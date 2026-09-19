# ALPHA — ANTIGRAVITY MASTER DEVELOPMENT INSTRUCTIONS

**Project:** Alpha
**Product:** Digital Professional Identity / Digital Visiting Card SaaS
**Instruction File:** Repository-wide AI Agent Contract
**Version:** 1.0
**Status:** Mandatory / Persistent

---

## 0. PURPOSE

This file is the persistent instruction contract for every AI coding/development agent working on Alpha, including Antigravity and any future agents or sessions.

The agent MUST read this file before doing any work in the repository and MUST follow it across sessions.

The objective is to deliver the complete, production-grade Alpha product using a strict **two-prompt operating model**:

- **PROMPT 1 — ARCHITECTURE + IMPLEMENTATION MASTER PLAN:** inspect the source-of-truth requirements, resolve all material ambiguities with the human, and produce a complete implementation blueprint before coding.
- **PROMPT 2 — FULL IMPLEMENTATION:** use the approved blueprint and source-of-truth documents to implement the entire approved product end-to-end. The agent must not stop after an MVP, demo, scaffold, or partial phase.

The goal is not a throwaway MVP. The goal is the approved end-production product.

---

# 1. SOURCE OF TRUTH HIERARCHY

The repository will contain two governing product/architecture documents supplied by the project owner.

Expected source files:

1. `Digital_Visiting_Card_SaaS_Full_Development_Requirements.md`
2. `Alpha_SaaS_Architecture_Blueprint_v1.0.md`
3. This file: `AGENTS.md`

### Authority order

When interpreting requirements:

1. The explicit human decision made in the current project conversation/session is highest authority.
2. `Alpha_SaaS_Architecture_Blueprint_v1.0.md` governs technical architecture and resolves technical interpretation.
3. `Digital_Visiting_Card_SaaS_Full_Development_Requirements.md` governs product scope and functional requirements.
4. This `AGENTS.md` governs AI-agent behavior, workflow, implementation discipline, and change control.
5. Existing repository code is evidence of current implementation, NOT authority over architecture when it conflicts with the approved documents.
6. General industry knowledge may be used only for implementation details that are not specified by the source documents and do not change product behavior or architecture.

### Critical rule

The agent MUST NOT silently reinterpret, remove, simplify, or replace a source-of-truth requirement.

When two source documents appear inconsistent:

- identify the conflict;
- determine whether the architecture document already resolves it;
- if it is a business/product decision, ask the human during Prompt 1;
- if it is a pure technical implementation detail, choose the solution consistent with the architecture and document the decision.

Never silently choose a materially different product behavior.

---

# 2. PROJECT VISION

Alpha is a production-grade, India-first, globally extensible, multi-tenant SaaS platform that begins as a digital visiting card and expands into a professional digital identity, business profile, lead capture, lightweight CRM, QR/NFC sharing, networking, appointments, team/organization management, analytics, reseller, white-label, and enterprise platform.

The digital card is the primary entry point, NOT the complete product definition.

Core product promise:

> Create your professional identity once, share it everywhere, and turn introductions into contacts, conversations, and leads.

---

# 3. NON-NEGOTIABLE ARCHITECTURE

The following decisions are LOCKED unless the human explicitly approves a change.

## Stack

- Next.js + TypeScript for web frontend.
- NestJS + TypeScript for backend API.
- PostgreSQL as primary transactional database.
- Redis for cache/queues/background jobs.
- S3-compatible object storage.
- Cloudflare or equivalent for CDN/WAF/DNS/TLS/edge concerns.
- AWS-compatible production deployment.
- Docker.
- Infrastructure-as-Code.

## Application architecture

- TypeScript monorepo.
- Modular monolith backend.
- REST APIs.
- API version prefix: `/api/v1`.
- OpenAPI documentation.
- Shared packages for reusable contracts and infrastructure concerns.
- No premature microservices.
- Future extraction only when operational evidence justifies it.

## Multi-tenancy

- Shared PostgreSQL database.
- Shared schema.
- Workspace/tenant isolation.
- Tenant isolation enforced at request context, membership authorization, application service, repository/data-access, database integrity, and automated security-test layers.

## SaaS model

```text
User
  ↓
Membership
  ↓
Workspace
  ↓
Subscription / Plan
  ↓
Entitlements
  ↓
Resources
  ↓
Usage
```

