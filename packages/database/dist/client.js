"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbPool = getDbPool;
exports.query = query;
exports.transaction = transaction;
const pg_1 = require("pg");
const config_1 = require("@alpha/config");
const pg_mem_1 = require("pg-mem");
let pool = null;
let useFallbackDb = false;
let memPoolInstance = null;
function isConnRefused(error) {
    if (!error)
        return false;
    if (error.code === 'ECONNREFUSED')
        return true;
    if (typeof error.message === 'string' && error.message.includes('ECONNREFUSED'))
        return true;
    if (Array.isArray(error.errors)) {
        return error.errors.some((e) => e?.code === 'ECONNREFUSED' || (typeof e?.message === 'string' && e.message.includes('ECONNREFUSED')));
    }
    return false;
}
function getDbPool() {
    if (!pool) {
        const env = (0, config_1.validateEnv)();
        pool = new pg_1.Pool({
            connectionString: env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        pool.on('error', (err) => {
            console.error('❌ Unexpected PostgreSQL pool error:', err?.message || err);
        });
    }
    return pool;
}
let memInitPromise = null;
function cleanQueryForPgMem(text) {
    if (typeof text !== 'string')
        return text;
    const upper = text.toUpperCase();
    if (upper.includes('CREATE EXTENSION') || upper.includes('CREATE TABLE IF NOT EXISTS USERS')) {
        // pg-mem schema is already initialized via initMemDbSchema, skip Postgres-specific full DDL
        return '';
    }
    return text;
}
async function executeMemQuery(mem, text, params) {
    if (memInitPromise) {
        await memInitPromise;
    }
    const clean = cleanQueryForPgMem(text);
    if (!clean.trim()) {
        return { rows: [], rowCount: 0, command: 'CREATE', oid: 0, fields: [] };
    }
    return await mem.query(clean, params);
}
function getMemDbPool() {
    if (memPoolInstance)
        return memPoolInstance;
    const db = (0, pg_mem_1.newDb)();
    let uuidCounter = 1000;
    db.public.registerFunction({
        name: 'gen_random_uuid',
        implementation: () => `018f92a1-0000-7000-8000-${(uuidCounter++).toString().padStart(12, '0')}`
    });
    db.public.registerFunction({
        name: 'version',
        implementation: () => 'PostgreSQL 14.0 (pg-mem fallback)'
    });
    const adapter = db.adapters.createPg();
    const rawPool = new adapter.Pool();
    const originalPoolQuery = rawPool.query.bind(rawPool);
    rawPool.query = function (text, params) {
        if (typeof text === 'string' && text.toUpperCase().includes('CREATE EXTENSION')) {
            const clean = cleanQueryForPgMem(text);
            if (!clean.trim()) {
                return Promise.resolve({ rows: [], rowCount: 0, command: '', oid: 0, fields: [] });
            }
            return originalPoolQuery(clean, params);
        }
        return originalPoolQuery(text, params);
    };
    const originalConnect = rawPool.connect.bind(rawPool);
    rawPool.connect = async function () {
        const client = await originalConnect();
        const originalClientQuery = client.query.bind(client);
        client.query = function (text, params) {
            if (typeof text === 'string' && text.toUpperCase().includes('CREATE EXTENSION')) {
                const clean = cleanQueryForPgMem(text);
                if (!clean.trim()) {
                    return Promise.resolve({ rows: [], rowCount: 0, command: '', oid: 0, fields: [] });
                }
                return originalClientQuery(clean, params);
            }
            return originalClientQuery(text, params);
        };
        return client;
    };
    memPoolInstance = rawPool;
    if (!memInitPromise) {
        memInitPromise = initMemDbSchema(memPoolInstance).catch(err => console.error('pg-mem init error:', err));
    }
    return memPoolInstance;
}
async function initMemDbSchema(memPool) {
    try {
        const ddl = `
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          password_hash VARCHAR(255),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          display_name VARCHAR(200) NOT NULL,
          avatar_url TEXT,
          phone VARCHAR(32),
          locale VARCHAR(10) DEFAULT 'en-US',
          timezone VARCHAR(50) DEFAULT 'UTC',
          status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS workspaces (
          id UUID PRIMARY KEY,
          type VARCHAR(32) NOT NULL DEFAULT 'PERSONAL',
          name VARCHAR(200) NOT NULL,
          owner_user_id UUID NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
          logo_url TEXT,
          brand_color VARCHAR(16),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY,
          workspace_id UUID,
          name VARCHAR(64) NOT NULL,
          is_system BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS permissions (
          id VARCHAR(64) PRIMARY KEY,
          category VARCHAR(32) NOT NULL,
          description TEXT
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
          role_id UUID NOT NULL,
          permission_id VARCHAR(64) NOT NULL,
          PRIMARY KEY (role_id, permission_id)
      );

      CREATE TABLE IF NOT EXISTS workspace_memberships (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          user_id UUID NOT NULL,
          role_id UUID NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
          invited_by UUID,
          joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS departments (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(32),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teams (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          department_id UUID,
          name VARCHAR(100) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS templates (
          id UUID PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(64) NOT NULL UNIQUE,
          category VARCHAR(32) NOT NULL,
          layout_schema JSONB NOT NULL,
          is_system BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cards (
          id UUID PRIMARY KEY,
          public_id VARCHAR(32) NOT NULL UNIQUE,
          workspace_id UUID NOT NULL,
          owner_user_id UUID,
          template_id UUID NOT NULL,
          title VARCHAR(200) NOT NULL,
          theme_color VARCHAR(16) DEFAULT '#2563EB',
          theme_name VARCHAR(64) DEFAULT 'Professional',
          status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
          is_primary BOOLEAN NOT NULL DEFAULT FALSE,
          published_revision_id UUID,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS card_revisions (
          id UUID PRIMARY KEY,
          card_id UUID NOT NULL,
          revision_number INT NOT NULL,
          content_data JSONB NOT NULL,
          visibility_data JSONB NOT NULL,
          created_by UUID NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS aliases (
          id UUID PRIMARY KEY,
          card_id UUID NOT NULL,
          hostname VARCHAR(255) NOT NULL DEFAULT 'alpha.com',
          path VARCHAR(100) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS leads (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          card_id UUID NOT NULL,
          name VARCHAR(200) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(32),
          company VARCHAR(100),
          notes TEXT,
          status VARCHAR(32) NOT NULL DEFAULT 'NEW',
          custom_fields JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_events (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          card_id UUID NOT NULL,
          event_type VARCHAR(32) NOT NULL,
          metadata JSONB DEFAULT '{}',
          user_agent TEXT,
          ip_hash VARCHAR(64),
          country VARCHAR(2),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS plans (
          id VARCHAR(64) PRIMARY KEY,
          family VARCHAR(32) NOT NULL,
          name VARCHAR(100) NOT NULL,
          billing_period VARCHAR(16) NOT NULL,
          prices_schema JSONB NOT NULL DEFAULT '{"USD": 0, "EUR": 0, "GBP": 0, "INR": 0}',
          price_inr INT NOT NULL DEFAULT 0,
          entitlements_schema JSONB NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          plan_id VARCHAR(64) NOT NULL,
          provider VARCHAR(32) NOT NULL DEFAULT 'STRIPE',
          provider_subscription_id VARCHAR(128) NOT NULL,
          status VARCHAR(32) NOT NULL,
          current_period_start TIMESTAMPTZ NOT NULL,
          current_period_end TIMESTAMPTZ NOT NULL,
          cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS nfc_devices (
          id UUID PRIMARY KEY,
          device_uid VARCHAR(128) NOT NULL UNIQUE,
          activation_code VARCHAR(32) NOT NULL UNIQUE,
          workspace_id UUID,
          assigned_card_id UUID,
          status VARCHAR(32) NOT NULL DEFAULT 'UNACTIVATED',
          tap_count INT NOT NULL DEFAULT 0,
          last_tapped_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          card_id UUID NOT NULL,
          appointment_type_id UUID,
          attendee_name VARCHAR(200) NOT NULL,
          attendee_email VARCHAR(255) NOT NULL,
          attendee_phone VARCHAR(32),
          start_time TIMESTAMPTZ NOT NULL,
          end_time TIMESTAMPTZ NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
          meeting_link TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS custom_domains (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          hostname VARCHAR(255) NOT NULL UNIQUE,
          verification_token VARCHAR(128) NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'PENDING_VERIFICATION',
          ssl_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY,
          workspace_id UUID NOT NULL,
          actor_user_id UUID NOT NULL,
          action VARCHAR(64) NOT NULL,
          target_resource_type VARCHAR(32) NOT NULL,
          target_resource_id VARCHAR(128) NOT NULL,
          changes_json JSONB DEFAULT '{}',
          ip_address VARCHAR(45) NOT NULL,
          user_agent TEXT,
          is_delegated BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
        // Execute statements sequentially
        for (const stmt of ddl.split(';')) {
            const trimmed = stmt.trim();
            if (trimmed)
                await memPool.query(trimmed);
        }
        // Seed default template
        await memPool.query(`
      INSERT INTO templates (id, name, slug, category, layout_schema, is_system)
      VALUES ('018f92a1-0000-7000-8000-000000000001', 'Corporate Executive', 'corporate-executive', 'Corporate', '{"theme":{"primaryColor":"#0F172A"}}', TRUE)
      ON CONFLICT (slug) DO NOTHING
    `);
        // Seed default plan
        await memPool.query(`
      INSERT INTO plans (id, family, name, billing_period, price_inr, entitlements_schema)
      VALUES ('plan_business_annual', 'Business', 'Business Plan', 'ANNUAL', 999900, '{"cards.max_active_count":100}')
      ON CONFLICT (id) DO NOTHING
    `);
        // Seed default demo user: shashank@alpha.com / Password123!
        const userId = '018f92a1-0000-7000-8000-000000000010';
        const wsId = '018f92a1-0000-7000-8000-000000000020';
        const roleId = '018f92a1-0000-7000-8000-000000000030';
        const passHash = '$2a$10$ij5DRud.zZXf9LFeFPVo.u35bAXFYaOfrj7cVbVSm7GHNw8zdFPki'; // Password123!
        await memPool.query(`
      INSERT INTO users (id, email, password_hash, display_name, first_name, last_name)
      VALUES ('${userId}', 'shashank@alpha.com', '${passHash}', 'Shashank Shekhar', 'Shashank', 'Shekhar')
      ON CONFLICT (email) DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO workspaces (id, type, name, owner_user_id)
      VALUES ('${wsId}', 'BUSINESS', 'Alpha Identity Workspace', '${userId}')
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO roles (id, workspace_id, name, is_system)
      VALUES ('${roleId}', '${wsId}', 'OWNER', TRUE)
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO workspace_memberships (id, workspace_id, user_id, role_id, status)
      VALUES ('018f92a1-0000-7000-8000-000000000035', '${wsId}', '${userId}', '${roleId}', 'ACTIVE')
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO subscriptions (id, workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
      VALUES ('018f92a1-0000-7000-8000-000000000038', '${wsId}', 'plan_business_annual', 'INTERNAL', 'sub_demo_100', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING
    `);
        // Seed default card
        const cardId = '018f92a1-0000-7000-8000-000000000040';
        const revId = '018f92a1-0000-7000-8000-000000000045';
        await memPool.query(`
      INSERT INTO cards (id, public_id, workspace_id, owner_user_id, template_id, title, status, theme_color, theme_name, published_revision_id)
      VALUES ('${cardId}', 'c_shashank_demo', '${wsId}', '${userId}', '018f92a1-0000-7000-8000-000000000001', 'Shashank Shekhar - Lead Product Architect', 'PUBLISHED', '#2563EB', 'Professional', '${revId}')
      ON CONFLICT (public_id) DO NOTHING
    `);
        const sectionsData = JSON.stringify([
            {
                id: 'sec_hero',
                type: 'hero',
                order: 0,
                enabled: true,
                fields: {
                    name: { value: 'Shashank Shekhar', visibility: 'PUBLIC' },
                    designation: { value: 'Lead Product Architect & Principal Engineer', visibility: 'PUBLIC' },
                    company: { value: 'Alpha Technologies', visibility: 'PUBLIC' },
                    bio: { value: 'Building next-generation digital identity and multi-tenant SaaS platforms.', visibility: 'PUBLIC' }
                }
            },
            {
                id: 'sec_contact',
                type: 'contact',
                order: 1,
                enabled: true,
                fields: {
                    email: { value: 'shashank@alpha.com', visibility: 'PUBLIC' },
                    phone: { value: '+91 9876543210', visibility: 'PUBLIC' },
                    website: { value: 'https://alpha.com', visibility: 'PUBLIC' },
                    social_linkedin: { value: 'https://linkedin.com/in/shashankshekhar', visibility: 'PUBLIC' },
                    social_twitter: { value: 'https://x.com/shashankshekhar', visibility: 'PUBLIC' },
                    social_github: { value: 'https://github.com/shashankshekhar', visibility: 'PUBLIC' }
                }
            }
        ]);
        // Seed user 2: shashankfrancilla@gmail.com / Password123!
        const user2Id = '018f92a1-0000-7000-8000-000000000080';
        const ws2Id = '018f92a1-0000-7000-8000-000000000090';
        const role2Id = '018f92a1-0000-7000-8000-000000000092';
        const card2Id = '018f92a1-0000-7000-8000-000000000095';
        const rev2Id = '018f92a1-0000-7000-8000-000000000098';
        await memPool.query(`
      INSERT INTO users (id, email, password_hash, display_name, first_name, last_name)
      VALUES ('${user2Id}', 'shashankfrancilla@gmail.com', '${passHash}', 'Shashank', 'Shashank', '')
      ON CONFLICT (email) DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO workspaces (id, type, name, owner_user_id)
      VALUES ('${ws2Id}', 'PERSONAL', 'Shashank''s Workspace', '${user2Id}')
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO roles (id, workspace_id, name, is_system)
      VALUES ('${role2Id}', '${ws2Id}', 'OWNER', TRUE)
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO workspace_memberships (id, workspace_id, user_id, role_id, status)
      VALUES ('018f92a1-0000-7000-8000-000000000093', '${ws2Id}', '${user2Id}', '${role2Id}', 'ACTIVE')
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO subscriptions (id, workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
      VALUES ('018f92a1-0000-7000-8000-000000000094', '${ws2Id}', 'plan_business_annual', 'INTERNAL', 'sub_demo_200', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING
    `);
        await memPool.query(`
      INSERT INTO cards (id, public_id, workspace_id, owner_user_id, template_id, title, status, theme_color, theme_name, published_revision_id)
      VALUES ('${card2Id}', 'c_shashank_francilla', '${ws2Id}', '${user2Id}', '018f92a1-0000-7000-8000-000000000001', 'Shashank - Digital Business Card', 'PUBLISHED', '#2563EB', 'Professional', '${rev2Id}')
      ON CONFLICT (public_id) DO NOTHING
    `);
        const sections2Data = JSON.stringify([
            {
                id: 'sec_hero',
                type: 'hero',
                order: 0,
                enabled: true,
                fields: {
                    name: { value: 'Shashank', visibility: 'PUBLIC' },
                    designation: { value: 'Founder & Product Architect', visibility: 'PUBLIC' },
                    company: { value: 'Alpha SaaS Platform', visibility: 'PUBLIC' },
                    bio: { value: 'Professional Identity & Digital Visiting Card.', visibility: 'PUBLIC' }
                }
            },
            {
                id: 'sec_contact',
                type: 'contact',
                order: 1,
                enabled: true,
                fields: {
                    email: { value: 'shashankfrancilla@gmail.com', visibility: 'PUBLIC' },
                    phone: { value: '+91 9876543210', visibility: 'PUBLIC' },
                    website: { value: 'https://alpha.com', visibility: 'PUBLIC' },
                    social_linkedin: { value: 'https://linkedin.com/in/shashank', visibility: 'PUBLIC' },
                    social_twitter: { value: 'https://x.com/shashank', visibility: 'PUBLIC' }
                }
            }
        ]);
        await memPool.query(`
      INSERT INTO card_revisions (id, card_id, revision_number, content_data, visibility_data, created_by)
      VALUES ('${rev2Id}', '${card2Id}', 1, '${sections2Data}', '{}', '${user2Id}')
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ In-Memory pg-mem DB Schema & Demo Users seeded successfully!');
    }
    catch (err) {
        console.error('⚠️ pg-mem schema init notice:', err);
    }
}
async function query(text, params) {
    const start = Date.now();
    if (useFallbackDb) {
        const mem = getMemDbPool();
        return await executeMemQuery(mem, text, params);
    }
    const db = getDbPool();
    try {
        const res = await db.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development' && duration > 200) {
            console.warn(`⚠️ Slow Database Query (${duration}ms): ${text}`);
        }
        return res;
    }
    catch (error) {
        if (isConnRefused(error)) {
            console.warn('⚠️ Primary PostgreSQL port 5432 unreachable. Switching to high-performance in-memory database fallback.');
            useFallbackDb = true;
            const mem = getMemDbPool();
            return await executeMemQuery(mem, text, params);
        }
        console.error(`❌ DB Query Failed: ${text}`, error);
        throw error;
    }
}
async function transaction(callback) {
    if (useFallbackDb) {
        const mem = getMemDbPool();
        const client = await mem.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    const db = getDbPool();
    let client;
    try {
        client = await db.connect();
    }
    catch (error) {
        if (isConnRefused(error)) {
            console.warn('⚠️ Primary PostgreSQL unreachable. Switching to in-memory fallback for transaction.');
            useFallbackDb = true;
            const mem = getMemDbPool();
            client = await mem.connect();
        }
        else {
            throw error;
        }
    }
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=client.js.map