// test-echo.js
import fetch from 'node-fetch';

async function testEcho() {
  const response = await fetch('https://postman-echo.com/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: ['Hello', 'How are you?'],
      options: { aiEnabled: false }
    })
  });
  const data = await response.json();
  console.log('Echo API response:', data);
}

testEcho().catch(console.error);
