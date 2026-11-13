# 📸 Photo Gallery (Infinite Scroll React App)

A responsive, single-page Photo Gallery web application built with **React 18** and **Vite**. It displays an infinite-scrolling feed of photos sourced from the [Picsum Photos API](https://picsum.photos/), complete with interactive like buttons, optimized image loading, error fallbacks, and a full-featured lightbox modal.

---

## 📌 Project Overview & Requirements

This project fulfills the requirements outlined in [reactjs_photo_gallery_assignment.md](reactjs_photo_gallery_assignment.md):
- **1-Column Photo View**: Displays photos with author metadata and optimized aspect ratios.
- **Infinite Scrolling**: Automatically loads subsequent pages (`?page=1`, `?page=2`, etc.) as the user scrolls near the bottom of the list.
- **Interactive Likes**: Each photo features a Font Awesome thumbs-up icon with an independent like counter starting at 0, incrementing on each click.
- **CORS Handling**: Configured with a local proxy in `vite.config.js` to prevent CORS issues.
- **Responsive & Accessible Design**: Styled contact-sheet aesthetic with dark/light mode support, keyboard navigation, and reduced-motion preferences.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `pnpm`

### Installation & Run

1. **Navigate to the project folder**:
   ```bash
   cd photo-gallery
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit [http://localhost:5173](http://localhost:5173) in your web browser.

### Other Commands
- `npm run build` — Bundles the app for production in the `dist` folder.
- `npm run preview` — Locally preview the production build.

---

## 🧩 Architecture & Component Breakdown

The project follows a clean, modular React component architecture:

```
photo-gallery/
├── index.html                 # HTML shell
├── vite.config.js             # Vite config & API reverse proxy
├── package.json               # Dependencies and scripts
└── src/
    ├── main.jsx               # React DOM root entry point
    ├── App.jsx                # Core gallery controller & infinite scroll logic
    ├── feed.js                # API service: fetch logic, caching, backup fallback
    ├── PhotoCard.jsx          # Individual photo row / card
    ├── PhotoMeta.jsx          # Author / Title & frame metadata
    ├── LikeButton.jsx         # Thumbs-up button with click counter
    ├── Lightbox.jsx           # Fullscreen modal dialog with image navigation
    └── index.css              # Custom styling, dark mode, responsive layout
```

### Component Roles & Responsibilities

| File | Purpose |
| :--- | :--- |
| **`App.jsx`** | Manages application state (`photos`, `page`, `status`, `likes`, `openIndex`). Orchestrates the `IntersectionObserver` to trigger page loads when scrolling near the bottom. |
| **`feed.js`** | Handles API communications. Requests data from Picsum (`/api/v2/list`), resizes image URLs for optimal performance, and automatically falls back to Sling Academy photos if Picsum fails. |
| **`PhotoCard.jsx`** | Renders each individual photo card with lazy loading, author info, and the like button. Memoized (`React.memo`) to prevent unnecessary re-renders. |
| **`Lightbox.jsx`** | Native HTML `<dialog>` modal showing the high-resolution photo. Supports left/right arrow navigation, Esc key closing, and external original image links. |
| **`LikeButton.jsx`** | Displays the Font Awesome `faThumbsUp` icon and like count. Triggers a subtle CSS bounce animation on each like. |
| **`PhotoMeta.jsx`** | Displays the author/title and a unique contact-sheet frame number (e.g. `No. 0001 · 5000 × 3333`). |

---

## 💡 Key Implementation Details

### 1. High-Performance Infinite Scrolling
Instead of attaching heavy `scroll` listeners to the `window`, this project uses the browser's native **`IntersectionObserver`** API targeting a sentinel element (`loaderRef`) at the bottom of the feed:
- Triggers pre-fetching with a `300px` root margin before the user hits the exact end.
- Gracefully handles state transitions: `loading` ➔ `idle` ➔ `done` (or `error`).

### 2. Image Optimization & Aspect Ratios
- The raw `download_url` from Picsum provides images up to 5000px wide (~5MB each).
- `feed.js` transforms thumbnail URLs to 400px wide while maintaining original aspect ratios (`download_url.replace(/\/\d+\/\d+$/, '/400/{calculatedHeight}')`).
- High-resolution versions (1600px wide) are only loaded when opening the `Lightbox`.

### 3. Resilient API & Fallback Strategy
- Picsum can occasionally suffer from Cloudflare 522/503 timeouts.
- `feed.js` sets an 8-second timeout per page. If Picsum fails, it gracefully switches to a secondary backup feed ([Sling Academy sample photos](https://api.slingacademy.com/)) so the user experience is never interrupted.

### 4. Zero-CORS Vite Proxy
To prevent browser CORS blocks during local development, `vite.config.js` sets up reverse proxies:
- `/api` ➔ `https://picsum.photos`
- `/backup-api` ➔ `https://api.slingacademy.com`
The browser only communicates with `localhost:5173`, avoiding cross-origin issues entirely.
