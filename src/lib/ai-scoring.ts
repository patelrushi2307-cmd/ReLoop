import { Product, User, AIFitScore, ProductCategory } from '@/lib/types';

export function getIndustryMatchScore(productCategory: ProductCategory, buyerIndustry: string): number {
  const preferences: Record<string, ProductCategory[]> = {
    'Iron & Steel': ['timber-skids', 'steel-drums', 'metal-strapping', 'industrial-pallets'],
    'Automotive': ['steel-drums', 'plastic-totes', 'industrial-pallets', 'metal-strapping'],
    'FMCG': ['cardboard', 'plastic-totes', 'timber-skids'],
    'Agriculture': ['plastic-totes', 'cardboard', 'timber-skids'],
    'Pharmaceuticals': ['plastic-totes', 'cardboard'],
    'Construction': ['timber-skids', 'industrial-pallets', 'steel-drums', 'scrap-metals'],
    'Food & Beverage': ['plastic-totes', 'cardboard', 'steel-drums'],
    'Chemicals': ['steel-drums', 'plastic-totes'],
    'Textiles': ['cardboard', 'plastic-totes'],
    'Electronics': ['cardboard', 'plastic-totes', 'timber-skids']
  };

  const preferredCategories = preferences[buyerIndustry] || [];
  return preferredCategories.includes(productCategory) ? 100 : 40;
}

export function getProximityScore(distanceKm: number): number {
  if (distanceKm <= 50) return 100;
  if (distanceKm <= 200) return 80;
  if (distanceKm <= 500) return 60;
  if (distanceKm <= 1000) return 40;
  return 20;
}

export function getCarbonImpactScore(co2Savings: number): number {
  if (co2Savings >= 1000) return 100;
  if (co2Savings >= 500) return 80;
  if (co2Savings >= 100) return 60;
  if (co2Savings >= 50) return 40;
  return 20;
}

export function getPriceFitScore(price: number, category: ProductCategory): number {
  if (price <= 0 || !category) return 50;
  return 85; 
}

export function calculateFitScore(product: Product, buyer: User): AIFitScore {
  const distanceKm = product.distanceKm || 500;
  
  const industryMatch = getIndustryMatchScore(product.category, buyer.industry);
  const proximityScore = getProximityScore(distanceKm);
  const carbonImpact = getCarbonImpactScore(product.co2Savings);
  const priceFit = getPriceFitScore(product.pricePerUnit, product.category);

  // Score = 0.30·Industry_Match + 0.30·Proximity + 0.25·Carbon_Impact + 0.15·Price_Fit
  const score = Math.round(
    (0.30 * industryMatch) + 
    (0.30 * proximityScore) + 
    (0.25 * carbonImpact) + 
    (0.15 * priceFit)
  );

  const result: AIFitScore = {
    score,
    reason: '',
    industryMatch,
    proximityScore,
    carbonImpact,
    priceFit
  };

  result.reason = generateFitReason(result, product, buyer);
  return result;
}

export function generateFitReason(score: AIFitScore, product: Product, buyer: User): string {
  const reasons: string[] = [];
  
  if (score.industryMatch >= 80) {
    reasons.push(`Strong match for the ${buyer.industry} industry`);
  }
  
  if (score.proximityScore >= 80) {
    reasons.push(`Sourced locally`);
  }
  
  if (score.carbonImpact >= 80) {
    reasons.push(`Exceptional CO2 reduction potential`);
  }
  
  return reasons.join(' • ') || 'Good baseline fit for your operations';
}