- User is an authenticated human identity.
- Workspace is the customer environment and tenant boundary.
- A user may belong to multiple workspaces.
- A workspace may contain multiple cards.
- Account/workspace type is separate from commercial plan.
- Billing belongs to the workspace.

## Workspace types

- Personal
- Team
- Business / Organization
- Enterprise
- Agency / Reseller

## Plan families

- Free Personal
- Personal Pro
- Team
- Business
- Enterprise
- Agency / Reseller

Prices MUST be configuration-driven and MUST NOT be hardcoded in application logic.

## Authentication

- Email/password.
- Email verification.
- Google OAuth.
- Password reset.
- Secure session management.
- Future-compatible with magic links, passkeys, OIDC, SAML, SCIM.

## Billing

- Razorpay as initial payment provider.
- Mandatory provider abstraction.
- Monthly and annual billing.
- Flat, per-seat, base+seat, add-on, enterprise custom pricing, and future usage-based billing support.
- Trials.
- Upgrades.
- Downgrades.
- Cancellations.
- Coupons/promotions.
- Grandfathered pricing.
- Idempotent payment webhook handling.

## Card identity

A card is a first-class public identity resource.

Each card has:

1. Internal database ID: UUIDv7 or approved equivalent.
2. Immutable public ID: globally unique public identifier.
3. Optional human-readable vanity aliases.

Canonical URL pattern:

```text
https://alpha.com/c/{public_id}
```

Vanity URLs are aliases, not resource identity.

URL uniqueness is enforced by:

```text
(hostname, normalized_path)
```

Database uniqueness is authoritative.

Never use display name, email, slug, or sequential ID as the permanent resource identity.

QR and NFC should reference stable card identity/destination behavior so printed physical references remain durable.

## Card system

- Multiple cards per workspace.
- Multiple cards per user through their workspace relationships.
- Cards can represent personal, business, consulting, event, campaign, role-specific, or other supported identities.
- Card-specific analytics.
- Card-specific URL.
- Draft/published/unpublished/archived/deleted lifecycle.
- Platform suspension as an independent trust state.

## Card rendering

The builder and renderer MUST be configuration/schema driven.

```text
Card Data
 ↓
Card Revision
 ↓
Template Version
 ↓
Section Configuration
 ↓
Validation / Policy Filtering
 ↓
Renderer
 ↓
Public HTML
```

Public rendering MUST use a publishable/sanitized projection and MUST never expose raw private database records.

## Templates

One template model MUST support:

- Platform templates.
- Workspace templates.
- Team templates.
- Private/custom templates.

Published templates are versioned. Existing customer designs must not be broken by template updates.

## CRM

CRM scope is lightweight:

- Contacts.
- Leads.
- Tags.
- Notes.
- Activities.
- Assignment.
- Status.
- Import/export.
- Search/filtering.

Do NOT turn Alpha into a general-purpose enterprise CRM without an explicit architecture revision.

## Networking

Connection sharing must be explicit and privacy-aware.

Scanning a card does NOT automatically expose information that has not been deliberately shared.

## NFC

Software-only initially.

The NFC architecture must support future physical commerce/order management without making hardware manufacturing part of the core platform.

## White-label

White-label must be entitlement-driven and may cover:

- Public cards.
- Login.
- Dashboard.
- Emails.
- Logo.
- Favicon.
- Colors.
- Footer branding.
- Custom domain.

## Resellers

Reseller/agency is a first-class partner environment:

```text
Platform
  ↓
Reseller Workspace
  ↓
Client Workspaces
```

Delegated access is explicit and auditable.

## Analytics

Analytics are asynchronous and decoupled from public-card rendering.

```text
Event
 ↓
Lightweight capture
 ↓
Queue
 ↓
Analytics event store
 ↓
Aggregation
 ↓
Analytics API
 ↓
Dashboard
```

PostgreSQL may be used initially with an abstraction for future dedicated analytics storage.

## Appointments

Native lightweight booking system is required.

Architecture must be ready for Google Calendar and Microsoft Outlook integrations.

---

# 4. THE TWO-PROMPT OPERATING MODEL

This is mandatory.

## PROMPT 1 — ARCHITECTURE + FULL IMPLEMENTATION PLAN

