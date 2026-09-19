# 36 — Master Implementation Plan

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Complete 15-Phase Execution Plan for Prompt 2 (Full Production Implementation)  

---

## Executive Implementation Strategy

This document outlines the **Complete Production Implementation Blueprint** to be executed by **Prompt 2**. Implementation is structured into 15 logical execution phases to ensure systematic, dependency-ordered delivery of the entire Alpha SaaS platform.

> **CRITICAL RULE FOR PROMPT 2:** Prompt 2 MUST implement ALL 15 phases end-to-end. Prompt 2 MUST NOT stop after Phase 1, Phase 2, or an MVP state.

---

## Execution Phase Directory

### Phase 0: Workspace Repository & Monorepo Foundation
- **Objective:** Establish monorepo workspace structure, packages, build tooling, Docker local setup, and base configuration.
- **Dependencies:** None.
- **Tasks:**
  - Initialize pnpm/npm monorepo workspace (`apps/web`, `apps/api`, `apps/admin`, `packages/*`).
  - Configure TypeScript `tsconfig.json` base, ESLint, Prettier, and Tailwind CSS design tokens.
  - Setup Docker Compose with PostgreSQL 16, Redis 7, and S3-compatible LocalStack.
  - Implement Environment Variable Zod schema validator (`packages/config`).
- **Acceptance Criteria:** Monorepo builds cleanly; Docker environment starts PostgreSQL and Redis; shared config packages resolve properly.

---

### Phase 1: Core Identity, Authentication & User Management
- **Objective:** Implement user registration, email verification, password reset, JWT/Session authentication, and user profile management.
- **Dependencies:** Phase 0.
- **Tasks:**
  - Database migrations for `users`, `auth_identities`, `sessions`.
  - Implement `IdentityService` with Argon2id password hashing and JWT access/refresh token generation.
  - Build Auth API endpoints (`/api/v1/auth/*`) with rate limiting guards.
  - Build Auth UI screens (Login, Register, Forgot Password, Profile Settings).
- **Acceptance Criteria:** User can register, verify email, log in, manage profile, and receive valid JWT tokens. Unit & integration tests passing.

---

### Phase 2: Workspaces, Multi-Tenancy & RBAC Engine
- **Objective:** Implement tenant workspace isolation, workspace types, membership management, invitation flows, and RBAC permission guards.
- **Dependencies:** Phase 1.
- **Tasks:**
  - Database migrations for `workspaces`, `workspace_memberships`, `roles`, `permissions`, `role_permissions`.
  - Implement `TenantContextMiddleware` and `TenantAuthorizationGuard`.
  - Build Workspace API (`/api/v1/workspaces/*`) and Member Invitation flow.
  - Build Workspace Switcher & Member Management UI in dashboard.
- **Acceptance Criteria:** User can create workspaces, invite team members, assign roles, switch active workspaces. Cross-tenant access denial integration tests passing.

---

### Phase 3: Card Aggregate, Card Builder & Revision Engine
- **Objective:** Build digital card data aggregate, section schema model, builder UI editor, draft/published revision control.
- **Dependencies:** Phase 2.
- **Tasks:**
  - Database migrations for `cards`, `card_revisions`, `card_sections`, `templates`.
  - Seed system template schemas (Corporate, Minimalist, Creative, Executive).
  - Implement `CardsService` for section CRUD, revision snapshotting, and publishing workflow.
  - Build Drag-and-Drop Card Builder UI with real-time mobile preview.
- **Acceptance Criteria:** User can build cards, reorder sections, customize themes, save drafts, and publish revisions.

---

### Phase 4: Public Card Engine & URL Identity Subsystem
- **Objective:** Implement immutable Public IDs, vanity alias allocation algorithm, canonical URLs, and sanitized public card SSR rendering.
- **Dependencies:** Phase 3.
- **Tasks:**
  - Database migrations for `aliases`.
  - Implement atomic vanity alias allocation algorithm with path normalization and reserved slug checks.
  - Build Public Profile API (`GET /api/v1/public/cards/*`) with server-side visibility policy filter.
  - Build Next.js Mobile-First Public Card rendering pages with Open Graph SEO metadata and vCard download button.
- **Acceptance Criteria:** `/c/:publicId` and `/:alias` resolve instantly; private fields are filtered out; vCard downloads cleanly.

---

### Phase 5: Dynamic QR Code & NFC Subsystem
- **Objective:** Implement dynamic QR code vector generation, custom styling, NFC device mapping, and physical tap routing.
- **Dependencies:** Phase 4.
- **Tasks:**
  - Database migrations for `nfc_devices`, `qr_codes`.
  - Build QR generation service (PNG/SVG export, Level H error correction, logo overlay).
  - Build NFC device claiming, binding, tap counter API (`GET /nfc/:deviceUid`).
  - Build QR Download & NFC Management UI in dashboard.
- **Acceptance Criteria:** High-res QR codes export in PNG/SVG; NFC tap routes to canonical card URL and increments counter.

---

### Phase 6: Leads Capture & CRM Lite Subsystem
- **Objective:** Build public lead capture forms, lead collection pipeline, lead status state machine, notes, and CSV export.
- **Dependencies:** Phase 5.
- **Tasks:**
  - Database migrations for `leads`, `lead_forms`, `lead_activities`.
  - Build Lead Capture API (`POST /api/v1/public/cards/:id/leads`) with bot protection & honeypot validation.
  - Build CRM Lite Dashboard UI (Lead pipeline grid, status updates, notes, CSV export).
