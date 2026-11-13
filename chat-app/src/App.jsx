import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMoon, faSun, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import useChat from './useChat.js';
import useTheme from './useTheme.js';
import Sidebar from './components/Sidebar.jsx';
import MessageList from './components/MessageList.jsx';
import Composer from './components/Composer.jsx';
import { CHANNELS, DEFAULT_CHANNEL, user_list } from './constants.js';

export default function App() {
  const { messages, connected, sendMessage, likeMessage } = useChat();
  const { theme, toggleTheme } = useTheme();
  const [activeId, setActiveId] = useState(DEFAULT_CHANNEL);
  const [menuOpen, setMenuOpen] = useState(false);

  const channel = CHANNELS.find((c) => c.id === activeId);
  const channelMessages = messages.filter((m) => m.channel === activeId);

  const counts = {};
  messages.forEach((m) => {
    counts[m.channel] = (counts[m.channel] || 0) + 1;
  });

  const isDark = theme === 'dark';

  function openChannel(id) {
    setActiveId(id);
    setMenuOpen(false);
  }

  return (
    <div className="app">
      <Sidebar
        channels={CHANNELS}
        activeId={activeId}
        counts={counts}
        users={user_list}
        connected={connected}
        open={menuOpen}
        onSelect={openChannel}
        onClose={() => setMenuOpen(false)}
      />

      <main className="chat">
        <header className="chat-header">
          <button type="button" className="menu-button" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className="channel-title">
            <h1>{channel.name}</h1>
            <p>{channel.description}</p>
          </div>

          <div className="header-info">
            <span className={connected ? 'connection online' : 'connection offline'}>
              <span className="dot" />
              {connected ? 'Live' : 'Offline'}
            </span>
            <span className="divider">|</span>
            <span className="members" title="Members">
              {user_list.length} <FontAwesomeIcon icon={faUserGroup} />
            </span>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
              aria-label={isDark ? 'Light mode' : 'Dark mode'}
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </div>
        </header>

        {/* key resets the scroll position when switching channels */}
        <MessageList key={activeId} messages={channelMessages} onLike={likeMessage} />
        <Composer users={user_list} onSend={(text) => sendMessage(text, activeId)} />
      </main>
    </div>
  );
}
