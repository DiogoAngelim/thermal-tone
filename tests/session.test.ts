import { createThermalSession, resumeThermalSession, serializeSession, deserializeSession } from '../src/session';

describe('ThermalSession helpers', () => {
  it('creates a new session', () => {
    const session = createThermalSession(['hello']);
    expect(session.originalMessages).toEqual(['hello']);
    expect(session.responses).toEqual([]);
  });

  it('serializes and deserializes session', () => {
    const session = createThermalSession(['hi']);
    const serialized = serializeSession(session);
    const deserialized = deserializeSession(serialized);
    expect(deserialized.originalMessages).toEqual(['hi']);
  });

  it('resumes session and updates responses', async () => {
    const session = createThermalSession(['angry']);
    const resumed = await resumeThermalSession(session, { aiEnabled: true });
    expect(resumed.responses.length).toBeGreaterThan(0);
    expect(resumed.result).toBeDefined();
  });
});