The first execution prompt will instruct the agent to plan the complete production product.

The agent MUST NOT start product implementation during Prompt 1 unless the human explicitly asks for a small supporting artifact necessary for planning.

Prompt 1 responsibilities:

1. Inspect the repository.
2. Read this `AGENTS.md`.
3. Read both source-of-truth Markdown documents in full.
4. Analyze all existing code, if any.
5. Identify conflicts, missing technical decisions, hidden dependencies, external integrations, and implementation risks.
6. Build the complete target architecture.
7. Build the complete implementation plan for the entire product.
8. Resolve all material ambiguities with the human.
9. Produce detailed development specifications inside the repository.
10. Validate that the complete plan covers every source-of-truth requirement.
11. Stop after planning and wait for the human's explicit Prompt 2 instruction.

### Prompt 1 MUST NOT

- Build an MVP instead of the complete approved product.
- Reduce scope because it appears large.
- Start coding because the architecture seems obvious.
- Make unapproved product decisions silently.
- Ask dozens of tiny questions independently.
- Ask questions whose answers are already established in the source documents or this instruction file.

### Prompt 1 clarification protocol

When questions are needed, group them into one concise decision list.

Only ask questions that materially affect:

- product behavior;
- pricing/commercial behavior;
- data ownership;
- security/privacy;
- user experience;
- external provider behavior;
- irreversibly expensive architecture choices.

For technical implementation details that do not materially change product behavior, the agent should make a senior-engineering decision and document it rather than interrupting the human.

### Prompt 1 required planning deliverables

The agent should create and maintain, at minimum:

```text
/docs/
  /architecture/
    SYSTEM_ARCHITECTURE.md
    DOMAIN_ARCHITECTURE.md
    TENANCY_ARCHITECTURE.md
    SECURITY_ARCHITECTURE.md
    INFRASTRUCTURE_ARCHITECTURE.md
    INTEGRATION_ARCHITECTURE.md

  /database/
    DATABASE_DESIGN.md
    ENTITY_MODEL.md
    INDEXING_AND_CONSTRAINTS.md
    MIGRATION_STRATEGY.md

  /api/
    API_SPECIFICATION.md
    API_CONVENTIONS.md
    ERROR_CATALOG.md
    WEBHOOK_SPECIFICATION.md

  /saas/
    ACCOUNT_MODEL.md
    WORKSPACE_MODEL.md
    RBAC_MATRIX.md
    PLANS_PRICING_ENTITLEMENTS.md
    BILLING_SPECIFICATION.md
    USAGE_METERING.md

  /product/
    FEATURE_CATALOG.md
    USER_JOURNEYS.md
    SCREEN_MAP.md
    UX_SPECIFICATION.md
    PUBLIC_CARD_SPECIFICATION.md

  /analytics/
    EVENT_SPECIFICATION.md
    METRICS_SPECIFICATION.md

  /operations/
    DEPLOYMENT_ARCHITECTURE.md
    CI_CD.md
    OBSERVABILITY.md
    BACKUP_AND_DR.md
    RUNBOOKS.md

  /testing/
    TEST_STRATEGY.md
    ACCEPTANCE_MATRIX.md

  /implementation/
    MASTER_IMPLEMENTATION_PLAN.md
    IMPLEMENTATION_TRACEABILITY_MATRIX.md
    DECISION_LOG.md
    OPEN_DECISIONS.md
```

The exact filenames may be consolidated if that improves repository clarity, but the information MUST exist.

### Requirements traceability

Prompt 1 MUST build a traceability matrix:

```text
Requirement
 → Domain
 → Database model
 → API
 → UI
 → Permission
 → Entitlement
 → Analytics
 → Audit
 → Test
 → Implementation task
 → Acceptance criteria
```

Every in-scope requirement must have a destination in the plan.

No requirement may disappear because it is inconvenient.

---

# 5. PROMPT 2 — FULL PRODUCTION IMPLEMENTATION

Prompt 2 is the implementation command.

When Prompt 2 is given, the agent MUST implement the **entire approved production product**, not only the first phase.

The agent must:

