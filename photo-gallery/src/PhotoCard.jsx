import { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const WIDTH = 200;

function PhotoCard({ photo }) {
  const [likes, setLikes] = useState(0);
  // picsum gives an author; the backup feed only has a title
  const caption = photo.author ? `Author: ${photo.author}` : `Title: ${photo.title}`;

  return (
    <li className="photo-card">
      <a href={photo.url} target="_blank" rel="noreferrer">
        <img
          className="photo"
          src={photo.thumbnail}
          alt={photo.author || photo.title}
          width={WIDTH}
          height={photo.width ? Math.round((WIDTH * photo.height) / photo.width) : undefined}
          loading="lazy"
        />
      </a>
      <span className="author">{caption}</span>
      <button
        type="button"
        className="like-button"
        onClick={() => setLikes((n) => n + 1)}
        aria-label={`Like, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <span className="like-count" aria-hidden="true">
        {likes}
      </span>
    </li>
  );
}

export default memo(PhotoCard);
