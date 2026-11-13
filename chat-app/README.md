# React chat app

Chat app made with React + Vite, with a small Express / socket.io server.

You type a message and hit Send (or Enter), and it shows up in the thread above the input. Every message gets a random user from `["Alan", "Bob", "Carol", "Dean", "Elin"]`, and has a like button on the right that counts clicks.

I also kept the layout close to the GIF in the brief, so there's a sidebar with the three conversations (Poland Office, Introductions, India Office) and the member list. On mobile the sidebar turns into a menu.

## Stretch goals

- **Emojis** - the smiley button in the input opens an emoji picker with search, categories and a "Frequently Used" row (saved in localStorage).
- **Mentions** - typing `@` shows the user list. Arrow keys + Enter/Tab to pick one, or click it.
- **socket.io** - the server broadcasts new messages and likes to everyone connected, so two tabs stay in sync.

Also added a dark mode toggle in the header.

## Running it

```bash
npm install

# terminal 1 - socket server (port 4000)
npm run server

# terminal 2 - react app (port 5173)
npm run dev
```

The app still works without the server, it just shows "Offline" and the messages stay in that tab.

The server url can be changed with `VITE_SOCKET_URL` in a `.env` file.

## Files

```
server/index.js     express + socket.io server, keeps messages in memory
src/useChat.js      socket connection + message state
src/useTheme.js     light/dark mode
src/components/     Sidebar, MessageList, Message, Composer, EmojiPicker, Avatar
src/constants.js    user_list, channels, colours
src/emojiData.js    emoji list with search keywords
```

## Socket events

| Event          | From → to        | Data                                       |
| -------------- | ---------------- | ------------------------------------------ |
| `chat:history` | server → client  | all messages, sent on connect              |
| `chat:message` | client → server  | `{ channel, user, text }`                  |
| `chat:message` | server → clients | `{ id, channel, user, text, time, likes }` |
| `chat:like`    | client → server  | message id                                 |
| `chat:like`    | server → clients | `{ id, likes }`                            |

The assignment brief is in [reactjs_chat_assignment.md](reactjs_chat_assignment.md).
