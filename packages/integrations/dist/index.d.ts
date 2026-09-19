export declare class IntegrationService {
    /**
     * Generates a standard vCard (.vcf) formatted string for contact downloads.
     */
    static generateVCard(cardData: {
        displayName: string;
        organization?: string;
        title?: string;
        email?: string;
        phone?: string;
        website?: string;
        address?: string;
        canonicalUrl?: string;
    }): string;
    /**
     * Generates CSV format for captured lead exports.
     */
    static generateLeadsCsv(leads: Array<{
        name: string;
        email?: string;
        phone?: string;
        company?: string;
        status: string;
        createdAt: string;
    }>): string;
    /**
     * Signs outgoing webhook payload using HMAC SHA-256 algorithm.
     */
    static signWebhookPayload(payload: string, secret: string, timestamp: number): string;
}
//# sourceMappingURL=index.d.ts.map