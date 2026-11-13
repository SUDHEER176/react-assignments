import { USER_COLORS } from '../constants.js';

export default function Avatar({ user, size = 40 }) {
  return (
    <div
      className="avatar"
      style={{ background: USER_COLORS[user] || '#888', width: size, height: size }}
      aria-hidden="true"
    >
      {user.slice(0, 2).toUpperCase()}
    </div>
  );
}
