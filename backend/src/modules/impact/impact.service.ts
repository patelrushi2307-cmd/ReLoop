import { ImpactEntryModel, IImpactEntry, computeImpactHash } from './impact.model.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { env } from '../../config/env.js';

/**
 * Service handling Impact Ledger operations.
 */
export class ImpactService {
  /**
   * Create a new immutable ledger entry for a given entity.
   * The entry includes hash‑chaining and a digital signature.
   */
  static async createEntry(entityId: mongoose.Types.ObjectId, entityType: string): Promise<IImpactEntry> {
    // Find the most recent entry to obtain its dataHash for chaining.
    const latest = await ImpactEntryModel.findOne().sort({ createdAt: -1 }).exec();
    const previousHash = latest ? latest.dataHash : '';
    const timestamp = new Date();
    const dataHash = computeImpactHash(entityId, entityType, previousHash, timestamp);

    // Sign the hash using the platform's private key (must be provided in env).
    const privateKey = env.IMPACT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('IMPACT_PRIVATE_KEY not configured');
    }
    const signer = crypto.createSign('sha256');
    signer.update(dataHash);
    signer.end();
    const signature = signer.sign(privateKey, 'base64');

    const entry = new ImpactEntryModel({
      entityId,
      entityType,
      previousHash,
      dataHash,
      signature,
      createdAt: timestamp,
    });
    return await entry.save();
  }

  /** Retrieve a ledger entry by its id. */
  static async getEntry(id: string): Promise<IImpactEntry | null> {
    return ImpactEntryModel.findById(id).exec();
  }

  /** Verify the entire chain integrity. */
  static async verifyChain(): Promise<boolean> {
    const entries = await ImpactEntryModel.find().sort({ createdAt: 1 }).exec();
    let previousHash = '';
    for (const entry of entries) {
      const recomputed = computeImpactHash(entry.entityId, entry.entityType, previousHash, entry.createdAt);
      if (recomputed !== entry.dataHash) {
        return false;
      }
      previousHash = entry.dataHash;
    }
    return true;
  }
}
