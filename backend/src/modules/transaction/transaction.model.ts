import { Schema, Document, Types } from 'mongoose';

export type TransactionStatus =
  | 'initiated'
  | 'carbon_checked'
  | 'claimed'
  | 'negotiated'
  | 'agreed'
  | 'completed';

export interface ITransaction extends Document {
  matchId: Types.ObjectId;
  carbonRecordId?: Types.ObjectId;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
    carbonRecordId: { type: Schema.Types.ObjectId, ref: 'Carbon' },
    status: { type: String, enum: ['initiated', 'carbon_checked', 'claimed', 'negotiated', 'agreed', 'completed'], default: 'initiated' },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
