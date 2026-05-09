# LeadFlow

Lightweight single-screen CRM for sales workflows: one list, one detail workspace, no login. Leads show status, last note, and follow-up urgency; the detail panel holds a discussion timeline, optional follow-up on each note, and status updates.

The workflow is intentionally designed around fast lead triage and follow-up management instead of multi-page navigation.

## Screenshots

When you add visuals: **one** clean main-workspace image is enough; optionally **one** timeline/detail shot. Skip wide galleries or marketing-style spreads.

---

## Features

- **Single workspace** — sidebar list + right-hand lead detail (no client-side routing for core CRM flows).
- **Follow-up discipline** — today’s follow-ups pinned; overdue and “due today” visually distinct.
- **Timeline** — discussions per lead, reverse chronological, follow-up metadata on notes.
- **Search & filters** — debounced name search; status filter (see `SidebarHeader` + `useLeads` query key).
- **State** — TanStack Query for server data; Zustand for selection and filters.
- **Docker** — Compose brings up Postgres, API, and Vite dev server (ports below).

For **API, schema, data flow, and design decisions**, see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Tech stack (summary)

| Layer | Choice |
|--------|--------|
| Backend | Node.js 20, Express, PostgreSQL 16, Prisma, Zod |
| Frontend | React 18, Vite, Tailwind CSS, TanStack Query, Zustand, Axios, date-fns, Lucide |
| Infra | Docker Compose, Prisma Migrate, `prisma/seed` |

Rationale for each layer is in **[docs/ARCHITECTURE.md#2-tech-stack](docs/ARCHITECTURE.md#2-tech-stack)**.

---

## Quick start (Docker)

You need **Git** and **Docker** (Compose v2). There is no Git remote until you add one—create an empty repo on GitHub (or elsewhere), then:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Clone and start the stack:

```bash
git clone <repo> && cd LeadFlow
docker compose up --build
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:5001  
- **Postgres:** localhost:5432 (see `docker-compose.yml`)

After the stack is up, run migrations and seed **once** (from `backend/`):

```bash
cd backend && npx prisma migrate dev && npx prisma db seed
```

This repository’s `docker-compose.yml` uses dev-style bind mounts and does **not** run Prisma migrate/seed automatically when the backend container starts—run the commands above after the first `up`.

---

## Local development (no Docker, or DB only)

1. **Database** — e.g. `docker compose up db` or a local PostgreSQL 16 instance. Set `DATABASE_URL` in `backend/.env`.
2. **Backend**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Default dev URLs: frontend **http://localhost:5173**, API **http://localhost:5001**.

---

## Environment variables

| Variable | Description | Example / default | Required |
|----------|-------------|-------------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/leadflow` | Yes (backend) |
| `PORT` | API listen port | `5001` | No |
| `NODE_ENV` | `development` \| `production` | `development` | No |
| `VITE_API_URL` | Base URL for the browser to call the API | `http://localhost:5001/api` | No (frontend) |

**Using `.env.example`:** Copy it to **`backend/.env`** for local runs (Prisma and Express read `DATABASE_URL` there). Optionally create **`frontend/.env`** with `VITE_API_URL` if you override the default. Real `.env` files stay **out of Git** (see `.gitignore`). Docker Compose injects the same variables into containers; you do not need a host `.env` file for Compose unless you extend it yourself.

---

## Architecture & Design Notes

Product and implementation depth (schema, API, stack rationale, key design decisions) live in **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**. This README is the short path: clone, run, and point to the architecture doc for everything else.
