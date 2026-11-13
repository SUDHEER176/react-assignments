import { memo, useState } from 'react';
import LikeButton from './LikeButton.jsx';
import PhotoMeta from './PhotoMeta.jsx';

const WIDTH = 200;

function PhotoCard({ photo, index, likes, onLike, onOpen }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <li className="photo-card">
      {/* a real link so ctrl/middle click still opens the original in a new tab */}
      <a
        className="photo-link"
        href={photo.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onOpen(index);
        }}
      >
        <img
          className={`photo${loaded ? ' is-loaded' : ''}`}
          src={photo.thumbnail}
          alt={photo.author || photo.title}
          width={WIDTH}
          height={photo.width ? Math.round((WIDTH * photo.height) / photo.width) : undefined}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </a>

      <div className="photo-info">
        <PhotoMeta photo={photo} />
        <LikeButton id={photo.id} count={likes} onLike={onLike} />
      </div>
    </li>
  );
}

export default memo(PhotoCard);
