# 34 — AI Agent & Developer Implementation Rules

**Document Version:** 1.0  
**Status:** Approved Engineering Contract  
**Scope:** Strict Code Discipline, Mandatory Architectural Guardrails & Prompt 2 Execution Contract  

---

## 0. MANDATORY CONTRACT FOR PROMPT 2 EXECUTION

This document defines the strict, non-negotiable development rules governing AI coding agents (including Antigravity) and human developers executing **Prompt 2 (Full Production Implementation)**.

---

## 1. Non-Negotiable Core Rules

1. **NO MVP / NO HALF-BAKED IMPLEMENTATIONS:** You MUST implement the complete approved production product across all domains. You MUST NOT stop after building a demo, scaffold, partial auth, or basic card generator.
2. **NO PLACEHOLDER UI / FAKE BUTTONS:** Every UI button, form input, navigation item, and modal must be fully wired to backend APIs and domain services.
3. **NO HARDCODED MOCKS IN PRODUCTION CODE:** Production controllers and services must query real PostgreSQL repositories, Redis queues, and S3 interfaces. Permanent mock fallbacks in application code are strictly forbidden.
4. **NEVER BYPASS TENANT ISOLATION:** Every database query for tenant-owned entities MUST enforce `WHERE workspace_id = :workspaceId`. Never write cross-tenant queries without explicit admin context.
5. **NEVER HARDCODE PLAN NAMES IN BUSINESS LOGIC:** Always evaluate feature availability through the Entitlement Engine (`entitlementService.canAccessFeature(...)`). Never write `if (plan === 'PRO')`.
6. **NEVER USE DISPLAY NAME / SLUG AS PERMANENT IDENTITY:** Resource identity is the immutable `public_id` (e.g. `7Kx9mP4QaZ8Vt2N6`) or internal `UUIDv7`. Slugs are mutable vanity pointers.
7. **NEVER EXPOSE PRIVATE CARD FIELDS:** Public profile APIs (`/api/v1/public/cards/*`) MUST execute server-side filtering of `PRIVATE` and `HIDDEN` fields. Never rely on frontend CSS hiding.
8. **NEVER DECOUPLE RAZORPAY SPECS INTO DOMAIN SERVICES:** All billing logic MUST consume the provider-agnostic `IBillingProvider` interface. Direct calls to Razorpay SDK inside core card or workspace domain modules are prohibited.
9. **ANALYTICS MUST BE ASYNCHRONOUS:** Public card rendering requests MUST NOT execute synchronous analytics database inserts. Analytics events MUST be pushed to Redis queues.
10. **DATABASE CONSTRAINTS ARE AUTHORITATIVE:** Always enforce uniqueness constraints at the PostgreSQL database level (`UNIQUE(hostname, path)`). Never rely solely on application-level pre-checks.

---

## 2. Code Quality & Verification Requirements

- **Type Safety:** TypeScript `strict` mode is enabled. The use of `any` is strictly prohibited unless explicitly typing external un-typed third-party payloads.
- **Linting & Verification:** Code must compile cleanly with `tsc --noEmit` and pass ESLint without warnings.
- **Automated Tests:** Every module MUST include unit tests and at least one cross-tenant security denial test.
- **Error Handling:** Use standardized machine-readable error DTOs (`{ code, message, requestId, details }`). Never swallow exceptions silently or suppress errors.
