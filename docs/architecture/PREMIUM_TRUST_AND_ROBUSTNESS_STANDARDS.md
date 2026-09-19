# ALPHA — PREMIUM TRUST & ROBUSTNESS ENGINEERING STANDARDS

**Document:** Engineering & Quality Addendum
**Version:** 1.0 (Global Mandate)
**Status:** Binding Quality Standard

---

## 1. PURPOSE

This document defines the non-negotiable engineering, security, reliability, perceived quality, and transparency standards for Alpha. Every component, API, database layer, and UI flow built in Alpha must strictly adhere to these standards so that global individual professionals, SMB decision-makers, and enterprise buyers can trust Alpha completely without hesitation.

---

## 2. PRODUCTION-GRADE RELIABILITY & FAULT TOLERANCE

1. **Idempotency by Default**:
   - All state-changing API endpoints (payment checkout, subscription updates, card publishing, lead submission, member invitation) MUST support/enforce idempotency headers (`Idempotency-Key`).
   - Payment webhooks from any gateway (Stripe, Razorpay, PayPal) MUST be processed idempotently using a database event log table (`billing_webhook_deliveries`).

2. **Graceful Degradation & Fallback Resilience**:
   - Fallback database mechanisms (e.g. `pg-mem` in local dev or read-replica failover in production) must fail gracefully without exposing technical stack traces or breaking public profile availability.
   - External service failures (e.g. email delivery, calendar integration, webhooks) must use asynchronous retry queues with exponential backoff and Dead Letter Queues (DLQ).

3. **Performance Budgets**:
   - Public Card Load Time: `< 100ms` TTFB on global Edge CDN.
   - API Endpoint P95 Response Time: `< 150ms`.
   - Card Builder Live Preview Latency: Real-time update `< 50ms`.

---

## 3. SECURITY & TENANT ISOLATION

1. **Multi-Layer Tenant Isolation**:
   - Tenant boundaries MUST be validated at 5 independent layers:
     1. Middleware request context resolution.
     2. Workspace membership authorization check.
     3. Domain service authorization check.
     4. Data access repository query filter (`workspace_id`).
     5. Database foreign key and composite unique constraints.
   - Client-supplied `workspace_id` parameters in API payloads MUST NEVER be trusted without server-side verification against the authenticated user session.

2. **OWASP SaaS Hardening**:
   - IDOR Protection: ImmutableUUIDv7 resource IDs, strict permission checks.
   - XSS & Injection: All dynamic card user inputs sanitized server-side before storage and HTML encoding during rendering.
   - CSRF & Session Security: HTTP-only, SameSite=Lax, Secure cookies with token rotation.
   - Rate Limiting: Tiered API rate limiting (Public APIs: 60 req/min, Auth APIs: 10 req/min, Admin APIs: 120 req/min).

3. **Auditability**:
   - All privilege actions (role assignment, billing changes, custom domain additions, team deletions, data exports) MUST produce immutable audit records in `audit_logs` containing `actor_user_id`, `workspace_id`, `action`, `ip_address`, `user_agent`, and `changes_json`.

---

## 4. PERCEIVED QUALITY & VISUAL EXCELLENCE

1. **Modern Aesthetic System**:
   - Curated modern color palettes (slate, dark obsidian, glassmorphism, fluid gradient accents).
   - Typography powered by modern web fonts (`Inter`, `Outfit`, `Roboto`).
   - Smooth micro-animations for hover states, button loading, modal transitions, and preview syncing.
   - Fully responsive design for mobile (320px+), tablet, and desktop viewports with zero horizontal overflow.

2. **Zero Fake UI / Zero Placeholders**:
   - Every UI button, toggle, filter, dropdown, and tab must execute complete, functional backend logic.
   - Interactive elements must feature clear loading indicators, success toasts, and human-readable, non-technical error notifications.

---

## 5. TRANSPARENT COMMERCIAL & BILLING TRUST

1. **Multi-Currency Pricing Engine**:
   - Prices MUST NOT be hardcoded in INR or any single currency.
   - Billing engine must support multi-currency pricing (`USD`, `EUR`, `GBP`, `INR`, `CAD`, `AUD`) backed by dynamic plan entitlement configurations.

2. **Clear Commercial Terms**:
   - Trials, subscription renewals, upgrade prorations, and cancellation policies must be clearly presented in the UI with instant self-serve options.
   - Automatic generation of itemized, downloadable PDF invoices upon every successful billing event.

3. **Reconciliation & Replay Protection**:
   - Webhook processing must verify cryptographic signatures before execution.
   - Billing entitlements are granted ONLY after successful server-to-server webhook reconciliation or provider polling, never solely on client-side redirect callbacks.

---

## 6. GLOBAL READINESS & LOCALIZATION (i18n)

1. **Internationalization Posture**:
   - UI text strings must use i18n keys (`next-intl` / `react-i18next`).
   - Formatting for dates, numbers, phone numbers, and currencies must use browser/server standard Intl formatters (`Intl.NumberFormat`, `Intl.DateTimeFormat`).

2. **Timezone & Regional Compliance**:
   - All timestamps stored in UTC (`TIMESTAMPTZ`). Display rendered in the user's explicit or detected local timezone.
   - Privacy controls compliant with GDPR and CCPA (right to access, data export in JSON/vCard, right to erasure).

---

## 7. OBSERVABILITY & OPERABILITY

1. **Structured Logging**:
   - JSON structured logs with standard fields: `timestamp`, `level`, `requestId`, `workspaceId`, `userId`, `action`, `durationMs`.

2. **System Health Endpoints**:
   - `/health/live`: Liveness probe for process execution.
   - `/health/ready`: Readiness probe verifying PostgreSQL connection, Redis availability, and queue worker status.
