import { routingService } from '../../services/routing.service.js';
import { carbonService } from '../carbon/carbon.service.js';
import { RouteModel } from './route.model.js';
import { OrganizationAuditModel } from '../organizations/audit.model.js';
import { Types } from 'mongoose';

/**
 * Service handling route optimization (F8).
 * For now it uses the basic haversine‑based routing service to compute
 * distance/duration for each shipment and stores a consolidated plan.
 */
export class RouteService {
  /**
   * Generate an optimized route plan for a list of shipments.
   * @param shipments Array of objects containing origin/destination coordinates.
   */
  async plan(shipments: Array<{ origin: { longitude: number; latitude: number }; destination: { longitude: number; latitude: number }; weight?: number }>) {
    const planSegments = [];
    for (const shipment of shipments) {
      const estimate = await routingService.calculateRoute(
        { longitude: shipment.origin.longitude, latitude: shipment.origin.latitude },
        { longitude: shipment.destination.longitude, latitude: shipment.destination.latitude }
      );
      planSegments.push({ ...shipment, estimate });
    }

    const route = await RouteModel.create({
      shipmentIds: [], // could be filled later when shipments are persisted
      plan: planSegments,
    });

    await OrganizationAuditModel.create({
      actorId: new Types.ObjectId(), // placeholder actor
      organizationId: new Types.ObjectId(), // placeholder org
      action: 'ROUTE_PLANNED',
      target: route._id.toHexString(),
      metadata: { segmentCount: planSegments.length },
    });
    return route;
  }

  /**
   * Mark a route as completed and record actual carbon emissions.
   * @param routeId Route document ID
   * @param actualKg Actual carbon measured for the route
   */
  async complete(routeId: string, actualKg: number) {
    const route = await RouteModel.findByIdAndUpdate(
      routeId,
      { status: 'completed' },
      { new: true }
    );
    if (!route) {
      throw new Error('Route not found');
    }
    // Record actual carbon – associate with the route entity
    await carbonService.recordActualCarbon(new Types.ObjectId(routeId), actualKg);

    await OrganizationAuditModel.create({
      actorId: new Types.ObjectId(),
      organizationId: new Types.ObjectId(),
      action: 'ROUTE_COMPLETED',
      target: routeId,
      metadata: { actualKg },
    });
    return route;
  }
}

export const routeService = new RouteService();
