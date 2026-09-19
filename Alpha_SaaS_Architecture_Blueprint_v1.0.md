# Alpha — SaaS Architecture Blueprint

**Document:** Alpha System & SaaS Architecture Blueprint  
**Version:** 2.0 (Global Mandate)  
**Status:** Architecture Baseline — Locked for Development  
**Product Type:** Multi-tenant SaaS  
**Market:** Global from day one  
**Internal Project Name:** Alpha  
**Primary Product:** Digital Professional Identity / Digital Visiting Card SaaS

---

## 0. Purpose

This document translates the approved Alpha product requirements and locked architecture decisions into a concrete technical architecture intended for implementation by human developers and AI coding agents.

This document is the architectural source of truth for:

- system structure;
- tenant and workspace boundaries;
- identity and resource ownership;
- plans, entitlements and usage limits;
- RBAC and authorization;
- database responsibilities and constraints;
- API contracts and conventions;
- asynchronous processing;
- multi-currency billing and multi-provider subscription behavior;
- public URL and card identity behavior;
- infrastructure and deployment;
- security, privacy compliance, and observability;
- testing strategy;
- implementation rules for AI development agents.

The existing Product & Development Requirements remain the product-level baseline. This architecture document resolves the technical interpretation of those requirements.

---

# 1. Executive Architecture Decision

Alpha will use a **TypeScript monorepo with a modular-monolith backend and a Next.js web frontend**, backed by PostgreSQL, Redis, S3-compatible object storage, and Cloudflare, with AWS-compatible production deployment.

The platform is **shared-database, shared-schema multi-tenant SaaS**. Tenant isolation is enforced through workspace ownership, membership authorization, repository/service scoping, database constraints, automated security tests, and auditability.

The core commercial model is **workspace-centric**. Users are identities; workspaces are customer environments; memberships connect users to workspaces; subscriptions belong to workspaces; entitlements determine capabilities; resources belong to workspaces.

The platform supports multiple cards per workspace and multiple workspaces per user. A card is an independent public identity resource.

Card identity uses an immutable internal identifier and a separate immutable public identifier. Human-readable vanity paths are aliases, not permanent resource identity.

---

# 2. Non-Negotiable Architectural Principles

1. Global-first posture, multi-currency pricing, multi-language readiness (i18n), and global compliance from day one.
2. Multi-tenancy is a foundational architecture rule, not a later feature.
3. A user is never synonymous with a tenant.
4. A workspace is the primary customer/resource isolation boundary.
5. A user may belong to multiple workspaces.
6. A workspace may contain multiple cards.
7. Account/workspace type and commercial plan are separate concepts.
8. Plan logic must be configuration-driven and support multi-currency pricing schemas.
9. Feature access must be enforced server-side.
10. Roles and permissions are independent of plans.
11. Public card fields must never expose unpublished/private data.
12. Card identity must not depend on a person's display name.
13. Slugs are aliases; immutable IDs are resource identity.
14. Database constraints are authoritative for uniqueness and integrity.
15. Payment-provider APIs must be hidden behind a multi-gateway billing abstraction (Stripe + Razorpay + PayPal).
16. Analytics must not become a synchronous dependency of public-card rendering.
17. Background jobs must be retryable and idempotent where appropriate.
18. Cross-tenant access must fail closed.
19. All privileged operational actions must be auditable.
20. No customer-specific code forks are permitted.
21. Customer-specific behavior must be implemented through configuration, entitlements, branding, templates, and data.
22. The public-card path must be optimized independently from dashboard workloads (sub-100ms CDN projection).
23. APIs must be versioned and documented through OpenAPI.
24. Production changes must be observable and reversible where practical.
25. Security controls are part of feature completion, not a separate final task.
26. Do not introduce microservices until operational evidence justifies extraction.

---

# 3. Approved Technology Stack

## 3.1 Application

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- API style: REST
- API version: `/api/v1`
- API documentation: OpenAPI
- Validation: shared schema/validation layer
- UI system: shared internal UI package

## 3.2 Data

- Primary database: PostgreSQL
- Cache and job infrastructure: Redis
- Object/file storage: S3-compatible object storage
- Analytics: PostgreSQL initially, abstracted for future dedicated analytics store

## 3.3 Edge / Platform

- CDN/WAF/DNS: Cloudflare or equivalent
- Initial deployment posture: AWS-compatible
- Infrastructure definition: Infrastructure-as-Code
- Containerization: Docker

## 3.4 Payments

- Primary global provider: Stripe
- Regional/Alternative providers: Razorpay, PayPal
- Provider abstraction: mandatory multi-gateway billing strategy pattern (`IPaymentProviderAdapter`)

## 3.5 Repository

- Monorepo
- Separate deployable applications within one repository
- Shared packages for types, UI, validation, auth, billing, entitlements, notifications, analytics and database access as appropriate

---

# 4. High-Level System Architecture

```text
                                     INTERNET
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                         PUBLIC                 APPLICATION
                         TRAFFIC                   TRAFFIC
                            │                       │
                       Cloudflare               Cloudflare
                       CDN / WAF                CDN / WAF
                            │                       │
               ┌────────────┴────────────┐         │
               │                         │         │
         Public Card Edge          Next.js Web      │
               │                         │         │
               └────────────┬────────────┘         │
                            │                      │
                            └──────────────┬───────┘
                                           │
                                      NestJS API
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          │                │               │                │                │
       Identity         Workspace       Card/Identity    CRM/Leads       Billing
          │                │               │                │                │
          └────────────────┴───────────────┼────────────────┴────────────────┘
                                           │
                               Domain Services / Policies
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
                 PostgreSQL             Redis             Object Storage
                     │                     │                     │
                     │                 Job Workers               │
                     │                     │                     │
                     └─────────────────────┼─────────────────────┘
                                           │
                                  External Providers
                           ┌──────────┬─────┴─────┬───────────┐
                           │          │           │           │
                       Razorpay    Email      Calendar     WhatsApp
                                      /future providers/
```

---

# 5. Deployment Topology

## 5.1 Environments

Required environments:

- local development;
- development/shared development;
- staging;
- production.

Each environment must have isolated:

- database;
- Redis;
- object-storage namespace/bucket or equivalent isolation;
- secrets;
- webhook endpoints;
- payment credentials;
- domain configuration.

Production data must never be used casually in development.

## 5.2 Production Logical Components

```text
Cloudflare
  ├── DNS
  ├── CDN
  ├── WAF
  ├── Rate limiting
  └── TLS
       │
       ├── Web application
       ├── Public card renderer
       └── API
              │
              ├── NestJS application pods/containers
              ├── Background workers
              └── Scheduled jobs

Managed PostgreSQL
Managed Redis
S3-compatible object storage
Observability platform
```

## 5.3 Scalability Strategy

Scale the system by independently scaling:

- public web/card rendering;
- API application instances;
- background workers;
- database capacity;
- Redis capacity;
- object delivery through CDN.

Do not introduce service boundaries purely because a module exists. Keep domain modules inside the modular monolith until scale, deployment independence, fault isolation or organizational constraints justify extraction.

---

# 6. Monorepo Architecture

Recommended structure:

```text
/
├── apps/
│   ├── web/
│   ├── api/
│   └── admin/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── auth/
│   ├── database/
│   ├── validation/
│   ├── types/
│   ├── entitlements/
│   ├── billing/
│   ├── analytics/
│   ├── notifications/
│   └── integrations/
│
├── infrastructure/
│   ├── docker/
│   ├── terraform-or-infra/
│   └── scripts/
│
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── security/
│   ├── billing/
│   └── runbooks/
│
└── tooling/
```

## 6.1 Repository Rules

- Applications may depend on shared packages.
- Shared packages must not import application-specific code.
- Domain modules must not create hidden circular dependencies.
- Database access must be centralized through approved data-access layers.
- Cross-domain writes should occur through explicit application/domain services.
- Public API DTOs must be separated from internal persistence models where necessary.

---

# 7. Domain Architecture

The backend is divided into business domains.

## 7.1 Core Platform Domains

