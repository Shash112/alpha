export interface CreateSubscriptionParams {
    workspaceId: string;
    planId: string;
    customerEmail: string;
    customerName: string;
}
export interface SubscriptionResultDto {
    providerSubscriptionId: string;
    status: string;
    checkoutUrl?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}
export interface IBillingProvider {
    createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto>;
    cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export declare class RazorpayAdapter implements IBillingProvider {
    private keyId;
    private keySecret;
    constructor();
    createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto>;
    cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
//# sourceMappingURL=index.d.ts.map