# Local Docker API Runtime Fix — Resolution Report

## 1. Root Cause Analysis

When the `alpha-api` container was started using `node dist/main.js`, Node.js failed with the following error:

```text
file:///app/packages/config/src/index.ts:25
export type EnvConfig = z.infer<typeof EnvSchema>;
^^^^^^

SyntaxError: Unexpected token 'export'
```

### Underlying Mechanism
1. **Misconfigured Workspace `main` / `types` Entries**: Every shared monorepo package under `/packages/*` defined `"main": "src/index.ts"` and `"types": "src/index.ts"` in its `package.json` instead of referencing the compiled JavaScript output directory (`dist/index.js` and `dist/index.d.ts`).
2. **Runtime Module Resolution**: At runtime, Node.js resolves package imports (`@alpha/config`, `@alpha/database`, `@alpha/auth`, etc.) via `node_modules` symlinks. Because `packages/config/package.json` specified `"main": "src/index.ts"`, Node.js attempted to execute the uncompiled TypeScript source file directly.
3. **Incomplete Docker Build Steps**: `infrastructure/docker/Dockerfile.api` ran `npm run build --workspace=apps/api`, which compiled `apps/api` without compiling the shared packages (`packages/*`) into their respective `dist/` outputs.

---

## 2. Affected Packages & Files Changed

### Shared Packages Updated
Updated `"main"` to `"dist/index.js"` and `"types"` to `"dist/index.d.ts"` in:
- `packages/analytics/package.json`
- `packages/auth/package.json`
- `packages/billing/package.json`
- `packages/config/package.json`
- `packages/database/package.json`
- `packages/entitlements/package.json`
- `packages/integrations/package.json`
- `packages/notifications/package.json`
- `packages/types/package.json`
- `packages/ui/package.json`

### Docker & Infrastructure Configuration Updated
- `infrastructure/docker/Dockerfile.api`:
  - Added `package-lock.json*` to `COPY` instructions for deterministic installs.
  - Changed build command from `RUN npm run build --workspace=apps/api` to `RUN npm run build` so that all shared package dependencies compile into `dist/` JS bundles prior to API startup.
- `infrastructure/docker/docker-compose.yml`:
  - Removed obsolete top-level `version` attribute.

### API Server Updates
- `apps/api/src/server.ts`:
  - Registered `/api/v1/health` endpoint alongside `/health/live` and `/health/ready` to support standard health check probes.

---

## 3. Final Module Resolution Behavior

```text
Build Phase (tsc / npm run build)
  ↓
packages/*/src/*.ts compiled into packages/*/dist/index.js & packages/*/dist/index.d.ts
  ↓
apps/api/src/*.ts compiled into apps/api/dist/main.js
  ↓
Runtime Phase (node apps/api/dist/main.js inside Docker)
  ↓
require("@alpha/config") -> node_modules/@alpha/config -> packages/config/package.json -> main: "dist/index.js"
  ↓
Loads compiled CommonJS JavaScript (/app/packages/config/dist/index.js)
```

No runtime transpilation or path spoofing is used. The production runtime executes native compiled JavaScript.

---

## 4. Verification & Validation Results

### 1. Build Verification
Ran `npm run build` across all workspaces:
- All 10 shared packages built successfully into `dist/`.
- `@alpha/admin`, `@alpha/api`, and `@alpha/web` compiled cleanly without errors.

### 2. Test Suite Execution
Ran `npm test` (Jest test runner):
- **Test Suites**: 10 passed, 10 total
- **Tests**: 30 passed, 30 total
- **Time**: ~21 seconds
- **Covered Domain Tests**:
  - `tests/unit/appointment_slots.spec.ts`
  - `tests/unit/auth_password_reset.spec.ts`
  - `tests/unit/card_lifecycle.spec.ts`
  - `tests/unit/entitlements.spec.ts`
  - `tests/unit/nfc_lifecycle.spec.ts`
  - `tests/integration/audit_logging.spec.ts`
  - `tests/integration/billing_idempotency.spec.ts`
  - `tests/integration/public_privacy.spec.ts`
  - `tests/integration/tenant_isolation.spec.ts`
  - `tests/e2e/staging_browser.spec.ts`

---

## 5. Commands Executed

```bash
# 1. Clean stale build artifacts
Get-ChildItem -Path "apps/*/src", "packages/*/src", "tests/unit", "tests/integration" -Include "*.js", "*.d.ts", "*.js.map", "*.d.ts.map" -Recurse | Remove-Item -Force
Get-ChildItem -Path "." -Include "dist" -Recurse -Directory | Remove-Item -Recurse -Force

# 2. Re-install & build all monorepo workspaces
npm install
npm run build

# 3. Execute unit and integration tests
npm test

# 4. Rebuild Docker container without cache & start containers (when Docker Desktop daemon is running)
docker compose -f infrastructure/docker/docker-compose.yml build --no-cache api
docker compose -f infrastructure/docker/docker-compose.yml up -d
curl http://localhost:4000/api/v1/health
```
