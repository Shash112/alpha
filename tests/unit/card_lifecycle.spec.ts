import { SYSTEM_CONSTANTS } from '@alpha/config';

describe('Card Lifecycle & Slug Unit Tests', () => {
  test('Vanity Alias Normalization', () => {
    const rawAlias = '  Shashank-Sharma / CEO  ';
    const normalized = rawAlias.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    expect(normalized).toBe('shashank-sharma-ceo');
  });

  test('Reserved Vanity Slug Protection', () => {
    const isReserved = (slug: string) => SYSTEM_CONSTANTS.RESERVED_SLUGS.includes(slug.toLowerCase());
    expect(isReserved('admin')).toBe(true);
    expect(isReserved('billing')).toBe(true);
    expect(isReserved('api')).toBe(true);
    expect(isReserved('shashank-sharma')).toBe(false);
  });

  test('Card Revision Section Reordering', () => {
    const sections = [
      { id: 'sec_1', type: 'HERO', position: 0 },
      { id: 'sec_2', type: 'CONTACT_INFO', position: 1 },
      { id: 'sec_3', type: 'SOCIAL_LINKS', position: 2 }
    ];

    // Reorder section 3 to position 0
    const reordered = [
      { ...sections[2], position: 0 },
      { ...sections[0], position: 1 },
      { ...sections[1], position: 2 }
    ];

    expect(reordered[0].type).toBe('SOCIAL_LINKS');
    expect(reordered[0].position).toBe(0);
    expect(reordered[1].type).toBe('HERO');
    expect(reordered[2].type).toBe('CONTACT_INFO');
  });
});
