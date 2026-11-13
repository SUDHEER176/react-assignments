import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function LikeButton({ id, count, onLike }) {
  return (
    <button
      type="button"
      className={`like-button${count > 0 ? ' is-liked' : ''}`}
      onClick={() => onLike(id)}
      aria-label={`Like, ${count} ${count === 1 ? 'like' : 'likes'}`}
    >
      {/* key restarts the small bump animation on every click */}
      <FontAwesomeIcon key={count} icon={faThumbsUp} className="like-icon" />
      <span className="like-count">{count}</span>
    </button>
  );
}