1. Read `AGENTS.md` again.
2. Read the two source-of-truth documents again as needed.
3. Read the approved planning documents generated during Prompt 1.
4. Verify the decision log and ensure no material questions remain open.
5. Implement the full system across all approved domains.
6. Continue until all planned in-scope functionality is implemented.
7. Run the required tests, validation, builds, and static checks.
8. Fix failures rather than stopping at the first successful compilation.
9. Update documentation to match the actual implementation.
10. Produce a final implementation audit against the traceability matrix.

### Prompt 2 MUST NOT

- Stop after building a foundation.
- Stop after implementing authentication/card creation.
- Deliver only an MVP.
- Leave placeholder pages for approved features.
- Leave fake buttons that do nothing.
- Replace production integrations with permanent mocks.
- Mark TODOs as completed functionality.
- Skip security/tenant/billing tests.
- Claim production readiness if critical acceptance criteria fail.
- Rewrite the approved architecture without an ADR and explicit human approval.

### If the agent encounters an implementation uncertainty

The architecture and planning documents should already have resolved material product decisions.

For non-material technical decisions, follow the architecture and make the most robust implementation choice.

For a genuine blocking business decision not covered by the approved plan:

1. Record it in `docs/implementation/OPEN_DECISIONS.md`.
2. Do not invent a business rule.
3. Continue all unrelated work.
4. Clearly report the blocker at the end.

The agent must not silently change a business rule.

---

# 6. COMPLETE PRODUCT DELIVERY EXPECTATION

The final system is expected to cover all approved product domains, including at minimum:

## Platform

- Authentication.
- Users.
- Workspaces.
- Memberships.
- RBAC.
- Tenant isolation.
- Platform configuration.
- Feature flags.

## Digital identity

- Cards.
- Card revisions.
- Card builder.
- Templates.
- Media.
- Public profiles.
- Vanity aliases.
- Canonical public IDs.
- QR.
- NFC.
- Contact/vCard functionality.

## Business growth

- Leads.
- Contacts.
- CRM Lite.
- Analytics.
- Notifications.
- Networking.
- Events.
- Connections.
- Appointments.

## Organizations

- Teams.
- Departments.
- Company profiles.
- Employee provisioning.
- Employee lifecycle.
- Offboarding.
- Organization analytics.

## SaaS monetization

- Plans.
- Prices.
- Entitlements.
- Usage.
- Subscriptions.
- Seats.
- Add-ons.
- Coupons/promotions.
- Trials.
- Upgrade.
- Downgrade.
- Cancellation.
- Refunds.
- Razorpay.
- Billing reconciliation.

## Enterprise / partner

- Custom domains.
- White-label.
- Resellers.
- Client workspaces.
- Delegated access.
- Commission tracking.
- Enterprise security architecture.
- SSO-ready architecture.
- SCIM-ready architecture.

## Platform administration

- Admin dashboard.
- User/workspace management.
- Templates.
- Plans.
- Pricing.
- Entitlements.
- Billing.
- Resellers.
- Domains.
- NFC.
- Abuse/trust tools.
- Audit logs.
- Support tooling.
- Business metrics.

## Marketing/public layer

- Marketing website.
- Pricing pages.
- Feature pages.
- Industry pages.
- FAQ.
- Legal pages.
- SEO.
- Social sharing metadata.

---

# 7. DATA ARCHITECTURE RULES

## Identity

Never use a mutable business field as a permanent primary identifier.

Required pattern:

```text
Entity
 ├── internal_id
 ├── public_id where externally referenced
 └── human-readable aliases where applicable
```

## Tenant ownership

Every tenant-owned resource must have a resolvable workspace ownership path.

Never trust a client-supplied workspace ID as authorization.

## Database constraints

Use the database as the authoritative integrity boundary for:

- uniqueness;
- foreign keys;
- required relationships;
- state constraints where appropriate;
- idempotency keys where appropriate;
- billing provider event identity;
- public URL uniqueness.

## Soft delete

Do not blindly soft-delete every table.

Use explicit lifecycle and retention rules per domain.

## Migrations

All schema changes must use versioned migrations.

Never make undocumented destructive schema changes.

---

# 8. API RULES

API base:

```text
/api/v1
```

Every endpoint MUST define:

- authentication requirements;
- permission requirements;
- workspace/resource scope;
- request schema;
- response schema;
- validation;
- pagination behavior where applicable;
- error codes;
- idempotency behavior where applicable;
- audit behavior where applicable;
- analytics/event behavior where applicable.

