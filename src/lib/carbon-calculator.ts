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

export function calculateEquivalentTrees(kgCo2Saved: number): number {
  // 1 tree absorbs ~22kg CO2/year
  return Math.round(kgCo2Saved / 22);
}

export function getVirginComparison(materialType: string, weightKg: number): string {
  const savings = calculateCO2Savings(materialType, weightKg);
  return `Reusing this ${Math.round(weightKg)}kg of ${materialType.replace('-', ' ')} saves ${formatCO2(savings)} of CO2e compared to manufacturing from virgin materials.`;
}