1. Identity
2. Users
3. Workspaces
4. Memberships
5. Authorization
6. Organizations
7. Departments
8. Teams
9. Cards
10. Templates
11. Media
12. Public Profiles
13. URL/Slug Identity
14. QR
15. NFC
16. Leads
17. Contacts
18. CRM
19. Analytics
20. Events
21. Networking
22. Appointments
23. Plans
24. Entitlements
25. Usage
26. Billing
27. Notifications
28. Domains
29. Integrations
30. Resellers
31. Audit
32. Abuse/Trust
33. Platform Administration

## 7.2 Dependency Direction

Preferred dependency direction:

```text
API Controllers
      ↓
Application Services
      ↓
Domain Services / Policies
      ↓
Repositories / Adapters
      ↓
Infrastructure
```

Controllers must not contain business rules.

Repositories must not decide authorization.

Authorization must happen before a protected resource is mutated or revealed.

---

# 8. Canonical SaaS Object Model

```text
User
  │
  ├── User Profile
  │
  └── Workspace Memberships
          │
          ▼
      Workspace
          │
     ┌────┼───────────────────────────────────┐
     │    │          │         │              │
   Plan  Brand    Members    Cards           Usage
     │              │         │
     │          Teams/Dept    ├── QR
     │                        ├── NFC
     │                        ├── Leads
     │                        └── Analytics
     │
     └── Entitlements
```

Core rule:

> A User is the authenticated human identity. A Workspace is the customer environment and tenant boundary. A Card is an independently addressable public identity resource.

---

# 9. User Architecture

## 9.1 User Responsibilities

The User entity represents authentication and human identity only.

Required information includes:

- id;
- email;
- email verification state;
- authentication identities;
- name/display name;
- profile photo;
- locale;
- time zone;
- language;
- notification preferences;
- account status;
- timestamps;
- deletion state.

## 9.2 User Does Not Own Tenant Data Directly

Business resources should normally be owned by a workspace.

Avoid designs where card, lead, analytics or billing records are only owned by `user_id`.

A user may create or manage a resource, but ownership is determined by the resource's workspace and domain rules.

---

# 10. Workspace Architecture

## 10.1 Workspace Types

Canonical workspace types:

- Personal
- Team
- Business/Organization
- Enterprise
- Agency/Reseller

Workspace type is descriptive/commercial metadata and is not the same as subscription plan.

## 10.2 Workspace Characteristics

Every workspace has:

- immutable id;
- type;
- display name;
- status;
- owner relationship;
- settings;
- branding;
- active subscription/billing relationship;
- entitlement context;
- usage context.

## 10.3 Multi-Workspace Membership

A single user may belong to multiple workspaces.

Example:

```text
User: Shashank
  ├── Personal Workspace
  ├── ABC Technologies Workspace
  └── Agency Workspace
```

The current workspace is request context, never an authorization bypass.

---

# 11. Workspace Lifecycle

Canonical workspace states:

```text
TRIAL
  ↓
ACTIVE
  ↓
PAST_DUE / GRACE_PERIOD
  ↓
SUSPENDED
  ↓
CANCELLED
  ↓
DELETION_PENDING
  ↓
DELETED
```

State changes must be driven by explicit policies and billing/system events.

Do not permanently delete transactional records merely because a subscription was cancelled.

---

# 12. Membership Architecture

A membership represents a user's relationship to a workspace.

Required conceptual fields:

- membership id;
- user id;
- workspace id;
- role assignment;
- membership status;
- invitation state;
- joined timestamp;
- invited by;
- team assignments;
- department assignment where applicable;
- offboarding state.

Membership is the primary input to workspace authorization.

---

# 13. Roles and Authorization

## 13.1 Authorization Model

```text
Authenticated User
       ↓
Workspace Membership
       ↓
Role(s)
       ↓
Permission Set
       ↓
Resource Scope
       ↓
Policy Checks
       ↓
Allow / Deny
```

## 13.2 Standard Roles

### Personal

- Owner

### Team

- Owner
- Admin
- Manager
- Member
- Viewer

### Organization

- Owner
- Organization Admin
- Billing Admin
- People/HR Admin
- Department Admin
- Team Manager
- Member
- Viewer

### Agency

- Agency Owner
- Agency Admin
- Account Manager
- Client Admin

## 13.3 Permission Model

Permissions should use stable identifiers such as:

```text
workspace.read
workspace.update
members.read
members.invite
members.remove
cards.create
cards.read
cards.update
cards.publish
leads.read
leads.assign
billing.read
billing.manage
analytics.read
nfc.manage
```

Permissions must not be inferred solely from role names in application code. Roles map to permissions through configuration/data.

## 13.4 Scope

Permissions may have scopes such as:

- workspace-wide;
- department;
- team;
- own resource;
- assigned resource;
- client workspace for reseller delegation.

---

# 14. Tenant Isolation

## 14.1 Rule

All tenant-owned records must have a resolvable workspace ownership path.

Examples:

- cards;
- leads;
- contacts;
- media;
- analytics events;
- QR resources;
- NFC resources;
- domains;
- appointments;
- organization settings.

## 14.2 Enforcement Layers

Tenant isolation is enforced at multiple layers:

1. request context;
2. membership authorization;
3. application-service policy;
4. repository query scoping;
5. database foreign keys/constraints;
6. automated security tests;
7. audit logging for sensitive failures.

## 14.3 Never Trust Client Workspace IDs

A client-supplied `workspace_id` must never by itself grant access.

The server must derive and validate workspace context from the authenticated session and membership.

## 14.4 Security Test Requirement

Every tenant-scoped module must have at least one cross-tenant denial test.

---

# 15. Card Architecture

## 15.1 Card as a First-Class Resource

A card represents a publishable professional identity.

A card may belong to a personal, team, business or other workspace and may be managed by one or more authorized members.

## 15.2 Card Lifecycle

```text
DRAFT
  ↓
PUBLISHED
  ↕
UNPUBLISHED
  ↓
ARCHIVED
  ↓
DELETED
```

`SUSPENDED` is a platform/trust state that may override publication.

## 15.3 Card Ownership

A card should contain at least:

- card id;
- immutable public id;
- workspace id;
- owner/assigned member;
- template id;
- content/configuration;
- visibility configuration;
- status;
- slug/alias references;
- published revision/current revision pointer;
- timestamps.

## 15.4 Multiple Cards

A workspace may contain multiple cards subject to entitlement limits.

Examples:

```text
Personal Workspace
  ├── Personal
  ├── Consulting
  └── Conference

Organization Workspace
  ├── Employee A
  ├── Employee B
  └── Employee C
```

## 15.5 Primary Card

A workspace may designate one card as a primary/default card.

Primary status is convenience metadata; it is not permanent resource identity.

---

# 16. Card Identity and URL Architecture

This section is a critical security and integrity decision.

## 16.1 Three Identifiers

Every card has:

### A. Internal ID

- database identity;
- UUIDv7 or approved equivalent;
- never used as human-facing identity.

### B. Public ID

- immutable;
- globally unique within the platform;
- generated independently from the display name;
- used for canonical public identity.

### C. Vanity Alias

- optional human-readable path;
- changeable;
- unique within its hostname namespace;
- points to the immutable card identity.

## 16.2 Canonical URL

Canonical form:

```text
https://alpha.com/c/{public_id}
```

Example:

```text
https://alpha.com/c/7Kx9mP4QaZ8Vt2N6
```

This URL should be stable for the life of the card and should be suitable for QR/NFC references.

## 16.3 Vanity URL

Examples:

```text
https://alpha.com/shashank
https://alpha.com/shashank-consulting
https://alpha.com/john-smith
```

Vanity URLs resolve to a card public ID.

## 16.4 URL Uniqueness

Uniqueness is enforced at the URL namespace level:

```text
(hostname, normalized_path)
```

For the default Alpha host:

```text
alpha.com + /john-smith
```

must be unique among active aliases.

For custom domains:

```text
card.acme.com + /john
```

is its own namespace.

## 16.5 Database Uniqueness

The database must enforce:

```text
cards.id                 PRIMARY KEY
cards.public_id          UNIQUE
aliases(hostname,path)   UNIQUE for active aliases
```

Do not rely on a prior availability check for uniqueness.

