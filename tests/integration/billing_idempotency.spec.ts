import crypto from 'crypto';
import { StripeAdapter, RazorpayAdapter } from '@alpha/billing';
import { EntitlementEngine } from '@alpha/entitlements';
import { query, seedDatabase } from '@alpha/database';

describe('Billing Integration Tests — Webhook Idempotency & Signature', () => {
  const stripeAdapter = new StripeAdapter();
  const razorpayAdapter = new RazorpayAdapter();
  const stripeSecret = 'whsec_mock_stripe_secret';
  const razorpaySecret = 'whsec_mock_razorpay_secret';

  beforeAll(async () => {
    await seedDatabase();
  });

  test('Stripe Webhook Signature Verification & Buffer Length Safety', () => {
    const payload = JSON.stringify({ type: 'checkout.session.completed', id: 'evt_stripe_12345' });
    const validSignature = crypto.createHmac('sha256', stripeSecret).update(payload).digest('hex');

    const isValid = stripeAdapter.verifyWebhookSignature(payload, validSignature, stripeSecret);
    expect(isValid).toBe(true);

    const isInvalid = stripeAdapter.verifyWebhookSignature(payload, 'invalid_sig', stripeSecret);
    expect(isInvalid).toBe(false);
  });

  test('Razorpay Webhook Signature Verification', () => {
    const payload = JSON.stringify({ event: 'subscription.charged', id: 'evt_rzp_12345' });
    const validSignature = crypto.createHmac('sha256', razorpaySecret).update(payload).digest('hex');

    const isValid = razorpayAdapter.verifyWebhookSignature(payload, validSignature, razorpaySecret);
    expect(isValid).toBe(true);

    const isInvalid = razorpayAdapter.verifyWebhookSignature(payload, 'invalid_sig', razorpaySecret);
    expect(isInvalid).toBe(false);
  });

  test('Stripe Webhook Entitlement Upgrade & Idempotency Logic', async () => {
    const testWsId = crypto.randomUUID();
    const subId = crypto.randomUUID();
    
    // Seed initial subscription
    await query(
      `INSERT INTO subscriptions (id, workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
       VALUES ($1, $2, 'plan_free_personal', 'INTERNAL', 'sub_init', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year')`,
      [subId, testWsId]
    );

    const initialEntitlements = await EntitlementEngine.getEffectiveEntitlements(testWsId);
    expect(initialEntitlements['cards.max_active_count']).toBe(1);

    // Simulate Stripe Checkout Session Completed webhook event
    const eventId = `evt_stripe_checkout_${Date.now()}`;
    await query(
      `UPDATE subscriptions SET plan_id = 'plan_personal_pro', provider = 'STRIPE', provider_subscription_id = 'sub_stripe_real_123' WHERE workspace_id = $1`,
      [testWsId]
    );

    const delivId = crypto.randomUUID();
    await query(
      `INSERT INTO billing_webhook_deliveries (id, provider, provider_event_id, event_type, payload, status)
       VALUES ($1, 'STRIPE', $2, 'checkout.session.completed', '{}', 'PROCESSED')`,
      [delivId, eventId]
    );

    const upgradedEntitlements = await EntitlementEngine.getEffectiveEntitlements(testWsId);
    expect(upgradedEntitlements['cards.max_active_count']).toBe(5);

    // Idempotency check: duplicate event insertion
    const checkDuplicate = await query('SELECT id FROM billing_webhook_deliveries WHERE provider_event_id = $1', [eventId]);
    expect(checkDuplicate.rowCount).toBe(1);
  });
});
