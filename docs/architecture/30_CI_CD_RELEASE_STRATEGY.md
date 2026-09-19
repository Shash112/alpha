# 30 — CI/CD & Release Strategy

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** GitHub Actions CI/CD Pipelines, Automated Testing Gating, Migration Safety & Rolling Deployments  

---

## 1. GitHub Actions Pipeline Architecture

Every Pull Request and commit to `main` branch triggers automated CI/CD pipeline checks. Code cannot be merged if any stage fails.

```text
[Git Push / PR to main]
          │
          ▼
   [Stage 1: Lint & Type Check] ──► (ESLint, Prettier, tsc --noEmit)
          │
          ▼
   [Stage 2: Unit & Integration Tests] ──► (Jest + Testcontainers DB)
          │
          ▼
   [Stage 3: Security & Audit Scan] ──► (npm audit, SonarQube, Snyk)
          │
          ▼
   [Stage 4: Docker Build & Push] ──► (Build multi-stage Docker images -> Push to ECR)
          │
          ▼
   [Stage 5: Database Migration] ──► (Execute zero-downtime Schema Migration)
          │
          ▼
   [Stage 6: ECS Rolling Deployment] ──► (Deploy updated task definitions to ECS)
```

---

## 2. Zero-Downtime Migration Policy

Schema changes MUST follow **Expand-Contract Migration Pattern** to ensure backwards compatibility with running backend tasks:

1. **Phase 1 (Expand):** Add new columns as nullable or with default values. Deploy application code that writes to both old and new columns.
2. **Phase 2 (Backfill):** Run async migration script to populate historical data.
3. **Phase 3 (Contract):** Deploy application code reading exclusively from new columns. Remove deprecated old columns in a subsequent release.
