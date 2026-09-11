import { logger } from '../config/logger.js';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Dispatches transactional email. Architecture prepared for Nodemailer/SES integration in later phases.
   */
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    logger.info(`[EmailService] Preparing email to ${payload.to}: ${payload.subject}`);
    // Future phase: implement actual transporter dispatch
    return true;
  }
}

export const emailService = new EmailService();
