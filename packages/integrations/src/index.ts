import crypto from 'crypto';

export class IntegrationService {
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
  }): string {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${cardData.displayName}`,
      `N:${cardData.displayName};;;;`
    ];

    if (cardData.organization) lines.push(`ORG:${cardData.organization}`);
    if (cardData.title) lines.push(`TITLE:${cardData.title}`);
    if (cardData.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${cardData.email}`);
    if (cardData.phone) lines.push(`TEL;TYPE=CELL,VOICE:${cardData.phone}`);
    if (cardData.website) lines.push(`URL:${cardData.website}`);
    if (cardData.address) lines.push(`ADR;TYPE=WORK:;;${cardData.address};;;;`);
    if (cardData.canonicalUrl) lines.push(`NOTE:Digital Visiting Card: ${cardData.canonicalUrl}`);

    lines.push('END:VCARD');
    return lines.join('\n');
  }

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
  }>): string {
    const header = 'Name,Email,Phone,Company,Status,Captured At';
    const rows = leads.map(l => 
      `"${l.name || ''}","${l.email || ''}","${l.phone || ''}","${l.company || ''}","${l.status}","${l.createdAt}"`
    );
    return [header, ...rows].join('\n');
  }

  /**
   * Signs outgoing webhook payload using HMAC SHA-256 algorithm.
   */
  static signWebhookPayload(payload: string, secret: string, timestamp: number): string {
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    return `t=${timestamp},v1=${signature}`;
  }
}
