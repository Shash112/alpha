"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const client_1 = require("./client");
async function seedDatabase() {
    console.log('🌱 Seeding database baseline data (Plans, Permissions, System Templates)...');
    // 1. Seed Permissions
    const permissions = [
        { id: 'workspace.read', category: 'workspace', description: 'View workspace settings' },
        { id: 'workspace.update', category: 'workspace', description: 'Modify workspace details' },
        { id: 'members.read', category: 'members', description: 'View workspace members' },
        { id: 'members.invite', category: 'members', description: 'Invite new members' },
        { id: 'members.remove', category: 'members', description: 'Remove members' },
        { id: 'cards.create', category: 'cards', description: 'Create cards' },
        { id: 'cards.read', category: 'cards', description: 'Read cards' },
        { id: 'cards.update', category: 'cards', description: 'Update cards' },
        { id: 'cards.publish', category: 'cards', description: 'Publish cards' },
        { id: 'cards.delete', category: 'cards', description: 'Delete cards' },
        { id: 'leads.read', category: 'leads', description: 'View captured leads' },
        { id: 'leads.export', category: 'leads', description: 'Export leads to CSV/vCard' },
        { id: 'billing.manage', category: 'billing', description: 'Manage billing and subscriptions' },
        { id: 'analytics.read', category: 'analytics', description: 'View analytics performance' },
        { id: 'nfc.manage', category: 'nfc', description: 'Provision and manage NFC tags' },
        { id: 'domains.manage', category: 'domains', description: 'Manage custom domains' },
    ];
    for (const perm of permissions) {
        await (0, client_1.query)(`INSERT INTO permissions (id, category, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [perm.id, perm.category, perm.description]);
    }
    // 2. Seed System Plans
    const plans = [
        {
            id: 'plan_free_personal',
            family: 'Free Personal',
            name: 'Free Personal Plan',
            billing_period: 'ANNUAL',
            prices: { USD: 0, EUR: 0, GBP: 0, INR: 0, CAD: 0, AUD: 0 }, // $0
            stripe_price_ids: { USD: null, EUR: null, GBP: null, INR: null },
            entitlements: {
                'cards.max_active_count': 1,
                'members.max_seats': 1,
                'cards.remove_branding': false,
                'custom_domain.enabled': false,
                'domains.max_count': 0,
                'appointments.enabled': true,
                'nfc.enabled': true,
                'analytics.retention_days': 30
            }
        },
        {
            id: 'plan_personal_pro',
            family: 'Personal Pro',
            name: 'Personal Pro Plan',
            billing_period: 'ANNUAL',
            prices: { USD: 4900, EUR: 4500, GBP: 3900, INR: 49900, CAD: 6500, AUD: 6900 }, // $49.00 / year
            stripe_price_ids: { USD: 'price_1P_personal_pro_usd', EUR: 'price_1P_personal_pro_eur' },
            entitlements: {
                'cards.max_active_count': 5,
                'members.max_seats': 1,
                'cards.remove_branding': true,
                'custom_domain.enabled': false,
                'domains.max_count': 0,
                'appointments.enabled': true,
                'nfc.enabled': true,
                'analytics.retention_days': 365
            }
        },
        {
            id: 'plan_team_annual',
            family: 'Team',
            name: 'Team Plan',
            billing_period: 'ANNUAL',
            prices: { USD: 19900, EUR: 18500, GBP: 15900, INR: 299900, CAD: 26900, AUD: 28900 }, // $199.00 / year
            stripe_price_ids: { USD: 'price_1P_team_annual_usd', EUR: 'price_1P_team_annual_eur' },
            entitlements: {
                'cards.max_active_count': 25,
                'members.max_seats': 10,
                'cards.remove_branding': true,
                'custom_domain.enabled': true,
                'domains.max_count': 1,
                'appointments.enabled': true,
                'nfc.enabled': true,
                'analytics.retention_days': 365
            }
        },
        {
            id: 'plan_business_annual',
            family: 'Business',
            name: 'Business Plan',
            billing_period: 'ANNUAL',
            prices: { USD: 49900, EUR: 46900, GBP: 39900, INR: 999900, CAD: 67900, AUD: 72900 }, // $499.00 / year
            stripe_price_ids: { USD: 'price_1P_business_annual_usd', EUR: 'price_1P_business_annual_eur' },
            entitlements: {
                'cards.max_active_count': 100,
                'members.max_seats': 50,
                'cards.remove_branding': true,
                'custom_domain.enabled': true,
                'domains.max_count': 3,
                'white_label.enabled': true,
                'appointments.enabled': true,
                'nfc.enabled': true,
                'analytics.retention_days': 730
            }
        }
    ];
    for (const plan of plans) {
        await (0, client_1.query)(`INSERT INTO plans (id, family, name, billing_period, prices_schema, stripe_price_ids, entitlements_schema)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET prices_schema = $5, stripe_price_ids = $6, entitlements_schema = $7`, [plan.id, plan.family, plan.name, plan.billing_period, JSON.stringify(plan.prices), JSON.stringify(plan.stripe_price_ids), JSON.stringify(plan.entitlements)]);
    }
    // 3. Seed System Templates
    const templates = [
        {
            id: '018f92a1-0000-7000-8000-000000000001',
            name: 'Corporate Executive',
            slug: 'corporate-executive',
            category: 'Corporate',
            layout_schema: JSON.stringify({
                theme: { primaryColor: '#0F172A', accentColor: '#2563EB', fontFamily: 'Inter' },
                sectionsOrder: ['hero', 'about', 'contact', 'services', 'lead_form', 'appointments']
            })
        },
        {
            id: '018f92a1-0000-7000-8000-000000000002',
            name: 'Modern Minimalist',
            slug: 'modern-minimalist',
            category: 'Minimal',
            layout_schema: JSON.stringify({
                theme: { primaryColor: '#18181B', accentColor: '#10B981', fontFamily: 'Outfit' },
                sectionsOrder: ['hero', 'about', 'contact', 'products', 'lead_form']
            })
        },
        {
            id: '018f92a1-0000-7000-8000-000000000003',
            name: 'Creative Portfolio',
            slug: 'creative-portfolio',
            category: 'Creative',
            layout_schema: JSON.stringify({
                theme: { primaryColor: '#4F46E5', accentColor: '#F59E0B', fontFamily: 'Roboto' },
                sectionsOrder: ['hero', 'about', 'gallery', 'contact', 'cta']
            })
        }
    ];
    for (const tmpl of templates) {
        await (0, client_1.query)(`INSERT INTO templates (id, name, slug, category, layout_schema, is_system)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       ON CONFLICT (slug) DO NOTHING`, [tmpl.id, tmpl.name, tmpl.slug, tmpl.category, tmpl.layout_schema]);
    }
    console.log('✅ Baseline Database Seeding Completed Cleanly!');
}
//# sourceMappingURL=seed.js.map