- **Acceptance Criteria:** Visitors can submit leads on public card; card owner receives real-time lead alert; leads manage cleanly in CRM grid.

---

### Phase 7: Asynchronous Analytics Engine
- **Objective:** Implement decoupled async analytics event queue, background rollup worker, and dashboard reporting APIs.
- **Dependencies:** Phase 6.
- **Tasks:**
  - Database migrations for `analytics_events` (partitioned) and `daily_analytics_aggregates`.
  - Build lightweight beacon endpoint (`/api/v1/public/analytics/event`) pushing to Redis queue.
  - Build BullMQ analytics rollup worker for IP hashing and daily aggregate increments.
  - Build Analytics Dashboard UI (Views, Clicks, Scans, Taps, Geo/Device charts).
- **Acceptance Criteria:** Analytics events record asynchronously without blocking public rendering; dashboard displays aggregate charts.

---

### Phase 8: Organization, Departments & Employee Onboarding
- **Objective:** Implement corporate organization tree, departments, teams, employee bulk CSV provisioning, and employee offboarding.
- **Dependencies:** Phase 7.
- **Tasks:**
  - Database migrations for `departments`, `teams`.
  - Build Bulk Employee CSV Import service & background worker.
  - Implement HR brand locking rules and employee offboarding workflow.
  - Build Department & Team Management UI.
- **Acceptance Criteria:** HR admin can upload CSV to provision 50 employee cards; corporate branding is locked; offboarded employee cards archive properly.

---

### Phase 9: Plans, Entitlements & Razorpay Billing Engine
- **Objective:** Implement configuration-driven entitlement engine, commercial plan matrix, Razorpay billing integration, webhooks, and subscription state machine.
- **Dependencies:** Phase 8.
- **Tasks:**
  - Database migrations for `plans`, `subscriptions`, `invoices`, `billing_webhook_deliveries`.
  - Implement `IBillingProvider` and `RazorpayAdapter`.
  - Build Entitlement Engine (`entitlementService.canAccessFeature(...)`) with Redis resolution caching.
  - Build Razorpay Webhook Handler with HMAC signature verification & idempotency.
  - Build Billing Dashboard UI (Plan selection, Razorpay Checkout Modal, Invoices).
- **Acceptance Criteria:** User can upgrade plan via Razorpay; webhooks update subscription status idempotently; feature entitlements unlock instantly.

---

### Phase 10: Appointments & Networking Subsystems
- **Objective:** Implement native appointment booking engine, availability schedules, time-slot generation, and explicit 2-way card connection swap.
- **Dependencies:** Phase 9.
- **Tasks:**
  - Database migrations for `appointment_types`, `availability_schedules`, `appointments`, `user_connections`.
  - Build real-time time-slot generator and booking submit API with `.ics` calendar generation.
  - Build 2-way contact exchange handshake flow.
  - Build Appointments & Networking UI.
- **Acceptance Criteria:** Visitors can view available slots and book appointments; card owners receive `.ics` email alerts; networking connection swap works mutually.

---

### Phase 11: Custom Domains & White-Label Subsystem
- **Objective:** Implement CNAME custom domain routing, automated SSL provisioning worker, custom brand styling, and custom email domains.
- **Dependencies:** Phase 10.
- **Tasks:**
  - Database migrations for `custom_domains`.
  - Build Next.js Edge Middleware for custom hostname routing.
  - Build Domain Verification DNS TXT checker worker.
  - Build White-Label UI Settings (Favicon upload, brand neutral toggle, custom CSS tokens).
- **Acceptance Criteria:** Custom CNAME `card.acme.com` routes correctly; DNS TXT verification worker activates domain; platform branding is hidden when enabled.

---

### Phase 12: Agency & Reseller Platform
- **Objective:** Implement partner agency workspaces, sub-client workspace creation, delegated access control, and commission tracking.
- **Dependencies:** Phase 11.
- **Tasks:**
  - Database migrations for `reseller_accounts`, `reseller_clients`, `commissions`.
  - Build Reseller Portal APIs & Delegated Access impersonation tokens.
  - Build Partner Portal UI (Client management, seat quota allocation, commission dashboard).
- **Acceptance Criteria:** Agency can provision client sub-workspaces, switch into client dashboard with auditable delegated tokens, and track commission share.

---

### Phase 13: Platform Admin Dashboard & Observability
- **Objective:** Build super-admin platform console, tenant management, global template editor, abuse suspension tools, and observability integration.
- **Dependencies:** Phase 12.
- **Tasks:**
  - Build `apps/admin` application.
  - Build Admin APIs for global user/workspace lookup, card suspension, plan configuration, and audit log inspection.
  - Setup Pino JSON logging with correlation IDs, Prometheus `/metrics` endpoint, and Sentry error tracking.
- **Acceptance Criteria:** Super-admins can suspend abusive cards, monitor platform metrics, and inspect tenant audit logs.

---

### Phase 14: Final System Verification, Security Audit & Production Release
- **Objective:** Execute full automated test suite, security denial tests, E2E Playwright tests, static analysis, and verify production deployment artifacts.
- **Dependencies:** Phase 13.
- **Tasks:**
  - Execute full unit & integration test suite (`npm test`).
  - Execute cross-tenant security denial tests & billing idempotency tests.
  - Execute E2E Playwright test suite (`npm run test:e2e`).
  - Build production Docker containers and verify Terraform HCL manifests.
  - Generate final Requirement Traceability Matrix report.
- **Acceptance Criteria:** 100% of planned functional and architectural requirements verified; 0 failing tests; zero lint/type errors.
