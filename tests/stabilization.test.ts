import { stabilizeConversation } from '../src/stabilization';
import { StabilizationOptions } from '../src/types';

describe('stabilizeConversation', () => {
  it('converges toward equilibrium', async () => {
    const messages = [
      'I am furious about this!',
      'We are sorry for your frustration.'
    ];
    const result = await stabilizeConversation(messages, { aiEnabled: true });
    expect(result.finalTemperature).toBeLessThanOrEqual(result.equilibriumTarget + 0.3);
    expect(result.finalTemperature).toBeGreaterThanOrEqual(result.equilibriumTarget - 0.3);
    expect(result.stabilized).toBe(true);
  });

  it('early-stops on consecutive increases', async () => {
    const messages = ['angry angry angry'];
    const result = await stabilizeConversation(messages, {
      aiEnabled: true,
      maxIterations: 2,
    });
    // Should not exceed maxIterations, but may stop early
    expect(result.iterations.length).toBeLessThanOrEqual(3);
  });

  it('deterministic fallback', async () => {
    const messages = ['I am sad.'];
    const result = await stabilizeConversation(messages, { aiEnabled: false, deterministic: true });
    expect(result.stabilized).toBe(false);
    expect(result.iterations.length).toBe(1);
  });

  it('maintains iteration history integrity', async () => {
    const messages = ['upset', 'response'];
    const result = await stabilizeConversation(messages, { aiEnabled: true });
    expect(result.iterations[0].step).toBe(0);
    for (let i = 1; i < result.iterations.length; i++) {
      expect(result.iterations[i].step).toBe(i);
    }
  });
});
