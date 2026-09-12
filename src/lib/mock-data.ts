import {
  Category,
  Seller,
  Product,
  Order,
  Notification,
  PlatformStats,
  User,
  CarbonImpact
} from '@/lib/types';

// ==========================================
// 1. CATEGORIES
// ==========================================
export const CATEGORIES: Category[] = [
  { id: 'timber-skids', name: 'Heavy-Duty Timber & Skids', slug: 'timber-skids', count: 145, listingCount: 145, thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=150&q=80' },
  { id: 'steel-drums', name: 'Industrial Steel Drums', slug: 'steel-drums', count: 89, listingCount: 89, thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=150&q=80' },
  { id: 'plastic-totes', name: 'Plastic Drums & IBC Totes', slug: 'plastic-totes', count: 210, listingCount: 210, thumbnailUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=150&q=80' },
  { id: 'cardboard', name: 'Corrugated Cardboard', slug: 'cardboard', count: 340, listingCount: 340, thumbnailUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=150&q=80' },
  { id: 'metal-strapping', name: 'Metal Strapping & Wire', slug: 'metal-strapping', count: 76, listingCount: 76, thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=150&q=80' },
  { id: 'industrial-pallets', name: 'Industrial Pallets', slug: 'industrial-pallets', count: 520, listingCount: 520, thumbnailUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=150&q=80' },
  { id: 'scrap-metals', name: 'Scrap Metals & Coils', slug: 'scrap-metals', count: 112, listingCount: 112, thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80' }
];

// ==========================================
// 2. SELLERS
// ==========================================
export const SELLERS: Seller[] = [
  {
    id: 'sel-001',
    name: 'PackagingHub Industries',
    rating: 4.8,
    salesCount: 1240,
    verified: true,
    location: {
      address: 'GIDC Estate, Phase IV',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      lat: 22.9961,
      lng: 72.6395
    },
    memberSince: '2023-01-15'
  },
  {
    id: 'sel-002',
    name: 'EcoSteel Corp',
    rating: 4.9,
    salesCount: 890,
    verified: true,
    location: {
      address: 'Hazira Industrial Area',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      lat: 21.1702,
      lng: 72.8311
    },
    memberSince: '2023-04-10'
  },
  {
    id: 'sel-003',
    name: 'GreenPack Solutions',
    rating: 4.7,
    salesCount: 1560,
    verified: true,
    location: {
      address: 'MIDC, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      lat: 19.1136,
      lng: 72.8697
    },
    memberSince: '2022-11-05'
  },
  {
    id: 'sel-004',
    name: 'TimberTrade Co.',
    rating: 4.5,
    salesCount: 650,
    verified: true,
    location: {
      address: 'Makarpura GIDC',
      city: 'Vadodara',
      state: 'Gujarat',
      country: 'India',
      lat: 22.2587,
      lng: 73.1936
    },
    memberSince: '2024-02-20'
  }
];

// ==========================================
// 3. PRODUCTS
// ==========================================
export const PRODUCTS: Product[] = [
  {
    id: 'prd-001',
    title: 'Grade-A Heat-Treated Oak Wooden Skids',
    slug: 'grade-a-heat-treated-oak-wooden-skids',
    description: 'High-quality heat-treated oak wooden skids, perfect for heavy industrial loads. Excellent condition with minor cosmetic scuffs.',
    category: 'timber-skids',
    material: 'Oak Wood',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.95,
    dimensions: { length: 120, width: 100, height: 15, unit: 'cm' },
    weight: { value: 45, unit: 'kg' },
    quantity: 500,
    moq: 50,
    pricePerUnit: 2800,
    wholesalePrice: 2400,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 420,
    co2SavedEstimate: 420,
    co2Details: '420 kg of CO2 equivalent saved per unit compared to sourcing virgin oak.',
    specs: {
      'Wood Type': 'Oak',
      'Treatment': 'Heat-treated',
      'Humidity': '12%',
      'Load Capacity': '1500kg'
    },
    defects: [
      { id: 'def-1', type: 'scuff', severity: 'minor', position: { x: 0.5, y: -0.2, z: 0.8 }, description: 'Minor scuff mark on bottom runner' }
    ],
    seller: SELLERS[3],
    location: SELLERS[3].location,
    distanceKm: 28,
    unitsPerTruckload: 200,
    unitsPerContainer: 450,
    humidityContent: 12,
    createdAt: '2026-08-25T10:00:00Z',
    featured: true,
    topCarbonSaver: true,
    meshType: 'crate',
    meshColor: '#8B6914'
  },
  {
    id: 'prd-002',
    title: 'Industrial Pine Timber Crates',
    slug: 'industrial-pine-timber-crates',
    description: 'Sturdy pine timber crates suitable for general purpose packaging. Grade B due to some visible wear and tear.',
    category: 'timber-skids',
    material: 'Pine Wood',
    grade: 'B',
    condition: 'B',
    gradeConfidence: 0.88,
    dimensions: { length: 100, width: 80, height: 60, unit: 'cm' },
    weight: { value: 25, unit: 'kg' },
    quantity: 800,
    moq: 100,
    pricePerUnit: 1800,
    wholesalePrice: 1500,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 310,
    co2SavedEstimate: 310,
    co2Details: '310 kg of CO2 equivalent saved per unit compared to new pine crates.',
    specs: {
      'Wood Type': 'Pine',
      'Treatment': 'Untreated',
      'Load Capacity': '800kg'
    },
    defects: [
      { id: 'def-2', type: 'scratch', severity: 'minor', position: { x: -0.4, y: 0.5, z: -0.3 }, description: 'Surface scratches' },
      { id: 'def-3', type: 'chip', severity: 'moderate', position: { x: 0.8, y: -0.8, z: 0.1 }, description: 'Small chip on the corner edge' }
    ],
    seller: SELLERS[0],
    location: SELLERS[0].location,
    distanceKm: 42,
    unitsPerTruckload: 150,
    unitsPerContainer: 300,
    humidityContent: 18,
    createdAt: '2026-09-01T12:30:00Z',
    featured: false,
    topCarbonSaver: false,
    meshType: 'crate',
    meshColor: '#A0522D'
  },
  {
    id: 'prd-003',
    title: '200L Reconditioned Steel Drums',
    slug: '200l-reconditioned-steel-drums',
    description: 'Fully reconditioned 200-liter steel drums. Thoroughly cleaned, pressure tested, and repainted.',
    category: 'steel-drums',
    material: 'Carbon Steel',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.98,
    dimensions: { length: 58.5, width: 58.5, height: 89, unit: 'cm' },
    weight: { value: 16, unit: 'kg' },
    quantity: 300,
    moq: 25,
    pricePerUnit: 3200,
    wholesalePrice: 2900,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 890,
    co2SavedEstimate: 890,
    co2Details: '890 kg of CO2 equivalent saved due to energy-intensive steel production avoidance.',
    specs: {
      'Capacity': '200L',
      'Thickness': '1.2mm',
      'Coating': 'Epoxy Phenolic',
      'Closure': 'Closed-head'
    },
    defects: [],
    seller: SELLERS[1],
    location: SELLERS[1].location,
    distanceKm: 18,
    unitsPerTruckload: 120,
    unitsPerContainer: 250,
    createdAt: '2026-09-05T09:15:00Z',
    featured: true,
    topCarbonSaver: true,
    meshType: 'drum',
    meshColor: '#4A5568'
  },
  {
    id: 'prd-004',
    title: '100L Open-Top Steel Drums',
    slug: '100l-open-top-steel-drums',
    description: '100-liter open-top steel drums. Ideal for solid and semi-solid materials. Shows minor dents.',
    category: 'steel-drums',
    material: 'Carbon Steel',
    grade: 'B',
    condition: 'B',
    gradeConfidence: 0.85,
    dimensions: { length: 45, width: 45, height: 70, unit: 'cm' },
    weight: { value: 10, unit: 'kg' },
    quantity: 150,
    moq: 20,
    pricePerUnit: 2100,
    wholesalePrice: 1900,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 450,
    co2SavedEstimate: 450,
    co2Details: '450 kg of CO2 equivalent saved per unit.',
    specs: {
      'Capacity': '100L',
      'Closure': 'Open-top with bolt ring'
    },
    defects: [
      { id: 'def-4', type: 'dent', severity: 'minor', position: { x: 0.1, y: 0.7, z: -0.9 }, description: 'Small dent near the rim' }
    ],
    seller: SELLERS[1],
    location: SELLERS[1].location,
    unitsPerTruckload: 200,
    unitsPerContainer: 400,
    createdAt: '2026-09-08T14:45:00Z',
    featured: false,
    topCarbonSaver: false,
    meshType: 'drum',
    meshColor: '#2D3748'
  },
  {
    id: 'prd-005',
    title: 'HDPE Industrial Pallets',
    slug: 'hdpe-industrial-pallets',
    description: 'Heavy-duty 100% recycled High-Density Polyethylene (HDPE) pallets. Highly durable and washable.',
    category: 'plastic-totes',
    material: 'Recycled HDPE',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.96,
    dimensions: { length: 120, width: 100, height: 16, unit: 'cm' },
    weight: { value: 18, unit: 'kg' },
    quantity: 1200,
    moq: 100,
    pricePerUnit: 1600,
    wholesalePrice: 1400,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 580,
    co2SavedEstimate: 580,
    co2Details: '580 kg of CO2 equivalent saved by using recycled plastic over virgin polymers.',
    specs: {
      'Static Load': '4000kg',
      'Dynamic Load': '1200kg',
      'Racking Load': '800kg'
    },
    defects: [],
    seller: SELLERS[2],
    location: SELLERS[2].location,
    distanceKm: 12,
    unitsPerTruckload: 350,
    unitsPerContainer: 700,
    createdAt: '2026-09-02T11:20:00Z',
    featured: false,
    topCarbonSaver: true,
    meshType: 'pallet',
    meshColor: '#2563EB'
  },
  {
    id: 'prd-006',
    title: '1000L IBC Tote Containers',
    slug: '1000l-ibc-tote-containers',
    description: 'Intermediate Bulk Containers (IBCs) with steel tube frame and HDPE inner bottle. Washed and leak-tested.',
    category: 'plastic-totes',
    material: 'HDPE & Steel',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.99,
    dimensions: { length: 120, width: 100, height: 116, unit: 'cm' },
    weight: { value: 55, unit: 'kg' },
    quantity: 200,
    moq: 10,
    pricePerUnit: 4500,
    wholesalePrice: 4200,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 720,
    co2SavedEstimate: 720,
    co2Details: '720 kg of CO2 equivalent saved per tote re-used in the supply chain.',
    specs: {
      'Capacity': '1000L',
      'Valve': '50mm Butterfly Valve',
      'Pallet Type': 'Steel/Plastic composite'
    },
    defects: [],
    seller: SELLERS[2],
    location: SELLERS[2].location,
    distanceKm: 15,
    unitsPerTruckload: 52,
    unitsPerContainer: 108,
    createdAt: '2026-09-10T08:00:00Z',
    featured: true,
    topCarbonSaver: true,
    meshType: 'ibc',
    meshColor: '#E2E8F0'
  },
  {
    id: 'prd-007',
    title: 'Heavy-Duty Corrugated Bundles',
    slug: 'heavy-duty-corrugated-bundles',
    description: 'Bundles of clean, 5-ply corrugated cardboard sheets. Perfect for void filling or custom packaging.',
    category: 'cardboard',
    material: 'Corrugated Cardboard',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.92,
    dimensions: { length: 150, width: 100, height: 1, unit: 'cm' },
    weight: { value: 1, unit: 'kg' },
    quantity: 5000,
    moq: 10,
    pricePerUnit: 800,
    wholesalePrice: 700,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 190,
    co2SavedEstimate: 190,
    co2Details: '190 kg of CO2 equivalent saved per 50-sheet bundle.',
    specs: {
      'Ply': '5-Ply',
      'Bundle Size': '50 Sheets',
      'Flute Type': 'B/C Double Wall'
    },
    defects: [],
    seller: SELLERS[0],
    location: SELLERS[0].location,
    distanceKm: 8,
    unitsPerTruckload: 400,
    unitsPerContainer: 850,
    createdAt: '2026-09-09T16:30:00Z',
    featured: false,
    topCarbonSaver: false,
    meshType: 'cardboard',
    meshColor: '#92400E'
  },
  {
    id: 'prd-008',
    title: 'Steel Strapping Coils - 19mm',
    slug: 'steel-strapping-coils-19mm',
    description: 'High-tensile steel strapping coils recovered from import shipments. Inspected for rust and kinks.',
    category: 'metal-strapping',
    material: 'Steel',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.94,
    dimensions: { length: 60, width: 60, height: 15, unit: 'cm' },
    weight: { value: 45, unit: 'kg' },
    quantity: 120,
    moq: 5,
    pricePerUnit: 5600,
    wholesalePrice: 5200,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 340,
    co2SavedEstimate: 340,
    co2Details: '340 kg of CO2 equivalent saved per coil.',
    specs: {
      'Width': '19mm',
      'Thickness': '0.8mm',
      'Finish': 'Blued & Waxed'
    },
    defects: [],
    seller: SELLERS[1],
    location: SELLERS[1].location,
    distanceKm: 22,
    unitsPerTruckload: 400,
    unitsPerContainer: 900,
    createdAt: '2026-09-11T10:00:00Z',
    featured: false,
    topCarbonSaver: false,
    meshType: 'strapping',
    meshColor: '#6B7280'
  },
  {
    id: 'prd-009',
    title: 'Zero-Cost Surplus Heat-Treated Pallets (Free Claim)',
    slug: 'zero-cost-surplus-pallets-free-claim',
    description: 'Circular reallocation: 200 standard wooden pallets donated by logistics hub to avoid landfill. Completely free for pickup!',
    category: 'industrial-pallets',
    material: 'Mixed Hardwood',
    grade: 'B',
    condition: 'B',
    gradeConfidence: 0.90,
    dimensions: { length: 120, width: 100, height: 14, unit: 'cm' },
    weight: { value: 20, unit: 'kg' },
    quantity: 200,
    moq: 10,
    pricePerUnit: 0,
    wholesalePrice: 0,
    isFreeReallocation: true,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 520,
    co2SavedEstimate: 520,
    co2Details: '520 kg CO2 saved per lot diverted from landfill incineration.',
    specs: {
      'Pricing': '₹0 (Free Circular Reallocation)',
      'Condition': 'Grade B (Fully functional)',
      'Pickup Location': 'GIDC Estate, Ahmedabad'
    },
    defects: [],
    seller: SELLERS[0],
    location: SELLERS[0].location,
    distanceKm: 6,
    unitsPerTruckload: 300,
    unitsPerContainer: 600,
    createdAt: '2026-09-11T16:00:00Z',
    featured: true,
    topCarbonSaver: true,
    meshType: 'pallet',
    meshColor: '#059669'
  },
  {
    id: 'prd-010',
    title: 'Clean Aluminum Wire Scrap Coils',
    slug: 'clean-aluminum-wire-scrap-coils',
    description: 'High-purity industrial aluminum wire scrap coils from electrical transformer decommission.',
    category: 'scrap-metals',
    material: '99.5% Aluminum Wire',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.97,
    dimensions: { length: 80, width: 80, height: 30, unit: 'cm' },
    weight: { value: 100, unit: 'kg' },
    quantity: 40,
    moq: 2,
    pricePerUnit: 12500,
    wholesalePrice: 11800,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 1420,
    co2SavedEstimate: 1420,
    co2Details: '1,420 kg CO2 saved per coil avoiding bauxite smelting.',
    specs: {
      'Purity': '99.5% EC Grade Aluminum',
      'Form': 'Coiled Wire Bundle',
      'Weight per coil': '100 kg'
    },
    defects: [],
    seller: SELLERS[1],
    location: SELLERS[1].location,
    distanceKm: 29,
    unitsPerTruckload: 100,
    unitsPerContainer: 220,
    createdAt: '2026-09-10T15:30:00Z',
    featured: true,
    topCarbonSaver: true,
    meshType: 'strapping',
    meshColor: '#38BDF8'
  },
  {
    id: 'prd-011',
    title: 'Reclaimed 4-Way Entry Pine Pallets',
    slug: 'reclaimed-4-way-entry-pine-pallets',
    description: 'Repaired and heat-treated 4-way entry pine pallets ready for immediate warehouse deployment.',
    category: 'industrial-pallets',
    material: 'Pine Wood',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.93,
    dimensions: { length: 120, width: 80, height: 14, unit: 'cm' },
    weight: { value: 18, unit: 'kg' },
    quantity: 450,
    moq: 25,
    pricePerUnit: 1200,
    wholesalePrice: 1050,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 380,
    co2SavedEstimate: 380,
    co2Details: '380 kg CO2 saved per pallet.',
    specs: {
      'Style': 'Euro Pallet Size (120x80 cm)',
      'Capacity': '1000 kg',
      'Condition': 'Grade A Reclaimed'
    },
    defects: [],
    seller: SELLERS[3],
    location: SELLERS[3].location,
    distanceKm: 14,
    unitsPerTruckload: 400,
    unitsPerContainer: 850,
    createdAt: '2026-09-09T18:20:00Z',
    featured: false,
    topCarbonSaver: false,
    meshType: 'pallet',
    meshColor: '#D97706'
  },
  {
    id: 'prd-012',
    title: 'Zero-Cost Surplus Cardboard Offcuts (Free Claim)',
    slug: 'zero-cost-surplus-cardboard-offcuts',
    description: 'Clean virgin corrugated cardboard offcut sheets available at no charge for packaging void fill or recycling.',
    category: 'cardboard',
    material: 'Kraft Fluted Board',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.98,
    dimensions: { length: 100, width: 100, height: 2, unit: 'cm' },
    weight: { value: 50, unit: 'kg' },
    quantity: 85,
    moq: 5,
    pricePerUnit: 0,
    wholesalePrice: 0,
    isFreeReallocation: true,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 240,
    co2SavedEstimate: 240,
    co2Details: '240 kg CO2 saved per bundle.',
    specs: {
      'Price': 'Free Claim (₹0)',
      'Usage': 'Box Partitioning / Void Fill',
      'Quantity': '85 Bundles (50kg each)'
    },
    defects: [],
    seller: SELLERS[0],
    location: SELLERS[0].location,
    distanceKm: 9,
    unitsPerTruckload: 200,
    unitsPerContainer: 500,
    createdAt: '2026-09-11T12:00:00Z',
    featured: false,
    topCarbonSaver: true,
    meshType: 'cardboard',
    meshColor: '#059669'
  },
  {
    id: 'prd-013',
    title: 'Food-Grade 220L Blue HDPE Drums',
    slug: 'food-grade-220l-blue-hdpe-drums',
    description: 'Sanitized food-grade 220L blue HDPE plastic drums with dual tight-head bungs.',
    category: 'plastic-totes',
    material: 'Food-Grade HDPE',
    grade: 'A',
    condition: 'A',
    gradeConfidence: 0.97,
    dimensions: { length: 58, width: 58, height: 98, unit: 'cm' },
    weight: { value: 10, unit: 'kg' },
    quantity: 280,
    moq: 15,
    pricePerUnit: 2400,
    wholesalePrice: 2150,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 610,
    co2SavedEstimate: 610,
    co2Details: '610 kg CO2 saved per drum.',
    specs: {
      'Food Grade': 'FDA Approved HDPE',
      'Capacity': '220 Liters',
      'Closure': '2" NPT Bungs'
    },
    defects: [],
    seller: SELLERS[2],
    location: SELLERS[2].location,
    distanceKm: 21,
    unitsPerTruckload: 100,
    unitsPerContainer: 210,
    createdAt: '2026-09-07T10:00:00Z',
    featured: false,
    topCarbonSaver: true,
    meshType: 'drum',
    meshColor: '#1D4ED8'
  },
  {
    id: 'prd-014',
    title: 'Heavy Structural Steel Scrap Bundles',
    slug: 'heavy-structural-steel-scrap-bundles',
    description: 'Sorted structural steel scrap beams and channels ready for foundry recycling.',
    category: 'scrap-metals',
    material: 'Mild Steel IS 2062',
    grade: 'B',
    condition: 'B',
    gradeConfidence: 0.91,
    dimensions: { length: 150, width: 80, height: 50, unit: 'cm' },
    weight: { value: 500, unit: 'kg' },
    quantity: 25,
    moq: 1,
    pricePerUnit: 18500,
    wholesalePrice: 17200,
    isFreeReallocation: false,
    status: 'active',
    currency: 'INR',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    ],
    co2Savings: 2150,
    co2SavedEstimate: 2150,
    co2Details: '2,150 kg CO2 saved per half-ton bundle.',
    specs: {
      'Steel Grade': 'IS 2062 Structural',
      'Weight': '500 kg/bundle',
      'Condition': 'Grade B Scrap'
    },
    defects: [],
    seller: SELLERS[1],
    location: SELLERS[1].location,
    distanceKm: 31,
    unitsPerTruckload: 40,
    unitsPerContainer: 80,
    createdAt: '2026-09-06T14:00:00Z',
    featured: false,
    topCarbonSaver: true,
    meshType: 'strapping',
    meshColor: '#475569'
  }
];

// ==========================================
// 4. ORDERS
// ==========================================
export const ORDERS: Order[] = [
  {
    id: 'ord-001',
    trackingNumber: 'TRK-4092',
    status: 'delivered',
    buyerId: 'usr-001',
    sellerId: SELLERS[3].id,
    products: [
      { product: PRODUCTS[0], quantity: 100, priceAtPurchase: 2400 }
    ],
    subtotal: 240000,
    freightCost: 15000,
    tax: 45900,
    total: 300900,
    currency: 'INR',
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-09-02T14:30:00Z',
    events: [
      { status: 'confirmed', timestamp: '2026-08-28T10:15:00Z', description: 'Order confirmed by TimberTrade Co.' },
      { status: 'processing', timestamp: '2026-08-29T08:30:00Z', description: 'Order is being packed.' },
      { status: 'in-transit', timestamp: '2026-08-31T09:00:00Z', description: 'Handed over to logistics partner.' },
      { status: 'delivered', timestamp: '2026-09-02T14:30:00Z', description: 'Successfully delivered to Bharat Steel Industries.' }
    ],
    shippingAddress: {
      address: 'Plot 45, Phase II GIDC',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      lat: 23.0225,
      lng: 72.5714
    }
  },
  {
    id: 'ord-002',
    trackingNumber: 'TRK-4156',
    status: 'in-transit',
    buyerId: 'usr-001',
    sellerId: SELLERS[2].id,
    products: [
      { product: PRODUCTS[5], quantity: 20, priceAtPurchase: 4200 }
    ],
    subtotal: 84000,
    freightCost: 8000,
    tax: 16560,
    total: 108560,
    currency: 'INR',
    createdAt: '2026-09-08T11:20:00Z',
    updatedAt: '2026-09-10T09:45:00Z',
    events: [
      { status: 'confirmed', timestamp: '2026-09-08T12:00:00Z', description: 'Order confirmed by GreenPack Solutions.' },
      { status: 'processing', timestamp: '2026-09-09T10:00:00Z', description: 'Order is being prepared for dispatch.' },
      { status: 'in-transit', timestamp: '2026-09-10T09:45:00Z', description: 'In transit to destination.' }
    ],
    shippingAddress: {
      address: 'Plot 45, Phase II GIDC',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      lat: 23.0225,
      lng: 72.5714
    }
  },
  {
    id: 'ord-003',
    trackingNumber: 'TRK-4201',
    status: 'confirmed',
    buyerId: 'usr-001',
    sellerId: SELLERS[1].id,
    products: [
      { product: PRODUCTS[2], quantity: 50, priceAtPurchase: 2900 }
    ],
    subtotal: 145000,
    freightCost: 12000,
    tax: 28260,
    total: 185260,
    currency: 'INR',
    createdAt: '2026-09-11T14:10:00Z',
    updatedAt: '2026-09-11T15:00:00Z',
    events: [
      { status: 'confirmed', timestamp: '2026-09-11T15:00:00Z', description: 'Order confirmed by EcoSteel Corp.' }
    ],
    shippingAddress: {
      address: 'Plot 45, Phase II GIDC',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      lat: 23.0225,
      lng: 72.5714
    }
  }
];

// ==========================================
// 5. NOTIFICATIONS
// ==========================================
export const NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', type: 'system', title: 'Platform Milestone', message: '♻️ Milestone: ReLoop has now saved 3,200 tons of CO₂!', read: false, createdAt: '2026-09-11T09:00:00Z' },
  { id: 'notif-2', type: 'order', title: 'Order Update', message: '🚚 Order #TRK-4092 has been delivered successfully.', read: true, createdAt: '2026-09-02T14:35:00Z', link: '/orders/ord-001' },
  { id: 'notif-3', type: 'market', title: 'Market Activity', message: '⚡ EcoSteel Corp just acquired 500 Heavy-Duty Pallets from PackagingHub!', read: false, createdAt: '2026-09-10T11:20:00Z' },
  { id: 'notif-4', type: 'alert', title: 'Price Drop', message: '💰 Price drop: Grade-A Oak Skids now ₹2,400/unit (-15%)', read: false, createdAt: '2026-09-09T16:00:00Z', link: '/products/prd-001' },
  { id: 'notif-5', type: 'inventory', title: 'New Stock Available', message: '📦 New stock: 200 IBC Containers listed by GreenPack Solutions.', read: true, createdAt: '2026-09-10T08:15:00Z', link: '/products/prd-006' },
  { id: 'notif-6', type: 'order', title: 'Order Dispatched', message: '🚚 Order #TRK-4156 is now in-transit.', read: true, createdAt: '2026-09-10T09:50:00Z', link: '/orders/ord-002' },
  { id: 'notif-7', type: 'system', title: 'Maintenance Notice', message: '⚙️ Scheduled platform maintenance on Sept 15, 2:00 AM - 4:00 AM IST.', read: false, createdAt: '2026-09-11T12:00:00Z' },
  { id: 'notif-8', type: 'order', title: 'Order Confirmed', message: '✅ Your order #TRK-4201 with EcoSteel Corp has been confirmed.', read: false, createdAt: '2026-09-11T15:05:00Z', link: '/orders/ord-003' }
];

// ==========================================
// 6. PLATFORM_STATS
// ==========================================
export const PLATFORM_STATS: PlatformStats = {
  totalWasteDiverted: 124000,
  totalCo2Saved: 3200,
  totalCompanies: 480,
  totalTransactions: 15600
};

// ==========================================
// 7. MOCK_USER
// ==========================================
export const MOCK_USER: User = {
  id: 'usr-001',
  email: 'procurement@bharatsteel.in',
  name: 'Rahul Sharma',
  companyName: 'Bharat Steel Industries',
  industry: 'Iron & Steel',
  role: 'buyer',
  location: {
    address: 'Plot 45, Phase II GIDC',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    lat: 23.0225,
    lng: 72.5714
  },
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
};

// ==========================================
// 8. MOCK_CARBON_IMPACT
// ==========================================
export const MOCK_CARBON_IMPACT: CarbonImpact = {
  totalCo2Saved: 4.2,
  wasteDiverted: 8500,
  virginMaterialDisplaced: 3.8,
  equivalentTreesSaved: 191,
  monthlyData: [
    { month: 'Apr', co2Saved: 0.5, wasteDiverted: 1000 },
    { month: 'May', co2Saved: 0.6, wasteDiverted: 1200 },
    { month: 'Jun', co2Saved: 0.8, wasteDiverted: 1600 },
    { month: 'Jul', co2Saved: 0.7, wasteDiverted: 1400 },
    { month: 'Aug', co2Saved: 1.1, wasteDiverted: 2200 },
    { month: 'Sep', co2Saved: 0.5, wasteDiverted: 1100 }
  ],
  transactions: [
    { id: 'tx-1', date: '2026-09-02', item: 'Oak Wooden Skids', quantity: 100, co2Saved: 42000, source: 'TimberTrade Co.' },
    { id: 'tx-2', date: '2026-08-15', item: 'Reconditioned Steel Drums', quantity: 50, co2Saved: 44500, source: 'EcoSteel Corp' },
    { id: 'tx-3', date: '2026-07-22', item: 'HDPE Pallets', quantity: 200, co2Saved: 116000, source: 'GreenPack Solutions' },
    { id: 'tx-4', date: '2026-06-10', item: 'Corrugated Bundles', quantity: 100, co2Saved: 19000, source: 'PackagingHub Industries' },
    { id: 'tx-5', date: '2026-05-05', item: 'IBC Totes', quantity: 10, co2Saved: 7200, source: 'GreenPack Solutions' }
  ]
};
