import { Types } from 'mongoose';
import { TransactionModel, ITransaction } from './transaction.model.js';
import { carbonService } from '../carbon/carbon.service.js';
import { OrganizationAuditModel } from '../organizations/audit.model.js';

/**
 * Service orchestrating the transaction workflow (F7).
 * For simplicity, this implementation assumes the matchId is provided and
 * uses a placeholder quantity for carbon calculation.
 */
export class TransactionService {
  /** Start a new transaction workflow for a given match */
  async start(matchId: string): Promise<ITransaction> {
    // Create a transaction record with initial status
    const transaction = await TransactionModel.create({
      matchId: Types.ObjectId(matchId),
      status: 'initiated',
    });

    // Audit creation
    await OrganizationAuditModel.create({
      actorId: Types.ObjectId(matchId), // placeholder actor
      organizationId: Types.ObjectId(matchId), // placeholder organization
      action: 'TRANSACTION_STARTED',
      target: transaction._id.toHexString(),
      metadata: { matchId },
    });

    // Perform carbon check (F6) – placeholder quantity 1
    const carbonRecord = await carbonService.calculateAndSave(
      transaction._id,
      'transaction',
      1,
      { matchId }
    );

    // Update transaction with carbon record and status
    transaction.carbonRecordId = carbonRecord._id;
    transaction.status = 'carbon_checked';
    await transaction.save();

    await OrganizationAuditModel.create({
      actorId: Types.ObjectId(matchId),
      organizationId: Types.ObjectId(matchId),
      action: 'CARBON_CHECKED',
      target: transaction._id.toHexString(),
      metadata: { carbonRecordId: carbonRecord._id },
    });

    return transaction;
  }

  /** Retrieve transaction status by ID */
  async getStatus(id: string): Promise<ITransaction | null> {
    return TransactionModel.findById(id);
  }
}

export const transactionService = new TransactionService();
