export interface SendNotificationParams {
    recipient: string;
    channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
    templateCode: string;
    data: Record<string, any>;
}
export declare class NotificationDispatcher {
    static send(params: SendNotificationParams): Promise<boolean>;
    static sendVerificationEmail(email: string, verifyToken: string): Promise<boolean>;
    static sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
    static sendLeadCapturedAlert(cardOwnerEmail: string, leadName: string, leadPhone?: string): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map