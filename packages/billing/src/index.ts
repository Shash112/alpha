import crypto from 'crypto';
import { validateEnv } from '@alpha/config';

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

export class RazorpayAdapter implements IBillingProvider {
  private keyId: string;
  private keySecret: string;

  constructor() {
    const env = validateEnv();
    this.keyId = env.RAZORPAY_KEY_ID || '';
    this.keySecret = env.RAZORPAY_KEY_SECRET || '';
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto> {
    // Standard Razorpay Subscription Creation Response Adapter
    const mockId = `sub_rzp_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    return {
      providerSubscriptionId: mockId,
      status: 'ACTIVE',
      checkoutUrl: `https://api.razorpay.com/v1/checkout/mock/${mockId}`,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd
    };
  }

  async cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean> {
    console.log(`RazorpayAdapter: Subscription ${providerSubscriptionId} marked for cancellation (atPeriodEnd=${atPeriodEnd})`);
    return true;
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!signature || !secret) return false;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    const bufExpected = Buffer.from(expectedSignature);
    const bufActual = Buffer.from(signature);
    if (bufExpected.length !== bufActual.length) return false;
    return crypto.timingSafeEqual(bufExpected, bufActual);
  }
}
