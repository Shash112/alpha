describe('Public Card Privacy Filter Integration Tests', () => {
  interface CardField {
    key: string;
    value: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
  }

  function filterPublicFields(fields: CardField[]) {
    return fields.filter(f => f.visibility === 'PUBLIC');
  }

  test('Public Card Projection Strips PRIVATE and HIDDEN Fields', () => {
    const rawFields: CardField[] = [
      { key: 'phone', value: '+919876543210', visibility: 'PUBLIC' },
      { key: 'email', value: 'public@alpha.com', visibility: 'PUBLIC' },
      { key: 'personal_note', value: 'Private CRM Note', visibility: 'PRIVATE' },
      { key: 'internal_id', value: 'sec_12345', visibility: 'HIDDEN' }
    ];

    const publicProjection = filterPublicFields(rawFields);

    expect(publicProjection.length).toBe(2);
    expect(publicProjection.map(f => f.key)).toEqual(['phone', 'email']);
    expect(publicProjection.find(f => f.key === 'personal_note')).toBeUndefined();
    expect(publicProjection.find(f => f.key === 'internal_id')).toBeUndefined();
  });
});
