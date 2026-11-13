import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faXmark } from '@fortawesome/free-solid-svg-icons';
import Avatar from './Avatar.jsx';

export default function Sidebar({ channels, activeId, counts, users, connected, open, onSelect, onClose }) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-logo">
            <FontAwesomeIcon icon={faComments} />
            <span className={connected ? 'status-dot online' : 'status-dot'} />
          </div>
          <div>
            <h2>Team Chat</h2>
            <p>{connected ? 'Connected' : 'Offline'}</p>
          </div>
          <button type="button" className="sidebar-close" aria-label="Close menu" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav>
          <h3 className="sidebar-title">Conversations</h3>
          <ul className="channel-list">
            {channels.map((channel) => {
              const active = channel.id === activeId;
              return (
                <li key={channel.id}>
                  <button
                    type="button"
                    className={active ? 'active' : ''}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onSelect(channel.id)}
                  >
                    <span className="channel-icon">#</span>
                    <span className="channel-name">{channel.name}</span>
                    {counts[channel.id] > 0 && <span className="channel-count">{counts[channel.id]}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section>
          <h3 className="sidebar-title">Members</h3>
          <ul className="member-list">
            {users.map((user) => (
              <li key={user}>
                <Avatar user={user} size={30} />
                <span>{user}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </>
  );
}
