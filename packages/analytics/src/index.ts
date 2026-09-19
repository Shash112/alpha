import crypto from 'crypto';
import { query } from '@alpha/database';

export interface RecordAnalyticsEventParams {
  workspaceId: string;
  cardId: string;
  eventType: 'VIEW' | 'CLICK' | 'SAVE_CONTACT' | 'LEAD_SUBMIT' | 'QR_SCAN' | 'NFC_TAP';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export class AnalyticsCollector {
  /**
   * Hashes IP address with daily salt for DPDP/GDPR privacy compliance.
   */
  static hashIp(ip: string): string {
    const today = new Date().toISOString().split('T')[0];
    return crypto.createHash('sha256').update(`${ip}:${today}`).digest('hex').substring(0, 32);
  }

  /**
   * Records raw analytics event and updates daily aggregates in PostgreSQL.
   */
  static async recordEvent(params: RecordAnalyticsEventParams): Promise<void> {
    const ipHash = params.ipAddress ? this.hashIp(params.ipAddress) : undefined;
    const today = new Date().toISOString().split('T')[0];

    // 1. Insert raw event
    await query(
      `INSERT INTO analytics_events (workspace_id, card_id, event_type, metadata, user_agent, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        params.workspaceId,
        params.cardId,
        params.eventType,
        JSON.stringify(params.metadata || {}),
        params.userAgent,
        ipHash
      ]
    );

    // 2. Increment daily aggregate metrics
    const columnMap: Record<string, string> = {
      VIEW: 'views_count',
      CLICK: 'clicks_count',
      SAVE_CONTACT: 'save_contact_count',
      LEAD_SUBMIT: 'lead_submissions_count',
      QR_SCAN: 'qr_scans_count',
      NFC_TAP: 'nfc_taps_count'
    };

    const targetColumn = columnMap[params.eventType] || 'views_count';

    await query(
      `INSERT INTO daily_analytics_aggregates (workspace_id, card_id, date, ${targetColumn})
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (card_id, date)
       DO UPDATE SET ${targetColumn} = daily_analytics_aggregates.${targetColumn} + 1`,
      [params.workspaceId, params.cardId, today]
    );
  }

  /**
   * Fetches aggregated metrics for dashboard reports.
   */
  static async getAggregateMetrics(cardId: string, days: number = 30) {
    const res = await query(
      `SELECT date, views_count, clicks_count, save_contact_count, lead_submissions_count, qr_scans_count, nfc_taps_count
       FROM daily_analytics_aggregates
       WHERE card_id = $1 AND date >= CURRENT_DATE - INTERVAL '1 day' * $2
       ORDER BY date ASC`,
      [cardId, days]
    );
    return res.rows;
  }
}
