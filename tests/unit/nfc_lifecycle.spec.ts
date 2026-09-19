describe('NFC Device State Lifecycle Unit Tests', () => {
  type NfcStatus = 'UNASSIGNED' | 'ASSIGNED' | 'ACTIVE' | 'SUSPENDED' | 'LOST' | 'RETIRED';

  const validTransitions: Record<NfcStatus, NfcStatus[]> = {
    UNASSIGNED: ['ASSIGNED', 'RETIRED'],
    ASSIGNED: ['ACTIVE', 'UNASSIGNED', 'RETIRED'],
    ACTIVE: ['SUSPENDED', 'LOST', 'RETIRED', 'UNASSIGNED'],
    SUSPENDED: ['ACTIVE', 'RETIRED', 'LOST'],
    LOST: ['RETIRED', 'ACTIVE'],
    RETIRED: []
  };

  function canTransition(current: NfcStatus, next: NfcStatus): boolean {
    return validTransitions[current]?.includes(next) ?? false;
  }

  test('Valid NFC State Transitions', () => {
    expect(canTransition('UNASSIGNED', 'ASSIGNED')).toBe(true);
    expect(canTransition('ASSIGNED', 'ACTIVE')).toBe(true);
    expect(canTransition('ACTIVE', 'SUSPENDED')).toBe(true);
    expect(canTransition('SUSPENDED', 'ACTIVE')).toBe(true);
    expect(canTransition('ACTIVE', 'LOST')).toBe(true);
    expect(canTransition('LOST', 'RETIRED')).toBe(true);
  });

  test('Invalid NFC State Transitions', () => {
    expect(canTransition('RETIRED', 'ACTIVE')).toBe(false);
    expect(canTransition('UNASSIGNED', 'SUSPENDED')).toBe(false);
  });
});
