import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current Organisation State
  const [org, setOrg] = useState({
    name: 'BioPolymer Labs Europe',
    legalName: 'BioPolymer Technologies B.V.',
    businessId: 'NL-884920194-B01',
    email: 'operations@biopolymerlabs.eu',
    verificationStatus: 'verified', // 'unverified' | 'documents_submitted' | 'verified'
    verificationThreshold: 15000, // EUR threshold for claiming trades when unverified
    capabilities: ['seller', 'buyer', 'carrier', 'recycler'], // multi-select
    permissions: {
      platform_admin: true,
      reporting: true,
    },
    primaryFacilityId: 1,
  });

  // Facilities
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: 'Rotterdam Circular Hub (HQ)',
      address: 'Maashaven Zuidzijde 12, 3072 AE Rotterdam, Netherlands',
      lat: 51.9054,
      lng: 4.4842,
      isPrimary: true,
      capacityTons: 4500,
    },
    {
      id: 2,
      name: 'Antwerp Depot & Processing',
      address: 'Haven 1025, 2030 Antwerp, Belgium',
      lat: 51.2721,
      lng: 4.3879,
      isPrimary: false,
      capacityTons: 2800,
    },
    {
      id: 3,
      name: 'Duisburg Logistics Platform',
      address: 'Alte Ruhrorter Str. 42, 47119 Duisburg, Germany',
      lat: 51.4508,
      lng: 6.7411,
      isPrimary: false,
      capacityTons: 3200,
    },
  ]);

  // Notifications & Pending Actions
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'match',
      title: 'New High-Score Match',
      desc: '94% composite match for 12,000kg Post-Consumer rPET Pellets (Rotterdam → Antwerp).',
      link: '/matches/m-101',
      date: '10m ago',
      unread: true,
    },
    {
      id: 'n2',
      type: 'route',
      title: 'Proposed Multi-Stop Route',
      desc: 'Route RT-882 awaits acceptance (Rotterdam → Breda → Antwerp). Est. Revenue: €1,850.',
      link: '/logistics',
      date: '1h ago',
      unread: true,
    },
    {
      id: 'n3',
      type: 'dispute',
      title: 'Dispute Response Window Closing',
      desc: 'Trade TR-4091 buyer reported moisture deviation. 14h left to submit counter-evidence.',
      link: '/trades/TR-4091',
      date: '3h ago',
      unread: false,
    },
  ]);

  // Listings Collection
  const [listings, setListings] = useState([
    {
      id: 'L-101',
      title: 'Clean Post-Industrial rHDPE Regrind (Grade A)',
      materialType: 'rHDPE',
      subType: 'Rigid Blow-Molding Flakes',
      grade: 'Grade A',
      gradeSource: 'AI (Confidence 96%)',
      mass_kg: 18500,
      price_per_kg: 1.12,
      currency: '€',
      carbon_class: 'carbon_positive', // 'carbon_positive' | 'marginal' | 'carbon_negative'
      net_co2e_saved_kg: 24800,
      distance_km: 42,
      breakeven_radius_km: 320,
      facilityName: 'Rotterdam Circular Hub',
      sellerOrg: 'BioPolymer Labs Europe',
      isVerified: true,
      openToOffers: true,
      isAuction: false,
      available_from: '2026-09-15',
      available_until: '2026-10-15',
      unit_dimensions: '120x100x110 cm',
      unit_count: 24,
      photos: [
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
      ],
      hotspots: [
        { id: 'h1', region: 'top_deck_left', type: 'Dust Contamination', severity: 'low', x: -0.4, y: 0.6, z: 0.2 },
        { id: 'h2', region: 'center_core', type: 'Uniform Density', severity: 'optimal', x: 0.0, y: 0.0, z: 0.0 },
      ],
    },
    {
      id: 'L-102',
      title: 'Clear Post-Consumer rPET Flakes (Hot Washed)',
      materialType: 'rPET',
      subType: 'Bottle-Grade Washed Flakes',
      grade: 'Grade A+',
      gradeSource: 'AI (Confidence 98%)',
      mass_kg: 26000,
      price_per_kg: 1.34,
      currency: '€',
      carbon_class: 'carbon_positive',
      net_co2e_saved_kg: 39500,
      distance_km: 78,
      breakeven_radius_km: 450,
      facilityName: 'Antwerp Depot',
      sellerOrg: 'Nordic Circular Materials',
      isVerified: true,
      openToOffers: false,
      isAuction: true,
      auctionClosing: '2026-09-14T18:00:00Z',
      leadingBid: 1.38,
      bidsCount: 7,
      photos: [
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
      ],
      hotspots: [
        { id: 'h3', region: 'surface_rim', type: 'Trace Cap Polyolefins', severity: 'medium', x: 0.5, y: 0.4, z: -0.3 },
      ],
    },
    {
      id: 'L-103',
      title: 'Clean Industrial LDPE Stretch Film Bales',
      materialType: 'rLDPE',
      subType: '98/2 Transparent Film Bales',
      grade: 'Grade B+',
      gradeSource: 'Manual Override (Seller Confirmed)',
      mass_kg: 14200,
      price_per_kg: 0.78,
      currency: '€',
      carbon_class: 'marginal',
      net_co2e_saved_kg: 9200,
      distance_km: 145,
      breakeven_radius_km: 190,
      facilityName: 'Duisburg Platform',
      sellerOrg: 'Rheinland Recovery GmbH',
      isVerified: true,
      openToOffers: true,
      isAuction: false,
      photos: [
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
      ],
      hotspots: [],
    },
    {
      id: 'L-104',
      title: 'Mixed Post-Consumer Polypropylene Regrind',
      materialType: 'rPP',
      subType: 'Dark Co-Polymer Regrind',
      grade: 'Grade C',
      gradeSource: 'AI (Confidence 68% - Flagged)',
      mass_kg: 8500,
      price_per_kg: 0.42,
      currency: '€',
      carbon_class: 'carbon_negative',
      net_co2e_saved_kg: -1400,
      distance_km: 390,
      breakeven_radius_km: 85,
      facilityName: 'Frankfurt Hub',
      sellerOrg: 'Hessen Polymer Reprocessing',
      isVerified: false,
      openToOffers: true,
      isAuction: false,
      photos: [
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
      ],
      hotspots: [
        { id: 'h4', region: 'base_left', type: 'High Ash Contaminant (4.2%)', severity: 'high', x: -0.3, y: -0.5, z: 0.2 },
      ],
    },
  ]);

  // Requirements Collection
  const [requirements, setRequirements] = useState([
    {
      id: 'REQ-201',
      title: 'Weekly Sourcing: Bottle-Grade rPET Flakes',
      materialCategory: 'rPET',
      minGrade: 'Grade A',
      massPerPeriod: 25000,
      period: 'weekly',
      maxPrice: 1.40,
      useCarbonLimit: true,
      maxDistanceKm: null,
      status: 'active', // 'active' | 'paused'
      isStandingContract: false,
    },
    {
      id: 'REQ-202',
      title: 'Continuous High-Grade rHDPE Injection Pellets',
      materialCategory: 'rHDPE',
      minGrade: 'Grade A',
      massPerPeriod: 60000,
      period: 'monthly',
      maxPrice: 1.25,
      useCarbonLimit: false,
      maxDistanceKm: 250,
      status: 'active',
      isStandingContract: true,
      cadence: 'Bi-Weekly Monday Run',
      baselineVolume: 30000,
      recentVolume: 21500,
      driftAlert: true,
      driftText: 'Actual volume is -28.3% below baseline over last 2 cycles.',
    },
  ]);

  // Ranked Matches
  const [matches, setMatches] = useState([
    {
      id: 'm-101',
      listingId: 'L-101',
      title: 'rHDPE Regrind Grade A ↔ Rotterdam Processing',
      material: 'rHDPE',
      distance_km: 42,
      carbon_class: 'carbon_positive',
      composite_score: 94,
      reasonText: 'Exceptional geographic proximity (<50km) and exact melt flow index match with zero moisture penalty.',
      breakdown: {
        semantic_similarity: 96,
        grade_fit: 98,
        price_fit: 91,
        carbon_score: 95,
        timing_fit: 90,
        gross_avoided_kg: 32000,
        reprocess_kg: 5200,
        transport_kg: 2000,
        net_saved_kg: 24800,
        breakeven_radius_km: 320,
        assumed_load_factor: 88,
        factor_version: 'v2.4-GHG-Protocol',
      },
    },
    {
      id: 'm-102',
      listingId: 'L-102',
      title: 'Clear rPET Washed Flakes ↔ Antwerp Bottle Extruder',
      material: 'rPET',
      distance_km: 78,
      carbon_class: 'carbon_positive',
      composite_score: 89,
      reasonText: 'Direct rail corridor alignment gives high net CO₂e savings despite slight grade premium.',
      breakdown: {
        semantic_similarity: 92,
        grade_fit: 95,
        price_fit: 82,
        carbon_score: 94,
        timing_fit: 85,
        gross_avoided_kg: 48000,
        reprocess_kg: 6000,
        transport_kg: 2500,
        net_saved_kg: 39500,
        breakeven_radius_km: 450,
        assumed_load_factor: 92,
        factor_version: 'v2.4-GHG-Protocol',
      },
    },
  ]);

  // Trades & Escrow
  const [trades, setTrades] = useState([
    {
      id: 'TR-4091',
      listingId: 'L-101',
      material: 'rHDPE Rigid Blow-Molding Flakes',
      mass_kg: 18500,
      agreedPrice: 1.10,
      totalValue: 20350,
      currency: '€',
      counterpartOrg: 'Nordic Packaging NV',
      status: 'in-transit', // 'claimed' | 'accepted' | 'logistics_assigned' | 'in-transit' | 'delivered' | 'closed' | 'disputed'
      stepIndex: 3, // 0 to 5
      escrow_state: 'held', // 'pending' | 'held' | 'released' | 'disputed'
      pickupFacility: 'Rotterdam Circular Hub',
      deliveryFacility: 'Ghent Industrial Park',
      shipmentId: 'SH-8821',
      deliveredAt: null,
      disputeCountdownHours: null,
      originalGrade: 'Grade A',
      deliveryGrade: null,
      photosOriginal: [
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=600&auto=format&fit=crop&q=80',
      ],
      photosDelivery: [],
    },
    {
      id: 'TR-3980',
      listingId: 'L-102',
      material: 'Post-Consumer rPET Flakes',
      mass_kg: 24000,
      agreedPrice: 1.32,
      totalValue: 31680,
      currency: '€',
      counterpartOrg: 'EcoPlast Polymers France',
      status: 'delivered',
      stepIndex: 4,
      escrow_state: 'held',
      pickupFacility: 'Antwerp Depot',
      deliveryFacility: 'Lille Circular Terminal',
      shipmentId: 'SH-7712',
      deliveredAt: '2026-09-11T14:30:00Z',
      disputeCountdownHours: 32, // within 48 hours
      originalGrade: 'Grade A+',
      deliveryGrade: 'Grade B (Moisture Detected)',
      gradeDeviationFlag: true,
      photosOriginal: [
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
      ],
      photosDelivery: [
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: 'TR-3801',
      listingId: 'L-103',
      material: 'Industrial LDPE Stretch Bales',
      mass_kg: 14000,
      agreedPrice: 0.76,
      totalValue: 10640,
      currency: '€',
      counterpartOrg: 'Duisburg Recycling Hub',
      status: 'closed',
      stepIndex: 5,
      escrow_state: 'released',
      pickupFacility: 'Duisburg Logistics Platform',
      deliveryFacility: 'Dortmund Sorter',
      shipmentId: 'SH-6510',
      deliveredAt: '2026-09-02T10:15:00Z',
      disputeCountdownHours: 0,
      originalGrade: 'Grade B+',
      deliveryGrade: 'Grade B+',
      gradeDeviationFlag: false,
      photosOriginal: [
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      ],
      photosDelivery: [
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      ],
    },
  ]);

  // Logistics & Vehicles State
  const [vehicles, setVehicles] = useState([
    {
      id: 'V-01',
      name: 'EcoCarrier Electric Mega #12',
      plate: 'NL-88-RTB',
      vehicle_class: 'Class 8 Electric Semi (53ft)',
      capacity_kg: 24000,
      volume_m3: 88,
      dimensions: '13.6m x 2.45m x 2.65m',
      baseLocation: 'Rotterdam Hub',
      status: 'In Transit',
      activeShipmentId: 'SH-8821',
    },
    {
      id: 'V-02',
      name: 'BioDiesel Euro-6 Curtainsider #04',
      plate: 'BE-44-ANT',
      vehicle_class: 'Curtainsider 40-Tonne',
      capacity_kg: 26500,
      volume_m3: 92,
      dimensions: '13.6m x 2.48m x 2.70m',
      baseLocation: 'Antwerp Depot',
      status: 'Available',
      activeShipmentId: null,
    },
  ]);

  const [proposedRoutes, setProposedRoutes] = useState([
    {
      id: 'RT-882',
      title: 'Tri-Facility Benelux Loop',
      origin: 'Rotterdam Hub',
      stops: [
        { type: 'pickup', facility: 'Rotterdam Hub', lot: '18,500kg rHDPE', time: '08:00' },
        { type: 'pickup', facility: 'Breda Circular Yard', lot: '4,200kg rPP', time: '11:30' },
        { type: 'delivery', facility: 'Antwerp Processing', lot: 'Complete Drop', time: '15:00' },
      ],
      distance_km: 174,
      loadFactorPct: 92,
      estRevenue: 1850,
      status: 'pending', // 'pending' | 'accepted' | 'declined'
    },
    {
      id: 'RT-890',
      title: 'Rhein-Ruhr Direct Corridor',
      origin: 'Duisburg Platform',
      stops: [
        { type: 'pickup', facility: 'Duisburg Platform', lot: '14,000kg LDPE', time: '07:00' },
        { type: 'delivery', facility: 'Cologne EcoCompound', lot: '14,000kg Drop', time: '10:30' },
      ],
      distance_km: 92,
      loadFactorPct: 78,
      estRevenue: 980,
      status: 'pending',
    },
  ]);

  const [backhauls, setBackhauls] = useState([
    {
      id: 'BH-01',
      vehicleId: 'V-02',
      origin: 'Antwerp Port',
      destination: 'Rotterdam Hub',
      dateWindow: '2026-09-16 to 2026-09-17',
      availableCapacityKg: 22000,
      availableVolumeM3: 75,
      status: 'Open for Auto-Match',
    },
  ]);

  // Team Members (for Settings)
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Elena Rostova', email: 'elena@biopolymerlabs.eu', role: 'Head of Circular Logistics', platform_admin: true, reporting: true },
    { id: 2, name: 'Marcus Vance', email: 'marcus.vance@biopolymerlabs.eu', role: 'Trading Desk Specialist', platform_admin: false, reporting: true },
    { id: 3, name: 'Sanne de Jong', email: 'sanne@biopolymerlabs.eu', role: 'Compliance Auditor', platform_admin: false, reporting: true },
  ]);

  // Emission Factors (for Admin)
  const [emissionFactors, setEmissionFactors] = useState([
    { id: 'EF-01', material: 'rPET Flakes', efVirgin: 2.15, efReprocess: 0.38, source: 'ecoinvent 3.9 / PlasticsEurope', version: 'v2.4', updatedAt: '2026-08-10' },
    { id: 'EF-02', material: 'rHDPE Regrind', efVirgin: 1.95, efReprocess: 0.31, source: 'WRAP UK & PlasticsEurope', version: 'v2.4', updatedAt: '2026-08-10' },
    { id: 'EF-03', material: 'rLDPE Film', efVirgin: 2.08, efReprocess: 0.42, source: 'ecoinvent 3.9', version: 'v2.3', updatedAt: '2026-07-22' },
    { id: 'EF-04', material: 'rPP Dark', efVirgin: 1.98, efReprocess: 0.45, source: 'FEVE & PlasticsEurope', version: 'v2.2', updatedAt: '2026-06-18' },
  ]);

  // Quick State Helper Functions
  const toggleCapability = (cap) => {
    setOrg((prev) => {
      const exists = prev.capabilities.includes(cap);
      const updated = exists
        ? prev.capabilities.filter((c) => c !== cap)
        : [...prev.capabilities, cap];
      return { ...prev, capabilities: updated.length ? updated : [cap] };
    });
  };

  const togglePermission = (perm) => {
    setOrg((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [perm]: !prev.permissions[perm],
      },
    }));
  };

  const setVerificationStatus = (status) => {
    setOrg((prev) => ({ ...prev, verificationStatus: status }));
  };

  return (
    <AppContext.Provider
      value={{
        org,
        setOrg,
        facilities,
        setFacilities,
        notifications,
        setNotifications,
        listings,
        setListings,
        requirements,
        setRequirements,
        matches,
        setMatches,
        trades,
        setTrades,
        vehicles,
        setVehicles,
        proposedRoutes,
        setProposedRoutes,
        backhauls,
        setBackhauls,
        teamMembers,
        setTeamMembers,
        emissionFactors,
        setEmissionFactors,
        toggleCapability,
        togglePermission,
        setVerificationStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
