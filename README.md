# CampusHive Frontend

React + Vite + Tailwind, wired to the live backend by default — nobody needs to run
the backend locally to work on this.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. It talks to the live backend
(`https://campushive-x3r5.onrender.com`) out of the box — no `.env` needed unless
you want to point at a different backend (see `.env.example`).

**First request of the session might take ~30 seconds** — the free-tier backend
sleeps after 15 minutes idle. That's normal, not broken. If you're demoing or
recording something, hit the live URL once beforehand to wake it up.

## What's already built (infrastructure, not features)

- Routing (`react-router-dom`) with a page per screen
- `src/api/client.js` — pre-configured API client, automatically attaches your
  login token to every request. Import `api` and call `api.get(...)` / `api.post(...)`.
- `src/context/AuthContext.jsx` — shared login state across the whole app.
  `useAuth()` gives you `{ user, login, signup, logout }` from any page.
- `src/components/Navbar.jsx` — shared nav, already auth-aware (shows Sign In vs.
  your name depending on login state)
- Tailwind is configured with brand colors as utility classes: `text-brand-purple`,
  `bg-brand-orange`, etc. — see `src/index.css` for the full token list.

## What's left to build

Every page below already fetches real data from the live API and shows it in a bare
list — that part is proven to work. What's missing is the actual visual design
from the original screenshots.

- `src/pages/Home.jsx` — browse/search/filter
- `src/pages/FestDetail.jsx` — fest detail, "I'm Interested" button, register button
- `src/pages/Dashboard.jsx` — college-rep dashboard, AI insights card, plus a new
  `src/pages/ListFest.jsx` to create and add to `App.jsx`'s routes for the
  "List Your Fest" form
- `src/pages/SignIn.jsx` — login/signup (logic already works, needs the real
  split-panel design) and the Razorpay checkout flow on the register button

Full endpoint reference for exactly what to call and what comes back:
`API_CONTRACT.md` in the **backend** repo
(github.com/Devvratsingh-S-Rawat/campushive-backend).

## A note on the CORS "bug" that wasn't

If you ever see a CORS error in your browser console when calling the live API,
it is almost certainly the backend being asleep (see above), not a real CORS
problem — this was checked carefully. Hit the root URL once in a browser tab
first, wait a few seconds, then try again before assuming something's broken.
