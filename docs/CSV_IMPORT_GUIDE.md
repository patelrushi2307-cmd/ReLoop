# ReLoop Flat CSV Listings Import Specification

This document defines the schema, field specifications, validation constraints, and API format for the flat CSV bulk listings import feature in ReLoop.

## Endpoint

- **Method**: `POST`
- **URL**: `/api/v1/listings/bulk`
- **Authentication**: Bearer JWT (organization `owner` or `admin` role required)
- **Content-Type**: `multipart/form-data`
- **Field Name**: `file` (a `.csv` file)

---

## CSV Column Definitions

| Column Header | Type | Required | Allowed Values / Constraints | Description & Example |
|---|---|---|---|---|
| `title` | String | **Yes** | 3 – 160 characters | Clear title of the material lot. E.g. `Clean OCC Corrugated Bales` |
| `description` | String | No | Max 5000 characters | Optional lot description, origin, or handling notes. |
| `material_type` or `material_category` | String | **Yes** | `cardboard`, `plastics`, `pallets`, `drums`, `gaylords` | Primary circular material category. |
| `material_subtype` | String | **Yes** | Valid taxonomy subtype for category | See Taxonomy Table below. E.g. `corrugated_cardboard`, `occ`, `wooden_pallet` |
| `grade` | String | **Yes** | `A`, `B`, `C`, `reject` | Quality grade according to ReLoop circular standards. |
| `mass_kg` | Number | **Yes** | Positive number > 0, max 100,000,000 | Total mass of the lot in kilograms. E.g. `5000` |
| `unit_count` | Integer | No | Positive integer >= 1 | Optional number of physical units. E.g. `120` |
| `length_mm` | Number | No | Positive number | Length of unit/bundle in millimeters. |
| `width_mm` | Number | No | Positive number | Width of unit/bundle in millimeters. |
| `height_mm` | Number | No | Positive number | Height of unit/bundle in millimeters. *Note: length, width, and height must all be provided if any dimension is specified.* |
| `packaging_state` | String | **Yes** | `new`, `reusable`, `damaged_recyclable`, `clean_scrap` | Physical state of the packaging materials. |
| `available_from` | Date | **Yes** | ISO 8601 (e.g. `2026-10-01T09:00:00Z` or `2026-10-01`) | Earliest pickup date. |
| `available_until` | Date | **Yes** | ISO 8601, >= `available_from` | Latest pickup date. |
| `price_per_kg` | Number | No | Non-negative number >= 0 | Asking price (USD). E.g. `0.25` |
| `open_to_offers` | Boolean | No | `true`, `false`, `1`, `0`, `yes`, `no` (default `false`) | Whether the seller is willing to negotiate price. |
| `facility_id` | String | **Yes** | 24-character hexadecimal ObjectId | Must be a valid facility belonging to the authenticated organization. Cross-organization facilities are strictly rejected. |
| `has_forklift` | Boolean | No | `true`, `false`, `1`, `0`, `yes`, `no` (default `false`) | Whether the facility provides forklift loading. |
| `packaging_mode` | String | No | `loose`, `palletised` (default `palletised`) | Packaging configuration for transport. |
| `dock_opens` | String | No | `HH:MM` format (default `09:00`) | Dock opening time for pickup. |
| `dock_closes` | String | No | `HH:MM` format (default `17:00`), > `dock_opens` | Dock closing time for pickup. |

---

## Allowed Material Taxonomy

| Category (`material_type`) | Allowed Subtypes (`material_subtype`) |
|---|---|
| `cardboard` | `corrugated_cardboard`, `occ`, `die_cut_box` |
| `plastics` | `stretch_film`, `strapping`, `rigid_container` |
| `pallets` | `wooden_pallet`, `plastic_pallet`, `euro_pallet` |
| `drums` | `steel_drum`, `plastic_drum` |
| `gaylords` | `fiber_gaylord`, `plastic_gaylord` |

---

## Validation & Error Handling

- **Row Indexing**: Header row is row 1. Data rows start at row 2.
- **Partial Failure Support**: Valid rows in the CSV are persisted as `draft` listings. Any invalid rows are reported with exact line and field details:

```json
{
  "success": true,
  "data": {
    "created": 2,
    "failed": 1,
    "listingIds": [
      "66f1234567890abcdef12345",
      "66f1234567890abcdef12346"
    ],
    "errors": [
      {
        "row": 4,
        "field": "grade",
        "message": "Grade must be one of: A, B, C, reject"
      }
    ]
  }
}
```

- **Organisation Isolation**: If `facility_id` belongs to another organization, the row is rejected immediately with error:
  `Facility not found or does not belong to your organisation`.
