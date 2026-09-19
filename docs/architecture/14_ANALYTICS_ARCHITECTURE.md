# 14 — Analytics Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Asynchronous Event Capture Pipeline, Aggregation Pipeline, Privacy Controls & Reporting APIs  

---

## 1. Executive Analytics Rule

Analytics logging MUST NEVER execute synchronously within public card rendering HTTP requests. Public card pages MUST load in under **200ms** unblocked by database writes or metrics calculation.

---

## 2. Decoupled Asynchronous Analytics Pipeline

```text
[Public Card Interaction (View, Click, Scan, Tap)]
                       │
                       ▼
[Lightweight Beacon / Event Endpoint (/api/v1/public/analytics/event)]
                       │
                       ▼ (Returns 202 Accepted instantly)
[Push Event Payload to Redis Queue ('analytics-events')]
                       │
                       ▼
[NestJS Analytics Worker Process (Batch Size = 500 / Interval = 5s)]
                       │
                       ├── Write Raw Event to 'analytics_events' (Partitioned Table)
                       └── Increment Daily Rollup Aggregates in 'daily_analytics_aggregates'
                                       │
                                       ▼
                       [Dashboard Analytics API (/api/v1/.../analytics)]
```

---

## 3. Physical Aggregate Schema

```sql
CREATE TABLE daily_analytics_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views_count INT NOT NULL DEFAULT 0,
    unique_visitors_count INT NOT NULL DEFAULT 0,
    clicks_count INT NOT NULL DEFAULT 0,
    save_contact_count INT NOT NULL DEFAULT 0,
    lead_submissions_count INT NOT NULL DEFAULT 0,
    qr_scans_count INT NOT NULL DEFAULT 0,
    nfc_taps_count INT NOT NULL DEFAULT 0,
    UNIQUE(card_id, date)
);

CREATE INDEX idx_daily_analytics_lookup ON daily_analytics_aggregates(workspace_id, date DESC);
```

---

## 4. Privacy & Compliance Controls

1. **IP Anonymization:** Raw IP addresses are NEVER stored in cleartext. IPs are hashed using SHA-256 with a daily rotating salt: `SHA256(ip + daily_salt)`.
2. **User-Agent Parsing:** User agents are parsed asynchronously in background workers to extract high-level OS, Browser family, and Device category (Mobile vs Desktop) without storing intrusive tracking cookies.
3. **Data Retention Policy:**
   - Free Personal: 30 Days raw events.
   - Pro / Team: 365 Days raw events.
   - Business / Enterprise: 730 Days raw events + unlimited daily aggregates.
