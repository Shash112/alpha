import { StripeAdapter, RazorpayAdapter } from '@alpha/billing';

describe('Billing Integration Tests — Webhook Idempotency & Signature', () => {
  const stripeAdapter = new StripeAdapter();
  const razorpayAdapter = new RazorpayAdapter();
  const stripeSecret = 'whsec_mock_stripe_secret';
  const razorpaySecret = 'whsec_mock_razorpay_secret';

  test('Stripe Webhook Signature Verification & Buffer Length Safety', () => {
    const payload = JSON.stringify({ type: 'checkout.session.completed', id: 'evt_stripe_12345' });
    const crypto = require('crypto');
    const validSignature = crypto.createHmac('sha256', stripeSecret).update(payload).digest('hex');

    const isValid = stripeAdapter.verifyWebhookSignature(payload, validSignature, stripeSecret);
    expect(isValid).toBe(true);

    const isInvalid = stripeAdapter.verifyWebhookSignature(payload, 'invalid_sig', stripeSecret);
    expect(isInvalid).toBe(false);
  });

  test('Razorpay Webhook Signature Verification', () => {
    const payload = JSON.stringify({ event: 'subscription.charged', id: 'evt_rzp_12345' });
    const crypto = require('crypto');
    const validSignature = crypto.createHmac('sha256', razorpaySecret).update(payload).digest('hex');

    const isValid = razorpayAdapter.verifyWebhookSignature(payload, validSignature, razorpaySecret);
    expect(isValid).toBe(true);

    const isInvalid = razorpayAdapter.verifyWebhookSignature(payload, 'invalid_sig', razorpaySecret);
    expect(isInvalid).toBe(false);
  });
});
