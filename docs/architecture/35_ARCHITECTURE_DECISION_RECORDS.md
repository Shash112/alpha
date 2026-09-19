# 35 — Architecture Decision Records (ADRs)

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Key Architecture Decision Records (ADRs 001 - 010)  

---

## ADR-001: TypeScript Monorepo & NestJS Modular Monolith
- **Status:** APPROVED / LOCKED
- **Context:** The team evaluated microservices vs modular monolith for Alpha SaaS.
- **Decision:** Use a TypeScript monorepo with NestJS backend modular monolith (`apps/api`) and Next.js frontend (`apps/web`).
- **Rationale:** Microservices add significant operational overhead and deployment complexity. A modular monolith provides clear domain boundaries while keeping transactional consistency and CI/CD simple.

---

## ADR-002: Shared Database, Shared Schema Multi-Tenancy
- **Status:** APPROVED / LOCKED
- **Context:** Deciding between database-per-tenant, schema-per-tenant, or shared-schema.
- **Decision:** Adopt Shared PostgreSQL Database with Shared Schema, enforcing workspace isolation via `workspace_id` columns, repository scoping, and automated tests.
- **Rationale:** Supports thousands of SMB/Personal tenants cost-effectively without managing thousands of database connections or migration overheads.

---

## ADR-003: Three-Tier Card Identifier & Canonical URL Architecture
- **Status:** APPROVED / LOCKED
- **Context:** Card identity vs vanity URLs and physical printed QR durability.
- **Decision:** Separate internal DB ID (UUIDv7), immutable Public ID (`7Kx9mP4QaZ8Vt2N6`), and mutable Vanity Aliases (`/shashank`).
- **Rationale:** Ensures that changing vanity URLs never breaks printed physical QR codes or programmed NFC tags.

---

## ADR-004: Configuration-Driven Entitlement Engine
- **Status:** APPROVED / LOCKED
- **Context:** Checking feature access across tier plans (Free, Pro, Team, Org, Enterprise).
- **Decision:** Implement a configuration-driven entitlement engine. Business logic must check `canAccessFeature()` or `checkUsageLimit()`, never `if (plan === 'PRO')`.
- **Rationale:** Allows dynamic plan re-packaging, add-ons, grandfathering, and custom enterprise grants without changing application source code.

---

## ADR-005: Provider-Agnostic Billing Abstraction Layer
- **Status:** APPROVED / LOCKED
- **Context:** Integration with Razorpay as initial payment gateway for India.
- **Decision:** Isolate Razorpay behind `IBillingProvider` interface.
- **Rationale:** Prevents vendor lock-in and enables future addition of Stripe, Cashfree, or PayPal adapters without altering SaaS subscription domain logic.

---

## ADR-006: Asynchronous Decoupled Analytics Pipeline
- **Status:** APPROVED / LOCKED
- **Context:** Tracking card views, clicks, QR scans, and NFC taps.
- **Decision:** Push analytics events to Redis queues for async batch worker processing.
- **Rationale:** Guarantees public card page rendering loads in sub-200ms unblocked by analytics DB writes.

---

## ADR-007: Hardware-Decoupled Software NFC Architecture
- **Status:** APPROVED / LOCKED
- **Context:** Supporting physical NFC products.
- **Decision:** Manage NFC devices as software-mapped identity objects (`NFCDevice`) bound to card public IDs via NDEF URL redirect pointers.
- **Rationale:** Enables instant re-binding of physical NFC cards to different employees without re-printing hardware.

---

## ADR-008: Schema-Driven Card Rendering & Server-Side Privacy Filtering
- **Status:** APPROVED / LOCKED
- **Context:** Card editor security and field visibility rules.
- **Decision:** Card rendering is schema-driven. Public APIs strip `PRIVATE` and `HIDDEN` fields server-side before responding.
- **Rationale:** Eliminates XSS vulnerabilities from raw user HTML and prevents client-side data leakage.

---

## ADR-009: PostgreSQL UUIDv7 Primary Key Standard
- **Status:** APPROVED / LOCKED
- **Context:** Selecting primary key generation strategy for database tables.
- **Decision:** Standardize on UUIDv7 for all database table primary keys.
- **Rationale:** Provides time-ordered sequential sortability for B-tree index efficiency while preserving global uniqueness across distributed systems.

---

## ADR-010: India-First Localized Defaults & Razorpay Integration
- **Status:** APPROVED / LOCKED
- **Context:** Market focus and payment preferences.
- **Decision:** Default currency INR (paise), Asia/Kolkata timezone, native Razorpay UPI/RuPay support, and B2B GST compliance.
- **Rationale:** Establishes Alpha as the premier Digital Professional Identity platform in India while maintaining global multi-currency extensibility.
