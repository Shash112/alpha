export interface SendNotificationParams {
  recipient: string; // Email or Phone
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  templateCode: string;
  data: Record<string, any>;
}

export class NotificationDispatcher {
  static async send(params: SendNotificationParams): Promise<boolean> {
    console.log(`✉️ [Notification Channel: ${params.channel}] Sending template '${params.templateCode}' to ${params.recipient}`, params.data);
    // In production environment, dispatches to SES/SendGrid/Twilio API
    return true;
  }

  static async sendVerificationEmail(email: string, verifyToken: string): Promise<boolean> {
    return this.send({
      recipient: email,
      channel: 'EMAIL',
      templateCode: 'auth.verify_email',
      data: { verifyToken, verifyUrl: `http://localhost:3000/auth/verify?token=${verifyToken}` }
    });
  }

  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    return this.send({
      recipient: email,
      channel: 'EMAIL',
      templateCode: 'auth.password_reset',
      data: { resetToken, resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}` }
    });
  }

  static async sendLeadCapturedAlert(cardOwnerEmail: string, leadName: string, leadPhone?: string): Promise<boolean> {
    return this.send({
      recipient: cardOwnerEmail,
      channel: 'EMAIL',
      templateCode: 'leads.new_lead_captured',
      data: { leadName, leadPhone }
    });
  }
}
