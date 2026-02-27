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
    // Compatible with Edge and Node runtimes
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      // fallback for Node.js/Serverless: read as text, then parse
      const text = typeof req.text === 'function' ? await req.text() : '';
      body = text ? JSON.parse(text) : {};
    }
    console.log('Raw body:', body);
    const { messages, options } = body;
    if (!Array.isArray(messages)) {
      console.error('Invalid input: messages must be an array');
      return new Response(JSON.stringify({ error: 'messages must be an array' }), { status: 400 });
    }
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
