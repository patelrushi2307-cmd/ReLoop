# Backend Planning & Master API Specification

This document maps all API routes under `/api/v1/` directly to the 8 foundational architecture tiers.

## 1. Response Envelope Standards

### Standard Success
```json
{
  "success": true,
  "data": {}
}
```

### Standard Paginated Success
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Standard Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation",
    "fields": {}
  }
}
```

---

## 2. API Endpoints by Master Tier

### Health & Readiness Probes
- `GET /health`: Liveness probe (`{ "status": "ok" }`)
- `GET /ready`: Readiness probe verifying MongoDB database connection state

---

### Tier 1: IDENTITY
- `POST /api/v1/auth/register`: Register user + organization
- `POST /api/v1/auth/login`: Issue short-lived access JWT + set HttpOnly refresh cookie
- `POST /api/v1/auth/refresh`: Rotate refresh token & issue new access JWT
- `POST /api/v1/auth/logout`: Revoke active refresh token
- `GET /api/v1/users/me`: Authenticated user session & active organization context
- `GET /api/v1/organizations`: List organizations
- `GET /api/v1/organizations/:id`: Organization public profile & verified status
- `POST /api/v1/organizations`: Create/update organization profile
- *(Planned)* `GET /api/v1/facilities`: List organization loading docks & collection facilities

---

### Tier 2: CATALOG
- `GET /api/v1/categories`: List primary categories (`cardboard`, `plastic`, `pallets`) & subcategories
- `GET /api/v1/materials`: Paginated search with filters (`materialType`, `status`, `condition`, `lng`, `lat`, `maxDistanceKm`)
- `POST /api/v1/materials`: Create new material listing (Enforces organization membership)
- `GET /api/v1/materials/:id`: Material listing detail with pickup facility coordinates
- `PATCH /api/v1/materials/:id`: Update material listing (Enforces ownership guard)
- `DELETE /api/v1/materials/:id`: Soft delete (`isDeleted: true`)
- *(Planned)* `POST /api/v1/requirements`: Post buyer demand requests for wanted packaging lots

---

### Tier 3: INTELLIGENCE
- `POST /api/v1/matching/recommendations`: Deterministic multi-criteria scoring algorithm matching demand with available lots
- *(Planned)* `POST /api/v1/grading/evaluate`: Grade packaging quality batch
- *(Planned)* `POST /api/v1/carbon/estimate`: Calculate projected avoided emissions before checkout

---

### Tier 4: COMMERCE
- `GET /api/v1/orders`: List organization orders (as buyer or seller)
- `POST /api/v1/orders`: Create new order / claim (Supports `free_claim` and `paid_purchase`)
- `GET /api/v1/orders/:id`: Detailed order record with custody status (Enforces ownership guard)
- *(Planned)* `POST /api/v1/trades/negotiate`: Submit offer / counteroffer on price or minimum order quantity

---

### Tier 5: LOGISTICS
- `GET /api/v1/logistics/estimate`: Calculate route distance, duration, and freight cost between pickup & delivery coordinates
- `GET /api/v1/logistics/orders/:orderId`: Get shipment details and waypoints for an order
- *(Planned)* `POST /api/v1/logistics/shipments`: Dispatch carrier vehicle
- *(Planned)* `PATCH /api/v1/logistics/shipments/:id/status`: Update transit milestones (`scheduled`, `in_transit`, `delivered`)
- *(Planned)* `GET /api/v1/logistics/backhauls`: Find matching return loads along existing delivery corridors

---

### Tier 6: CIRCULARITY
- `GET /api/v1/impact/organization/:orgId`: Aggregate metrics (`wasteDivertedKg`, `co2SavedKg`, `completedTransactions`)
- *(Planned)* `GET /api/v1/impact/ledger`: Immutable record of verified circular diversion events
- *(Planned)* `GET /api/v1/impact/certificates/:orderId`: Download verifiable Chain-of-Custody certificate

---

### Tier 7: TRUST
- `GET /api/v1/reviews/organization/:organizationId`: Organization review history & rating
- `POST /api/v1/reviews`: Submit counterparty review post-transaction
- *(Planned)* `POST /api/v1/disputes`: Open dispute regarding shipment discrepancy
- *(Planned)* `GET /api/v1/verification/badges`: Check organization accreditation

---

### Tier 8: EXPERIENCE
- `GET /api/v1/notifications`: List in-app notifications
- `PATCH /api/v1/notifications/:id/read`: Mark notification as read
- *(Planned)* `GET /api/v1/reports/esg`: Export sustainability performance reports
