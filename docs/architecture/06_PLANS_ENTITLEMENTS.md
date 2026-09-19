# 06 — Plans & Entitlements Engine Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Plan Configuration, Entitlement Resolution Model, Feature Flags & Numeric Usage Limit Enforcement  

---

## 1. Executive Entitlement Rule

Application business logic MUST NEVER hardcode plan checks (e.g. `if (workspace.plan === 'PRO')`). All feature access and limit checks MUST pass through the **Configuration-Driven Entitlement Engine**:

```typescript
const isAllowed = await entitlementService.canAccessFeature(workspaceId, 'cards.custom_branding');
const limitCheck = await entitlementService.checkUsageLimit(workspaceId, 'cards.max_active_count', currentCardCount);
```

---

## 2. Entitlement Resolution Chain

The effective entitlement set for any workspace is dynamically resolved at runtime using a 5-tier inheritance evaluation chain:

```text
1. Base Plan Entitlements (Defined by commercial plan ID e.g. "plan_personal_pro")
       │
       ▼
2. Add-on Entitlements (Purchased workspace add-on packs e.g. "+5 Custom Domains")
       │
       ▼
3. Workspace Specific Overrides (Manual admin override e.g. VIP enterprise grant)
       │
       ▼
4. Promotional Overrides (Temporary promo code feature unlocks)
       │
       ▼
= EFFECTIVE WORKSPACE ENTITLEMENT SET (Cached in Redis for 15 mins)
```

---

## 3. Entitlement Catalogue

### 3.1 Boolean Feature Entitlements
- `cards.custom_url`: Ability to claim custom vanity aliases (e.g., `/shashank`).
- `cards.remove_branding`: Ability to toggle off "Powered by Alpha" footer.
- `cards.custom_branding`: Custom colors, custom fonts, CSS overrides.
- `analytics.advanced`: Advanced geo/device breakdown, CSV export, real-time tap streams.
- `leads.crm_export`: CSV download and webhook sync of captured leads.
- `custom_domain.enabled`: Ability to bind custom domain (e.g., `card.acme.com`).
- `nfc.enabled`: Provisioning physical NFC products.
- `appointments.enabled`: Native appointment booking calendar integration.
- `white_label.enabled`: White-label portal branding & custom email sending domain.
- `sso.saml_enabled`: SAML 2.0 / Okta / Azure AD Single Sign-On integration.
- `audit_logs.enabled`: Audit log viewing and export.

### 3.2 Numeric Limit Entitlements
- `cards.max_active_count`: Max active published cards per workspace (e.g., Free=1, Pro=5, Team=25, Org=100+).
- `members.max_seats`: Max member seats in workspace (e.g., Free=1, Pro=1, Team=10, Org=50+).
- `domains.max_count`: Max verified custom domains (e.g., Free=0, Pro=0, Team=1, Business=3, Enterprise=Custom).
- `leads.max_monthly_count`: Monthly lead capture limit.
- `analytics.retention_days`: Data retention window for analytics events (e.g., Free=30, Pro=365, Org=730).
- `storage.max_bytes`: Total file media storage allocation in bytes.

---

## 4. Plan Family Default Configurations

| Feature / Limit Key | Free Personal | Personal Pro | Team | Business / Org | Enterprise |
|---|---|---|---|---|---|
| `cards.max_active_count` | 1 | 5 | 25 | 100 | Unlimited (-1) |
| `members.max_seats` | 1 | 1 | 10 | 50 | Custom |
| `cards.remove_branding` | False | True | True | True | True |
| `custom_domain.enabled` | False | False | True | True | True |
| `domains.max_count` | 0 | 0 | 1 | 3 | Unlimited (-1) |
| `appointments.enabled` | Basic | Full | Full | Full | Full |
| `white_label.enabled` | False | False | False | True | True |
| `sso.saml_enabled` | False | False | False | False | True |

> **Value `-1` represents unlimited.** All plan prices and default entitlement matrices are defined in seed configuration JSON files and managed via platform admin without requiring code redeployments.

---

## 5. Server-Side Enforcement & Caching

1. **Resolution Caching:** Resolved effective entitlements are cached in Redis under key `tenant:{workspace_id}:entitlements` with a TTL of 900 seconds (15 minutes).
2. **Cache Invalidation:** Any subscription upgrade, downgrade, add-on purchase, or admin override trigger invalidates the Redis key immediately.
3. **Usage Check Interceptor:** API endpoints creating resources execute `EntitlementGuard` before processing the DTO:
```typescript
if (usageCount >= limit && limit !== -1) {
  throw new ForbiddenException({
    code: 'ENTITLEMENT_LIMIT_EXCEEDED',
    message: `You have reached the maximum limit of ${limit} active cards for your current plan.`,
    upgradeRequired: true
  });
}
```
