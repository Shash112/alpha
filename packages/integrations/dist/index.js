"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
class IntegrationService {
    /**
     * Generates a standard vCard (.vcf) formatted string for contact downloads.
     */
    static generateVCard(cardData) {
        const lines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${cardData.displayName}`,
            `N:${cardData.displayName};;;;`
        ];
        if (cardData.organization)
            lines.push(`ORG:${cardData.organization}`);
        if (cardData.title)
            lines.push(`TITLE:${cardData.title}`);
        if (cardData.email)
            lines.push(`EMAIL;TYPE=INTERNET,WORK:${cardData.email}`);
        if (cardData.phone)
            lines.push(`TEL;TYPE=CELL,VOICE:${cardData.phone}`);
        if (cardData.website)
            lines.push(`URL:${cardData.website}`);
        if (cardData.address)
            lines.push(`ADR;TYPE=WORK:;;${cardData.address};;;;`);
        if (cardData.canonicalUrl)
            lines.push(`NOTE:Digital Visiting Card: ${cardData.canonicalUrl}`);
        lines.push('END:VCARD');
        return lines.join('\n');
    }
    /**
     * Generates CSV format for captured lead exports.
     */
    static generateLeadsCsv(leads) {
        const header = 'Name,Email,Phone,Company,Status,Captured At';
        const rows = leads.map(l => `"${l.name || ''}","${l.email || ''}","${l.phone || ''}","${l.company || ''}","${l.status}","${l.createdAt}"`);
        return [header, ...rows].join('\n');
    }
    /**
     * Signs outgoing webhook payload using HMAC SHA-256 algorithm.
     */
    static signWebhookPayload(payload, secret, timestamp) {
        const signature = crypto_1.default
            .createHmac('sha256', secret)
            .update(`${timestamp}.${payload}`)
            .digest('hex');
        return `t=${timestamp},v1=${signature}`;
    }
}
exports.IntegrationService = IntegrationService;
//# sourceMappingURL=index.js.map