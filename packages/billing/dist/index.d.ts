import { Currency, PaymentProvider } from '@alpha/types';
export interface CreateSubscriptionParams {
    workspaceId: string;
    planId: string;
    customerEmail: string;
    customerName: string;
    currency?: Currency;
}
export interface SubscriptionResultDto {
    providerSubscriptionId: string;
    status: string;
    checkoutUrl?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    currency: Currency;
    amountCents: number;
}
export interface IBillingProvider {
    providerName: PaymentProvider;
    createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto>;
    cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export declare class StripeAdapter implements IBillingProvider {
    providerName: PaymentProvider;
    private secretKey;
    private stripe;
    private frontendUrl;
    constructor();
    createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto>;
    cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export declare class RazorpayAdapter implements IBillingProvider {
    providerName: PaymentProvider;
    private keyId;
    private keySecret;
    constructor();
    createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto>;
    cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
export declare function getBillingAdapter(provider?: string): IBillingProvider;
export declare function formatCurrencyAmount(amountCents: number, currency?: Currency, locale?: string): string;
//# sourceMappingURL=index.d.ts.map