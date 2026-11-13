import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Message from './Message.jsx';

export default function MessageList({ messages, onLike }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="empty">
          <FontAwesomeIcon icon={faComments} className="empty-icon" />
          <p className="empty-title">Welcome to Team Chat 👋</p>
          <p>No messages yet. Say hi!</p>
        </div>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} onLike={onLike} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
