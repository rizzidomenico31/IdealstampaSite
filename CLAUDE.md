# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing site + quote-request ("preventivo") system for **Idealstampa**, an Italian print shop. Monorepo with two independently-deployed apps:

- `frontend/` — React 19 + Vite SPA (Tailwind, react-router-dom v7), served statically via Nginx in production.
- `backend/` — Express 4 REST API (layered: routes → controllers → services → models), MongoDB via Mongoose, email via Resend.

Code, comments, log messages, and user-facing strings are in **Italian** — match this when editing.

## Commands

Frontend (`cd frontend`):
- `npm run dev` — Vite dev server.
- `npm run build` — production build to `dist/`.
- `npm run lint` — ESLint (flat config in `eslint.config.js`).
- `npm run preview` — serve the built `dist/`.

Backend (`cd backend`):
- `npm run dev` — nodemon (auto-reload).
- `npm start` — `node server.js`.
- `npm run seed:admin` — create/reset the first admin user. Requires env vars: `ADMIN_USERNAME`, `ADMIN_PASSWORD` (must pass strength check: ≥ min length, upper+lower+digit+special), optional `ADMIN_ROLE` (default `superadmin`), `ADMIN_FORCE_RESET=true` to reset an existing user's password.
- **No test runner is configured** (`npm test` is a placeholder that exits 1).

Full stack via Docker: `docker-compose up` brings up frontend, backend, MongoDB 7, and an Nginx reverse proxy. Backend needs `backend/.env` (see `docker-compose.yml` for the Mongo wiring). Note ports differ from prod: backend is exposed on `5001→5000`.

## Deployment

Both apps deploy to **Railway** via their respective `Dockerfile`s (`railway.toml` sets `builder = "dockerfile"`). The frontend build bakes static assets into an Nginx image; the backend runs as a non-root Node 18 Alpine container with a `/api/health` healthcheck. The frontend's live backend URL is hardcoded as a fallback in `frontend/src/services/api.js` (`VITE_API_URL` overrides it).

## Backend architecture

Entry: `server.js` → `bootstrap()` connects Mongo (optional), verifies the mailer, starts `src/app.js`, and wires graceful shutdown. `src/app.js` mounts helmet, CORS, body parsers, then `src/routes` under `/api`, then the error-handler chain.

**Layering convention** — keep this separation when adding features:
- `routes/` — wiring only (middleware order, validators). Aggregated in `routes/index.js`.
- `controllers/` — HTTP req/res shaping; delegate all logic to services.
- `services/` — business logic; the only layer that touches models/email/external APIs.
- `models/` — Mongoose schemas (`admin.model.js`, `quote.model.js`).
- `validators/` — express-validator rule arrays + a shared `handleValidation`.
- `config/index.js` — **single source of truth for all env config**, with typed coercion helpers. Read config from here, not `process.env` directly.

**Stateless-DB mode (important):** MongoDB is optional. `database.isEnabled()` is `false` when `MONGO_URI` is unset; the app still boots and quote emails still send — persistence is just skipped (`persistQuote` returns null, admin/auth endpoints return 503). Don't assume a DB connection exists. Models are lazy-`require`d inside services to avoid loading Mongoose when DB is off.

**Email (`config/email.js`):** despite the `smtp.*` naming, email actually goes through the **Resend API**. `config.smtp.pass` holds the Resend API key; `config.smtp.user` is only used as the `from` address. `getTransporter()` exposes a nodemailer-shaped `sendMail` adapter (converts file attachments to base64) so services stay transport-agnostic.

**Quote flow (the core feature):** `POST /api/preventivo` → multer single-file upload (`middleware/upload.js`, allowed MIME types + size in config) → validators (on failure, the uploaded file is cleaned up before responding) → `preventivo.service.processPreventivo`: persist to Mongo (best-effort), send two emails in parallel (company notification w/ attachment + client confirmation) via `email.service`, record `emailStatus` on the quote doc. The controller schedules temp-file cleanup ~5s after responding.

**Auth (JWT, admin area):** `POST /api/admin/auth/login` verifies against the `Admin` model (bcrypt), enforces failed-attempt lockout (`registerFailedAttempt` / `lockUntil`), and returns an HS256 JWT (`JWT_SECRET` must be ≥32 chars or auth throws 500). Protect routes with `requireAuth` (attaches `req.admin`) and `requireRole('superadmin', ...)`. User-management routes (`/api/admin/users`) are entirely superadmin-only.

**Reviews:** `reviews.service` fetches Google Places reviews (New Places API, filtered to rating ≥4), caches in-memory for `GOOGLE_CACHE_MS`, and falls back to a hardcoded `FALLBACK_REVIEWS` set when the API key/place ID are missing or the call fails.

### API surface (all under `/api`)
- `GET /health`
- `GET /reviews`, `POST /reviews/refresh-cache`
- `POST /preventivo`
- `POST /admin/auth/login|logout`, `GET /admin/auth/me`, `POST /admin/auth/change-password`
- `GET|POST /admin/users`, `PATCH|DELETE /admin/users/:id`, `POST /admin/users/:id/password` (superadmin)

## Frontend architecture

`App.jsx` splits routing into two trees:
- **Public site** (`/*`) is wrapped in `PasswordProtection` (a client-side gate) and rendered inside the `Nav` layout.
- **Admin area** (`/admin/*`) sits outside that gate. `AdminLayout` is guarded by `ProtectedRoute`; `/admin/users` additionally requires `requiredRole="superadmin"`.

**Auth state** lives in `context/AuthContext.jsx`: the JWT is stored in `localStorage` (`idealstampa_admin_token`), reconciled on mount via `adminApi.me()`. `services/api.js` `apiFetch` attaches the Bearer token when `auth: true`, and on a 401 dispatches a global `auth:expired` window event that `AuthContext` listens for to force a silent logout. Use the `adminApi` / `usersApi` wrappers rather than calling `fetch` directly.

## Configuration notes

- Backend env vars are all documented by their defaults in `backend/src/config/index.js`. Key ones: `MONGO_URI`, `MONGO_DB_NAME`, `JWT_SECRET` (≥32 chars), `SMTP_PASS` (= Resend API key), `SMTP_USER`/`COMPANY_EMAIL`, `CORS_ORIGINS` (comma-separated), `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`.
- CORS origins have a hardcoded default allowlist (localhost + idealstampa.com domains) overridable via `CORS_ORIGINS`.
- `.env` files are gitignored; there is no committed `.env.example`.
