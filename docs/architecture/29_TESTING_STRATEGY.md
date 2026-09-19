# 29 — Testing Strategy & Quality Assurance

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Test Automation Pyramid, Integration Testing, Security Denial Suites & E2E Validation  

---

## 1. Automated Testing Pyramid

Alpha mandates a strict testing methodology. No feature is marked "Done" without corresponding unit, integration, and security tests.

```text
               ▲
              / \
             /   \     E2E Tests (Playwright - Critical User Journeys)
            /─────\
           /       \   Integration & Security Denial Tests (Supertest + Testcontainers)
          /─────────\
         /           \ Unit Tests (Jest/Vitest - Services, Policies, Entitlements)
        /─────────────\
```

---

## 2. Test Suite Matrix & Acceptance Criteria

### 2.1 Unit Testing (Target Coverage > 85%)
- Domain Business Rules & Calculations (Proration formula, slug normalization).
- Entitlement Evaluation Engine.
- RBAC Permission Evaluator.
- Input DTO Validation Schemas.

### 2.2 Integration Testing (Testcontainers PostgreSQL + Redis)
- Repository Queries & Foreign Key Constraints.
- Razorpay Webhook Signature Verification & Idempotency.
- BullMQ Job Processing & Queue Retries.

### 2.3 Mandatory Security Denial Tests (Cross-Tenant & Privacy)
Every tenant-scoped module MUST contain explicit security denial integration tests:
1. **Cross-Tenant Denial Test:** Verify that User A (Workspace 1) issuing a request to `/api/v1/workspaces/{Workspace_2_ID}/cards` receives `403 Forbidden`.
2. **Public Data Leakage Test:** Verify that `GET /api/v1/public/cards/{publicId}` NEVER returns private fields, unpublished draft revisions, or internal user emails.
3. **Billing Webhook Replay Test:** Verify that sending the same Razorpay webhook payload twice returns `200 OK` without duplicating invoice records.

### 2.4 End-to-End (E2E) Journeys (Playwright)
- Full User Signup -> Workspace Provisioning -> Card Creation -> Card Publishing -> Public Profile Viewing -> vCard Download -> Lead Submission -> Dashboard CRM View.
- Plan Upgrade -> Razorpay Checkout -> Entitlement Unlock Verification.