## 16.6 Collision Handling

If an identifier collision occurs:

1. database unique constraint rejects the duplicate;
2. application catches the conflict;
3. a new public identifier is generated;
4. transaction retries.

The application must never silently overwrite an existing identity.

## 16.7 Slug Normalization

All vanity aliases must pass canonical normalization before uniqueness validation.

Normalization should address:

- case;
- surrounding whitespace;
- allowed characters;
- separator normalization;
- Unicode normalization as applicable;
- reserved terms.

## 16.8 Historical Alias Strategy

When a vanity alias changes:

```text
old alias
   ↓
redirect/resolve
   ↓
current immutable card
```

Historical aliases should not be immediately released if doing so could break QR/NFC links, confuse identity, or create impersonation risk.

Alias retention policy is configurable.

## 16.9 Deleted Cards

Deleted card aliases must enter a controlled release/retention process. Default behavior should favor preserving identity history rather than immediate reassignment.

---

# 17. Card Rendering Architecture

The card builder and renderer must be schema/configuration driven.

Recommended flow:

```text
Card Data
   ↓
Card Revision
   ↓
Template Definition
   ↓
Section Configuration
   ↓
Validation / Policy Filtering
   ↓
Renderer
   ↓
Public HTML
```

## 17.1 Public Rendering Rule

Public rendering must use a publishable/sanitized representation of card data, not the raw private database record.

## 17.2 Published Revision

Recommended approach:

- editor modifies draft state;
- draft validates;
- publish operation creates or activates a publishable revision;
- public renderer reads the published representation.

This reduces the risk of exposing incomplete/private draft data.

## 17.3 Visibility

Each supported card field can be:

- public;
- private;
- hidden.

The public projection must enforce this server-side.

---

# 18. Template Architecture

Templates use a common schema and renderer.

## 18.1 Ownership Levels

One template system must support:

1. platform templates;
2. workspace templates;
3. team templates;
4. private/custom templates.

## 18.2 Template Metadata

Templates should include:

- id;
- name;
- version;
- status;
- ownership scope;
- preview asset;
- default configuration;
- allowed sections;
- available plans/entitlements;
- compatibility version.

## 18.3 Template Evolution

Published templates should be versioned.

Changing a template definition must not unexpectedly destroy an existing customer card layout.

Cards should reference a template/version or support migration explicitly.

---

# 19. Media Architecture

All user-uploaded media is tenant-owned.

## 19.1 Media Types

- profile images;
- company logos;
- cover images;
- gallery images;
- template previews;
- QR exports.

## 19.2 Upload Flow

```text
Client
 ↓
Authenticated upload authorization
 ↓
Signed upload / controlled upload
 ↓
Object storage
 ↓
Validation / processing
 ↓
Media record
 ↓
CDN delivery
```

## 19.3 Requirements

- MIME verification;
- file size limits;
- image dimension checks;
- safe filenames;
- malware scanning strategy;
- thumbnail creation;
- tenant ownership;
- cleanup on deletion;
- CDN cache strategy.

---

# 20. QR Architecture

A QR resource belongs to a card and points to a stable destination.

## 20.1 Canonical Behavior

QR should normally point to the canonical card public URL or a stable redirect route controlled by Alpha.

## 20.2 Benefits

- card details may change;
- vanity slug may change;
- template may change;
- analytics can remain consistent;
- printed QR remains useful.

## 20.3 QR Entity

Conceptual fields:

- id;
- card id;
- public token if required;
- destination type;
- status;
- scan tracking flag;
- style configuration;
- created/updated timestamps.

---

# 21. NFC Architecture

NFC is a software-managed destination object, not a hardware manufacturing platform.

## 21.1 NFC Device Lifecycle

```text
UNASSIGNED
  ↓
ASSIGNED
  ↓
ACTIVE
  ↕
SUSPENDED
  ↓
LOST / RETIRED
  ↘
   REASSIGNED
```

## 21.2 NFC Device Ownership

NFC devices belong to a workspace and may be assigned to a user/card.

## 21.3 NFC Resolution

Prefer stable destination references so a physical NFC product does not need reprogramming when a card's content changes.

---

# 22. Lead Architecture

## 22.1 Lead Ownership

A lead belongs to the workspace associated with the target card.

## 22.2 Lead Lifecycle

```text
NEW
 ↓
CONTACTED
 ↓
QUALIFIED
 ├──> CONVERTED
 └──> LOST
```

## 22.3 Lead Data

Minimum:

- id;
- workspace id;
- source card id;
- contact information;
- message;
- status;
- assignee;
- tags;
- notes;
- activity history;
- timestamps.

## 22.4 Public Lead Submission

The public form must not allow a client to choose arbitrary workspace/card identifiers to redirect or inject data.

The server derives the target card from the public card context.

---

# 23. CRM Lite Architecture

CRM Lite includes:

- contacts;
- tags;
- notes;
- lead relationships;
- assignment;
- activity history;
- import/export;
- basic search/filtering.

Do not expand the CRM into an unrestricted enterprise CRM without a separate architecture review.

---

# 24. Analytics Architecture

Analytics must be separated conceptually from transactional state.

## 24.1 Event Flow

```text
Public/User Action
        ↓
Lightweight Event Capture
        ↓
Queue / Async Processing
        ↓
Analytics Event Store
        ↓
Aggregation
        ↓
Analytics API
        ↓
Dashboard
```

## 24.2 Event Categories

Examples:

- card.viewed;
- qr.scanned;
- nfc.scanned;
- call.clicked;
- whatsapp.clicked;
- email.clicked;
- contact.saved;
- lead.form.viewed;
- lead.created;
- appointment.clicked;
- appointment.booked;
- share.clicked.

## 24.3 Event Immutability

Raw analytics events should be append-oriented. Corrections should occur through derived aggregates or correction mechanisms, not arbitrary mutation of history.

## 24.4 Privacy

Only collect and retain analytics needed for product value and legally permitted operation. Avoid unnecessary personally identifying tracking.

---

# 25. Organization Architecture

An organization workspace may contain:

```text
Organization
 ├── Departments
 │    ├── Teams
 │    │    └── Members
 │    └── Teams
 └── Members
```

Organizations must also support a simple structure with no departments/teams.

## 25.1 Employee Lifecycle

```text
INVITED
 ↓
ACTIVE
 ↓
SUSPENDED
 ↓
OFFBOARDED
```

Offboarding policies include:

- card suspension/transfer;
- lead reassignment;
- contact ownership resolution;
- audit retention;
- membership removal.

---

# 26. Reseller Architecture

A reseller workspace is a privileged partner environment managing customer workspaces.

```text
Platform
  ↓
Reseller Workspace
  ├── Client Workspace A
  ├── Client Workspace B
  └── Client Workspace C
```

## 26.1 Delegated Access

Resellers do not receive unrestricted access automatically.

Delegated access must specify:

- target client workspace;
- allowed capabilities;
- actor identity;
- duration if temporary;
- audit context.

## 26.2 Commission Model

Support:

- percentage commissions;
- fixed commissions;
- eligible plans;
- accrued amount;
- paid amount;
- refund reversal;
- payout status.

Commission accounting must be kept separate from payment-provider transaction identity.

---

# 27. Entitlement Architecture

Entitlements determine what a workspace can use.

## 27.1 Core Model

```text
Plan
 ↓
Plan Entitlements
 ↓
Workspace Overrides / Add-ons
 ↓
Resolved Entitlements
 ↓
Authorization / Usage Check
```

## 27.2 Types

Entitlements may be:

- boolean;
- numeric limit;
- string/configuration value where justified.

Examples:

```text
analytics.advanced = true
cards.max_active = 10
members.max_active = 25
nfc.max_devices = 20
custom_domains.max = 3
```

## 27.3 Resolution Precedence

Recommended precedence:

```text
System safety restrictions
        ↓
Platform feature flags
        ↓
Base plan entitlement
        ↓
Workspace override
        ↓
Purchased add-on
        ↓
Temporary support/promotion override
```

The exact precedence must be encoded in one entitlement-resolution service.

## 27.4 Hard Rule

No feature should check:

