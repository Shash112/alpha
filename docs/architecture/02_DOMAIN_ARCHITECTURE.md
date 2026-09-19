# 02 — Domain Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Domain Bounded Contexts, Module Inventory, Dependency Direction & Event Inter-Communication  

---

## 1. Domain Overview

The Alpha backend (`apps/api`) is structured as a **Modular Monolith** containing 33 distinct domain modules. Each domain represents a specific bounded context with clear ownership, database entities, application services, controllers, DTOs, and event publishers.

---

## 2. Complete Catalogue of 33 Business Domains

| # | Domain Name | Bounded Context Purpose | Key Entities / Dependencies |
|---|---|---|---|
| 1 | **Identity & Auth** | User registration, authentication, sessions, OAuth, password reset | `User`, `AuthIdentity`, `Session`, `PasswordReset` |
| 2 | **User Management** | Human user profiles, global preferences, account lifecycle | `UserProfile`, `UserPreference` |
| 3 | **Workspaces** | Tenant boundary, workspace lifecycle, configuration & settings | `Workspace`, `WorkspaceSettings` |
| 4 | **Memberships** | User-to-workspace mapping, invitation flows, member status | `WorkspaceMembership`, `Invitation` |
| 5 | **Authorization (RBAC)** | Roles, permissions, evaluation engine, policy enforcement | `Role`, `Permission`, `RolePermission` |
| 6 | **Organizations** | Enterprise corporate structure, company profiles, company branding | `Organization`, `CompanyProfile` |
| 7 | **Departments** | Organizational subunits for grouping employees and cards | `Department` |
| 8 | **Teams** | Sub-department or cross-functional groups within workspaces | `Team`, `TeamMember` |
| 9 | **Cards** | Core Digital Visiting Card aggregate, revision control, status | `Card`, `CardRevision`, `CardSection` |
| 10 | **Templates** | Card visual layout engine, platform/custom design schemas | `Template`, `TemplateVersion` |
| 11 | **Media & Uploads** | Profile photos, logos, card banners, media storage management | `MediaAsset` |
| 12 | **Public Profiles** | Public profile projection, sanitized data assembly, SEO preview | `PublicProfileProjection` |
| 13 | **URL & Identity** | Immutable public IDs, vanity alias allocation, redirect engine | `CardAlias`, `AliasHistory` |
| 14 | **QR Code System** | Dynamic QR code generation, vector export, logo embedding | `QRCode`, `QRStyle` |
| 15 | **NFC System** | Physical NFC device provisioning, card mapping, tap counters | `NFCDevice` |
| 16 | **Leads Management** | Lead capture forms, lead collection pipeline, lead status | `Lead`, `LeadField` |
| 17 | **Contacts Management** | Saved contacts database, vCard generation, contact tags | `Contact`, `ContactTag` |
| 18 | **CRM Lite** | Lightweight activity tracking, notes, pipeline stages | `LeadActivity`, `LeadNote`, `CRMStage` |
| 19 | **Analytics Engine** | Async event capture, aggregations, views, clicks, tap metrics | `AnalyticsEvent`, `DailyAnalyticsAggregate` |
| 20 | **Events & Networking** | Networking event host cards, attendee badges, card swaps | `EventCard`, `EventAttendee` |
| 21 | **Connections** | Explicit contact exchange requests, mutual connection graph | `ConnectionRequest`, `UserConnection` |
| 22 | **Appointments** | Booking schedules, availability slots, appointment management | `AppointmentType`, `Availability`, `Appointment` |
| 23 | **Plans Management** | Commercial plan definitions, pricing Tiers, billing periods | `Plan`, `PlanPrice` |
| 24 | **Entitlement Engine** | Feature flags, numeric usage limits, plan feature evaluators | `Entitlement`, `WorkspaceOverride` |
| 25 | **Usage Metering** | Tracking consumption metrics (cards created, SMS sent, API calls) | `UsageRecord`, `UsageAggregate` |
| 26 | **Billing & Subscriptions** | Provider-agnostic subscriptions, Razorpay sync, invoices | `Subscription`, `Invoice`, `Payment` |
| 27 | **Notifications** | Transactional emails, SMS alerts, WhatsApp triggers | `Notification`, `NotificationTemplate` |
| 28 | **Custom Domains** | Custom CNAME domain routing, SSL certificate management | `CustomDomain`, `DomainVerification` |
| 29 | **Integrations & Webhooks** | Outgoing webhooks, API keys, third-party CRM exports | `WebhookEndpoint`, `WebhookDelivery`, `ApiKey` |
| 30 | **Reseller & Partners** | Reseller agency workspaces, sub-clients, commission tracking | `ResellerAccount`, `ResellerClient`, `Commission` |
| 31 | **Audit Logging** | Immutable security audit trail of privileged tenant actions | `AuditLog` |
| 32 | **Abuse & Trust** | Card suspension, spam filtering, rate limiting policies | `AbuseReport`, `CardSuspension` |
| 33 | **Platform Admin** | Super-admin platform operations, global user/tenant management | `AdminUser`, `GlobalPlatformSettings` |

---

## 3. Dependency Direction Rules

```text
[Controllers / Handlers]
       │
       ▼
[Application Services] ──(Emits Domain Events)──► [Event Bus] ──► [Background Workers]
       │
       ▼
[Domain Policies / Entitlements]
       │
       ▼
[Repositories / Data Access Layer]
       │
       ▼
[PostgreSQL Database]
```

### Domain Isolation Safeguards
- **Direct Cross-Domain Database Access Prohibited:** Domain `Leads` must not directly query `Cards` tables via raw SQL. It must consume `CardsService` or rely on foreign keys defined at DB level.
- **Transactional Consistency Boundary:** Transactions must not cross domain boundaries except through orchestrator application services (Sagas / Application Services).
- **Event-Driven Decoupling:** Non-critical secondary actions (e.g., sending an email when a lead is captured) MUST use domain events (`LeadCapturedEvent`) handled asynchronously.
