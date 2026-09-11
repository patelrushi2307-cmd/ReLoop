# Circular Packaging & Materials Exchange

A B2B circular materials marketplace connecting manufacturers, retailers, packaging recyclers, and logistics operators to keep packaging materials (Cardboard, Plastic, Pallets) in high-value industrial circulation.

---

## 1. Project Purpose

The platform enables businesses to list surplus or reusable packaging, claim or purchase materials (including zero-cost circular reallocations), arrange certified transport logistics, and calculate waste diversion and estimated carbon impact metrics.

- **Manufacturers:** List industrial surplus packaging and off-spec lots.
- **Retailers:** Source reusable packaging containers or return pallets into circulation.
- **Recyclers:** Procure graded secondary raw materials at volume.
- **Logistics Providers:** Provide route-optimized hauling, verification, and chain-of-custody tracking.

---

## 2. Architectural Overview

- **Pattern:** Modular Monolith with clean layered boundaries (`Routes` -> `Controller` -> `Service` -> `Model`).
- **Backend:** Node.js, Express, TypeScript, Mongoose, Socket.io, Winston, Zod.
- **Frontend:** React 18/19, Vite, TypeScript, React Router, TanStack Query, Axios, React Hook Form, Zod.
- **Security:** In-memory access JWT + HttpOnly SameSite=Strict refresh token rotation, ownership guards, role guards, rate limiting, and mongo sanitization.

---

## 3. Directory Layout

```text
CircularPackagingExchange/
├── backend/               # Modular Monolith Express API
│   ├── src/
│   │   ├── config/        # Environment & MongoDB setup
│   │   ├── middleware/    # Auth, Validation, Roles, Centralized Errors
│   │   ├── modules/       # Domain modules (auth, materials, orders, etc.)
│   │   ├── services/      # Shared domain services (email, routing, impact)
│   │   ├── sockets/       # Socket.io gateway
│   │   └── utils/         # Ownership checks, token hashing
│   └── postman/           # Pre-configured collection & environment
├── frontend/              # Vite + React + TypeScript SPA
│   ├── src/
│   │   ├── auth/          # Token storage and AuthProvider
│   │   ├── components/    # Reusable structural components (RequireAuth, ErrorBoundary)
│   │   ├── features/      # Feature domain abstractions
│   │   ├── lib/           # Environment and dual Axios clients
│   │   └── pages/         # High-level route pages
├── docs/                  # Architecture blueprints and API planning
└── .github/workflows/     # Lightweight CI pipeline
```

---

## 4. Prerequisites

- **Node.js:** >= 20.x LTS
- **npm:** >= 10.x
- **MongoDB:** MongoDB Atlas or local MongoDB instance (>= 6.0)

---

## 5. Getting Started

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The server starts on port `5000` (or `PORT` from `.env`).
Health check: `GET http://localhost:5000/health`
Readiness check: `GET http://localhost:5000/ready`

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 6. Architecture Phase 1 Status

This repository is currently in **Phase 1: Basic Scaffolding & Architecture**. Business workflows, complete marketplace logic, and external provider integrations will be implemented iteratively in subsequent phases.
