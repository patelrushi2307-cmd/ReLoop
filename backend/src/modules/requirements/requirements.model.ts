import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirement extends Document {
  organizationId: mongoose.Types.ObjectId;
  materialType: string;
  subCategory?: string;
  minQuantity: number;
  unit: string;
  targetPricePerUnit?: number;
  maxDistanceKm: number;
  facilityId?: mongoose.Types.ObjectId;
  status: 'active' | 'fulfilled' | 'expired' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    materialType: { type: String, required: true, index: true },
    subCategory: { type: String },
    minQuantity: { type: Number, required: true, min: 0.1 },
    unit: { type: String, required: true },
    targetPricePerUnit: { type: Number },
    maxDistanceKm: { type: Number, default: 100 },
    facilityId: { type: Schema.Types.ObjectId, ref: 'Facility' },
    status: { type: String, enum: ['active', 'fulfilled', 'expired', 'paused'], default: 'active', index: true },
  },
  { timestamps: true }
);

export const RequirementModel = mongoose.model<IRequirement>('Requirement', RequirementSchema);
