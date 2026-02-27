// test-api.js
import fetch from 'node-fetch';

async function testAPI() {
  const response = await fetch('https://thermal-tone.vercel.app/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: ['Hello', 'How are you?'],
      options: { aiEnabled: false }
    })
  });
  const data = await response.json();
  console.log('API response:', data);
}

testAPI().catch(console.error);
