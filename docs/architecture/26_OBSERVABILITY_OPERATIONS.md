# 26 — Observability & Operations Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Structured JSON Logging, Distributed Tracing, Metrics Collection & Health Checks  

---

## 1. Structured JSON Logging

All applications (`apps/api`, `apps/web`) write structured JSON logs to standard output (`stdout`) using Pino/Winston. Every log entry MUST include `correlation_id` and `workspace_id` when available.

```json
{
  "level": "info",
  "timestamp": "2026-09-15T00:48:10.123Z",
  "correlation_id": "req_8f92a11b4c6e",
  "workspace_id": "018f92a1-1b4c-7e89-a1b2-c3d4e5f6a7b8",
  "user_id": "usr_998877665544",
  "module": "CardsModule",
  "message": "Card published successfully",
  "details": {
    "card_id": "crd_12345",
    "public_id": "7Kx9mP4QaZ8Vt2N6",
    "revision": 3
  }
}
```

---

## 2. Health Check Endpoints

Alpha provides standardized Kubernetes / ECS health probe endpoints:

- `GET /health/live` (Liveness Probe): Returns HTTP 200 if container API is responding.
- `GET /health/ready` (Readiness Probe): Verifies connectivity to PostgreSQL, Redis, and S3 before routing traffic. Returns HTTP 503 if DB is unreachable.

---

## 3. Metrics & Alerting Strategy

1. **Prometheus Metrics (`/metrics`):** Exposes HTTP request latency histograms, status code counters (5xx rates), active Redis queue lengths, and DB connection pool stats.
2. **Sentry Error Tracking:** Captures unhandled backend exceptions and frontend React errors with full stack traces and correlation IDs.
3. **Critical Alerts:**
   - 5xx API Error Rate > 2% over 5 minutes -> PagerDuty Alert to On-Call Engineer.
   - DB Connection Pool Exhaustion > 90% -> Auto-scale alert.
   - Redis Queue Lag > 5,000 jobs -> Alert Operations channel.
