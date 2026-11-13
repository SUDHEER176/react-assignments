# Photo gallery

Infinite scroll photo list using the [picsum](https://picsum.photos/v2/list?page=1) feed. Made with React + Vite.

It starts with page 1, and when you scroll near the bottom it loads the next page and adds it to the list. It stops when a page comes back empty. Every photo shows the author, a Font Awesome thumbs up and a like counter starting at 0.

## Running it

```bash
npm install
npm run dev
```

and open http://localhost:5173

## Notes

- The infinite scroll uses an `IntersectionObserver` on the loading text under the list instead of a scroll listener.
- `download_url` gives the original image which is usually 5000px wide, so for the thumbnail I change the size at the end of the url to 400px wide (same ratio). Clicking a photo opens the full one.
- picsum sometimes goes down (Cloudflare 522/503). `src/feed.js` gives picsum 8 seconds per page; if it fails, the app switches to the [Sling Academy sample photos](https://api.slingacademy.com/v1/sample-data/photos) feed for the rest of the session (proxied as `/backup-api`). Those photos have no author, so the card shows their title instead.
- The feed goes through a Vite proxy (`/api` → `https://picsum.photos`, in `vite.config.js`). Calling picsum directly gave a "Ensure CORS response header values are valid" warning in Chrome, and with the proxy the browser only talks to localhost so there's no CORS at all.

The assignment brief is in [reactjs_photo_gallery_assignment.md](reactjs_photo_gallery_assignment.md).
