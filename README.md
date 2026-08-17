# FamilyBudget

A ReactNative Mobile App to plan the family budgets (Personal Project)

This document currently covers the **backend only**.

## Project Summary

FamilyBudget's backend is a Node/TypeScript/Express API backed by PostgreSQL (via Drizzle ORM). Multiple users belong to a **family** (a shared budget group); within a family they track **categories** (income/expense buckets), **transactions** (actual money movements), and **schedules** (recurring transaction templates, e.g. monthly rent), and can view a **budget overview** summarizing income/expenses by category over a date range. New members join a family by accepting an emailed-token **invite**.

### Tech stack

- **Runtime**: Node.js + TypeScript, built/bundled with `esbuild`, run in dev via `tsx watch`
- **Framework**: Express 5
- **Database**: PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-kit` for migrations)
- **Validation**: Zod — shared request schemas live in `packages/shared` so they can be reused by other workspaces (e.g. the mobile app)
- **Auth**: JWT (`jsonwebtoken`) + `bcrypt` password hashing
- **Testing**: Vitest + Supertest, run against a real Postgres test database (not mocked)
- **Monorepo**: npm workspaces — `apps/backend`, `apps/mobile`, `packages/shared`
- **Containerization**: Docker Compose, with separate dev (`docker-compose.dev.yml`, bind-mounted + `tsx watch`) and prod (`docker-compose.yml`, esbuild bundle) setups


### Getting started

```bash
# start Postgres + backend in Docker (dev mode, hot reload)
npm run docker:dev:up

# apply migrations to the dev database
npm run db:migrate

# apply migrations to the test database
npm run db:migrate:test

# run the backend test suite (inside the dev container)
npm run test:file

# or run the backend locally without Docker
npm run backend
```

## Authentication

Every endpoint except `POST /auth/login` and `POST /auth/register` requires a JWT bearer token, obtained from `/auth/login`:

```
Authorization: Bearer <token>
```

The authenticated user's family is always resolved server-side from their `userId` (via `family_members`) — it is never trusted from the request body/params, so a user can only ever read or write data belonging to their own family.

## API Reference

All non-auth responses follow the shape `{ data, meta? }`; error responses generally follow `{ error }`.

### Auth — `/auth` (public, no token required)

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `200 { token, user: { id, name } }` · `401` invalid credentials · `400` validation |
| POST | `/auth/register` | `{ name, email, password }` | `200 { user }` · `400` validation |

### Categories — `/api/categories`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/api/categories/:familyId` | query: `type?` (`income`\|`expense`), `sort?` (`asc`\|`desc`) | `200 { data: Category[], meta: { total } }` — scoped to the caller's own family; the `:familyId` path segment is currently unused by the handler |
| POST | `/api/categories` | `{ familyId, name, type }` | `200 { data: Category }` · `400` validation |
| PUT | `/api/categories/:categoryId` | `{ name }` | `200 { data: Category | null }` · `400` validation |
| DELETE | `/api/categories/:categoryId` | — | `200 { data: Category | null }` |

### Transactions — `/api/transactions`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/api/transactions` | query: `filter[from]?`, `filter[to]?` (`YYYY-MM-DD`) | `200 { data: Transaction[], meta: { total } }` |
| GET | `/api/transactions/:id` | — | `200 { data: Transaction, meta: { total: 1 } }` · `404` |
| POST | `/api/transactions` | `{ familyId, categoryId, scheduleId?, amountCents, type, description, status? }` | `200 { data: Transaction }` · `403` if `familyId` isn't the caller's family · `400` validation |
| PUT | `/api/transactions/:id` | partial: `{ categoryId?, amountCents?, type?, description?, status? }` | `200 { data: Transaction }` · `404` |
| DELETE | `/api/transactions/:id` | — | `200 { data: Transaction }` · `404` |

`amountCents` is always a positive integer number of cents; `type` is `income`\|`expense`; `status` is `actual`\|`projected`\|`skipped` (defaults to `actual`).

### Schedules — `/api/schedules`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/api/schedules` | — | `200 { data: Schedule[], meta: { total } }` |
| GET | `/api/schedules/:id` | — | `200 { data: Schedule, meta: { total: 1 } }` · `404` |
| POST | `/api/schedules` | `{ familyId, categoryId, description, amountCents, frequency, startDate, endDate?, dayOfMonth?, dayOfWeek?, active? }` | `200 { data: Schedule }` · `403` if `familyId` isn't the caller's family |
| PUT | `/api/schedules/:id` | partial, any of the create fields except `familyId` | `200 { data: Schedule }` · `404` |
| DELETE | `/api/schedules/:id` | — | `200 { data: Schedule }` · `404` |

`amountCents` is signed (positive = income, negative = expense); `frequency` is `once`\|`weekly`\|`biweekly`\|`monthly`\|`yearly`; dates are `YYYY-MM-DD` strings.

### Family Invites — `/api/familyInvites`

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/familyInvites` | `{ invitedEmail }` | `200 { data: Invite, meta: { total: 1 } }` — invites into the caller's own family; the invited email must already have an account |
| POST | `/api/familyInvites/:token/accept` | — | `200 { data: "success" }` · `400` if the token is missing/expired/already used, or doesn't belong to the caller's account |

### Budgets Overview — `/api/budgets`

| Method | Path | Body / Query | Response |
|---|---|---|---|
| GET | `/api/budgets/:familyId/overview` | query: `filter[from]?`, `filter[to]?` (`YYYY-MM-DD`, defaults to the current month) | `200 { data: { totalIncomeCents, totalExpensesCents, totalNetCents, byCategory: [{ categoryId, categoryName, type, totalAmountCents }] }, meta: { total } }` · `403` if the caller isn't in `familyId` |

Only transactions with `status: "actual"` are counted in the overview.
