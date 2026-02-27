import { stabilizeConversation } from '../src/stabilization';
import type { StabilizationOptions, StabilizationResult } from '../src/types';

// Vercel Edge Function handler
export default async function handler(req: Request): Promise<Response> {
  console.log('Handler started');
  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    console.log('Parsing request JSON');
    const { messages, options } = await req.json();
    console.log('Calling stabilizeConversation', { messages, options });
    const result: StabilizationResult = await stabilizeConversation(messages, options as StabilizationOptions);
    console.log('stabilizeConversation finished', result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('Handler error', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
