import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ALL_EMOJIS, EMOJI_CATEGORIES } from '../emojiData.js';

// every search word has to match the start of one of the emoji's keywords,
// so "thu up" finds 👍
function matchesSearch(emoji, words) {
  const keywords = emoji.name.split(' ');
  return words.every((w) => keywords.some((k) => k.startsWith(w)));
}

export default function EmojiPicker({ recent, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState(null);
  const [activeTab, setActiveTab] = useState(recent.length ? 'recent' : EMOJI_CATEGORIES[0].id);
  const bodyRef = useRef(null);
  const sectionRefs = useRef({});

  const sections = recent.length
    ? [{ id: 'recent', label: 'Frequently Used', icon: faClock, emojis: recent }, ...EMOJI_CATEGORIES]
    : EMOJI_CATEGORIES;

  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const results = searching ? ALL_EMOJIS.filter((e) => matchesSearch(e, words)) : [];

  function goToSection(id) {
    setSearch('');
    setActiveTab(id);
    // wait for the sections to render again if we were searching
    requestAnimationFrame(() => {
      bodyRef.current.scrollTop = sectionRefs.current[id]?.offsetTop ?? 0;
    });
  }

  function handleScroll() {
    if (searching) return;
    const body = bodyRef.current;
    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 2;
    const current = atBottom
      ? sections[sections.length - 1]
      : sections.filter((s) => sectionRefs.current[s.id]?.offsetTop <= body.scrollTop + 8).pop();
    if (current) setActiveTab(current.id);
  }

  function handleSearchKey(e) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length) onSelect(results[0]);
    }
  }

  const emojiButton = (emoji) => (
    <button
      key={emoji.char}
      type="button"
      className="emoji"
      title={emoji.name.split(' ')[0]}
      onClick={() => onSelect(emoji)}
      onMouseEnter={() => setHovered(emoji)}
      onMouseLeave={() => setHovered(null)}
    >
      {emoji.char}
    </button>
  );

  return (
    <div className="popover emoji-picker">
      <nav className="emoji-tabs">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.label}
            className={!searching && activeTab === s.id ? 'active' : ''}
            onClick={() => goToSection(s.id)}
          >
            <FontAwesomeIcon icon={s.icon} />
          </button>
        ))}
      </nav>

      <div className="emoji-search">
        <input
          type="text"
          value={search}
          placeholder="Search"
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
        />
        {searching ? (
          <button type="button" aria-label="Clear" onClick={() => setSearch('')}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        ) : (
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        )}
      </div>

      <div className="emoji-body" ref={bodyRef} onScroll={handleScroll}>
        {searching ? (
          <section>
            <h4>Search Results</h4>
            {results.length > 0 ? (
              <div className="emoji-grid">{results.map(emojiButton)}</div>
            ) : (
              <p className="emoji-empty">Nothing found for "{search.trim()}"</p>
            )}
          </section>
        ) : (
          sections.map((s) => (
            <section key={s.id} ref={(el) => (sectionRefs.current[s.id] = el)}>
              <h4>{s.label}</h4>
              <div className="emoji-grid">{s.emojis.map(emojiButton)}</div>
            </section>
          ))
        )}
      </div>

      <footer className="emoji-preview">
        {hovered ? (
          <>
            <span className="preview-char">{hovered.char}</span>
            <span className="preview-name">:{hovered.name.split(' ')[0]}:</span>
          </>
        ) : (
          <span className="preview-hint">Pick an emoji</span>
        )}
      </footer>
    </div>
  );
}
