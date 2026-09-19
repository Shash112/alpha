# Critical Audit Findings & Production Blockers

**Document Version:** 1.0  
**Status:** Audit Report  
**Scope:** Classified Defect Inventory, Severity Ratings & Recommended Fixes  

---

## 1. Production Blocker Findings (High Severity)

### Finding BLK-001: Workspace Dependencies Not Installed (Build Failure)
- **Severity:** HIGH / BLOCKER
- **Location:** Monorepo Workspace Root (`package.json`, `apps/*`, `packages/*`)
- **Requirement Violated:** `AGENTS.md` Section 19 (Build Verification & Clean Compilation)
- **Evidence:** Running `npm run build` throws `'next' is not recognized as an internal or external command` and `'tsc' is not recognized as an internal or external command`.
- **Consequence:** CI/CD pipeline cannot build container images or run static analysis.
- **Recommended Fix:** Run `npm install` at repository root to generate `node_modules` and link workspace packages.

---

### Finding BLK-002: Hardcoded API Route in Billing Dashboard Page
- **Severity:** HIGH / FUNCTIONAL BUG
- **Location:** `apps/web/src/app/dashboard/billing/page.tsx` (Line 12)
- **Requirement Violated:** `AGENTS.md` Section 12 (Billing Architecture) & Section 49 (No Hardcoded Mocks)
- **Evidence:** `fetch('http://localhost:4000/api/v1/workspaces/mock/billing/plans')` passes literal string `'mock'` instead of dynamic `activeWorkspaceId`.
- **Consequence:** Plan fetching in Billing UI will fail with HTTP 403 `TENANT_ACCESS_DENIED` in production.
- **Recommended Fix:** Replace `'mock'` with dynamic `activeWorkspaceId` from `localStorage`.

---

### Finding BLK-003: Missing Domain Controllers in Backend API (`server.ts`)
- **Severity:** HIGH / INCOMPLETE DOMAIN INTEGRATION
- **Location:** `apps/api/src/server.ts`
- **Requirement Violated:** `AGENTS.md` Section 6 (Complete Product Delivery Expectation) & Section 20 (Definition of Done)
- **Evidence:** Database tables exist for `nfc_devices`, `appointment_types`, `availability_schedules`, `appointments`, `departments`, `teams`, `custom_domains`, `reseller_accounts`, and `audit_logs`. However, `apps/api/src/server.ts` lacks API routes for:
  - Department/Team CRUD
  - NFC claim & tap redirection (`GET /nfc/:deviceUid`)
  - Appointment availability slot calculation & booking submission
  - Reseller sub-client creation & delegated access impersonation
  - Custom domain registration & DNS verification
  - Audit log query endpoints & mutation interceptors
- **Consequence:** Frontend users cannot claim NFC cards, book appointments, bind custom domains, or manage reseller client accounts via API.
- **Recommended Fix:** Wire the missing Express route handlers in `apps/api/src/server.ts` for these domains.

---

## 2. Non-Critical Findings (Medium / Low Severity)

### Finding NC-001: Missing Password Reset & Profile Edit API Endpoints
- **Severity:** MEDIUM
- **Location:** `apps/api/src/server.ts`
- **Description:** `POST /api/v1/auth/password/reset-request` and `PATCH /api/v1/users/me` are defined in API specifications but not yet wired in `server.ts`.
- **Recommended Fix:** Implement password reset token handling and user profile update routes.

---

### Finding NC-002: Card Revision Updating & Duplication Routes
- **Severity:** MEDIUM
- **Location:** `apps/api/src/server.ts`
- **Description:** `PUT /api/v1/workspaces/:id/cards/:cardId` (editing section content DTOs) and card duplication routes are missing.
- **Recommended Fix:** Add card update and duplication endpoints to `Cards` section in `server.ts`.