Controllers must not contain domain business rules.

Business rules belong in application/domain services.

Repositories must not make authorization decisions.

Public APIs must not expose private tenant data.

---

# 9. ERROR HANDLING

Use a consistent machine-readable error format, for example:

```json
{
  "code": "CARD_SLUG_ALREADY_EXISTS",
  "message": "The selected URL is already in use.",
  "requestId": "...",
  "details": {}
}
```

Rules:

- Stable error codes.
- Human-safe messages.
- No stack traces in production responses.
- Request/correlation IDs.
- Errors are observable.
- Security-sensitive errors must not reveal unnecessary information.

---

# 10. AUTHORIZATION RULES

Every protected request follows:

```text
Request
 ↓
Authentication
 ↓
Workspace context
 ↓
Membership
 ↓
Role
 ↓
Permission
 ↓
Resource scope
 ↓
Policy checks
 ↓
Allow / Deny
```

Frontend visibility is NOT authorization.

A feature hidden in the UI is still protected unless the server enforces it.

All privileged actions must be auditable.

---

# 11. ENTITLEMENT RULES

Never write application logic like:

```text
if plan == "PRO"
```

Use:

```text
feature
 → entitlement
 → usage/limit
 → authorization
```

Entitlements must support:

- boolean features;
- numeric limits;
- workspace overrides;
- add-ons;
- promotions;
- grandfathered plans;
- controlled deprecation;
- server-side enforcement.

A new billable/resource-producing feature MUST define:

- plan availability;
- entitlement key;
- usage metric;
- limits;
- upgrade behavior;
- downgrade behavior;
- cancellation behavior;
- billing behavior if applicable.

---

# 12. BILLING RULES

Razorpay is an adapter, not the business model.

Application code should depend on a billing abstraction.

Webhook processing MUST be:

- signature verified;
- idempotent;
- logged;
- replay-safe;
- auditable.

Subscription changes must not rely solely on browser-side payment success.

Billing state should be reconciled from provider events and internal records.

Never grant permanent paid entitlements solely because the frontend displayed a success state.

---

# 13. PUBLIC CARD RULES

Public cards are high-priority traffic.

The public card must:

- load fast;
- expose only explicitly public fields;
- remain usable without dashboard authentication;
- gracefully handle unpublished/suspended/deleted states;
- support canonical URLs;
- support vanity aliases;
- support QR/NFC flows;
- collect analytics asynchronously;
- support Open Graph/social preview metadata;
- remain mobile-first and accessible.

Do not make expensive synchronous database/analytics processing part of normal public rendering.

---

# 14. URL / IDENTITY RULES

### Canonical

```text
alpha.com/c/{public_id}
```

### Vanity

```text
alpha.com/{vanity_path}
```

### Custom domain

```text
customer-domain.com/{path}
```

Uniqueness:

```text
(hostname, normalized_path)
```

Normalization must be deterministic.

Canonical public ID must be immutable.

Vanity aliases are changeable.

Historical aliases may redirect/resolve to the current card according to retention policy.

Do not immediately release old aliases when doing so creates identity, QR/NFC, impersonation, or trust risk.

---

# 15. BACKGROUND JOB RULES

Use background jobs for:

- email;
- analytics processing;
- image processing;
- QR generation when expensive;
- import/export;
- webhook delivery;
- subscription reconciliation;
- usage aggregation;
- cleanup/retention tasks.

Jobs must be:

- retryable;
- observable;
- idempotent where appropriate;
- dead-letter aware for repeatedly failing jobs.

---

# 16. SECURITY RULES

Security is implemented with the feature, not after the feature.

Mandatory baseline:

- TLS.
- Secure secret management.
- Environment separation.
- Least-privilege access.
- Secure password hashing.
- Session security.
- Secure headers.
- WAF/rate limiting.
- Input validation.
- Output encoding.
- File validation.
- Malware scanning strategy for uploads.
- Dependency vulnerability scanning.
- Audit logging.
- Backup/recovery.
- Cross-tenant security tests.
- IDOR/resource authorization tests.
- Privilege escalation tests.
- Webhook signature tests.
- XSS/SQLi/CSRF protections as applicable.

Never commit secrets.

Never log secrets, passwords, raw authentication tokens, or payment credentials.

---

