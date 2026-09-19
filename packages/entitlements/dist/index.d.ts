export declare class EntitlementEngine {
    /**
     * Resolves effective entitlements for a workspace by fetching active plan definition and overrides.
     */
    static getEffectiveEntitlements(workspaceId: string): Promise<Record<string, any>>;
    /**
     * Checks if a workspace has boolean access to a feature entitlement.
     */
    static canAccessFeature(workspaceId: string, featureKey: string): Promise<boolean>;
    /**
     * Evaluates if current usage count exceeds plan numeric limit entitlement.
     * Return value: { isAllowed: boolean, limit: number, currentUsage: number }
     */
    static checkUsageLimit(workspaceId: string, limitKey: string, currentUsage: number): Promise<{
        isAllowed: boolean;
        limit: number;
        currentUsage: number;
    }>;
}
//# sourceMappingURL=index.d.ts.map