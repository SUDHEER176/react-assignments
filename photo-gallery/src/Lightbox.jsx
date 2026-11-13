import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import LikeButton from './LikeButton.jsx';
import PhotoMeta from './PhotoMeta.jsx';

// Large view of one photo. Uses <dialog> so the browser handles focus
// trapping and Esc. Left/right arrow keys move between photos.
export default function Lightbox({ photos, index, likes, onLike, onNavigate, onClose }) {
  const dialogRef = useRef(null);
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    // don't close() in the cleanup: that fires the dialog's close event, which
    // (with StrictMode's mount/unmount/mount in dev) would shut it right away.
    // The element is removed on unmount anyway.
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, hasPrev, hasNext, onNavigate]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={photo.author || photo.title}
      onClose={onClose}
      // clicking the dark backdrop (the dialog itself, not its content) closes it
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lightbox-body">
        <button type="button" className="icon-button lightbox-close" onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="lightbox-stage">
          <button
            type="button"
            className="icon-button lightbox-nav"
            onClick={() => onNavigate(index - 1)}
            disabled={!hasPrev}
            aria-label="Previous photo"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* key makes the image fade in again for each new photo */}
          <img key={photo.id} className="lightbox-photo" src={photo.large} alt={photo.author || photo.title} />

          <button
            type="button"
            className="icon-button lightbox-nav"
            onClick={() => onNavigate(index + 1)}
            disabled={!hasNext}
            aria-label="Next photo"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className="lightbox-footer">
          <div className="photo-info">
            <PhotoMeta photo={photo} />
          </div>
          <div className="lightbox-actions">
            <a className="original-link" href={photo.url} target="_blank" rel="noreferrer">
              Original <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
            <LikeButton id={photo.id} count={likes[photo.id] || 0} onLike={onLike} />
          </div>
        </div>
      </div>
    </dialog>
  );
}
