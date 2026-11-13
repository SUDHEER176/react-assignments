import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, randomUser } from './constants.js';

let localId = 0;

// Talks to the socket server when it's up. If it isn't, messages
// just live in this tab so the app is still usable.
export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { reconnectionDelay: 3000, reconnectionDelayMax: 10000 });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('chat:history', setMessages);
    socket.on('chat:message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('chat:like', ({ id, likes }) => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes } : m)));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((rawText, channel) => {
    const text = rawText.trim();
    if (!text) return;

    const user = randomUser();
    const socket = socketRef.current;

    if (socket?.connected) {
      socket.emit('chat:message', { channel, user, text });
    } else {
      const id = `local-${++localId}`;
      setMessages((prev) => [...prev, { id, channel, user, text, time: Date.now(), likes: 0 }]);
    }
  }, []);

  const likeMessage = useCallback((id) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit('chat:like', id);
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m)));
    }
  }, []);

  return { messages, connected, sendMessage, likeMessage };
}