# 17. PRIVACY RULES

Users control what is public.

Public card rendering must enforce field visibility server-side.

Minimize collection of personal data.

Provide appropriate:

- export;
- deletion;
- retention;
- consent;
- privacy controls.

Do not invent privacy/legal behavior where requirements are silent; flag material policy decisions during Prompt 1.

---

# 18. OBSERVABILITY RULES

Implement from the start:

- structured logs;
- request/correlation IDs;
- error tracking;
- health checks;
- application metrics;
- database metrics;
- Redis/queue metrics;
- billing metrics;
- public-card performance metrics;
- background-job monitoring.

Critical failures should be observable and actionable.

---

# 19. TESTING RULES

Every major domain requires tests.

## Unit

At minimum:

- business rules;
- permissions;
- entitlements;
- billing calculations;
- state transitions;
- slug normalization;
- public identity resolution;
- usage metering.

## Integration

At minimum:

- repositories;
- authentication;
- tenant isolation;
- payment webhooks;
- queues;
- file storage;
- domain resolution.

## E2E

Cover every critical end-to-end journey.

At minimum:

```text
signup
login
verify
workspace
card creation
publish
public card
save contact
lead
analytics
upgrade
team member
organization
QR
NFC
custom domain
reseller
cancellation/downgrade
```

## Security

At minimum:

- cross-tenant access denial;
- IDOR;
- privilege escalation;
- rate limiting;
- malicious file upload;
- webhook verification;
- XSS;
- SQL injection;
- CSRF where applicable.

A feature is not done because it compiles.

---

# 20. DEFINITION OF DONE

A feature is complete only when all relevant items are complete:

- data model;
- migration;
- repository/data access;
- domain/application service;
- authorization;
- entitlements;
- API;
- UI;
- validation;
- loading states;
- empty states;
- error states;
- audit events;
- analytics events;
- notifications if applicable;
- background jobs if applicable;
- tests;
- documentation;
- observability;
- security review;
- acceptance criteria.

No placeholder is considered complete functionality.

---

# 21. FRONTEND RULES

The web application must be:

- responsive;
- mobile-first where public interaction matters;
- accessible;
- consistent;
- typed;
- validated;
- resilient to loading/error/empty states.

Do not duplicate business logic across pages/components.

Use shared UI components and design primitives.

Public card rendering and authenticated dashboard experiences should remain architecturally distinct even if they share packages/components.

---

# 22. ADMIN UI RULES

Platform administration is a separate privileged application boundary.

Every sensitive admin operation must:

- require explicit authorization;
- produce an audit event;
- have appropriate confirmation for destructive actions;
- avoid exposing unnecessary tenant data.

Admin impersonation/delegated access, if implemented, must be explicit, time-aware where appropriate, and audited.

---

# 23. FILE / MEDIA RULES

All tenant uploads must be associated with ownership metadata.

Use controlled upload flows.

Validate:

- MIME type;
- extension;
- size;
- dimensions;
- storage path;
- authorization.

Never trust a filename from the client.

Do not expose private object-storage paths directly when a secure delivery mechanism is required.

---

# 24. CACHE RULES

Cache only data that is safe and appropriate to cache.

Cache keys must incorporate the relevant tenant/domain context for tenant-specific data.

Public data may be CDN/cache optimized only when invalidation behavior is defined.

Never create a cache that can leak one tenant's private data into another tenant's response.

---

# 25. CONFIGURATION RULES

Separate:

1. Environment configuration.
2. Platform configuration.
3. Tenant/workspace configuration.
4. Commercial configuration.
5. Feature flags.

Never hardcode:

- subscription prices;
- feature availability;
- tenant branding;
- payment credentials;
- environment secrets;
- customer-specific behavior.

---

# 26. DOCUMENTATION RULES

Documentation is part of implementation.

When code changes architecture, API behavior, schema, billing, or operational behavior, the relevant documentation MUST be updated in the same change.

The final implementation must remain traceable to the source requirements.

---

# 27. ARCHITECTURE CHANGE CONTROL

AI agents MUST NOT make silent architectural changes.

If a change affects:

- tenant boundaries;
- identity model;
- workspace model;
- billing ownership;
- entitlement semantics;
- public URL identity;
- security boundaries;
- domain boundaries;
- persistence model;
- external provider strategy;
- deployment model;
- public API contracts;

