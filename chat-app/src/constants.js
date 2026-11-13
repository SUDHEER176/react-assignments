export const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

export const CHANNELS = [
  { id: 'poland', name: 'Poland Office', description: 'News and chat from the Poland team' },
  { id: 'introductions', name: 'Introductions', description: 'This channel is for company wide chatter' },
  { id: 'india', name: 'India Office', description: 'News and chat from the India team' },
];

export const DEFAULT_CHANNEL = 'introductions';

export const USER_COLORS = {
  Alan: '#e5484d',
  Bob: '#3e8ed0',
  Carol: '#c9a227',
  Dean: '#3fa66b',
  Elin: '#e58a8a',
};

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const randomUser = () => user_list[Math.floor(Math.random() * user_list.length)];
