# GigMate

A two-sided marketplace where students offer freelance gigs to clients. The app
has a public landing page, a gig browse/detail flow, authenticated dashboards,
order management, and user profiles.

## Stack

- **Frontend**: React 19 + Vite 8 + Tailwind CSS 4 + React Router 7 (TypeScript)
- **Backend**: Node 20 + Express 4 + Mongoose + JWT auth + Zod (TypeScript, ESM)
- **Database**: MongoDB (in-memory via `mongodb-memory-server` for dev; an
  external MongoDB instance — e.g. MongoDB Atlas — should be used in production
  by setting `MONGO_URL`)

## Project Layout

```
backend/    Express API (port 3001 in dev)
  src/
    config/db.ts          Mongo connection (in-memory fallback when MONGO_URL is unset/local)
    controllers/          Auth, gig, order, user controllers
    middleware/auth.ts    JWT auth guard
    models/               Mongoose models: User, Gig, Order
    routes/               /api/auth, /api/users, /api/gigs, /api/orders
    utils/jwt.ts          JWT helpers
    app.ts                Express app (also serves built frontend in prod)
    index.ts              Entrypoint

frontend/   React + Vite SPA (port 5000)
  src/
    pages/, components/, context/, lib/
    App.tsx, main.tsx
  vite.config.ts          host 0.0.0.0, allowedHosts:true, /api proxy → :3001
```

## Dev Workflows

- **Frontend** — `cd frontend && npm run dev` on port 5000 (webview).
  Vite proxies `/api/*` to `http://127.0.0.1:3001`.
- **Backend** — `cd backend && npm run dev` on port 3001 (console).
  Boots Express immediately, then connects to Mongo asynchronously.

## Environment Variables

Backend (`backend/.env`):

- `PORT` — defaults to 3001
- `HOST` — defaults to `0.0.0.0`
- `MONGO_URL` — optional. If unset or pointing at localhost, an in-memory
  MongoDB is started automatically. For production set it to a real connection
  string (e.g. MongoDB Atlas).
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CORS_ORIGIN` — comma-separated allowed origins (defaults to allow all)

## Deployment

Configured as an autoscale deployment. The build step installs deps and builds
both frontend and backend; the run step starts the backend, which serves the
built frontend from `frontend/dist` in addition to the API.

> Note on data persistence in production: the in-memory MongoDB fallback does
> not persist data and is unsuitable for production. Set `MONGO_URL` to a real
> MongoDB instance before relying on the deployed app.

## Recent Changes

- Initial Replit import setup (Apr 2026): wired workflows on ports 5000/3001,
  added in-memory MongoDB fallback, configured backend to serve the built SPA
  in production, configured autoscale deployment.
