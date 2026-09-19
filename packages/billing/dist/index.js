"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayAdapter = exports.StripeAdapter = void 0;
exports.getBillingAdapter = getBillingAdapter;
exports.formatCurrencyAmount = formatCurrencyAmount;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("@alpha/config");
class StripeAdapter {
    providerName = 'STRIPE';
    secretKey;
    constructor() {
        const env = (0, config_1.validateEnv)();
        this.secretKey = env.STRIPE_SECRET_KEY || '';
    }
    async createSubscription(params) {
        const mockId = `sub_stripe_${crypto_1.default.randomBytes(8).toString('hex')}`;
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
    async cancelSubscription(providerSubscriptionId, atPeriodEnd) {
        console.log(`StripeAdapter: Subscription ${providerSubscriptionId} cancelled (atPeriodEnd=${atPeriodEnd})`);
        return true;
    }
    verifyWebhookSignature(payload, signature, secret) {
        if (!signature || !secret)
            return false;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        const bufExpected = Buffer.from(expectedSignature);
        const bufActual = Buffer.from(signature);
        if (bufExpected.length !== bufActual.length)
            return false;
        return crypto_1.default.timingSafeEqual(bufExpected, bufActual);
    }
}
exports.StripeAdapter = StripeAdapter;
class RazorpayAdapter {
    providerName = 'RAZORPAY';
    keyId;
    keySecret;
    constructor() {
        const env = (0, config_1.validateEnv)();
        this.keyId = env.RAZORPAY_KEY_ID || '';
        this.keySecret = env.RAZORPAY_KEY_SECRET || '';
    }
    async createSubscription(params) {
        const mockId = `sub_rzp_${crypto_1.default.randomBytes(8).toString('hex')}`;
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
    async cancelSubscription(providerSubscriptionId, atPeriodEnd) {
        console.log(`RazorpayAdapter: Subscription ${providerSubscriptionId} cancelled (atPeriodEnd=${atPeriodEnd})`);
        return true;
    }
    verifyWebhookSignature(payload, signature, secret) {
        if (!signature || !secret)
            return false;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
        const bufExpected = Buffer.from(expectedSignature);
        const bufActual = Buffer.from(signature);
        if (bufExpected.length !== bufActual.length)
            return false;
        return crypto_1.default.timingSafeEqual(bufExpected, bufActual);
    }
}
exports.RazorpayAdapter = RazorpayAdapter;
function getBillingAdapter(provider = 'STRIPE') {
    const upper = (provider || 'STRIPE').toUpperCase();
    if (upper === 'RAZORPAY') {
        return new RazorpayAdapter();
    }
    return new StripeAdapter();
}
function formatCurrencyAmount(amountCents, currency = 'USD', locale = 'en-US') {
    const decimal = amountCents / 100;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2
    }).format(decimal);
}
//# sourceMappingURL=index.js.map