import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from './EmojiPicker.jsx';
import Avatar from './Avatar.jsx';

const RECENT_KEY = 'chat:recent-emojis';
const MAX_RECENT = 16;

// "@" at the start of a word, plus whatever was typed after it, right before the cursor
const MENTION_REGEX = /(^|\s)@(\w*)$/;

function loadRecent() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function Composer({ users, onSend }) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [recent, setRecent] = useState(loadRecent);
  const [selected, setSelected] = useState(0);
  const [mentionClosed, setMentionClosed] = useState(false);
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const nextCursor = useRef(null);

  const match = MENTION_REGEX.exec(text.slice(0, cursor));
  const query = match ? match[2].toLowerCase() : null;
  const suggestions = query === null ? [] : users.filter((u) => u.toLowerCase().startsWith(query));
  const showMentions = suggestions.length > 0 && !mentionClosed;
  const highlighted = Math.min(selected, suggestions.length - 1);

  // put the cursor back after inserting an emoji / mention
  useLayoutEffect(() => {
    if (nextCursor.current !== null) {
      inputRef.current.setSelectionRange(nextCursor.current, nextCursor.current);
      nextCursor.current = null;
    }
  }, [text]);

  useEffect(() => {
    if (!showEmoji) return;
    const onClickOutside = (e) => {
      if (!formRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showEmoji]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
      // ignore
    }
  }, [recent]);

  function updateCursor(e) {
    setCursor(e.target.selectionStart ?? e.target.value.length);
  }

  function insertText(start, end, value) {
    const pos = start + value.length;
    setText(text.slice(0, start) + value + text.slice(end));
    setCursor(pos);
    nextCursor.current = pos;
    inputRef.current.focus();
  }

  function pickMention(user) {
    insertText(cursor - query.length - 1, cursor, `@${user} `);
    setSelected(0);
  }

  function pickEmoji(emoji) {
    insertText(cursor, cursor, emoji.char);
    setRecent((prev) => [emoji, ...prev.filter((e) => e.char !== emoji.char)].slice(0, MAX_RECENT));
    setShowEmoji(false);
  }

  function handleChange(e) {
    setText(e.target.value);
    updateCursor(e);
    setShowEmoji(false);
    setMentionClosed(false);
    setSelected(0);
  }

  function handleKeyDown(e) {
    if (!showMentions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((highlighted + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((highlighted - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      pickMention(suggestions[highlighted]);
    } else if (e.key === 'Escape') {
      setMentionClosed(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
    setCursor(0);
    setShowEmoji(false);
  }

  return (
    <form className="composer" ref={formRef} onSubmit={handleSubmit}>
      {showMentions && (
        <ul className="popover mention-list" role="listbox">
          {suggestions.map((user, i) => (
            <li
              key={user}
              role="option"
              aria-selected={i === highlighted}
              className={i === highlighted ? 'active' : ''}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus in the input
                pickMention(user);
              }}
              onMouseEnter={() => setSelected(i)}
            >
              <Avatar user={user} size={24} />
              <span>{user}</span>
            </li>
          ))}
        </ul>
      )}

      {showEmoji && (
        <EmojiPicker
          recent={recent}
          onSelect={pickEmoji}
          onClose={() => {
            setShowEmoji(false);
            inputRef.current.focus();
          }}
        />
      )}

      <div className="input-wrap">
        <input
          ref={inputRef}
          type="text"
          value={text}
          placeholder="Type Message"
          autoComplete="off"
          maxLength={1000}
          autoFocus
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursor}
          onClick={updateCursor}
        />
        <button
          type="button"
          className={showEmoji ? 'icon-button active' : 'icon-button'}
          aria-label="Emoji"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <FontAwesomeIcon icon={faFaceSmile} />
        </button>
      </div>

      <button type="submit" className="send-button" disabled={!text.trim()}>
        <FontAwesomeIcon icon={faPaperPlane} />
        <span>Send</span>
      </button>
    </form>
  );
}