```text
if plan === 'PRO'
```

Instead it checks a resolved entitlement.

---

# 28. Feature Flags

Feature flags and entitlements are separate.

Feature flags control product rollout.

Entitlements control customer access.

A feature may require both:

```text
feature_flag = ENABLED
AND
entitlement = ALLOWED
```

Feature flags support:

- beta rollout;
- internal-only features;
- gradual rollout;
- emergency disablement.

---

# 29. Pricing Architecture

Commercial configuration must be data-driven.

## 29.1 Plan Families

- Free Personal
- Personal Pro
- Team
- Business
- Enterprise
- Agency/Reseller

## 29.2 Pricing Dimensions

Support:

- monthly;
- annual;
- per-seat;
- base + seat;
- add-on;
- usage-based future model;
- custom enterprise price.

## 29.3 Price Identity

A price is a separate immutable commercial record with effective dates.

Do not mutate historical prices in a way that changes historical invoices.

## 29.4 Grandfathering

Existing subscriptions can continue using a historical price reference when policy allows.

---

# 30. Billing Architecture

```text
Workspace
  ↓
Billing Customer
  ↓
Subscription
  ↓
Subscription Items
  ↓
Entitlement Resolution
  ↓
Usage / Limits
```

## 30.1 Billing Provider Abstraction

```text
Billing Application Service
         ↓
Payment Provider Interface
       ┌─┴──────────────┐
       │                │
   Razorpay        Future Provider
```

The rest of the application must not directly invoke Razorpay SDK methods.

## 30.2 Subscription States

```text
TRIALING
ACTIVE
PAST_DUE
PAUSED
CANCELLED
EXPIRED
```

## 30.3 Billing Events

Webhook events may include:

- payment success;
- payment failure;
- subscription create/update/cancel;
- refund;
- chargeback where available.

## 30.4 Webhook Handling

Every incoming billing webhook must be:

1. signature-verified;
2. assigned a provider/event identity;
3. checked for duplicate processing;
4. persisted or recorded as processed;
5. applied transactionally where appropriate;
6. safe for replay.

## 30.5 Idempotency

Payment, subscription and entitlement changes must not be applied twice if the same provider event is delivered twice.

---

# 31. Upgrade / Downgrade Architecture

## 31.1 Upgrade

Upgrade should:

- verify billing result;
- update subscription state;
- resolve new entitlements;
- record audit event;
- preserve historical state.

## 31.2 Downgrade

Downgrade must not blindly delete customer data.

Example:

```text
Current plan allows 50 cards
Current usage = 42
New plan allows 10
```

System should mark over-limit resources appropriately and restrict new creation until usage is brought within limits or an upgrade occurs.

Do not silently delete the extra 32 cards.

## 31.3 Cancellation

Default recommendation:

- allow cancel-at-period-end;
- optionally cancel immediately according to plan/provider policy;
- retain data according to retention rules;
- suspend premium capability after entitlement expiry;
- allow recovery/reactivation during configured grace period.

---

# 32. Add-On Architecture

Add-ons modify resolved entitlements.

Examples:

- extra cards;
- extra seats;
- extra storage;
- additional NFC capacity;
- advanced analytics;
- custom domain;
- white-label;
- API capacity.

Add-ons must have their own identity, price and lifecycle.

---

# 33. Usage Architecture

Usage is tenant-scoped and time-windowed.

Supported usage dimensions:

- active cards;
- active members;
- leads;
- profile views;
- QR scans;
- NFC scans;
- storage;
- API requests;
- active events.

## 33.1 Metering Rules

Usage records must be:

- tenant-scoped;
- aggregatable;
- recalculable;
- idempotent where event-based;
- auditable.

## 33.2 Usage Enforcement

```text
Request
 ↓
Resolved entitlement
 ↓
Current usage
 ↓
Limit check
 ↓
Allow / deny
```

For race-sensitive resource creation, usage enforcement and creation must occur transactionally or through another concurrency-safe mechanism.

---

# 34. Appointment Architecture

Native appointment scheduling will be implemented as a separate domain.

## 34.1 Core Objects

- appointment type;
- availability rule;
- timezone context;
- appointment;
- participant/contact;
- booking event;
- cancellation/reschedule metadata.

## 34.2 Booking Safety

The booking engine must prevent double-booking through concurrency-safe checks/transactions.

## 34.3 Future Integrations

Use adapters for:

- Google Calendar;
- Microsoft Outlook Calendar;
- meeting links.

---

# 35. Custom Domain Architecture

## 35.1 Domain Mapping

```text
Incoming Hostname
        ↓
Domain Resolution
        ↓
Verified Domain Record
        ↓
Workspace Mapping
        ↓
Public Profile/Card Resolution
```

## 35.2 Domain Lifecycle

```text
ADDED
 ↓
VERIFICATION_PENDING
 ↓
VERIFIED
 ↓
ACTIVE
 ↓
SUSPENDED / REMOVED
```

## 35.3 Requirements

- DNS ownership verification;
- domain conflict prevention;
- certificate/TLS strategy;
- routing;
- cache safety;
- removal handling.

---

# 36. White-Label Architecture

White-label configuration belongs to a workspace or reseller scope according to entitlement.

Branding may include:

- logo;
- favicon;
- color tokens;
- typography settings where supported;
- public card branding;
- login branding;
- email branding;
- footer branding;
- custom domain.

The platform must maintain a distinction between:

- platform branding;
- workspace branding;
- reseller branding.

Do not copy branding logic into every page. Use a centralized branding configuration resolver.

---

# 37. Networking Architecture

Networking is an explicit relationship between parties/cards, not an automatic public data exchange.

## 37.1 Connection Flow

```text
Scan/View Card
      ↓
View Public Profile
      ↓
User chooses Connect
      ↓
Consent / Data-sharing action
      ↓
Connection Record
      ↓
Optional Contact / Lead
```

## 37.2 Connection Context

A connection may be associated with:

- event;
- card;
- date/time;
- source;
- note;
- follow-up state.

## 37.3 Privacy

Only permitted data is exposed to the receiving party.

---

# 38. Notification Architecture

Central notification service with channel adapters.

```text
Notification Request
       ↓
Template Resolver
       ↓
Preference / Policy Check
       ↓
Channel Adapter
   ┌────┼─────┐
 Email In-App Future WhatsApp/SMS
```

## 38.1 Channels

Initial:

- email;
- in-app.

Future:

- WhatsApp;
- SMS.

## 38.2 Requirements

- template versioning;
- locale support;
- retry;
- delivery status;
- provider abstraction;
- preference handling;
- failure logging.

---

# 39. Background Job Architecture

Use Redis-backed asynchronous processing for:

- email sending;
- analytics processing;
- image processing;
- large exports/imports;
- webhook delivery;
- billing reconciliation;
- usage aggregation;
- cleanup/retention;
- scheduled domain checks where required.

## 39.1 Job Contract

Every job should define:

- job type;
- payload schema/version;
- retry policy;
- timeout;
- idempotency behavior;
- dead-letter behavior where appropriate;
- observability metadata.

---

# 40. API Architecture

## 40.1 Versioning

All public application APIs begin under:

```text
/api/v1
```

## 40.2 Core API Areas

- auth;
- users;
- workspaces;
- memberships;
- roles/permissions;
- organizations;
- teams;
- departments;
- cards;
- templates;
- media;
- public profiles;
- URL aliases;
- QR;
- NFC;
- leads;
- contacts;
- CRM;
- analytics;
- events;
- connections;
- appointments;
- domains;
- plans;
- prices;
- entitlements;
- subscriptions;
- usage;
- notifications;
- resellers;
- webhooks;
- admin.

## 40.3 API Conventions

Every endpoint must define:

- authentication requirement;
- permission requirement;
- tenant/workspace context;
- request schema;
- response schema;
- pagination behavior;
- validation rules;
- error codes;
- idempotency requirement where applicable.

## 40.4 Pagination

Use cursor pagination for large/event-like datasets where stable ordering matters. Offset pagination may be used for small/admin datasets where appropriate.

## 40.5 Error Model

Canonical structure:

```json
{
  "code": "CARD_SLUG_ALREADY_EXISTS",
  "message": "The selected card URL is already in use.",
  "requestId": "req_...",
  "details": {}
}
```

Internal stack traces must never be returned to clients.

---

# 41. API Idempotency

Idempotency is required for operations where retries could create duplicate effects.

Examples:

- payment creation;
- subscription actions;
- card publication jobs;
- webhook processing;
- large export creation;
- public lead submission where duplicate prevention is required.

Idempotency keys must be scoped appropriately and stored with request outcome.

---

# 42. Outbound Webhooks

Eligible workspaces may register webhook endpoints.

## 42.1 Event Naming

Use stable versioned event names such as:

```text
card.published
lead.created
contact.created
subscription.updated
payment.succeeded
appointment.booked
```

## 42.2 Delivery

Each delivery supports:

- signature;
- event id;
- attempt count;
- timestamps;
- retry;
- response capture;
- dead-letter/failure state.

Webhook delivery must be independent of the original transactional request whenever practical.

---

# 43. Database Architecture

PostgreSQL is the transactional system of record.

## 43.1 Core Table Families

### Identity

- users
- user_profiles
- auth_identities
- sessions/refresh tokens as appropriate

### Tenancy

- workspaces
- workspace_settings
- workspace_memberships
- roles
- permissions
- role_permissions

### Organization

- organizations
- departments
- teams
- team_memberships or equivalent assignments

### Card

- cards
- card_revisions
- card_sections
- card_social_links
- card_services
- card_products
- card_gallery
- card_testimonials
- card_ctas
- card_visibility
- card_templates

### Identity/URL

- public_ids if modeled separately
- card_aliases / slugs
- reserved_slugs
- domains
- domain_verifications

### Interaction

- qr_codes
- nfc_devices
- analytics_events
- analytics_aggregates
- leads
- lead_activities
- contacts
- contact_tags

### Networking/Scheduling

- events
- event_participants
- connections
- appointment_types
- availability_rules
- appointments

### Commerce/SaaS

- plans
- prices
- plan_entitlements
- workspace_entitlements
- addons
- subscriptions
- subscription_items
- invoices
- payments
- refunds
- coupons
- promotions
- usage_records

### Operations

- notifications
- notification_templates
- webhook_endpoints
- webhook_deliveries
- api_keys
- audit_logs
- support records where added

### Reseller

- reseller_accounts
- reseller_clients
- commissions

## 43.2 Database Rules

- Foreign keys must be explicit.
- Unique constraints must exist for all true business uniqueness requirements.
- Tenant-scoped indexes must be designed intentionally.
- Avoid unbounded JSON for core relational data.
- JSON/config fields are appropriate for flexible presentation configuration where schema evolution is expected.
- Audit fields must be consistent.
- Soft deletion is used selectively, not universally.
- Transaction boundaries must be explicit around state transitions.

---

# 44. Database Uniqueness Strategy

The database is the final authority for uniqueness.

## 44.1 Examples

```text
users.email               UNIQUE
cards.public_id           UNIQUE
aliases(host,path)        UNIQUE ACTIVE
workspace memberships     UNIQUE(user,workspace)
```

## 44.2 Race-Safe Creation

Never use:

```text
SELECT availability
INSERT later
```

as the only uniqueness protection.

Use:

```text
INSERT
  ↓
UNIQUE constraint
  ↓
commit or conflict
```

Application availability checks are UX helpers only.

---

# 45. Transaction Boundaries

Transactions are required when multiple writes represent one business state change.

Examples:

### Card publish

```text
Validate draft
 → validate entitlements
 → create published revision
 → update card status
 → create audit entry
 → commit
```

### Subscription change

```text
Validate provider result
 → update subscription
 → update subscription items
 → resolve/invalidate entitlements
 → audit
 → commit
```

### Employee offboarding

```text
update membership
 → apply card policy
 → reassign leads if required
 → revoke access
 → audit
 → commit
```

---

# 46. Caching Architecture

Cache only data whose invalidation and isolation are well defined.

Recommended cache candidates:

- public card configuration;
- published template metadata;
- plan configuration;
- resolved static entitlement data where safe;
- custom-domain routing metadata;
- branding configuration.

## 46.1 Cache Key Rule

Private data must include tenant/workspace/resource isolation in cache keys.

## 46.2 Invalidation

Any mutation that changes publicly visible card state must invalidate or version relevant cache entries.

---

# 47. Public Card Performance Architecture

The public card is the highest-importance latency path.

## 47.1 Goals

- fast first render;
- minimal JavaScript;
- optimized images;
- CDN caching where safe;
- asynchronous analytics;
- no dashboard/database-heavy dependencies.

## 47.2 Recommended Flow

```text
Request
 ↓
Hostname / Alias Resolution
 ↓
Public Card Resolution
 ↓
Cached Published Representation
 ↓
Render
 ↓
Async Analytics Event
```

If analytics ingestion fails, card rendering must still succeed.

---

# 48. Search Architecture

Initial search uses PostgreSQL indexes/full-text capabilities as appropriate.

Search domains:

- members;
- cards;
- contacts;
- leads;
- organizations;
- events.

Tenant filters must always apply.

A dedicated search engine may be introduced later without changing API semantics.

---

# 49. SEO Architecture

## 49.1 Public Cards

Support:

- title;
- description;
- Open Graph metadata;
- canonical URL;
- robots directives;
- structured data where appropriate.

## 49.2 Indexing Controls

Users/organizations may eventually need a card-level search indexing preference.

Unpublished/suspended/private cards must not accidentally become indexable.

---

# 50. Authentication Architecture

## 50.1 Supported Initial Methods

- email/password;
- email verification;
- Google OAuth;
- password reset.

Future-compatible:

- magic links;
- passkeys;
- SAML;
- OIDC;
- SCIM.

## 50.2 Authentication vs Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What may this user do in this workspace to this resource?

Never merge those responsibilities.

---

# 51. Session Security

Requirements:

- secure session handling;
- refresh token revocation where used;
- token/session rotation as appropriate;
- login throttling;
- secure cookies where cookie sessions are used;
- password hashing with strong modern configuration;
- security event logging.

---

# 52. Public Security Boundaries

Public endpoints include:

- card/profile retrieval;
- QR redirect/resolution;
- NFC resolution;
- public lead forms;
- public appointment booking;
- public sharing metadata.

Each public endpoint must define:

- rate limit;
- abuse controls;
- validation;
- cache behavior;
- information exposure policy;
- analytics behavior.

---

# 53. Abuse / Trust Architecture

Because Alpha hosts public identity pages:

- abuse reporting;
- card suspension;
- slug/username protection;
- spam protection;
- rate limiting;
- lead-form bot prevention;
- impersonation handling;
- domain abuse controls;
- platform moderation tooling

must be part of the architecture.

A suspended card must have a deterministic public response and must not continue to expose private content.

---

# 54. Data Privacy Architecture

## 54.1 Data Classes

At minimum classify data as:

- public profile data;
- private account data;
- tenant business data;
- billing/accounting data;
- security/audit data;
- analytics data.

## 54.2 Public Projection

Public responses should be generated from a safe public projection or an equivalent policy-filtered representation.

Do not query a full card record and simply serialize it to JSON.

## 54.3 User Controls

Support:

- field visibility;
- data export;
- account deletion;
- workspace deletion;
- consent capture where applicable.

---

# 55. Data Retention Architecture

Retention periods must be configurable by data class.

Examples:

- deleted accounts;
- deleted workspaces;
- analytics events;
- audit logs;
- leads;
- contacts;
- billing records;
- backups.

Billing/accounting records may require longer retention than ordinary profile data.

Do not implement deletion workflows that unknowingly violate operational/accounting requirements.

---

# 56. Audit Architecture

Audit is an append-oriented record of security and operationally important actions.

Required metadata:

- event id;
- actor user;
- workspace;
- target resource;
- action;
- timestamp;
- request/correlation id;
- outcome;
- relevant network metadata where appropriate.

Audit logs are not ordinary editable tenant data.

---

# 57. Administrative Architecture

Platform admin is separate from customer admin.

## 57.1 Platform Admin Functions

