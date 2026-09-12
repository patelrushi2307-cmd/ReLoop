import { Router } from 'express';
import { MATERIAL_TAXONOMY } from '../listings/materialType.model.js';

const router = Router();

// Readable labels for the slugs listings and requirements are validated against.
const SUBTYPE_LABELS: Record<string, string> = {
  corrugated_cardboard: 'Corrugated cardboard',
  occ: 'OCC (Old Corrugated Containers)',
  die_cut_box: 'Die-cut boxes',
  stretch_film: 'LDPE stretch film',
  strapping: 'Strapping',
  rigid_container: 'Rigid containers',
  wooden_pallet: 'Wooden pallets',
  plastic_pallet: 'Plastic pallets',
  euro_pallet: 'Euro pallets (EPAL)',
  steel_drum: 'Steel drums',
  plastic_drum: 'Plastic drums',
  fiber_gaylord: 'Fibre gaylords',
  plastic_gaylord: 'Plastic gaylords',
};

const CATEGORY_LABELS: Record<string, string> = {
  cardboard: 'Cardboard',
  plastics: 'Plastics',
  pallets: 'Pallets',
  drums: 'Drums',
  gaylords: 'Gaylords',
};

// Static MVP categories matching requirements: Cardboard, Plastic, Pallets
const MVP_CATEGORIES = [
  {
    id: 'cardboard',
    name: 'Cardboard',
    description: 'Corrugated boxes, sheets, industrial packaging tubes, and baled OCC',
    subcategories: ['OCC (Old Corrugated Containers)', 'Die-Cut Boxes', 'Cardboard Pallets', 'Industrial Rolls'],
  },
  {
    id: 'plastic',
    name: 'Plastic',
    description: 'Stretch film, LDPE wraps, HDPE containers, plastic totes and crates',
    subcategories: ['LDPE Stretch Film', 'HDPE Crates & Totes', 'Polypropylene Strapping', 'Rigid Drums'],
  },
  {
    id: 'pallets',
    name: 'Pallets',
    description: 'Standard wooden pallets, heat-treated Euro pallets, and heavy-duty plastic skids',
    subcategories: ['Wooden Pallets (48x40)', 'Euro Pallets (EPAL)', 'Plastic Skids', 'Reversible Heavy Duty'],
  },
];

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: MVP_CATEGORIES,
  });
});

/**
 * The taxonomy listings and requirements are actually validated against.
 * Clients must submit these slugs, so they are served rather than duplicated.
 */
router.get('/taxonomy', (_req, res) => {
  const data = Object.entries(MATERIAL_TAXONOMY).map(([category, subtypes]) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    subtypes: (subtypes as readonly string[]).map((slug) => ({
      slug,
      label: SUBTYPE_LABELS[slug] ?? slug.replace(/_/g, ' '),
    })),
  }));

  res.json({ success: true, data });
});

export const categoriesRoutes = router;
