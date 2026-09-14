# OurBudget

**OurBudget** is a full-stack personal and household budgeting application. It helps members of a shared household record income and expenses, organize spending into categories, plan recurring payments, and understand their financial position through a dashboard and monthly trends.

Built as a portfolio project, it demonstrates end-to-end product development: a cross-platform mobile/web client, a typed REST API, secure authentication and authorization, PostgreSQL data modeling, automated testing, containers, and continuous deployment.

## What it does

- Register and sign in securely with JWT-based authentication.
- Track income and expense transactions with search, date, type, sort, and limit filters.
- Create and manage income and expense categories.
- Plan recurring transactions on weekly, biweekly, monthly, and yearly schedules.
- View a family-scoped financial overview, category breakdown, recent activity, upcoming payments, and monthly income-versus-expense trends.
- Invite an existing user to join a shared family budget through a tokenized invite link.
- Run on mobile with Expo and export the same experience for the web.

## Interface

The app includes a dashboard, transaction history, category management, recurring schedules, profile/invite flow, and dedicated income and expense entry screens. A project screenshot will be added here once one is captured from a running authenticated session.

## Architecture

```text
Expo Router app (iOS, Android, Web)
        |
        | HTTPS / JSON + Bearer JWT
        v
Express 5 REST API ── Drizzle ORM ── PostgreSQL
        ^
        |
Caddy serves the web export and reverse-proxies /api and /auth
        |
GitHub Actions builds, publishes the ARM64 backend image to GHCR,
and deploys the web export and Compose runtime configuration to the VM.
```

The repository is an npm-workspaces monorepo:

- `apps/mobile` — Expo/React Native client and web export.
- `apps/backend` — Express API, Drizzle schema, migrations, and integration tests.
- `packages/shared` — shared Zod schemas and TypeScript types used by both applications.

## Tech stack

| Area | Technologies |
| --- | --- |
| Client | React 19, React Native, Expo, Expo Router, React Native Web |
| UI and state | React Native Paper, React Query, React Native SVG, Material Design Icons |
| API | Node.js, TypeScript, Express 5, REST/JSON |
| Data | PostgreSQL 17, Drizzle ORM, Drizzle Kit migrations |
| Validation and shared contracts | Zod 4, npm workspaces |
| Security | JWT bearer authentication, bcrypt password hashing, server-side family membership checks, Expo Secure Store |
| Testing and quality | Vitest, Supertest, Biome |
| Build tooling | esbuild production bundle, tsx development watch mode |
| Delivery and infrastructure | Docker, Docker Compose, Caddy, GitHub Actions, GitHub Container Registry, QEMU/Buildx ARM64 builds |

## API reference

The API is served on port `3000`. In the deployed web application, Caddy proxies both `/auth` and `/api` on the same origin.

Unless noted otherwise, endpoints require:

```http
Authorization: Bearer <JWT>
```

Protected resources are always scoped to the authenticated user's family on the server. The client cannot select another family's data by changing a request parameter.

Successful protected responses use `{ "data": ..., "meta": ... }`; errors return an error payload and an appropriate HTTP status.

### Authentication

| Method | Endpoint | Authentication | Request body | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `{ name, email, password }` | Create a user account. Passwords must be at least 8 characters. |
| POST | `/auth/login` | Public | `{ email, password }` | Return a JWT and user summary. |

### Categories

| Method | Endpoint | Request | Purpose |
| --- | --- | --- | --- |
| GET | `/api/categories` | Query: `type=income\|expense`, `sort=asc\|desc` (optional) | List categories available to the current family. |
| POST | `/api/categories` | `{ name, type }` | Create an income or expense category. |
| PUT | `/api/categories/:categoryId` | `{ name }` | Rename a category. |
| DELETE | `/api/categories/:categoryId` | — | Delete a category. |

### Transactions

| Method | Endpoint | Request | Purpose |
| --- | --- | --- | --- |
| GET | `/api/transactions` | Query: `filter[from]`, `filter[to]`, `filter[type]`, `filter[search]`, `sort`, `limit` (all optional) | List the current family's transactions. Dates use `YYYY-MM-DD`. |
| GET | `/api/transactions/:id` | — | Retrieve one transaction. |
| POST | `/api/transactions` | `{ categoryId, scheduleId?, amountCents, type, description, status?, date? }` | Create a transaction. `amountCents` is a positive integer; `type` is `income` or `expense`. |
| PUT | `/api/transactions/:id` | Partial `{ categoryId, amountCents, type, description, status }` | Update a transaction. |
| DELETE | `/api/transactions/:id` | — | Delete a transaction. |

`status` is `actual`, `projected`, or `skipped`. Monetary values are stored as integer cents to avoid floating-point precision issues.

### Schedules

| Method | Endpoint | Request | Purpose |
| --- | --- | --- | --- |
| GET | `/api/schedules` | — | List recurring schedules for the current family. |
| GET | `/api/schedules/upcoming` | — | Return the nearest upcoming scheduled payment. |
| GET | `/api/schedules/:id` | — | Retrieve one schedule. |
| POST | `/api/schedules` | `{ categoryId, description, amountCents, frequency, startDate, endDate?, dayOfMonth?, dayOfWeek?, active? }` | Create a recurring schedule. |
| PUT | `/api/schedules/:id` | Partial create payload | Update a schedule. |
| DELETE | `/api/schedules/:id` | — | Delete a schedule. |

`frequency` accepts `once`, `weekly`, `biweekly`, `monthly`, or `yearly`; schedule amounts are signed (`+` income, `-` expense).

### Budget dashboard

| Method | Endpoint | Request | Purpose |
| --- | --- | --- | --- |
| GET | `/api/budgets/overview` | Query: `filter[from]`, `filter[to]` (optional `YYYY-MM-DD`) | Return total income, expenses, net balance, and category breakdown for the selected period. |
| GET | `/api/budgets/monthly` | Query: `months` (required integer) | Return monthly income/expense chart data for the requested number of months. |

Only transactions with `status: "actual"` contribute to the overview totals.

### Family invitations

| Method | Endpoint | Authentication | Request | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/api/familyInvites` | Required | `{ invitedEmail }` | Create an invitation for an existing user to join the current family. |
| GET | `/api/familyInvites/:token/accept` | Public | — | Accept an invitation using its token. |

## Local development

### Prerequisites

- Node.js 24+
- Docker and Docker Compose

Copy and complete the backend environment configuration before starting services:

```bash
cp apps/backend/env.example apps/backend/.env.development
```

Start the development stack with hot reload:

```bash
npm install
npm run docker:dev:up
npm run db:migrate
```

Useful commands:

```bash
# Start the Expo app
npm run mobile

# Run the API locally (outside Docker)
npm run backend

# Run backend integration tests against the test database
npm run test:file

# Export the mobile app for web
npm run mobile:build:web

# Check and format code with Biome
npm run linter
```

## Production delivery

Pushing to `main` triggers the deployment workflow:

1. Build the backend for `linux/arm64` and push it to GitHub Container Registry.
2. Export the Expo web client and upload it as a workflow artifact.
3. Copy the web export, Compose/Caddy configuration, and database initialization scripts to the VM.
4. Pull the commit-tagged backend image and restart the Compose stack without building on the VM.

The VM requires its own `~/budget-app/.env` file for database and JWT settings. If the GHCR image package is private, the VM must be authenticated to `ghcr.io` with a token that can read packages.

## Roadmap

- Add screenshot-based interface previews to this README.
- Add automated API documentation (OpenAPI).
- Add transaction editing from the mobile client and richer budget reporting.
- Add CI checks for type safety, tests, and linting before deployment.
