# 09 — API Architecture & Catalogue Specification

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** REST API Conventions, OpenAPI 3.0 Standard, Global Error Catalog & Comprehensive Endpoint Directory  

---

## 1. REST API Standards & Conventions

1. **Base URL Prefix:** `/api/v1`
2. **Payload Protocol:** JSON (`Content-Type: application/json`).
3. **Authentication Header:** `Authorization: Bearer <JWT_ACCESS_TOKEN>` or HTTP-Only Session Cookie.
4. **Tenant Header:** `X-Workspace-Id: <WORKSPACE_UUID>` (Required for all protected workspace routes).
5. **Idempotency Header:** `Idempotency-Key: <UUIDv4>` (Supported on all POST/PUT mutation routes).
6. **Pagination Format:** Cursor-based pagination for feeds/logs; offset-based for tabular grids:
```json
{
  "data": [...],
  "pagination": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "nextCursor": "eyJpZCI6IjEyMyJ9"
  }
}
```

---

## 2. Standard Machine-Readable Error Response Schema

All error responses strictly adhere to the standardized machine-readable JSON structure:

```json
{
  "code": "CARD_SLUG_ALREADY_EXISTS",
  "message": "The selected vanity URL 'shashank' is already in use by another card.",
  "requestId": "req_8f92a11b4c6e",
  "timestamp": "2026-09-15T00:48:00Z",
  "details": {
    "field": "path",
    "value": "shashank"
  }
}
```

### Global Error Code Catalogue
- `UNAUTHENTICATED` (401): Missing or expired access token.
- `TENANT_ACCESS_DENIED` (403): User does not hold valid membership in requested workspace.
- `PERMISSION_DENIED` (403): User role lacks required permission scope.
- `ENTITLEMENT_LIMIT_EXCEEDED` (403): Operation exceeds active workspace plan numeric limit.
- `RESOURCE_NOT_FOUND` (404): Target resource ID does not exist or has been deleted.
- `CARD_SLUG_ALREADY_EXISTS` (409): Target vanity URL alias is already claimed.
- `CONCURRENCY_CONFLICT` (409): Resource version conflict during optimistic lock check.
- `RATE_LIMIT_EXCEEDED` (429): Request throttled by rate limiting guard.
- `INTERNAL_SERVER_ERROR` (500): Unhandled exception caught by global filter.

---

## 3. Comprehensive Endpoint Catalogue

### 3.1 Auth & Identity Domain (`/api/v1/auth`)
- `POST /auth/register`: Create user account & default personal workspace.
- `POST /auth/login`: Authenticate with email/password, return access & refresh tokens.
- `POST /auth/logout`: Revoke active session / refresh token.
- `POST /auth/refresh`: Exchange refresh token for new access token.
- `GET  /auth/me`: Fetch authenticated user profile & active workspace list.
- `POST /auth/password/reset-request`: Trigger password reset email.
- `POST /auth/password/reset-confirm`: Execute password reset with token.

### 3.2 Workspaces & Memberships Domain (`/api/v1/workspaces`)
- `GET  /workspaces`: List all workspaces user belongs to.
- `POST /workspaces`: Create new team/business workspace.
- `GET  /workspaces/:id`: Get workspace details & branding settings.
- `PATCH /workspaces/:id`: Update workspace configuration.
- `GET  /workspaces/:id/members`: List workspace members & assigned roles.
- `POST /workspaces/:id/invitations`: Invite new member via email.
- `DELETE /workspaces/:id/members/:memberId`: Remove member from workspace.

### 3.3 Cards Domain (`/api/v1/workspaces/:workspaceId/cards`)
- `GET  /`: List all cards in workspace with status filters.
- `POST /`: Create draft card identity.
- `GET  /:cardId`: Fetch complete card metadata and current draft content.
- `PUT  /:cardId/content`: Update card sections, content payload & visibility rules.
- `POST /:cardId/publish`: Publish current draft revision to public profile projection.
- `POST /:cardId/unpublish`: Unpublish card (revert to offline status).
- `DELETE /:cardId`: Soft-delete card and unbind active vanity aliases.

### 3.4 Public Cards Domain (`/api/v1/public`)
- `GET  /cards/id/:publicId`: Fetch sanitized public profile projection by Public ID.
- `GET  /cards/alias/:alias`: Resolve vanity alias (e.g. `shashank`) and return public profile.
- `POST /cards/:publicId/leads`: Submit lead capture form on public card.
- `GET  /cards/:publicId/vcard`: Download `.vcf` vCard contact file.

### 3.5 Billing & Subscriptions (`/api/v1/workspaces/:workspaceId/billing`)
- `GET  /plans`: Fetch available commercial plans & prices.
- `GET  /subscription`: Get active subscription & entitlement usage overview.
- `POST /subscription/checkout`: Create Razorpay order/subscription for upgrade.
- `POST /subscription/cancel`: Cancel subscription at period end.
- `POST /webhooks/billing/razorpay`: Razorpay payment webhook endpoint (Public).

### 3.6 Leads, CRM & Analytics (`/api/v1/workspaces/:workspaceId/...`)
- `GET  /leads`: List captured leads with filter/search.
- `PATCH /leads/:leadId`: Update lead status (`CONTACTED`, `QUALIFIED`, etc.).
- `GET  /leads/export`: Download CSV export of captured leads.
- `GET  /analytics/overview`: Fetch card view, click, scan & conversion metrics.