- user management;
- workspace management;
- plan management;
- price management;
- entitlement management;
- subscription operations;
- refunds;
- coupons/promotions;
- templates;
- reseller management;
- domain operations;
- NFC operations;
- abuse/moderation;
- audit review;
- system settings;
- support tools.

## 57.2 Admin Impersonation

Any future support/admin impersonation must:

- require explicit privileged permission;
- show a clear impersonation state;
- restrict dangerous actions where appropriate;
- generate audit records;
- capture actor and target identities.

---

# 58. Configuration Architecture

Separate three categories:

### Environment configuration

Secrets, provider keys, infrastructure endpoints.

### Platform configuration

Global defaults, system safety settings, feature flags.

### Tenant configuration

Branding, settings, limits overrides, domain settings, preferences.

Never store environment secrets inside tenant configuration.

---

# 59. Internationalization Architecture

The system must be locale-ready.

Support:

- locale-aware dates;
- locale-aware numbers;
- timezone-aware scheduling;
- currency abstraction;
- translation keys;
- localized notification templates.

Initial UI language may be English.

India-specific behavior must remain configurable rather than embedded into domain rules.

---

# 60. India-First Architecture

Initial commercial behavior supports:

- INR;
- Indian phone formatting;
- +91 handling;
- UPI-capable payment flow through the selected payment gateway;
- GST/tax fields where applicable;
- Indian addresses;
- WhatsApp-first sharing.

International expansion must not require rewriting core domain models.

---

# 61. Email Architecture

Use an email provider abstraction.

Capabilities:

- transactional emails;
- verified sender identity;
- domain verification;
- bounce handling;
- complaint handling;
- delivery tracking;
- retry;
- templates;
- localization.

Customer-domain sending may be added for eligible plans later.

---

# 62. API Security

All protected APIs must validate:

1. authentication;
2. workspace membership;
3. permission;
4. resource scope;
5. entitlement where required;
6. input schema.

Public APIs must additionally enforce:

- rate limits;
- abuse controls;
- origin/context validation where applicable.

---

# 63. Rate Limiting

Different endpoint groups may have different policies:

- auth;
- public card resolution;
- public lead submission;
- dashboard APIs;
- admin APIs;
- webhook receivers;
- outbound/public developer APIs.

Rate limits must be configurable.

Tenant-aware and user-aware limits should be supported.

---

# 64. Public Lead Anti-Spam Architecture

Use layered controls:

- rate limiting;
- honeypot fields;
- duplicate submission detection;
- suspicious traffic heuristics;
- optional challenge/captcha;
- throttling by source.

Do not require heavy anti-bot processing on every normal card view.

---

# 65. Observability Architecture

Required baseline:

- structured logs;
- request/correlation IDs;
- error tracking;
- API latency metrics;
- database metrics;
- queue metrics;
- worker metrics;
- billing metrics;
- public-card performance metrics;
- external-provider health.

## 65.1 Critical Alerts

- API outage;
- elevated error rate;
- database unavailable;
- queue backlog;
- payment webhook failures;
- storage failures;
- domain/TLS failures;
- repeated background-job failure.

---

# 66. Backup and Disaster Recovery

Required:

- automated database backups;
- point-in-time recovery where supported;
- object-storage durability strategy;
- backup monitoring;
- restore runbook;
- periodic restore testing.

RPO/RTO must be explicitly configured during infrastructure implementation.

---

# 67. Infrastructure-as-Code

Production infrastructure must be represented as code.

Infrastructure code must define, as applicable:

- network;
- compute;
- PostgreSQL;
- Redis;
- storage;
- CDN/WAF/DNS configuration;
- secrets references;
- monitoring/alerts;
- backup policy.

No undocumented manual infrastructure drift should be considered acceptable for production.

---

# 68. CI/CD Architecture

Pipeline stages:

```text
Commit
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
Build
 ↓
Integration Tests
 ↓
Security Checks
 ↓
Deploy Staging
 ↓
E2E Tests
 ↓
Approval/Policy Gate
 ↓
Production
```

Migrations must be backward-compatible with the running application during rollout when zero/low-downtime deployment is required.

---

# 69. Database Migration Rules

1. Every schema change must use a migration.
2. Never edit production schema manually without an emergency runbook.
3. Destructive migrations require explicit review.
4. Large migrations must consider lock duration and table size.
5. Application deployment ordering must support migration compatibility.
6. Rollback strategy must be defined for high-risk migrations.

---

# 70. Testing Architecture

Testing is mandatory at four levels.

## 70.1 Unit

Test:

- entitlements;
- permissions;
- billing calculations;
- slug normalization;
- state transitions;
- usage rules;
- domain policies.

## 70.2 Integration

Test:

- repositories;
- database constraints;
- authentication;
- tenant scoping;
- billing provider adapters;
- webhooks;
- object storage;
- job processing.

## 70.3 E2E

Test:

- signup;
- verification;
- card creation;
- publication;
- public card access;
- contact saving;
- lead submission;
- analytics;
- subscription change;
- team invitation;
- organization flow;
- QR;
- NFC;
- domain verification;
- reseller provisioning;
- cancellation/downgrade.

## 70.4 Security

Must include:

- cross-tenant access;
- IDOR;
- privilege escalation;
- authentication abuse;
- malicious uploads;
- XSS;
- injection protection;
- rate-limit behavior;
- webhook signature bypass attempts.

---

# 71. Critical State Machines

The following state machines must be implemented centrally and not recreated differently in each controller.

## 71.1 Card

```text
DRAFT → PUBLISHED
PUBLISHED → UNPUBLISHED
PUBLISHED → SUSPENDED
UNPUBLISHED → PUBLISHED
UNPUBLISHED → ARCHIVED
ARCHIVED → DELETED
```

## 71.2 Membership

```text
INVITED → ACTIVE
INVITED → EXPIRED
ACTIVE → SUSPENDED
ACTIVE → OFFBOARDED
SUSPENDED → ACTIVE
```

## 71.3 Workspace

```text
TRIAL → ACTIVE
ACTIVE → PAST_DUE
PAST_DUE → ACTIVE
PAST_DUE → SUSPENDED
SUSPENDED → ACTIVE
ACTIVE → CANCELLED
CANCELLED → DELETION_PENDING
DELETION_PENDING → DELETED
```

## 71.4 Subscription

```text
TRIALING → ACTIVE
ACTIVE → PAST_DUE
PAST_DUE → ACTIVE
PAST_DUE → PAUSED
ACTIVE → CANCELLED
CANCELLED → EXPIRED
```

## 71.5 NFC

```text
UNASSIGNED → ASSIGNED
ASSIGNED → ACTIVE
ACTIVE ↔ SUSPENDED
ACTIVE → LOST
ACTIVE → RETIRED
LOST → REASSIGNED
```

All transitions must be validated by domain policy.

---

# 72. Public Request Resolution

A public profile request should follow this sequence:

```text
Request
 ↓
Normalize Host + Path
 ↓
Resolve Alias / Canonical Public ID
 ↓
Check Resource Status
 ↓
Load Published Public Projection
 ↓
Resolve Template + Branding
 ↓
Render Response
 ↓
Queue Analytics Event
```

Do not load a private workspace and then expose fields based on frontend logic.

---

# 73. Authenticated Request Resolution

Authenticated request sequence:

```text
Request
 ↓
Authenticate
 ↓
Resolve User
 ↓
Resolve Current Workspace
 ↓
Verify Membership
 ↓
Resolve Role/Permissions
 ↓
Resolve Resource
 ↓
Check Resource Scope
 ↓
Check Entitlement
 ↓
Execute Application Service
 ↓
Audit if required
```

---

# 74. New Feature Architecture Checklist

No new feature may be implemented until the developer documents:

1. domain/module;
2. owner/workspace boundary;
3. resource identity;
4. lifecycle/state machine;
5. permissions;
6. plan/entitlement behavior;
7. usage/limits;
8. API endpoints;
9. database impact;
10. events;
11. audit events;
12. notifications;
13. deletion/retention behavior;
14. security threats;
15. tests;
16. observability.

This is mandatory for AI-generated changes too.

---

# 75. AI Coding Agent Rules

