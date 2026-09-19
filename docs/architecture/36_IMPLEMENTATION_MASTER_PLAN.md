# 36 — Master Implementation Plan

**Document Version:** 2.0 (Global Mandate & Vertical Slice Priority)  
**Status:** Approved Technical Architecture Blueprint  
**Scope:** Complete Execution Plan for Full Production Implementation  

---

## Executive Implementation Strategy

This document outlines the **Master Implementation Blueprint**. Implementation is structured to deliver a **High-Confidence Vertical Slice First** — a complete, secure, polished, and purchasable core experience (Personal Digital Card creation, live preview, sub-100ms public rendering, multi-currency Stripe + Razorpay billing checkout, lead capture, and workspace management) before expanding into teams, CRM, white-labeling, and reseller portals.

---

## Strategic Phase Structure

```text
PHASE 1: HIGH-CONFIDENCE VERTICAL SLICE (Core Purchasable Experience)
  ├── 1.1 Monorepo & Global Configuration Foundation
  ├── 1.2 Authentication, User Identity & i18n Posture
  ├── 1.3 Tenant Workspaces, Isolation & RBAC Engine
  ├── 1.4 Digital Card Engine, Builder & Live Preview
  ├── 1.5 Public Profile Subsystem & URL Identity (Sub-100ms CDN)
  ├── 1.6 Multi-Currency Billing Engine (Stripe + Razorpay Strategy, Checkout & Webhooks)
  └── 1.7 Lead Capture & Email Notifications

PHASE 2: ORGANIZATION, QR/NFC & GROWTH SLICE
  ├── 2.1 Dynamic QR Code & Physical NFC Tag Management
  ├── 2.2 CRM Lite, Lead Management Pipeline & vCard Export
  ├── 2.3 Asynchronous Analytics & Event Reporting
  ├── 2.4 Corporate Teams, Departments & Employee Onboarding
  └── 2.5 Native Appointment Booking & 2-Way Networking Exchange

PHASE 3: RESELLER, WHITE-LABEL & ENTERPRISE SLICE
  ├── 3.1 Custom Domains & Automated Edge SSL Routing
  ├── 3.2 Agency & Reseller Partner Portal
  ├── 3.3 Super-Admin Operations Console & Observability
  └── 3.4 Enterprise Security, Audit Logs & Final Release Verification
```

---

## Execution Phase Details

### PHASE 1: HIGH-CONFIDENCE VERTICAL SLICE (Core Purchasable Experience)

#### Phase 1.1: Monorepo & Global Configuration Foundation
- **Objective:** Establish monorepo structure, TypeScript configs, Docker environment, and global configuration schema.
- **Tasks:**
  - Monorepo structure (`apps/web`, `apps/api`, `apps/admin`, `packages/*`).
  - Docker Compose with PostgreSQL 16, Redis 7, and LocalStack.
  - Zod environment validator for global billing keys (`STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`, etc.).

#### Phase 1.2: Authentication, User Identity & i18n Posture
- **Objective:** Implement user registration, login, email verification, session security, and i18n locale/timezone posture.
- **Tasks:**
  - Migrations for `users`, `auth_identities`. Default locale `en-US`, timezone `UTC`.
  - Argon2id password hashing, JWT session rotation, rate-limiting guards.
  - UI Auth screens with polished glassmorphic styling and i18n strings.

#### Phase 1.3: Tenant Workspaces, Isolation & RBAC Engine
- **Objective:** Enforce multi-layer workspace tenant isolation, membership management, and RBAC guards.
- **Tasks:**
  - Migrations for `workspaces`, `workspace_memberships`, `roles`, `permissions`, `role_permissions`.
  - Server-side `TenantContextMiddleware` and authorization guards.
  - Cross-tenant denial security tests.

#### Phase 1.4: Digital Card Engine, Builder & Live Preview
- **Objective:** Build digital card model, template schema, section-based editor, and real-time live preview.
- **Tasks:**
  - Migrations for `cards`, `card_revisions`, `templates`.
  - Drag-and-drop Card Builder UI with real-time preview (sub-50ms sync).
  - Draft vs published revision snapshot engine.

#### Phase 1.5: Public Profile Subsystem & URL Identity
- **Objective:** Deliver sub-100ms global CDN public card rendering, canonical IDs, and vanity path resolution.
- **Tasks:**
  - Migrations for `aliases`. Atomic path allocation algorithm.
  - Public Profile API with server-side visibility policy filters.
  - Next.js Mobile-First Public Card pages with Open Graph metadata and vCard download.

#### Phase 1.6: Multi-Currency Billing Engine (Stripe + Razorpay Strategy)
- **Objective:** Implement multi-provider billing strategy pattern (`IPaymentProviderAdapter`), multi-currency pricing schemas (`USD`, `EUR`, `GBP`, `INR`), Stripe/Razorpay Checkout, and idempotent webhook handlers.
- **Tasks:**
  - Migrations for `plans`, `subscriptions`, `billing_webhook_deliveries`.
  - Stripe & Razorpay webhook reconciliation with HMAC verification and idempotency keys.
  - Multi-currency Pricing UI, Checkout Modal, and PDF Invoice generation.

#### Phase 1.7: Lead Capture & Email Notifications
- **Objective:** Build public lead capture forms on digital cards with bot protection and async email alerts.
- **Tasks:**
  - Public lead endpoint with rate limiting & honeypot validation.
  - Email notification queue worker.

---

### PHASE 2: ORGANIZATION, QR/NFC & GROWTH SLICE

#### Phase 2.1: Dynamic QR Code & Physical NFC Tag Subsystem
- Dynamic QR code vector generation (PNG/SVG, custom logo overlay) and physical NFC tag activation (`/nfc/:uid`).

#### Phase 2.2: CRM Lite, Lead Management Pipeline & vCard Export
- Dashboard lead management grid, status pipeline, notes, CSV export.

#### Phase 2.3: Asynchronous Analytics & Event Reporting
- Async analytics beacon (`/api/v1/public/analytics/event`), BullMQ daily aggregate worker, performance reporting charts.

#### Phase 2.4: Corporate Teams, Departments & Employee Onboarding
- Corporate organization structure (`departments`, `teams`), bulk CSV employee onboarding, brand locking.

#### Phase 2.5: Native Appointment Booking & 2-Way Networking Exchange
- Time-slot availability generator, `.ics` calendar invite creation, mutual contact exchange handshake.

---

### PHASE 3: RESELLER, WHITE-LABEL & ENTERPRISE SLICE

#### Phase 3.1: Custom Domains & Automated Edge SSL Routing
- Edge CNAME routing middleware, automated DNS TXT verification worker, white-label brand neutrality.

#### Phase 3.2: Agency & Reseller Partner Portal
- Sub-client workspace provisioning, delegated impersonation access, partner commission tracking.

#### Phase 3.3: Super-Admin Operations Console & Observability
- Admin console (`apps/admin`), tenant suspension tools, audit log inspector, Prometheus `/metrics` endpoint.

#### Phase 3.4: Enterprise Security, Audit Logs & Final Release Verification
- Full test suite execution, OWASP vulnerability audit, Playwright E2E verification, production deployment packaging.
