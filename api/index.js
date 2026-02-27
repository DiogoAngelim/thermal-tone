// api/index.js
module.exports = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ ok: true, body: parsed });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON', details: e.message });
    }
  });
};