This section is specifically intended to prevent architecture drift.

## 75.1 Agent Must Not

- invent a new tenant model;
- create separate account architectures for plans;
- couple business logic to plan names;
- expose raw database records through public APIs;
- bypass authorization because a route is internal-looking;
- create a second billing abstraction;
- call Razorpay directly from feature modules;
- create customer-specific code forks;
- add a new database column to solve a feature that belongs in configuration without architecture review;
- use user name as resource identity;
- use vanity slug as permanent resource identity;
- add microservices without explicit architecture approval;
- disable tests to make a feature pass;
- swallow authorization failures;
- return internal exception details to clients.

## 75.2 Agent Must

- reuse existing domain modules;
- reuse shared authentication and authorization;
- reuse entitlement resolution;
- reuse billing abstractions;
- enforce workspace scoping;
- use database constraints for uniqueness;
- add tests for new business rules;
- update OpenAPI/API documentation;
- add audit events for privileged operations;
- add analytics events where user interaction requires measurement;
- update documentation when architecture changes;
- preserve backwards compatibility where required.

---

# 76. AI Agent Change Procedure

Every meaningful change follows:

```text
Understand requirement
 ↓
Identify domain
 ↓
Review existing contracts
 ↓
Check tenancy/ownership
 ↓
Check permission model
 ↓
Check entitlement model
 ↓
Check state machine
 ↓
Implement domain/service layer
 ↓
Implement persistence
 ↓
Implement API
 ↓
Implement UI
 ↓
Add tests
 ↓
Add audit/events
 ↓
Update docs
 ↓
Run regression
```

An agent must not jump directly from a user request to UI code without validating architecture impact.

---

# 77. API Contract Rules for AI Agents

The agent must always determine:

- endpoint ownership;
- HTTP method;
- auth requirements;
- permission;
- workspace context;
- request DTO;
- response DTO;
- error codes;
- idempotency;
- pagination;
- audit behavior;
- analytics impact.

API breaking changes require versioning or an approved migration strategy.

---

# 78. UI Architecture Rules

The frontend should consume APIs through typed clients/services.

Do not duplicate business rules in the UI merely for access control.

UI may hide unavailable functionality for user experience, but the server remains authoritative.

Every major screen must provide:

- loading state;
- empty state;
- error state;
- permission-denied state;
- plan-limit state where applicable;
- success feedback.

---

# 79. Admin UI Rules

Platform admin interfaces must visually and functionally distinguish:

- platform scope;
- customer workspace scope;
- reseller scope;
- delegated access.

Dangerous actions require confirmation and are audited.

---

# 80. Public Card UX Rules

Public cards must prioritize:

1. identity clarity;
2. immediate contact actions;
3. fast loading;
4. mobile usability;
5. clear CTAs;
6. trust and legitimacy;
7. privacy.

The public card must not feel like a generic dashboard page.

---

# 81. Accessibility Architecture

Target WCAG 2.2 AA where practical.

Application UI requirements:

- keyboard navigation;
- visible focus;
- semantic headings;
- form labels;
- accessible validation messages;
- contrast;
- meaningful alt text;
- reduced motion support;
- accessible dialogs.

Public cards must use accessible controls and readable typography.

---

# 82. Performance Budgets

Exact budgets are to be finalized during performance engineering, but architecture assumes:

- public card first render is the highest-priority web path;
- below-fold assets are lazy-loaded;
- image dimensions are controlled;
- expensive analytics are asynchronous;
- API list endpoints are paginated;
- dashboard data is not loaded all at once.

Performance regression testing should be part of release readiness for major public-card changes.

---

# 83. Security Architecture Summary

Security controls must include:

- TLS;
- secrets management;
- least privilege;
- secure headers;
- WAF/rate limits;
- validated input;
- output encoding;
- secure upload handling;
- tenant isolation;
- authentication security;
- authorization enforcement;
- audit logging;
- dependency scanning;
- backup and recovery;
- webhook signature verification.

---

# 84. Future Mobile Architecture

Native mobile applications are not required for the initial web product.

The backend API must remain sufficiently complete and documented to support future mobile clients.

Future mobile use cases:

- card sharing;
- QR scanning;
- networking;
- contacts;
- NFC management;
- push notifications.

---

# 85. Future AI Architecture

AI is optional and sits outside the core transactional domain.

Future AI services may include:

- bio generation;
- card copy suggestions;
- lead summarization;
- lead qualification;
- follow-up recommendations;
- networking recommendations.

AI integrations must use explicit service interfaces and must not introduce AI-specific coupling into core identity/resource models.

---

# 86. Future Physical Commerce Architecture

NFC hardware manufacturing is not part of the current platform scope.

However, the architecture should allow a later commerce domain such as:

```text
Catalog
 ↓
Product
 ↓
Order
 ↓
Payment
 ↓
Fulfilment
 ↓
NFC Assignment
```

This future commerce capability must not be mixed into the current card domain.

---

# 87. Architecture Decision Records

## ADR-001 — Modular Monolith

**Decision:** Use a modular monolith.  
**Reason:** Product domains are numerous but tightly related; operational simplicity is more valuable than premature distributed systems complexity.

## ADR-002 — Shared Database Multi-Tenancy

**Decision:** Shared PostgreSQL database with workspace-level tenant isolation.  
**Reason:** Simpler operations and cost profile while supporting strong logical isolation.

## ADR-003 — Workspace-Centric SaaS

**Decision:** Workspace is the commercial and resource tenancy boundary.  
**Reason:** Supports individual, team, organization, enterprise and reseller models without duplicate architectures.

## ADR-004 — Independent Card Identity

**Decision:** Card is an independent public identity resource.  
**Reason:** Supports multiple cards per user/workspace and avoids coupling identity to names.

## ADR-005 — Immutable Public Card ID

**Decision:** Use an immutable public ID for canonical card URLs.  
**Reason:** QR/NFC links remain stable when names or vanity aliases change.

## ADR-006 — Vanity Alias Layer

**Decision:** Human-readable URLs are aliases, not permanent identity.  
**Reason:** Supports human-friendly sharing without sacrificing stable resource identity.

## ADR-007 — Configuration-Driven Entitlements

**Decision:** Plans resolve capabilities through an entitlement engine.  
**Reason:** Enables plan changes, add-ons, promotions, grandfathering and enterprise customization without code forks.

## ADR-008 — Billing Provider Abstraction

**Decision:** Razorpay is the initial provider behind an abstraction.  
**Reason:** India-first product today, multi-provider flexibility tomorrow.

## ADR-009 — Async Analytics

**Decision:** Analytics ingestion is asynchronous.  
**Reason:** Public card rendering must remain available even when analytics processing is delayed or degraded.

## ADR-010 — Cloud-Neutral Application Design

**Decision:** Application contracts remain cloud-neutral while production is AWS-compatible.  
**Reason:** Avoid infrastructure lock-in in core code while retaining a concrete operational baseline.

---

# 88. Canonical Data Ownership Rules

| Resource | Primary owner | Access boundary |
|---|---|---|
| User | Platform identity | User |
| Workspace | Platform tenant | Workspace |
| Membership | Workspace | Workspace admins |
| Card | Workspace | Workspace permissions |
| Lead | Workspace | Lead permissions |
| Contact | Workspace | CRM permissions |
| Analytics Event | Workspace/Card | Analytics permissions |
| QR | Card/Workspace | Card permissions |
| NFC Device | Workspace | NFC permissions |
| Appointment | Workspace | Appointment permissions |
| Subscription | Workspace | Billing permissions |
| Invoice | Billing account/workspace | Billing/admin scope |
| Audit Log | Workspace/platform | Restricted read-only |
| Reseller Client | Reseller relationship | Delegated partner scope |

---

# 89. Canonical Resource Identification Rules

Every resource should distinguish between:

- internal database identity;
- public/external identity where required;
- display name;
- human-readable slug/alias where required.

Never reuse one field for all four responsibilities.

---

# 90. Canonical Plan/Feature Rules

A feature is available only when:

```text
Platform Feature Enabled
        AND
Resolved Workspace Entitlement Allows It
        AND
Current Resource/Usage Is Within Limit
        AND
Actor Has Permission
```

