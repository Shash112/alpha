# 27 — Background Jobs & Queues Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** BullMQ Queue Architecture, Job Workers, Tenant Context Propagation & Dead Letter Handling  

---

## 1. BullMQ / Redis Queue Topology

Asynchronous processing in Alpha is handled using **BullMQ** running on Redis. Producer applications (`apps/api`) enqueue jobs into dedicated queues processed asynchronously by background worker tasks (`worker-app`).

```text
[NestJS API Producer]
          │
          ▼
   [Redis BullMQ Clusters]
          │
          ├── 'email-queue' ────────► [Email Worker: SendGrid/SES]
          ├── 'analytics-queue' ────► [Analytics Aggregator Worker]
          ├── 'media-queue' ────────► [Image Resizing Worker]
          ├── 'webhook-queue' ──────► [Outgoing Webhook Worker]
          └── 'billing-queue' ──────► [Razorpay Subscription Reconciler]
```

---

## 2. Queue Catalogue & Retry Policy

| Queue Name | Job Purpose | Max Retries | Backoff Strategy | DLQ Enabled |
|---|---|---|---|---|
| `email-queue` | Transactional emails | 5 | Exponential (10s, 30s, 2m, 10m) | Yes |
| `analytics-queue` | Analytics event batching | 3 | Fixed (5s) | Yes |
| `media-queue` | Image crop/compression | 3 | Exponential (5s, 30s) | Yes |
| `webhook-queue` | Customer HTTP webhooks | 5 | Exponential (15s, 1m, 5m, 30m) | Yes |
| `billing-queue` | Razorpay event processing | 5 | Exponential (30s, 2m, 10m, 1h) | Yes |

---

## 3. Tenant Context & Dead Letter Queue (DLQ) Rules

1. **Job Payload Scoping:** Every background job MUST explicitly include `workspaceId` in its payload data object:
```json
{
  "jobId": "job_998877",
  "workspaceId": "018f92a1-1b4c-7e89-a1b2-c3d4e5f6a7b8",
  "eventType": "lead.captured",
  "payload": { "leadId": "lead_123" }
}
```
2. **Dead Letter Queue (DLQ):** Jobs failing all retry attempts are automatically moved to `<queue-name>:dlq` for admin inspection and manual replay via Platform Admin Console.
