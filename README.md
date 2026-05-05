# Vault

A clean, full-stack task management application with real authentication, a REST API backend, and SQLite database — built to be deployed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4 |
| Database | SQLite (via sqlite3) |
| Auth | bcryptjs (password hashing) + JWT (session tokens) |
| Fonts | DM Serif Display, DM Mono, Outfit (Google Fonts) |

---

## Project Structure

```
vault/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # POST /signup, POST /login, GET /me
│   │   └── tasks.js         # Full CRUD for tasks
│   ├── db.js                # SQLite connection + schema
│   ├── server.js            # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.js  # Task display with status advance
│   │   │   └── TaskModal.js # Create / edit task modal
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state + Axios instance
│   │   ├── hooks/
│   │   │   └── useTasks.js  # Task data fetching hook
│   │   ├── pages/
│   │   │   ├── Landing.js   # Marketing homepage
│   │   │   ├── Auth.js      # Shared login + signup page
│   │   │   └── Dashboard.js # Main app dashboard
│   │   ├── styles/
│   │   │   └── global.css   # Design tokens, typography, utilities
│   │   ├── App.js           # Routing with protected routes
│   │   └── index.js
│   └── package.json
│
├── .gitignore
├── package.json
├── render.yaml              # Backend deploy config (Render)
└── vercel.json              # Frontend deploy config (Vercel)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone <your-repo>
cd vault

# Install all dependencies
npm run install:all
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set a strong JWT_SECRET
```

### 3. Run the backend

```bash
# Terminal 1
npm run dev:backend
# Runs on http://localhost:5000
```

### 4. Run the frontend

```bash
# Terminal 2
npm run dev:frontend
# Runs on http://localhost:3000
# Proxied to backend via package.json "proxy" field
```

Open http://localhost:3000 — sign up and start using Vault.

---

## API Reference

All task routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `name, email, password` | Create account |
| POST | `/api/auth/login` | `email, password` | Sign in |
| GET | `/api/auth/me` | — | Get current user |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks (filter: `?status=todo`) |
| GET | `/api/tasks/stats` | Get task counts per status |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Deployment

### Backend — Render (free tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Build: `npm install` | Start: `node server.js`
5. Add environment variables:
   - `JWT_SECRET` — a long random string
   - `CLIENT_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`

### Frontend — Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` — your Render backend URL
4. Update `frontend/src/context/AuthContext.js` — change `baseURL` to your Render URL in production

> **Tip**: Update the `proxy` in `frontend/package.json` for local dev, and use `REACT_APP_API_URL` for production builds.

---

## Features

- **Auth**: Signup, login, logout. Passwords hashed with bcrypt (12 salt rounds). Sessions via 7-day JWT tokens.
- **Tasks**: Create, read, update, delete. Filter by status. Advance tasks through stages (To Do → In Progress → Done).
- **Priorities**: Low / Medium / High with color-coded badges.
- **Due Dates**: Overdue tasks highlighted.
- **Stats**: Live sidebar overview of task counts.
- **Responsive**: Works on mobile, adapts layout for sidebar navigation.

---

## Design

Vault uses a deliberate editorial aesthetic — DM Serif Display for headings, DM Mono for data, and a warm paper/ink palette with sharp brutalist card shadows. Every interactive element has hover state feedback. No frameworks, no bloat.

---

## License

MIT
