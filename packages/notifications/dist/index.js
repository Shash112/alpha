"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcher = void 0;
class NotificationDispatcher {
    static async send(params) {
        console.log(`✉️ [Notification Channel: ${params.channel}] Sending template '${params.templateCode}' to ${params.recipient}`, params.data);
        // In production environment, dispatches to SES/SendGrid/Twilio API
        return true;
    }
    static async sendVerificationEmail(email, verifyToken) {
        return this.send({
            recipient: email,
            channel: 'EMAIL',
            templateCode: 'auth.verify_email',
            data: { verifyToken, verifyUrl: `http://localhost:3000/auth/verify?token=${verifyToken}` }
        });
    }
    static async sendPasswordResetEmail(email, resetToken) {
        return this.send({
            recipient: email,
            channel: 'EMAIL',
            templateCode: 'auth.password_reset',
            data: { resetToken, resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}` }
        });
    }
    static async sendLeadCapturedAlert(cardOwnerEmail, leadName, leadPhone) {
        return this.send({
            recipient: cardOwnerEmail,
            channel: 'EMAIL',
            templateCode: 'leads.new_lead_captured',
            data: { leadName, leadPhone }
        });
    }
}
exports.NotificationDispatcher = NotificationDispatcher;
//# sourceMappingURL=index.js.map