import mongoose, { Schema, Document } from 'mongoose';

export interface ICarbonLedgerEntry extends Document {
  organizationId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  eventType: 'material_diverted' | 'reusable_cycle_completed' | 'virgin_avoidance';
  materialType: string;
  weightKg: number;
  co2eAvoidedKg: number;
  verificationHash: string;
  timestamp: Date;
}

const CarbonLedgerSchema = new Schema<ICarbonLedgerEntry>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    eventType: {
      type: String,
      enum: ['material_diverted', 'reusable_cycle_completed', 'virgin_avoidance'],
      required: true,
    },
    materialType: { type: String, required: true },
    weightKg: { type: Number, required: true },
    co2eAvoidedKg: { type: Number, required: true },
    verificationHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const CarbonLedgerModel = mongoose.model<ICarbonLedgerEntry>('CarbonLedger', CarbonLedgerSchema);
