import { useCallback, useEffect, useRef, useState } from 'react';
import PhotoCard from './PhotoCard.jsx';
import Lightbox from './Lightbox.jsx';
import { fetchPhotos } from './feed.js';

function plural(n, word) {
  return `${n.toLocaleString()} ${word}${n === 1 ? '' : 's'}`;
}

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading'); // loading | idle | error | done
  const [retry, setRetry] = useState(0);
  const [likes, setLikes] = useState({}); // photo id -> count
  const [openIndex, setOpenIndex] = useState(null); // photo shown in the lightbox
  const loaderRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');

    fetchPhotos(page, controller.signal)
      .then((data) => {
        if (data.length === 0) {
          setStatus('done');
          return;
        }
        setPhotos((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...data.filter((p) => !ids.has(p.id))];
        });
        setStatus('idle');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [page, retry]);

  // load the next page when the bottom of the list scrolls into view.
  // this runs again after every load, so a tall screen keeps loading until it's full
  useEffect(() => {
    if (status !== 'idle') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: '300px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [status]);

  // stable callbacks so memo(PhotoCard) only re-renders the card that changed
  const like = useCallback((id) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);
  const open = useCallback((index) => setOpenIndex(index), []);

  const totalLikes = Object.values(likes).reduce((sum, n) => sum + n, 0);

  return (
    <main className="gallery">
      <header className="gallery-header">
        <h1>Photo gallery</h1>
        <p className="subtitle">
          {photos.length > 0
            ? [
                plural(photos.length, 'photo'),
                plural(totalLikes, 'like'),
                status === 'done' ? 'end of feed' : 'scroll for more',
              ].join(' · ')
            : 'Infinite scroll over a paginated feed'}
        </p>
      </header>

      <ul className="photo-list">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            likes={likes[photo.id] || 0}
            onLike={like}
            onOpen={open}
          />
        ))}
        {status === 'loading' &&
          [0, 1, 2].map((n) => (
            <li key={`skeleton-${n}`} className="photo-card skeleton" aria-hidden="true">
              <div className="skeleton-photo" />
              <div className="photo-info">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </li>
          ))}
      </ul>

      <div ref={loaderRef} className="status" role="status">
        {status === 'loading' && <span className="visually-hidden">Loading photos</span>}
        {status === 'done' && <p>No more photos</p>}
        {status === 'error' && (
          <p>
            Couldn't load photos{' '}
            <button type="button" className="retry-button" onClick={() => setRetry((n) => n + 1)}>
              Retry
            </button>
          </p>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          likes={likes}
          onLike={like}
          onNavigate={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </main>
  );
}
