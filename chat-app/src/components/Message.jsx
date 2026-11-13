import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { user_list } from '../constants.js';
import Avatar from './Avatar.jsx';

const EMOJI_ONLY = /^(\p{Extended_Pictographic}|\p{Emoji_Component}|\s)+$/u;

const formatTime = (time) =>
  new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const formatDate = (time) =>
  new Date(time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

function highlightMentions(text) {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@') && user_list.includes(part.slice(1)) ? (
      <span key={i} className="mention">{part}</span>
    ) : (
      part
    )
  );
}

function Message({ message, onLike }) {
  const { id, user, text, time, likes } = message;
  // "👋🔥" on its own gets shown big without the bubble
  const bigEmoji = EMOJI_ONLY.test(text) && /\p{Extended_Pictographic}/u.test(text);

  return (
    <div className="message">
      <Avatar user={user} />

      <div className="message-body">
        <div className="message-meta">
          <span className="message-user">{user}</span>
          <time className="message-time" dateTime={new Date(time).toISOString()} title={formatDate(time)}>
            {formatTime(time)}
          </time>
        </div>
        <div className={bigEmoji ? 'bubble jumbo' : 'bubble'}>{highlightMentions(text)}</div>
      </div>

      <button
        type="button"
        className={likes > 0 ? 'like-button liked' : 'like-button'}
        onClick={() => onLike(id)}
        aria-label="Like"
      >
        <FontAwesomeIcon icon={faThumbsUp} />
        <span className="like-count">{likes}</span>
      </button>
    </div>
  );
}

export default memo(Message);
