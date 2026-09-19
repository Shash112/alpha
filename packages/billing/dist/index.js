"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayAdapter = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("@alpha/config");
class RazorpayAdapter {
    keyId;
    keySecret;
    constructor() {
        const env = (0, config_1.validateEnv)();
        this.keyId = env.RAZORPAY_KEY_ID || '';
        this.keySecret = env.RAZORPAY_KEY_SECRET || '';
    }
    async createSubscription(params) {
        // Standard Razorpay Subscription Creation Response Adapter
        const mockId = `sub_rzp_${crypto_1.default.randomBytes(8).toString('hex')}`;
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
    async cancelSubscription(providerSubscriptionId, atPeriodEnd) {
        console.log(`RazorpayAdapter: Subscription ${providerSubscriptionId} marked for cancellation (atPeriodEnd=${atPeriodEnd})`);
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
//# sourceMappingURL=index.js.map