the agent must create or update an Architecture Decision Record (ADR) and obtain human approval when the change is material.

Routine implementation improvements that stay within the locked architecture do not need human approval.

---

# 28. AI AGENT BEHAVIOR RULES

The agent is expected to behave as a senior staff/principal engineer, not as an autocomplete tool.

### The agent MUST

- read before modifying;
- understand dependencies before editing;
- prefer existing approved abstractions;
- keep changes coherent;
- preserve type safety;
- preserve tenant isolation;
- test security boundaries;
- avoid duplication;
- explain material trade-offs in planning documents;
- maintain traceability;
- finish features rather than merely scaffolding them;
- fix failures before declaring success.

### The agent MUST NOT

- invent customer-specific forks;
- skip tests because a feature appears simple;
- put business logic in controllers/components;
- bypass service layers;
- trust client-provided authorization context;
- bypass entitlement checks;
- bypass billing state;
- expose private fields publicly;
- use hacks that weaken architecture;
- leave silent TODOs for approved functionality;
- declare success based only on build/compile status.

---

# 29. SESSION CONTINUITY

The agent MUST assume that a future session may not remember prior reasoning.

Therefore, durable decisions MUST live in repository documentation, not only in chat history.

At the beginning of every session, the agent should inspect:

1. `AGENTS.md`
2. source-of-truth requirements;
3. source-of-truth architecture;
4. current implementation plan;
5. decision log;
6. open decision/blocker list;
7. relevant source code and tests.

At the end of significant work, update the durable project state.

Recommended:

```text
/docs/implementation/PROJECT_STATE.md
/docs/implementation/DECISION_LOG.md
/docs/implementation/OPEN_DECISIONS.md
```

The state file should summarize:

- completed domains;
- incomplete domains;
- known failures;
- pending migrations;
- pending external configuration;
- architecture deviations;
- test status.

---

# 30. IMPLEMENTATION SEQUENCE

The final product is implemented through logical internal domains, but Prompt 2 must continue through the whole approved scope.

Recommended order:

```text
1. Repository + tooling
2. Infrastructure + environments
3. Database foundation
4. Identity + authentication
5. Workspace + memberships
6. RBAC + tenant isolation
7. Configuration + feature flags
8. Card identity + URL system
9. Card domain + revisions
10. Templates + builder
11. Media
12. Public card renderer
13. QR
14. NFC
15. Leads
16. Contacts / CRM Lite
17. Analytics
18. Notifications
19. Organizations / teams / departments
20. Events / networking
21. Appointments
22. Plans / prices / entitlements
23. Billing / Razorpay
24. Usage / add-ons / coupons
25. Custom domains
26. White-label
27. Reseller / agency
28. Admin platform
29. Marketing website
30. SEO / sharing
31. Security hardening
32. Observability / backups / DR
33. Full regression
34. Production-readiness audit
```

This ordering is for dependency management. It does NOT mean Prompt 2 can stop after any item.

---

# 31. EXTERNAL INTEGRATION RULE

External services must be abstracted behind internal interfaces where the architecture requires provider neutrality.

Examples:

```text
BillingProvider
 └── RazorpayAdapter

EmailProvider
 └── SelectedEmailAdapter

CalendarProvider
 ├── GoogleAdapter
 └── MicrosoftAdapter

StorageProvider
 └── S3Adapter
```

The domain/business layer should not be tightly coupled to provider-specific SDK objects.

---

# 32. PRODUCTION-READINESS RULE

The final output of Prompt 2 is not a demo.

Before declaring completion, the agent must perform a production-readiness audit covering:

### Architecture

- boundaries respected;
- no unauthorized architectural drift;
- no critical circular dependencies.

### Data

- migrations work;
- indexes exist;
- constraints exist;
- tenant isolation is proven by tests.

### Security

- authentication;
- authorization;
- tenant isolation;
- secure sessions;
- file security;
- webhook validation;
- rate limiting;
- abuse controls.

### Billing

- provider events;
- subscription state;
- idempotency;
- upgrades;
- downgrades;
- cancellations;
- refunds.

### Public card

- canonical URL;
- aliases;
- QR;
- NFC;
- performance;
- visibility;
- accessibility;
- SEO/social metadata.

### Operations

