# 31 — Integration & Webhook Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Outgoing Webhook Subsystem, Event Signing, API Keys & Third-Party Integration Readiness  

---

## 1. Outgoing Webhook Engine

Alpha enables workspaces to receive real-time HTTP POST notifications when key platform events occur (e.g., lead captured, appointment booked, card updated).

```sql
CREATE TABLE webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret VARCHAR(128) NOT NULL, -- HMAC SHA-256 signing secret
    events VARCHAR(64)[] NOT NULL, -- Array of subscribed event codes
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    response_status INT,
    response_body TEXT,
    attempts INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL, -- DELIVERED, FAILED, RETRYING
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Webhook Event Signing Standard

All outgoing webhook requests include an HMAC SHA-256 signature in the HTTP header to allow clients to verify payload authenticity:

```text
X-Alpha-Signature: t=1726358400,v1=9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a
```

- `t`: Timestamp of event dispatch (protects against replay attacks).
- `v1`: `HMAC-SHA256(timestamp + "." + raw_json_payload, endpoint_secret)`.

---

## 3. Third-Party Integration Readiness

1. **API Keys:** Workspaces on Business/Enterprise plans can issue scoped API keys (`ak_live_...`) to access REST endpoints programmatically.
2. **Automation Hooks:** Pre-configured DTO schemas for Zapier, Make.com, and Pipedream integrations.
