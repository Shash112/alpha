# 22 — Security Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** OWASP Top 10 Protections, Password Hashing, Rate Limiting, Audit Logging & IDOR Prevention  

---

## 1. Security Baseline & Principles

Alpha enforces **Defense in Depth** across network, application, database, and infrastructure layers. Security controls are built directly into feature development, never retrofitted.

---

## 2. OWASP Top 10 Mitigations Matrix

| OWASP Risk Area | Architectural Mitigation Strategy |
|---|---|
| **A01: Broken Access Control** | Server-side `TenantAuthorizationGuard` + RBAC permission checks + mandatory DB `workspace_id` scoping on every query. IDOR prevention tests enforced in CI/CD. |
| **A02: Cryptographic Failures** | TLS 1.3 enforced at edge. Passwords hashed using **Argon2id** (or bcrypt with cost factor 12). Data at rest encrypted in RDS using AES-256. |
| **A03: Injection (SQLi/XSS)** | Parameterized queries via ORM. Inputs sanitized with `sanitize-html`. Strict Content Security Policy (CSP) headers. |
| **A04: Insecure Design** | Rate limiting at edge (Cloudflare) and API layer (`ThrottlerGuard`). Denial-by-default permission model. |
| **A05: Security Misconfiguration** | Infrastructure defined in Terraform. Production environment variables stored in AWS Secrets Manager. Stack traces hidden in production API error DTOs. |
| **A07: Identification & Auth** | JWT access tokens with short TTL (15 mins) + HTTP-Only secure cookies for refresh tokens. Brute-force throttling on login endpoints (5 attempts/min). |
| **A08: Software Data Integrity** | Webhook signature verification mandatory on Razorpay endpoints (`X-Razorpay-Signature`). Package dependencies audited via `npm audit` in CI. |

---

## 3. Rate Limiting Policy Configuration

```typescript
// NestJS Throttler Configuration
export const RateLimitConfig = {
  global: { ttl: 60, limit: 100 }, // 100 requests / min per IP
  authLogin: { ttl: 60, limit: 5 }, // 5 login attempts / min per IP
  publicCards: { ttl: 60, limit: 300 }, // 300 public profile requests / min per IP
  leadSubmit: { ttl: 60, limit: 3 }, // 3 lead submissions / min per IP/Card
};
```

---

## 4. Immutable Audit Log Schema

All privileged tenant operations (member invites, role changes, card deletions, billing upgrades, domain changes, admin support sessions) emit immutable `AuditLog` records:

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(64) NOT NULL, -- e.g. member.invited, card.deleted
    target_resource_type VARCHAR(32) NOT NULL,
    target_resource_id VARCHAR(128) NOT NULL,
    changes_json JSONB DEFAULT '{}', -- Diff of modified fields
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    is_delegated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_lookup ON audit_logs(workspace_id, created_at DESC);
```
