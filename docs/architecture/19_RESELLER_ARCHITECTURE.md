# 19 — Reseller & Agency Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Partner Workspaces, Managed Client Workspaces, Delegated Access Control & Commission Tracking  

---

## 1. Partner / Reseller Environment Model

Alpha supports agencies, NFC vendors, printing companies, and channel partners through a first-class **Reseller & Agency Platform Architecture**.

```text
Platform Super-Admin
  │
  ▼
Reseller / Agency Workspace (Partner Account)
  │
  ├── Bulk Provisioned Plan Licenses / Quota Pool
  ├── Commission Tracking Engine
  │
  └── Client Workspaces (Managed Sub-Tenants)
         ├── Client Workspace A (Acme Corp)
         ├── Client Workspace B (Beta Industries)
         └── Client Workspace C (Gamma Services)
```

---

## 2. Reseller Data Schema

```sql
CREATE TABLE reseller_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
    commission_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 20.00, -- e.g., 20% recurring revenue share
    allocated_license_seats INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reseller_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
    commission_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_workspace_id UUID NOT NULL REFERENCES workspaces(id),
    client_workspace_id UUID NOT NULL REFERENCES workspaces(id),
    invoice_id UUID NOT NULL,
    amount_inr INT NOT NULL, -- Stored in paise
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, PAID
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Delegated Access Control & Auditing

1. **Explicit Delegation Token:** Reseller admins manage client sub-workspaces via delegated access sessions (`POST /api/v1/reseller/clients/:id/impersonate`).
2. **Context Isolation:** When operating in client context, request headers carry `X-Workspace-Id: <client_workspace_id>` and `X-Delegated-By: <reseller_workspace_id>`.
3. **Audit Trail Guarantee:** All actions executed via reseller delegation are stamped in the client's `audit_logs` with `is_delegated = TRUE` and the identity of the agency account manager.