- logs;
- errors;
- metrics;
- health checks;
- backups;
- restoration procedure;
- deployment.

### Testing

- unit;
- integration;
- E2E;
- security;
- regression.

---

# 33. FINAL TRACEABILITY REQUIREMENT

At the end of Prompt 2, produce:

```text
/docs/implementation/FINAL_IMPLEMENTATION_AUDIT.md
```

It must map:

```text
Every approved requirement
        ↓
Actual implementation
        ↓
Relevant code/module
        ↓
Relevant database model
        ↓
Relevant API
        ↓
Relevant UI
        ↓
Relevant permission/entitlement
        ↓
Relevant tests
        ↓
Status
```

Allowed statuses:

- COMPLETE
- COMPLETE_WITH_CONFIG_REQUIRED
- BLOCKED_BY_EXTERNAL_CREDENTIAL
- BLOCKED_BY_APPROVED_PENDING_DECISION

Do NOT use "mostly complete", "almost complete", or equivalent vague language.

---

# 34. DEFINITION OF PROJECT COMPLETE

Alpha is considered complete only when:

1. All approved in-scope product domains are implemented.
2. All critical user journeys work end-to-end.
3. All source-of-truth requirements are traceable to implementation.
4. Tenant isolation is tested.
5. Server-side authorization is tested.
6. Billing is tested.
7. Public-card flows are tested.
8. Important background jobs are tested.
9. Production builds pass.
10. Documentation reflects the implementation.
11. No approved feature remains only as a placeholder.
12. No unresolved material architecture decision exists.
13. Any missing external credentials are explicitly identified rather than hidden.
14. The final implementation audit has been generated.

---

# 35. THE AGENT'S GOLDEN RULE

> **Do not optimize for finishing the next task. Optimize for delivering the approved Alpha system correctly.**

The agent must reason from the whole platform, not from the current screen or isolated feature.

Whenever implementing a feature, consider:

```text
Product
→ Domain
→ Tenant ownership
→ Identity
→ Database
→ API
→ Authorization
→ Entitlement
→ Billing
→ Usage
→ Analytics
→ Audit
→ Notifications
→ Security
→ Testing
→ Operations
```

If a relevant layer is required by the architecture, it is part of the feature.

---

# 36. HUMAN APPROVAL BOUNDARY

The agent may autonomously make technical implementation decisions that are consistent with the locked architecture.

The human must be consulted for material changes to:

- product scope;
- pricing/business rules;
- ownership semantics;
- privacy behavior;
- public identity behavior;
- tenant model;
- billing semantics;
- irreversible architecture changes;
- contractual/compliance decisions.

The agent should not ask for approval for ordinary coding details that can be resolved using the approved architecture.

---

# 37. INITIAL SESSION PROTOCOL

When the agent receives Prompt 1:

```text
READ
 ↓
UNDERSTAND
 ↓
AUDIT REPOSITORY
 ↓
AUDIT REQUIREMENTS
 ↓
AUDIT ARCHITECTURE
 ↓
IDENTIFY GAPS / CONFLICTS
 ↓
ASK MATERIAL HUMAN QUESTIONS
 ↓
RESOLVE DECISIONS
 ↓
CREATE COMPLETE PLAN
 ↓
TRACE EVERY REQUIREMENT
 ↓
STOP AND WAIT FOR PROMPT 2
```

When the agent receives Prompt 2:

```text
READ APPROVED PLAN
 ↓
IMPLEMENT EVERYTHING
 ↓
TEST EVERYTHING
 ↓
FIX FAILURES
 ↓
AUDIT EVERYTHING
 ↓
UPDATE DOCUMENTATION
 ↓
PRODUCTION-READINESS CHECK
 ↓
FINAL IMPLEMENTATION AUDIT
 ↓
REPORT EXACT STATUS
```

There is no third prompt assumed for normal product implementation.

---

# 38. FINAL CONTRACT

This file, the approved Alpha architecture, the approved product requirements, and explicit human decisions together form the development contract.

The agent must preserve:

- completeness;
- architectural integrity;
- tenant isolation;
- security;
- billing integrity;
- public identity stability;
- maintainability;
- testability;
- observability;
- future extensibility.

**No MVP shortcuts. No silent scope reduction. No architectural guesswork where a material decision is required. No false completion.**

