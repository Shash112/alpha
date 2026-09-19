# 37 — Requirement Traceability Matrix

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Full End-to-End Requirement Traceability Mapping  

---

## Traceability Matrix Overview

This matrix maps every major product and architectural requirement specified in `Digital_Visiting_Card_SaaS_Full_Development_Requirements.md` and `Alpha_SaaS_Architecture_Blueprint_v1.0.md` to its designated Database Entity, API Domain, UI Screen, Permission, Entitlement Key, Test Suite, and Implementation Phase.

---

| Requirement Area | DB Entity | API Area | UI Screen | Permission / Entitlement | Test Suite | Phase |
|---|---|---|---|---|---|---|
| **User Auth & Profiles** | `users`, `auth_identities` | `/api/v1/auth/*` | `/login`, `/register` | N/A | `auth.spec.ts` | Phase 1 |
| **Workspace & Multi-Tenancy** | `workspaces`, `memberships` | `/api/v1/workspaces/*` | `/dashboard/settings` | `workspace.read` | `tenancy.spec.ts` | Phase 2 |
| **RBAC Roles & Permissions** | `roles`, `permissions` | `/api/v1/workspaces/:id/members` | `/dashboard/members` | `members.invite` | `rbac.spec.ts` | Phase 2 |
| **Card Aggregate & Builder** | `cards`, `card_revisions` | `/api/v1/workspaces/:id/cards` | `/dashboard/cards/builder` | `cards.create` | `cards.spec.ts` | Phase 3 |
| **Public Card Projection** | `cards`, `card_revisions` | `/api/v1/public/cards/*` | `/c/:publicId`, `/:alias` | Server Policy Filter | `public_privacy.spec.ts` | Phase 4 |
| **URL & Vanity Aliases** | `aliases` | `/api/v1/public/cards/alias/*` | `/dashboard/cards/settings` | `cards.custom_url` | `aliases.spec.ts` | Phase 4 |
| **Dynamic QR Codes** | `qr_codes` | `/api/v1/.../qr` | `/dashboard/cards/qr` | `qr.customize` | `qr.spec.ts` | Phase 5 |
| **NFC Device Mapping** | `nfc_devices` | `/api/v1/.../nfc`, `/nfc/:uid` | `/dashboard/nfc` | `nfc.enabled` | `nfc.spec.ts` | Phase 5 |
| **Lead Capture & CRM Lite** | `leads`, `lead_activities` | `/api/v1/.../leads` | `/dashboard/leads` | `leads.read` | `leads.spec.ts` | Phase 6 |
| **Async Analytics Engine** | `analytics_events`, `aggregates` | `/api/v1/.../analytics` | `/dashboard/analytics` | `analytics.basic` | `analytics.spec.ts` | Phase 7 |
| **Corporate Organizations** | `departments`, `teams` | `/api/v1/.../departments` | `/dashboard/organization` | `organization.enabled` | `org.spec.ts` | Phase 8 |
| **Plans & Entitlements** | `plans`, `workspace_overrides` | `/api/v1/.../billing/plans` | `/dashboard/billing/plans` | `EntitlementEngine` | `entitlements.spec.ts` | Phase 9 |
| **Razorpay Subscriptions** | `subscriptions`, `invoices` | `/api/v1/.../billing`, `/webhooks` | `/dashboard/billing` | `billing.manage` | `billing_idempotency.spec.ts` | Phase 9 |
| **Appointments Booking** | `appointments`, `schedules` | `/api/v1/.../appointments` | `/dashboard/appointments` | `appointments.enabled` | `appointments.spec.ts` | Phase 10 |
| **Networking Card Swap** | `user_connections` | `/api/v1/.../connections` | `/dashboard/network` | N/A | `networking.spec.ts` | Phase 10 |
| **Custom Domains** | `custom_domains` | `/api/v1/.../domains` | `/dashboard/domains` | `custom_domain.enabled` | `domains.spec.ts` | Phase 11 |
| **White-Labeling** | `workspaces` | `/api/v1/.../settings` | `/dashboard/white-label` | `white_label.enabled` | `white_label.spec.ts` | Phase 11 |
| **Reseller & Agencies** | `reseller_accounts`, `clients` | `/api/v1/reseller/*` | `/reseller/portal` | `reseller.clients.manage` | `reseller.spec.ts` | Phase 12 |
| **Platform Administration** | `users`, `audit_logs` | `/api/v1/admin/*` | `/admin` | Super-Admin Role | `admin.spec.ts` | Phase 13 |
| **Audit Logging** | `audit_logs` | `/api/v1/.../audit-logs` | `/dashboard/audit-logs` | `audit_logs.enabled` | `audit.spec.ts` | Phase 13 |
