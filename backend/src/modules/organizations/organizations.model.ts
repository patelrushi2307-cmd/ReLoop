import mongoose, { Schema, Document } from 'mongoose';

export type OrganizationType = 'manufacturer' | 'retailer' | 'recycler' | 'logistics';

export interface IOrganization extends Document {
  name: string;
  type: OrganizationType;
  registrationNumber?: string;
  contactEmail: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  verified: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['manufacturer', 'retailer', 'recycler', 'logistics'],
      required: true,
      index: true,
    },
    registrationNumber: { type: String, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true, default: 'USA' },
      postalCode: { type: String },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },
    verified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

OrganizationSchema.index({ location: '2dsphere' });

export const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);