This should be implemented centrally where practical.

---

# 91. Canonical Billing Rules

1. Workspace is billing owner.
2. Subscription is provider-independent domain data.
3. Razorpay identifiers are provider references, not system identity.
4. Webhook events are idempotent.
5. Historical invoices retain historical prices.
6. Downgrade does not silently destroy data.
7. Cancellation changes capability according to explicit policy.
8. Billing changes generate audit events.
9. Entitlements update through the entitlement resolver.

---

# 92. Canonical URL Rules

1. Every card has one immutable public ID.
2. Canonical URL uses public ID.
3. Vanity aliases are optional.
4. Alias uniqueness is host + normalized path.
5. Alias changes preserve history according to policy.
6. QR/NFC may use canonical stable identity.
7. Database uniqueness constraints are authoritative.
8. User display names do not determine identity.
9. Slugs may be user-selected but never become primary keys.
10. Reserved namespaces are centrally managed.

---

# 93. Release Architecture Sequence

Although this is a full-product architecture, implementation is sequenced to reduce dependency risk.

## Release 1 — Foundation

- monorepo;
- authentication;
- user;
- workspace;
- membership;
- authorization;
- PostgreSQL;
- Redis;
- storage;
- CI/CD;
- observability.

## Release 2 — Card Platform

- cards;
- card revisions;
- templates;
- builder;
- public rendering;
- immutable public IDs;
- aliases;
- QR;
- vCard/contact save;
- sharing.

## Release 3 — Leads / CRM / Analytics

- leads;
- contacts;
- CRM Lite;
- notifications;
- analytics event pipeline;
- dashboards.

## Release 4 — Organization

- organizations;
- departments;
- teams;
- employee lifecycle;
- company profile;
- team analytics.

## Release 5 — Revenue Platform

- plans;
- prices;
- entitlements;
- usage;
- subscriptions;
- Razorpay;
- trials;
- add-ons;
- coupons;
- downgrade/cancel flows.

## Release 6 — Networking / Scheduling

- events;
- connections;
- appointments.

## Release 7 — Domains / NFC / Reseller

- custom domains;
- NFC management;
- reseller accounts;
- delegated access;
- commissions;
- white-label.

## Release 8 — Enterprise / Scale

- SSO;
- SCIM;
- advanced audit;
- advanced API;
- scale optimization;
- enterprise reporting.

---

# 94. Production Readiness Checklist

A release is production-ready only when:

### Architecture

- module boundaries documented;
- migrations reviewed;
- tenancy checks implemented;
- dependency direction respected.

### Security

- authentication tested;
- authorization tested;
- cross-tenant tests passing;
- secrets protected;
- upload security tested;
- webhooks verified.

### Billing

- entitlement behavior verified;
- webhook idempotency verified;
- upgrade/downgrade tested;
- refund/cancellation behavior tested.

### Public Cards

- public fields filtered;
- canonical URL works;
- alias resolution works;
- QR works;
- NFC path works where applicable;
- analytics failure does not break rendering.

### Operations

- logs available;
- error tracking active;
- metrics active;
- backups verified;
- alerts configured;
- rollback/runbook available.

---

# 95. Explicit Out-of-Scope for This Architecture Baseline

Unless a later architecture revision is approved, do not introduce:

- full ERP;
- full enterprise CRM;
- native mobile applications as a required launch dependency;
- generic social network unrelated to product value;
- arbitrary customer-specific code branches;
- arbitrary customer-specific schema forks;
- hardware manufacturing infrastructure;
- microservices solely for organizational fashion;
- large AI-agent systems in the core identity path.

---

# 96. Final Architectural Contract

The Alpha platform is defined by the following canonical chain:

```text
USER
  ↓
MEMBERSHIP
  ↓
WORKSPACE
  ↓
PLAN
  ↓
RESOLVED ENTITLEMENTS
  ↓
PERMISSIONS + USAGE
  ↓
RESOURCES
  ↓
AUDIT + ANALYTICS + EVENTS
```

For cards:

```text
USER / WORKSPACE
       ↓
     CARD
       ↓
IMMUTABLE PUBLIC ID
       ↓
CANONICAL URL
       ↓
OPTIONAL VANITY ALIAS
       ↓
PUBLIC CARD RENDERER
       ↓
CALL / WHATSAPP / EMAIL / SAVE / LEAD / BOOK / SHARE
       ↓
ANALYTICS / CRM / NETWORKING
```

For billing:

```text
WORKSPACE
   ↓
BILLING CUSTOMER
   ↓
SUBSCRIPTION
   ↓
SUBSCRIPTION ITEMS
   ↓
ENTITLEMENTS
   ↓
USAGE LIMITS
   ↓
FEATURE ACCESS
```

For public identity uniqueness:

```text
DATABASE ID
   +
IMMUTABLE PUBLIC ID
   +
UNIQUE(HOST, NORMALIZED PATH) FOR ACTIVE ALIASES
   +
ATOMIC DATABASE CONSTRAINTS
   +
RETRY-ON-COLLISION
   =
NO DUPLICATE ACTIVE PUBLIC IDENTITIES
```

---

# 97. Final Rules for Developers

1. Do not redesign tenancy while implementing a feature.
2. Do not create a second concept for an existing domain responsibility.
3. Do not bypass centralized authorization.
4. Do not bypass centralized entitlement resolution.
5. Do not use names, emails or slugs as permanent resource IDs.
6. Do not allow two active public aliases to represent the same URL namespace.
7. Do not trust client-provided workspace ownership.
8. Do not expose private card data from public endpoints.
9. Do not perform billing state changes solely from client-side state.
10. Do not process provider webhooks without verification and idempotency.
11. Do not make analytics a rendering dependency.
12. Do not add a feature without permission and entitlement definitions.
13. Do not add a billable resource without usage/limit definitions.
14. Do not add destructive downgrade behavior without explicit policy.
15. Do not create customer-specific code forks.
16. Do not change API semantics silently.
17. Do not omit tests for new authorization or billing behavior.
18. Do not ship privileged operations without audit logging.
19. Do not treat feature flags as entitlement checks.
20. Update the architecture documentation when a foundational architecture decision changes.

---

# 98. Architecture Change Control

Any change affecting the following requires an Architecture Decision Record or explicit architecture review:

- tenancy model;
- workspace model;
- identity model;
- billing ownership;
- entitlement resolution;
- permission model;
- database strategy;
- public URL identity;
- provider abstraction;
- deployment topology;
- cross-domain dependencies.

Feature-level implementation details can evolve without changing the architecture baseline, provided the non-negotiable principles remain intact.

---

# 99. Architecture Status

**Status: LOCKED FOR DEVELOPMENT**

The following have been resolved:

- technology stack;
- monorepo;
- shared PostgreSQL tenancy;
- workspace model;
- workspace-owned billing;
- plan families;
- Razorpay;
- authentication baseline;
- custom domains;
- configuration-driven card renderer;
- four-level template ownership;
- CRM Lite scope;
- native appointments;
- software-only NFC architecture;
- white-label;
- reseller model;
- analytics architecture;
- REST/OpenAPI;
- Redis background jobs;
- cloud-neutral/AWS-compatible deployment;
- multiple cards per user/workspace;
- immutable card identity;
- canonical public URL;
- vanity alias architecture;
- duplicate-safe database and URL uniqueness strategy.

Commercial price amounts remain configuration data and may change without architecture changes.

---

# 100. Source and Relationship to Product Requirements

This architecture blueprint operationalizes the approved Alpha Product & Development Requirements, including its production-grade multi-tenant model, workspace-centric authorization, configurable entitlements, multiple cards, leads/CRM, analytics, organizations, appointments, custom domains, reseller/white-label, billing, API, security, and phased implementation principles.

The architecture should be read together with the Product & Development Requirements and the future supporting documents listed there, including Database Design, API Specification, Roles & Permissions Matrix, Plans/Pricing/Entitlements Specification, Billing Specification, Analytics Event Specification, Security Specification, and Deployment/Operations documentation.

---

**End of Alpha SaaS Architecture Blueprint v1.0**
