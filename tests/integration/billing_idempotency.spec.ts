import { RazorpayAdapter } from '@alpha/billing';

describe('Billing Integration Tests — Webhook Idempotency & Signature', () => {
  const adapter = new RazorpayAdapter();
  const secret = 'whsec_mock_razorpay_secret';

  test('Razorpay Webhook Signature Verification', () => {
    const payload = JSON.stringify({ event: 'subscription.charged', id: 'evt_12345' });
    const crypto = require('crypto');
    const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const isValid = adapter.verifyWebhookSignature(payload, validSignature, secret);
    expect(isValid).toBe(true);

    const isInvalid = adapter.verifyWebhookSignature(payload, 'invalid_sig', secret);
    expect(isInvalid).toBe(false);
  });
});
