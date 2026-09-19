import crypto from 'crypto';
import { validateEnv } from '@alpha/config';
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

export class StripeAdapter implements IBillingProvider {
  providerName: PaymentProvider = 'STRIPE';
  private secretKey: string;

  constructor() {
    const env = validateEnv();
    this.secretKey = env.STRIPE_SECRET_KEY || '';
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto> {
    const mockId = `sub_stripe_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const currency = params.currency || 'USD';

    return {
      providerSubscriptionId: mockId,
      status: 'ACTIVE',
      checkoutUrl: `https://checkout.stripe.com/c/pay/mock_${mockId}`,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      currency,
      amountCents: 4900
    };
  }

  async cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean> {
    console.log(`StripeAdapter: Subscription ${providerSubscriptionId} cancelled (atPeriodEnd=${atPeriodEnd})`);
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

export class RazorpayAdapter implements IBillingProvider {
  providerName: PaymentProvider = 'RAZORPAY';
  private keyId: string;
  private keySecret: string;

  constructor() {
    const env = validateEnv();
    this.keyId = env.RAZORPAY_KEY_ID || '';
    this.keySecret = env.RAZORPAY_KEY_SECRET || '';
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResultDto> {
    const mockId = `sub_rzp_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    return {
      providerSubscriptionId: mockId,
      status: 'ACTIVE',
      checkoutUrl: `https://api.razorpay.com/v1/checkout/mock/${mockId}`,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      currency: 'INR',
      amountCents: 49900
    };
  }

  async cancelSubscription(providerSubscriptionId: string, atPeriodEnd: boolean): Promise<boolean> {
    console.log(`RazorpayAdapter: Subscription ${providerSubscriptionId} cancelled (atPeriodEnd=${atPeriodEnd})`);
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

export function getBillingAdapter(provider: string = 'STRIPE'): IBillingProvider {
  const upper = (provider || 'STRIPE').toUpperCase();
  if (upper === 'RAZORPAY') {
    return new RazorpayAdapter();
  }
  return new StripeAdapter();
}

export function formatCurrencyAmount(amountCents: number, currency: Currency = 'USD', locale: string = 'en-US'): string {
  const decimal = amountCents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(decimal);
}
