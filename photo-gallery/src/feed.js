// Loads one page of photos. Tries picsum first; if picsum is down (it sometimes
// returns Cloudflare 522/503 errors), switches to a backup feed for the rest of
// the session. Both feeds are turned into the same shape:
//   { id, number, author, title, url, thumbnail, large, width, height }

const PAGE_SIZE = 30;
const TIMEOUT_MS = 8000;

// the page number picsum failed on; from then on we read the backup feed,
// starting at its first page so nothing gets skipped
let backupFrom = null;

// fetch that also gives up after TIMEOUT_MS instead of hanging for ~20s
async function fetchJson(url, signal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (!signal.aborted && err.name === 'AbortError') throw new Error('timed out');
    throw err;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', cancel);
  }
}

async function fetchPicsum(page, signal) {
  // proxied to picsum.photos, see vite.config.js
  const data = await fetchJson(`/api/v2/list?page=${page}&limit=${PAGE_SIZE}`, signal);
  return data.map((p) => {
    // download_url is the full size image (usually 5000px wide), too big for a
    // 200px thumbnail. picsum lets you change the size at the end of the url.
    const thumbHeight = Math.round((400 * p.height) / p.width);
    const largeHeight = Math.round((1600 * p.height) / p.width);
    return {
      id: `picsum-${p.id}`,
      number: Number(p.id),
      author: p.author,
      url: p.download_url,
      thumbnail: p.download_url.replace(/\/\d+\/\d+$/, `/400/${thumbHeight}`),
      large: p.download_url.replace(/\/\d+\/\d+$/, `/1600/${largeHeight}`),
      width: p.width,
      height: p.height,
    };
  });
}

async function fetchBackup(page, signal) {
  // proxied to api.slingacademy.com, see vite.config.js
  const offset = (page - 1) * PAGE_SIZE;
  const data = await fetchJson(
    `/backup-api/v1/sample-data/photos?offset=${offset}&limit=${PAGE_SIZE}`,
    signal
  );
  return data.photos.map((p) => ({
    id: `backup-${p.id}`,
    number: p.id,
    author: null,
    title: p.title,
    url: p.url,
    thumbnail: p.url,
    large: p.url,
    width: null, // the backup feed doesn't give sizes
    height: null,
  }));
}

export async function fetchPhotos(page, signal) {
  if (backupFrom === null) {
    try {
      return await fetchPicsum(page, signal);
    } catch (err) {
      if (signal.aborted) throw err; // the component cancelled it, not a picsum failure
      console.warn(`picsum failed (${err.message}), switching to backup feed`);
      backupFrom = page;
    }
  }
  return fetchBackup(page - backupFrom + 1, signal);
}
