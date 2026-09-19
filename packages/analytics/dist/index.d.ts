export interface RecordAnalyticsEventParams {
    workspaceId: string;
    cardId: string;
    eventType: 'VIEW' | 'CLICK' | 'SAVE_CONTACT' | 'LEAD_SUBMIT' | 'QR_SCAN' | 'NFC_TAP';
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
export declare class AnalyticsCollector {
    /**
     * Hashes IP address with daily salt for DPDP/GDPR privacy compliance.
     */
    static hashIp(ip: string): string;
    /**
     * Records raw analytics event and updates daily aggregates in PostgreSQL.
     */
    static recordEvent(params: RecordAnalyticsEventParams): Promise<void>;
    /**
     * Fetches aggregated metrics for dashboard reports.
     */
    static getAggregateMetrics(cardId: string, days?: number): Promise<any[]>;
}
//# sourceMappingURL=index.d.ts.map