# ReLoop — Carbon-Aware B2B Circular Packaging Exchange

A B2B exchange for surplus industrial packaging that scores every match on **net carbon**, not diverted tonnage — and suppresses trades that would emit more than they save.

Reuse avoids the emissions of virgin production. Freight emits. Beyond a distance you can calculate, a circular trade costs more carbon than it saves. ReLoop computes that distance per lot and refuses to recommend anything past it.

---

## Contents

- [The core idea](#the-core-idea)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Directory layout](#directory-layout)
- [Getting started](#getting-started)
- [Material taxonomy](#material-taxonomy)
- [The carbon model](#the-carbon-model)
- [The matching engine](#the-matching-engine)
- [API surface](#api-surface)
- [Application routes](#application-routes)
- [Scripts](#scripts)
- [Security](#security)

---

## The core idea

Most circular-economy platforms optimise for tonnage diverted from landfill. That metric can be actively harmful: hauling a light, low-value lot 900 km in a diesel van can emit more CO₂e than the reuse avoids.

ReLoop treats that as a hard constraint rather than a footnote:

1. Every listing carries a **break-even radius** — the haul distance at which the trade stops paying for itself in carbon.
2. The matching engine **drops** any lot beyond that radius, or where net saved emissions are zero or negative. It is a filter, not a ranking penalty.
3. Every figure records the **emission-factor version** used to produce it.

A consequence worth understanding: "no matches" is a meaningful, correct result. A lot existing is not enough for it to be recommended.

---

## Architecture

**Modular monolith** with clean layered boundaries:

```
Routes → Controller → Service → Model
```

Each domain lives in its own module under `backend/src/modules/`, with its own routes, controller, service, schema and model. Shared concerns (auth, validation, error handling, rate limiting) are middleware; cross-cutting domain logic (carbon, email, routing) lives in `services/`.

The frontend is a separate Next.js application that talks to the API over HTTP. It holds no business logic — the carbon model and matching engine are server-side and authoritative.

---

## Tech stack

**Backend**
- Node.js, Express 4, TypeScript
- MongoDB via Mongoose 8
- Zod for request validation
- Socket.io for realtime notifications
- Winston for structured logging
- Helmet, CORS, rate limiting, `express-mongo-sanitize`

**Frontend**
- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion + Lenis for motion and smooth scrolling

---

## Directory layout

```text
ReLoop/
├── backend/                  # Express API (modular monolith)
│   ├── src/
│   │   ├── config/           # Environment schema and MongoDB connection
│   │   ├── middleware/       # Auth, validation, roles, error handling
│   │   ├── modules/          # Domain modules — see API surface below
│   │   ├── services/         # Shared domain services
│   │   ├── sockets/          # Socket.io gateway
│   │   ├── utils/            # Ownership checks, token hashing
│   │   ├── app.ts            # Express app and route mounting
│   │   └── server.ts         # Process entrypoint
│   ├── test/                 # Integration suites
│   ├── postman/              # Collection and environment
│   └── uploads/              # Listing media (gitignored)
├── frontend/                 # Next.js App Router application
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/        # Authenticated application
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── sections/         # Landing page sections
│   │   ├── dashboard/        # Dashboard UI
│   │   ├── motion/           # Scroll, reveal and text primitives
│   │   └── art/              # Illustrative SVG components
│   ├── content/site.ts       # Landing page copy and taxonomy mirror
│   └── lib/                  # API client, auth context, helpers
└── docs/                     # Architecture and API planning
```

---

## Getting started

### Prerequisites

- Node.js >= 20.x LTS
- npm >= 10.x
- MongoDB >= 6.0 (local, or a MongoDB Atlas cluster)

### Backend

```bash
cd backend
cp .env.example .env     # then fill in MONGODB_URI and the JWT secrets
npm install
npm run dev
```

The API starts on `PORT` from `.env` (the reference setup uses `5050`; the schema default is `5000`).

- Health: `GET http://localhost:5050/health`
- Readiness: `GET http://localhost:5050/ready`
- API base: `http://localhost:5050/api/v1`

Required environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | API port |
| `NODE_ENV` | `development` / `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Signs short-lived access tokens |
| `JWT_REFRESH_SECRET` | Signs rotating refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, for CORS and cookies |

`.env.example` also documents optional media storage, SMTP, Sentry and Gemini keys.

> **Never commit `.env`.** It is gitignored — keep it that way, and make sure no archive or zip containing it is committed either.

### Frontend

```bash
cd frontend
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:5050/api/v1' > .env.local
npm run dev
```

The app runs at `http://localhost:3000`. `NEXT_PUBLIC_API_URL` must point at the backend's `/api/v1` base, and `CLIENT_URL` in the backend `.env` must match the frontend origin or cookies and CORS will fail.

---

## Material taxonomy

Five categories, thirteen subtypes. This is the taxonomy every listing and requirement is validated against — a submission outside it is rejected at the API. It is served from `GET /api/v1/categories/taxonomy` so clients never hardcode a list that can drift.

| Category | Subtypes |
|---|---|
| **Cardboard** | Corrugated cardboard · OCC (Old Corrugated Containers) · Die-cut boxes |
| **Plastics** | LDPE stretch film · Strapping · Rigid containers |
| **Pallets** | Wooden pallets · Plastic pallets · Euro pallets (EPAL) |
| **Drums** | Steel drums · Plastic drums |
| **Gaylords** | Fibre gaylords · Plastic gaylords |

---

## The carbon model

Implemented in `backend/src/modules/carbon/`. Every computed figure carries the methodology version that produced it.

```
gross_avoided_kg     = mass_kg × EF_virgin
reprocess_kg         = mass_kg × EF_reprocess
transport_kg         = (mass_kg / 1000) × km × EF_freight / load_factor
net_saved_kg         = gross_avoided_kg − reprocess_kg − transport_kg

breakeven_radius_km  = ((gross_avoided_kg − reprocess_kg) × load_factor)
                       ÷ ((mass_kg / 1000) × EF_freight)
```

Each trade is classified `carbon-positive`, `marginal` or `carbon-negative`. The **Impact** page in the dashboard runs this across every vehicle class for a given lot and distance, so the freight decision is visible rather than assumed.

> Vehicle emission factors are indicative DEFRA-derived values. Replace them with citable published figures before making any public impact claim.

---

## The matching engine

Implemented in `backend/src/modules/matching/`. Deterministic — no model, no randomness, same inputs give the same ranking.

**Hard filters, applied before scoring.** A candidate failing any of these is dropped, not down-ranked:

- Material category and subtype compatibility
- Grade floor — the listing must meet the requirement's minimum grade
- Maximum haul distance from the requirement
- The buyer's own organisation is excluded
- **Carbon suppression** — `net_saved_kg` must be positive *and* the haul must fall within the lot's break-even radius

**Composite score** over what survives:

```
score = 0.25·semantic + 0.20·grade + 0.15·price + 0.30·carbon + 0.10·timing
```

| Component | Weight | Basis |
|---|---:|---|
| Semantic fit | 25% | Subtype alignment |
| Grade fit | 20% | Exact match scores highest; exceeding the floor still scores well |
| Price fit | 15% | Against the requirement's maximum; a free claim scores full marks |
| Carbon score | 30% | Net saved as a proportion of gross avoided — penalises long hauls |
| Timing fit | 10% | Whether the lot is available now |

Results are returned sorted by score, each with its subscore breakdown, carbon metrics and haul distance, so a recommendation can always be explained.

---

## API surface

All routes are mounted under `/api/v1`.

| Module | Route | Responsibility |
|---|---|---|
| Auth | `/auth` | Registration, login, refresh rotation, logout |
| Users | `/users` | User profiles |
| Organizations | `/organizations` | Organisation records and verification |
| Facilities | `/facilities` | Physical sites and geolocation |
| Categories | `/categories` | Material taxonomy |
| Materials | `/materials` | Material type records |
| Listings | `/listings` | Surplus lots, media, CSV bulk import |
| Requirements | `/requirements` | Standing buy-side requirements |
| **Matching** | `/matching` | Ranked recommendations |
| Orders | `/orders` | Purchases and free claims |
| Negotiations | `/negotiations` | Offers and counter-offers |
| Carbon | `/carbon` | Break-even and vehicle comparison |
| Impact | `/impact` | Impact ledger |
| Circularity | `/circularity` | Circularity metrics |
| Logistics | `/logistics` | Haulage coordination |
| Vehicles | `/vehicles` | Fleet and emission factors |
| Routes | `/routes` | Route planning |
| Transactions | `/transactions` | Settlement records |
| Reviews | `/reviews` | Counterparty reviews |
| Trust | `/trust` | Trust scoring |
| Notifications | `/notifications` | In-app notifications |
| Intelligence | `/intelligence` | Analytics |
| Experience | `/experience` | Experience surfaces |

A Postman collection and environment are provided in `backend/postman/`.

---

## Application routes

| Route | Purpose |
|---|---|
| `/` | Landing page — method, materials, carbon rationale |
| `/register`, `/login` | Authentication |
| `/dashboard` | Sell and buy views over your lots and the open market |
| `/dashboard/listings` | Your listings, drafts, and the open market |
| `/dashboard/listings/new` | Publish a lot |
| `/dashboard/requirements` | Standing requirements, with ranked recommendations |
| `/dashboard/trades` | Orders bought and sold, with status transitions |
| `/dashboard/impact` | Carbon comparison across vehicle classes |

Trade lifecycle: the seller accepts and dispatches; the buyer confirms delivery.

```
pending → accepted → in_transit → completed
              ↓           ↓
          cancelled   cancelled
```

---

## Scripts

**Backend**

| Command | Effect |
|---|---|
| `npm run dev` | Watch mode via `tsx` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type check without emitting |
| `npm run test:integration` | F2 integration suite |
| `npm run test:f3` | F3 integration suite |

**Frontend**

| Command | Effect |
|---|---|
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type check without emitting |
| `npm run lint` | ESLint |

> Integration suites write to the database named in your `.env`. Point them at a throwaway database — never a shared or production cluster.

---

## Security

- **Token model** — short-lived access JWT held in memory; refresh token in an `httpOnly`, `SameSite=Strict` cookie, rotated on use.
- **Authorisation** — ownership guards on every mutating route; listings, requirements and orders are scoped to the caller's organisation.
- **Soft deletes** — records carry `isDeleted` and every query filters on it, so removal is reversible and auditable.
- **Input handling** — Zod validation at the route boundary, `express-mongo-sanitize` against operator injection, and rate limiting applied across `/api`.
- **Transport** — Helmet headers and an explicit CORS origin allowlist.

If a secret has ever been committed or shared, rotate it. Removing it from the working tree does not remove it from git history.

---

## Licence

Not yet specified.
