# 28 — Caching & Performance Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Redis Cache Layer, Key Namespacing, TTL Strategy & Dynamic Invalidation Triggers  

---

## 1. Multi-Tier Caching Strategy

Alpha utilizes a 2-tier caching model to maintain sub-200ms latency on public cards and high-throughput dashboard endpoints.

```text
[HTTP Request]
      │
      ▼
[Tier 1: Cloudflare Edge Cache] ──(Hit: Public Card HTML)──► Return Response (<50ms)
      │ (Miss)
      ▼
[Tier 2: Redis In-Memory Cache] ──(Hit: Public Card Projection DTO)──► Return JSON (<100ms)
      │ (Miss)
      ▼
[Tier 3: PostgreSQL Database] ──► Fetch DB Record -> Write to Redis -> Return Response
```

---

## 2. Redis Cache Key Directory

| Cache Key Pattern | Cached Content | Default TTL | Invalidation Trigger |
|---|---|---|---|
| `alias:{hostname}:{path}` | Target Card `public_id` | 1 Hour | Alias update/delete |
| `card:projection:{public_id}` | Sanitized Public Card Projection DTO | 15 Mins | Card published/updated |
| `tenant:{workspace_id}:entitlements` | Resolved Workspace Entitlements | 15 Mins | Subscription change/override |
| `template:{template_id}:schema` | Template Layout JSON Schema | 24 Hours | Template modified by Admin |

---

## 3. Dynamic Cache Invalidation Flow

When a user modifies and publishes a card in the dashboard:
1. Card database revision status updates to `PUBLISHED`.
2. Application service emits internal `CardPublishedEvent`.
3. Event handler executes pipeline:
   - `redis.del('card:projection:' + publicId)`
   - `redis.del('alias:alpha.com:' + activeAlias)`
   - Purges Cloudflare CDN cache via Cloudflare Cache API.
