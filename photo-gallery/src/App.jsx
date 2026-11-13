import { useEffect, useRef, useState } from 'react';
import PhotoCard from './PhotoCard.jsx';
import { fetchPhotos } from './feed.js';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading'); // loading | idle | error | done
  const [retry, setRetry] = useState(0);
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

  return (
    <main className="gallery">
      <header className="gallery-header">
        <h1>Photo gallery</h1>
        <p className="subtitle">
          {photos.length > 0
            ? `${photos.length} photos · ${status === 'done' ? 'end of feed' : 'scroll for more'}`
            : 'Infinite scroll over a paginated feed'}
        </p>
      </header>

      <ul className="photo-list">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </ul>

      <div ref={loaderRef} className="status">
        {status === 'loading' && <p>Loading...</p>}
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
    </main>
  );
}
