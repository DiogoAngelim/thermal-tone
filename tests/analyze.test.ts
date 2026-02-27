import { analyzeThermalTone } from '../src/core/analyze';

describe('analyzeThermalTone', () => {
  test('returns expected shape and deterministic values', () => {
    const messages = [
      "I am so angry!!!",
      "This is not acceptable.",
      "Thank you for your help."
    ];
    const res = analyzeThermalTone(messages);
    expect(res).toHaveProperty('averageTemperature');
    expect(res).toHaveProperty('normalizedIntensity');
    expect(res.messageBreakdown.length).toBe(3);
    // deterministic: same inputs produce same result
    const res2 = analyzeThermalTone(messages);
    expect(res2.averageTemperature).toBe(res.averageTemperature);
    expect(res2.colorHex).toBe(res.colorHex);
  });

  test('handles empty messages', () => {
    const res = analyzeThermalTone(['']);
    expect(res.normalizedIntensity).toBe(0);
  });
});
