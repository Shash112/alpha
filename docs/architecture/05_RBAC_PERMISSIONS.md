# 05 — RBAC & Permissions Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Role-Based Access Control, Permission Matrix, Resource Scope Evaluation & Security Policies  

---

## 1. Role-Based Access Control (RBAC) Hierarchy

Authorization in Alpha follows a strict **Deny-by-Default** policy hierarchy. Frontend visibility controls are purely UX conveniences; server-side permission checks are mandatory for every API call.

```text
Request
  │
  ▼
[Global Super-Admin Bypass Check] ──(Is Super Admin?)──► [ALLOW]
  │ (No)
  ▼
[Workspace Membership Active Check] ──(Membership Inactive?)──► [DENY 403]
  │ (Active)
  ▼
[Role Resolution] ──► Get Permissions assigned to Membership Role
  │
  ▼
[Permission Check] ──(Has Required Permission?)──► [DENY 403]
  │ (Yes)
  ▼
[Resource Scope Check] ──(Workspace / Department / Team / Own Resource match)
  │
  ▼
[ALLOW / EXECUTE]
```

---

## 2. Standard Roles Across Workspace Types

| Role Name | Workspace Type | Core Scope & Description |
|---|---|---|
| **Owner** | All Types | Full workspace control, billing management, deletion, transfer ownership |
| **Workspace Admin** | Team, Business, Org | Manage members, roles, templates, branding, cards, and integrations |
| **Billing Admin** | Business, Enterprise | Manage billing, payment methods, plan upgrades, invoices only |
| **People / HR Admin** | Business, Org, Enterprise | Onboard/offboard employees, assign departments, provision cards |
| **Department Admin** | Business, Org, Enterprise | Manage cards, members, and analytics within assigned department |
| **Team Manager** | Team, Business, Org | Manage team cards, leads, and view team performance analytics |
| **Member** | All Types | Create and edit personal/assigned cards, view own leads |
| **Viewer** | Team, Business, Org | Read-only access to assigned cards, templates, and reporting |
| **Agency Admin** | Reseller | Full reseller workspace control & management of client sub-workspaces |
| **Account Manager** | Reseller | Management of assigned reseller client workspaces |

---

## 3. Comprehensive Permission Matrix

Permissions use explicit dot-notation string identifiers: `<resource>.<action>`

```text
Workspace Permissions:
  workspace.read, workspace.update, workspace.delete, workspace.settings.manage
  
Member Permissions:
  members.read, members.invite, members.update_role, members.remove
  
Card Permissions:
  cards.create, cards.read, cards.update, cards.publish, cards.unpublish, cards.delete, cards.reassign
  
Template Permissions:
  templates.read, templates.create, templates.update, templates.delete
  
Lead & CRM Permissions:
  leads.read, leads.export, leads.assign, leads.update_status, leads.delete
  
Analytics Permissions:
  analytics.read_basic, analytics.read_advanced, analytics.export
  
Billing Permissions:
  billing.read, billing.manage_payment, billing.upgrade_plan, billing.cancel
  
Domain & White-Label Permissions:
  domains.manage, white_label.configure
  
NFC & QR Permissions:
  nfc.provision, nfc.rebind, qr.customize
  
Reseller Permissions:
  reseller.clients.create, reseller.clients.manage, reseller.commissions.read
```

---

## 4. Resource Scope Resolution Algorithm

When performing permission validation on a target resource (e.g. updating a card), the authorization engine evaluates scope boundaries in the following priority order:

1. **Workspace Scope:** If the role has global workspace permission (`cards.update`), action is ALLOWED.
2. **Department Scope:** If the role has `Department Admin` status and target resource belongs to user's department, action is ALLOWED.
3. **Team Scope:** If the role has `Team Manager` status and target resource belongs to user's team, action is ALLOWED.
4. **Own Resource Scope:** If user is the explicit `owner_user_id` of the card/lead, action is ALLOWED.
5. Otherwise, action is DENIED (`403 Forbidden`).
