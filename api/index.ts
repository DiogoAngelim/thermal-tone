import { stabilizeConversation } from '../src/stabilization';
import type { StabilizationOptions, StabilizationResult } from '../src/types';

// Vercel Edge Function handler
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const { messages, options } = await req.json();
    const result: StabilizationResult = await stabilizeConversation(messages, options as StabilizationOptions);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
