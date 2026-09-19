describe('Native Appointments Slot Generator Unit Tests', () => {
  function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
    const slots: string[] = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const m = (currentMinutes % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      currentMinutes += durationMinutes;
    }
    return slots;
  }

  test('Slot Generation for 30-minute Window', () => {
    const slots = generateSlots('09:00', '11:00', 30);
    expect(slots).toEqual(['09:00', '09:30', '10:00', '10:30']);
  });

  test('Slot Generation with Non-matching Window End', () => {
    const slots = generateSlots('10:00', '11:15', 30);
    expect(slots).toEqual(['10:00', '10:30']);
  });
});
