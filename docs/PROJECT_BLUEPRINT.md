# Circular Packaging & Materials Exchange — Master Project Blueprint

This blueprint outlines the complete end-to-end domain pipeline, data models, and architectural layers for the **Circular Packaging & Materials Exchange** platform across its 8 foundational tiers.

---

## 1. Domain Architecture & The 8-Tier Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. IDENTITY                                                                 │
│    Organizations (B2B)  │  Users (RBAC/Auth)  │  Facilities (Geo/Permits)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. CATALOG                                                                  │
│    Categories (3 MVP)   │  Materials (Specs)  │  Listings & Requirements    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. INTELLIGENCE                                                             │
│    Quality Grading      │  Multi-Criteria Match │  Carbon/Avoidance Calc    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. COMMERCE                                                                 │
│    Matches Generated    │  Trades / Orders    │  B2B Price & Term Negot.    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. LOGISTICS                                                                │
│    Fleet / Vehicles     │  Shipments & Stops  │  Consolidation & Backhaul   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. CIRCULARITY                                                              │
│    Diversion Metrics    │  Carbon Ledger      │  Chain-of-Custody Certs     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. TRUST                                                                    │
│    Facility & Lot Verif │  B2B Reviews        │  Dispute Resolution         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 8. EXPERIENCE                                                               │
│    Realtime Alerts      │  Role Dashboards    │  ESG Compliance Reports     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Tier Breakdown

### 1. IDENTITY
- **Organizations**: Legal entities classified as `manufacturer`, `retailer`, `recycler`, or `logistics`.
- **Users**: Employees/agents with RBAC (`owner`, `admin`, `member`) authenticated via access JWT & HttpOnly refresh tokens.
- **Facilities**: Physical collection centers, warehouses, recycling yards, and retail depots with GeoJSON Point coordinates and operational hours.

### 2. CATALOG
- **Categories**: Cardboard/OCC, Plastics (rigid, film), and Pallets (wooden 48x40, Euro, skids).
- **Materials**: Material attributes, standardized resin/fiber grades, moisture/contamination levels.
- **Listings**: Supply lots available for transfer (sale or zero-cost free circular claim) with available quantities.
- **Requirements**: Buyer demand requests specifying needed material types, volumes, target pricing, and geofence radii.

### 3. INTELLIGENCE
- **Grading**: Standardized material condition assessment (`new`, `reusable`, `clean_scrap`, `damaged_recyclable`).
- **Matching**: Deterministic multi-criteria scoring algorithm taking into account distance, quantity fulfillment, quality grade, and price.
- **Carbon**: Baseline avoided emissions calculator translating diverted mass into CO₂ equivalent reduction.

### 4. COMMERCE
- **Matches**: Ranked potential transactions surfaced automatically between sellers and buyers.
- **Trades (Orders)**: Binding agreements supporting both paid purchases and free circular allocations.
- **Negotiation**: Counterparty offer/counter-offer workflow for volume and price terms prior to confirmation.

### 5. LOGISTICS
- **Vehicles**: Carrier fleet capacity, vehicle types (box trucks, flatbeds, dry vans), and payload limits.
- **Shipments & Stops**: Multi-leg custody tracking from pickup dock to intermediate drop-off or recycler yard.
- **Consolidation & Backhaul**: Route optimization matching empty return trips with nearby recyclable packaging lots to minimize empty miles.

### 6. CIRCULARITY
- **Impact Metrics**: Cumulative kilograms diverted from landfill and virgin resource extraction avoided.
- **Carbon Ledger**: Immutable audit log of emissions savings attributed to specific verified order completions.
- **Certificates**: Downloadable Chain-of-Custody certificates for corporate ESG disclosure.

### 7. TRUST
- **Verification**: Verified enterprise badges, facility accreditation, and lot sample validation.
- **Reviews**: Mutual counterparty reviews (1-5 stars + qualitative commentary) post-transaction.
- **Disputes**: Issue reporting (weight discrepancy, contamination, damage in transit) with resolution states.

### 8. EXPERIENCE
- **Notifications**: Real-time Socket.io and transactional email alerts on order milestones and matches.
- **Dashboard**: Role-tailored dashboards for sellers, buyers, carriers, and administrators.
- **Reporting**: Exportable CSV/PDF summaries for sustainability auditors.
