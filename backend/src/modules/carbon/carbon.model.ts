import mongoose, { Document, Schema } from 'mongoose';

export interface ICarbon extends Document {
  entityId: mongoose.Types.ObjectId; // could be listing, shipment, etc.
  entityType: string; // e.g., 'listing', 'shipment', 'transaction'
  carbonKg: number;
  methodologyVersion: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const CarbonSchema = new Schema<ICarbon>(
  {
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    entityType: { type: String, required: true },
    carbonKg: { type: Number, required: true },
    methodologyVersion: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CarbonModel = mongoose.model<ICarbon>('Carbon', CarbonSchema);
