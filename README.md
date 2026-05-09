# LeadFlow

Lightweight single-screen CRM for sales workflows: one list, one detail workspace, no login. Leads show status, last note, and follow-up urgency; the detail panel holds a discussion timeline, optional follow-up on each note, and status updates.

The workflow is intentionally designed around fast lead triage and follow-up management instead of multi-page navigation.

**Repository:** [https://github.com/abhinavsurya1/LeadFlow](https://github.com/abhinavsurya1/LeadFlow)

## Screenshots

### Main workspace
![LeadFlow main workspace](docs/assets/main-workspace.png)

### Timeline view
![LeadFlow timeline view](docs/assets/timeline%20view.png)

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

## Prerequisites

Install these on your laptop before running:

- **Git**
- **Docker** (Docker Desktop on macOS/Windows, or Docker Engine + Compose plugin on Linux)
- At least ~4 GB RAM available for Docker

## Quick start (Docker)

### 1) Clone and start containers

```bash
git clone https://github.com/abhinavsurya1/LeadFlow.git
cd LeadFlow
docker compose up --build
```

### 2) Apply migration (first run on a fresh DB volume)

```bash
docker compose exec backend ./node_modules/.bin/prisma migrate deploy
```

### 3) Seed demo data (optional but recommended for review)

```bash
docker compose exec backend ./node_modules/.bin/prisma db seed
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:5001  
- **Postgres:** localhost:5432

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
