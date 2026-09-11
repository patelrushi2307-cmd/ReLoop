import { CarbonModel, ICarbon } from './carbon.model.js';
import { OrganizationAuditModel } from '../organizations/audit.model.js';
import { Types } from 'mongoose';

/**
 * Service responsible for carbon calculations and persistence.
 * Real carbon factor data should be sourced from an external emissions factor API.
 * For now we abstract the factor lookup behind `getFactor` which can be later
 * implemented to call a real service.
 */
export class CarbonService {
  /**
   * Retrieves the emissions factor (kg CO₂ per unit) for a given entity type.
   * This stub returns a static factor; replace with actual lookup.
   */
  private async getFactor(entityType: string): Promise<number> {
    // TODO: integrate with external carbon data source (e.g., DEFRA, EPA)
    const defaults: Record<string, number> = {
      listing: 0.5, // kg per unit of material
      shipment: 0.2, // kg per km per kg of cargo (simplified)
      transaction: 0.1,
    };
    return defaults[entityType] ?? 0.3;
  }

  /**
   * Calculates carbon for an entity and persists the result.
   * @param entityId - MongoDB ObjectId of the entity (listing, shipment, etc.)
   * @param entityType - Type of the entity (used for factor lookup)
   * @param quantity - Quantity of material involved (units depend on entity)
   * @param extra - Optional extra data for more complex calculations
   */
  async calculateAndSave(
    entityId: Types.ObjectId,
    entityType: string,
    quantity: number,
    extra?: Record<string, unknown>
  ): Promise<ICarbon> {
    const factor = await this.getFactor(entityType);
    const carbonKg = Number((factor * quantity).toFixed(3));

    const carbonRecord = await CarbonModel.create({
      entityId,
      entityType,
      carbonKg,
      methodologyVersion: 'v1.0',
      metadata: extra,
    });

    // Audit the calculation
    await OrganizationAuditModel.create({
      actorId: entityId, // placeholder; real actor should be the service user
      organizationId: entityId, // placeholder; adapt as needed
      action: 'CARBON_CALCULATION',
      target: entityId.toHexString(),
      metadata: { entityType, quantity, carbonKg },
    });

    return carbonRecord;
  }

  /**
   * Record actual carbon after logistics execution (e.g., measured emissions).
   */
  async recordActualCarbon(
    entityId: Types.ObjectId,
    actualKg: number,
    extra?: Record<string, unknown>
  ): Promise<ICarbon> {
    const carbon = await CarbonModel.findOneAndUpdate(
      { entityId },
      { carbonKg: actualKg, $set: { metadata: extra } },
      { new: true }
    );
    if (!carbon) {
      throw new Error('Carbon record not found for entity');
    }
    await OrganizationAuditModel.create({
      actorId: entityId,
      organizationId: entityId,
      action: 'CARBON_ACTUAL_RECORDED',
      target: entityId.toHexString(),
      metadata: { actualKg },
    });
    return carbon;
  }
}

export const carbonService = new CarbonService();
