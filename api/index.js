// api/index.js
const { stabilizeConversation } = require('../src/stabilization');

// Vercel Serverless Function handler (Node.js style)
module.exports = async (req, res) => {
  console.log('Handler started');
  if (req.method !== 'POST') {
    console.log('Method not allowed');
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      let raw = '';
      req.on('data', chunk => { raw += chunk; });
      await new Promise(resolve => req.on('end', resolve));
      body = raw ? JSON.parse(raw) : {};
    }
    console.log('Raw body:', body);
    const { messages, options } = body;
    if (!Array.isArray(messages)) {
      console.error('Invalid input: messages must be an array');
      res.status(400).json({ error: 'messages must be an array' });
      return;
    }
    console.log('Calling stabilizeConversation', { messages, options });
    const result = await stabilizeConversation(messages, options);
    console.log('stabilizeConversation finished', result);
    res.status(200).json(result);
  } catch (e) {
    console.error('Handler error', e);
    res.status(400).json({ error: e.message });
  }
};
