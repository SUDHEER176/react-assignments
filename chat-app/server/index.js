import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const MAX_HISTORY = 600;
const USERS = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];
const CHANNELS = ['poland', 'introductions', 'india']; // keep in sync with src/constants.js

// no database, everything is lost on restart
const messages = [];

const app = express();
app.get('/', (req, res) => res.json({ status: 'ok', messages: messages.length }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.emit('chat:history', messages);

  socket.on('chat:message', (data) => {
    const text = typeof data?.text === 'string' ? data.text.trim().slice(0, 1000) : '';
    if (!text) return;

    const user = USERS.includes(data.user) ? data.user : USERS[Math.floor(Math.random() * USERS.length)];
    const channel = CHANNELS.includes(data.channel) ? data.channel : 'introductions';

    const message = { id: randomUUID(), channel, user, text, time: Date.now(), likes: 0 };
    messages.push(message);
    if (messages.length > MAX_HISTORY) messages.shift();

    io.emit('chat:message', message);
  });

  socket.on('chat:like', (id) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;
    message.likes++;
    io.emit('chat:like', { id, likes: message.likes });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});
