import { MaterialModel } from '../materials/materials.model.js';

export interface MatchingCriteria {
  materialType: string;
  requiredQuantity: number;
  buyerLocation: {
    longitude: number;
    latitude: number;
  };
  maxDistanceKm: number;
  maxPricePerUnit?: number;
  preferredCondition?: string;
}

export class MatchingService {
  /**
   * Deterministic matching service algorithm prepared for multi-criteria ranking.
   */
  async findMatches(criteria: MatchingCriteria) {
    const query: Record<string, any> = {
      isDeleted: false,
      status: 'available',
      materialType: criteria.materialType,
      'pickupLocation.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [criteria.buyerLocation.longitude, criteria.buyerLocation.latitude],
          },
          $maxDistance: criteria.maxDistanceKm * 1000,
        },
      },
    };

    if (criteria.maxPricePerUnit !== undefined) {
      query.pricePerUnit = { $lte: criteria.maxPricePerUnit };
    }

    if (criteria.preferredCondition) {
      query.condition = criteria.preferredCondition;
    }

    const candidateListings = await MaterialModel.find(query)
      .populate('sellerOrganizationId', 'name verified address')
      .limit(20);

    return candidateListings.map((listing) => {
      // Deterministic ranking score: distance + price + quantity fulfillment
      const quantityScore = Math.min(listing.availableQuantity / criteria.requiredQuantity, 1) * 40;
      const verifiedBonus = (listing.sellerOrganizationId as any)?.verified ? 10 : 0;
      const matchScore = Math.round(50 + quantityScore + verifiedBonus);

      return {
        score: matchScore,
        listing,
      };
    });
  }
}

export const matchingService = new MatchingService();
