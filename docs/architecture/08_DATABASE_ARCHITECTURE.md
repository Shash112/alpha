# 08 — Database Architecture & Schema Specification

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** PostgreSQL Physical Database Design, Table Schemas, Constraints, Indexes & Migration Guidelines  

---

## 1. Database Standards & Primary Keys

1. **Database Engine:** PostgreSQL 16+
2. **Primary Key Standard:** `UUIDv7` (Time-ordered sequential UUIDs for optimal B-tree index performance).
3. **Timestamps Standard:** `TIMESTAMPTZ` (Stored in UTC).
4. **Tenant Scoping:** All tenant-owned tables MUST include `workspace_id UUID NOT NULL REFERENCES workspaces(id)`.
5. **Naming Conventions:** `snake_case` for all table names, column names, and constraint names.

---

## 2. Core Relational Schema SQL (DDL)

```sql
-- Enable UUIDv7 / Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. IDENTITY & USERS
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(32),
    locale VARCHAR(10) DEFAULT 'en-IN',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, DELETED
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL, -- local, google, apple, saml
    provider_user_id VARCHAR(255) NOT NULL,
    credentials JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- ==========================================
-- 2. WORKSPACES & MEMBERSHIPS
-- ==========================================
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(32) NOT NULL DEFAULT 'PERSONAL', -- PERSONAL, TEAM, BUSINESS, ENTERPRISE, AGENCY
    name VARCHAR(200) NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- TRIAL, ACTIVE, PAST_DUE, SUSPENDED, CANCELLED, DELETED
    logo_url TEXT,
    brand_color VARCHAR(16),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- NULL for platform global roles
    name VARCHAR(64) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, name)
);

CREATE TABLE permissions (
    id VARCHAR(64) PRIMARY KEY, -- e.g. cards.create, leads.read
    category VARCHAR(32) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE workspace_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INVITED, SUSPENDED
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);

-- ==========================================
-- 3. ORGANIZATIONS, DEPARTMENTS & TEAMS
-- ==========================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, name)
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. CARDS, REVISIONS & ALIASES
-- ==========================================
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(64) NOT NULL UNIQUE,
    category VARCHAR(32) NOT NULL,
    layout_schema JSONB NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(32) NOT NULL UNIQUE, -- Immutable Public Identifier e.g. 7Kx9mP4QaZ8Vt2N6
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    owner_user_id UUID REFERENCES users(id),
    template_id UUID NOT NULL REFERENCES templates(id),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, UNPUBLISHED, SUSPENDED, ARCHIVED, DELETED
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    published_revision_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE card_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    content_data JSONB NOT NULL, -- Complete card payload (contacts, links, sections, styles)
    visibility_data JSONB NOT NULL, -- Field visibility rules (public, private, hidden)
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(card_id, revision_number)
);

CREATE TABLE aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    hostname VARCHAR(255) NOT NULL DEFAULT 'alpha.com',
    path VARCHAR(100) NOT NULL, -- Normalized path e.g. 'shashank'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hostname, path)
);

-- ==========================================
-- 5. LEADS, CONTACTS & CRM
-- ==========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(32),
    company VARCHAR(100),
    notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, CONVERTED, ARCHIVED
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. ANALYTICS EVENTS & AGGREGATES
-- ==========================================
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    event_type VARCHAR(32) NOT NULL, -- VIEW, CLICK, SAVE_CONTACT, LEAD_SUBMIT, QR_SCAN, NFC_TAP
    metadata JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_hash VARCHAR(64),
    country VARCHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 7. BILLING & SUBSCRIPTIONS
-- ==========================================
CREATE TABLE plans (
    id VARCHAR(64) PRIMARY KEY, -- plan_personal_pro, plan_team_annual
    family VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    billing_period VARCHAR(16) NOT NULL, -- MONTHLY, ANNUAL
    price_inr INT NOT NULL, -- Stored in smallest currency unit (paise) e.g., 49900 = ₹499.00
    entitlements_schema JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id VARCHAR(64) NOT NULL REFERENCES plans(id),
    provider VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    provider_subscription_id VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL, -- ACTIVE, PAST_DUE, UNPAID, CANCELLED, HALTED
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. High-Performance Indexing Strategy

```sql
-- Tenant Scoping Composite Indexes
CREATE INDEX idx_cards_workspace_status ON cards(workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_workspace_created ON leads(workspace_id, created_at DESC);
CREATE INDEX idx_analytics_card_event ON analytics_events(card_id, event_type, created_at DESC);

-- Public Card Lookup Index (Ultra-fast resolution)
CREATE INDEX idx_cards_public_id ON cards(public_id) WHERE status = 'PUBLISHED';
CREATE INDEX idx_aliases_lookup ON aliases(hostname, path) WHERE is_active = TRUE;
```

---

## 4. Retention & Soft-Delete Rules

1. **Soft Delete (`deleted_at`):** Used for `users`, `workspaces`, `cards`. Soft-deleted items are excluded from standard API queries via ORM middleware.
2. **Hard Delete Purge Worker:** Async worker permanently purges items soft-deleted for more than 30 days.
3. **Analytics Event Partitioning:** `analytics_events` table is range-partitioned by `created_at` monthly. Old partitions are dropped according to plan retention limits.
