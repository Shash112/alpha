import { SYSTEM_CONSTANTS } from '@alpha/config';
import { AnalyticsCollector } from '@alpha/analytics';
import { IntegrationService } from '@alpha/integrations';

describe('Unit Tests — Core Business Rules & Formatting', () => {
  test('Slug Normalization & Reserved Check', () => {
    const raw = '  Shashank Sharma / Consulting  ';
    const normalized = raw.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    expect(normalized).toBe('shashank-sharma---consulting');
    expect(SYSTEM_CONSTANTS.RESERVED_SLUGS).toContain('admin');
    expect(SYSTEM_CONSTANTS.RESERVED_SLUGS).toContain('api');
  });

  test('IP Privacy Hashing', () => {
    const ip = '192.168.1.100';
    const hash1 = AnalyticsCollector.hashIp(ip);
    const hash2 = AnalyticsCollector.hashIp(ip);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(ip);
    expect(hash1.length).toBe(32);
  });

  test('vCard Formatting Standard', () => {
    const vcard = IntegrationService.generateVCard({
      displayName: 'Shashank Sharma',
      title: 'Solutions Architect',
      email: 'shashank@alpha.com',
      canonicalUrl: 'https://alpha.com/c/7Kx9mP4QaZ8Vt2N6'
    });

    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('FN:Shashank Sharma');
    expect(vcard).toContain('EMAIL;TYPE=INTERNET,WORK:shashank@alpha.com');
    expect(vcard).toContain('END:VCARD');
  });
});
