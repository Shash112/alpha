"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitlementEngine = void 0;
const database_1 = require("@alpha/database");
class EntitlementEngine {
    /**
     * Resolves effective entitlements for a workspace by fetching active plan definition and overrides.
     */
    static async getEffectiveEntitlements(workspaceId) {
        // 1. Fetch Active Subscription & Plan
        const subRes = await (0, database_1.query)(`SELECT s.plan_id, p.entitlements_schema
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.workspace_id = $1 AND s.status IN ('ACTIVE', 'TRIALING', 'PAST_DUE')`, [workspaceId]);
        let baseEntitlements = {};
        if (subRes.rowCount && subRes.rowCount > 0) {
            const raw = subRes.rows[0].entitlements_schema;
            baseEntitlements = typeof raw === 'string' ? JSON.parse(raw) : raw;
        }
        else {
            // Fallback to Free Personal Plan Defaults
            const freePlanRes = await (0, database_1.query)(`SELECT entitlements_schema FROM plans WHERE id = 'plan_free_personal'`);
            if (freePlanRes.rowCount && freePlanRes.rowCount > 0) {
                const raw = freePlanRes.rows[0].entitlements_schema;
                baseEntitlements = typeof raw === 'string' ? JSON.parse(raw) : raw;
            }
        }
        return baseEntitlements;
    }
    /**
     * Checks if a workspace has boolean access to a feature entitlement.
     */
    static async canAccessFeature(workspaceId, featureKey) {
        const entitlements = await this.getEffectiveEntitlements(workspaceId);
        const value = entitlements[featureKey];
        return value === true || value === 'Full' || value === 'Basic';
    }
    /**
     * Evaluates if current usage count exceeds plan numeric limit entitlement.
     * Return value: { isAllowed: boolean, limit: number, currentUsage: number }
     */
    static async checkUsageLimit(workspaceId, limitKey, currentUsage) {
        const entitlements = await this.getEffectiveEntitlements(workspaceId);
        let limit = entitlements[limitKey];
        if (limit === undefined || limit === null) {
            if (limitKey === 'cards.max_active_count')
                limit = 50;
            else if (limitKey === 'members.max_seats')
                limit = 10;
            else
                limit = 100;
        }
        // Value -1 denotes unlimited
        if (limit === -1) {
            return { isAllowed: true, limit, currentUsage };
        }
        return {
            isAllowed: currentUsage < limit,
            limit,
            currentUsage
        };
    }
}
exports.EntitlementEngine = EntitlementEngine;
//# sourceMappingURL=index.js.map