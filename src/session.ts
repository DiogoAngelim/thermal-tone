import { StabilizationOptions, StabilizationResult } from './types';
import { stabilizeConversation } from './stabilization';

export type ThermalSession = {
  originalMessages: string[];
  responses: string[];
  result?: StabilizationResult;
};

export function createThermalSession(messages: string[]): ThermalSession {
  return {
    originalMessages: [...messages],
    responses: [],
  };
}

export async function resumeThermalSession(
  session: ThermalSession,
  options?: StabilizationOptions
): Promise<ThermalSession> {
  const transcript = [...session.originalMessages, ...session.responses];
  const result = await stabilizeConversation(transcript, options);
  const newResponses = result.iterations
    .filter((it) => it.generatedResponse)
    .map((it) => it.generatedResponse!);
  return {
    ...session,
    responses: newResponses,
    result,
  };
}

export function serializeSession(session: ThermalSession): string {
  return JSON.stringify(session);
}

export function deserializeSession(serialized: string): ThermalSession {
  return JSON.parse(serialized);
}
