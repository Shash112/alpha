# 33 — Configuration & Feature Flags Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Environment Variable Validation Schemas, Dynamic Feature Flag Engine & Rollout Strategies  

---

## 1. Environment Variable Schema Validation

All environment configurations are validated at application startup using `zod` schemas. If required variables are missing or malformed, the process halts immediately.

```typescript
import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_REGION: z.string().default('ap-south-1'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;
```

---

## 2. Feature Flag Subsystem

Alpha incorporates a lightweight feature flag evaluator allowing gradual rollouts, beta testing, and emergency kill-switches without redeploying code.

```sql
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(64) NOT NULL UNIQUE, -- e.g., 'enable_nfc_v2_flows'
    description TEXT,
    is_globally_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    percentage_rollout INT NOT NULL DEFAULT 0, -- 0 to 100%
    target_workspace_ids UUID[] DEFAULT '{}', -- Explicit beta workspace grants
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Feature Flag Resolution

```typescript
const isFeatureActive = await featureFlagService.isFeatureEnabled('enable_nfc_v2_flows', workspaceId);
```

1. Checks if `is_globally_enabled == true`.
2. Checks if `workspaceId` is listed in `target_workspace_ids`.
3. Evaluates consistent hash `MurmurHash3(workspaceId + key) % 100 < percentage_rollout`.
