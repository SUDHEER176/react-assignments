import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const WIDTH = 200;

function PhotoCard({ photo }) {
  const [likes, setLikes] = useState(0);

  return (
    <li className="photo-card">
      <a className="photo-link" href={photo.url} target="_blank" rel="noreferrer">
        <img
          className="photo"
          src={photo.thumbnail}
          alt={photo.author || photo.title}
          width={WIDTH}
          height={photo.width ? Math.round((WIDTH * photo.height) / photo.width) : undefined}
          loading="lazy"
        />
      </a>

      <div className="photo-info">
        {/* picsum gives an author; the backup feed only has a title */}
        <p className="author">
          <span className="author-label">{photo.author ? 'Author: ' : 'Title: '}</span>
          {photo.author || photo.title}
        </p>
        <span className="frame-number">No. {String(photo.number).padStart(4, '0')}</span>

        <button
          type="button"
          className={`like-button${likes > 0 ? ' is-liked' : ''}`}
          onClick={() => setLikes((n) => n + 1)}
          aria-label={`Like, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
          <span className="like-count">{likes}</span>
        </button>
      </div>
    </li>
  );
}

export default memo(PhotoCard);
