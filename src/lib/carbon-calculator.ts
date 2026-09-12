import { Product } from '@/lib/types';

// CO2 savings per kg of material reused vs virgin production (kg CO2e per kg material)
const CO2_FACTORS: Record<string, number> = {
  'timber': 0.46,      // kg CO2e saved per kg of timber reused
  'steel': 1.89,       // steel recycling vs virgin
  'plastic-hdpe': 1.53,
  'plastic-pp': 1.68,
  'cardboard': 0.67,
  'aluminum': 8.14,    // aluminum has huge savings
  'metal-strapping': 1.42,
};

export function calculateCO2Savings(materialType: string, weightKg: number): number {
  const factor = CO2_FACTORS[materialType.toLowerCase()] || 1.0;
  return weightKg * factor;
}

export function formatCO2(kgCo2: number): string {
  if (kgCo2 >= 1000) {
    return `${(kgCo2 / 1000).toFixed(1)} tons`;
  }
  return `${Math.round(kgCo2)} kg`;
}

  export function formatCO2Tons(kgCo2: number): string {
    return `${(kgCo2 / 1000).toFixed(3)} tons`;
  }

export function calculateDistanceKm(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = (destination.lat - origin.lat) * Math.PI / 180;
  const longitudeDelta = (destination.lng - origin.lng) * Math.PI / 180;
  const originLatitude = origin.lat * Math.PI / 180;
  const destinationLatitude = destination.lat * Math.PI / 180;
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}

export function calculateTransportEmissions(distanceKm: number = 0, weightKg: number = 0, quantity: number = 0): number {
  // Conservative freight scenario: transport should materially reduce the benefit
  // of small, distant orders. Replace this with carrier-specific data in production.
  const fixedTripEmissions = distanceKm * 0.5;
  const loadEmissions = distanceKm * weightKg * quantity * 0.24;
  return Math.round((fixedTripEmissions + loadEmissions) * 100) / 100;
}

export function calculateOrderImpact(product: Product, quantity: number, distanceKm = product.distanceKm ?? 0) {
  const avoidedEmissions = product.co2Savings * quantity;
  const transportEmissions = calculateTransportEmissions(distanceKm, product.weight?.value, quantity);
  return {
    avoidedEmissions,
    transportEmissions,
    netEmissions: Math.round((avoidedEmissions - transportEmissions) * 100) / 100,
  };
}

export function getSustainableQuantity(product: Product, distanceKm = product.distanceKm ?? 0): number | null {
  const perUnitTransport = distanceKm * (product.weight?.value ?? 0) * 0.24;
  const fixedTripEmissions = distanceKm * 0.5;
  const netPerUnit = product.co2Savings - perUnitTransport;
  if (netPerUnit <= 0) return null;
  return Math.max(product.moq, Math.floor(fixedTripEmissions / netPerUnit) + 1);
}

export function calculateEquivalentTrees(kgCo2Saved: number): number {
  // 1 tree absorbs ~22kg CO2/year
  return Math.round(kgCo2Saved / 22);
}

export function getVirginComparison(materialType: string, weightKg: number): string {
  const savings = calculateCO2Savings(materialType, weightKg);
  return `Reusing this ${Math.round(weightKg)}kg of ${materialType.replace('-', ' ')} saves ${formatCO2(savings)} of CO2e compared to manufacturing from virgin materials.`;
}
