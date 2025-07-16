const express = require('express');
const axios = require('axios');
const Paste = require('./mongo.model');
const Share = require('./share.model');

const router = express.Router();

function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function generateShareId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

router.post('/paste', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || content.length === 0)
      return res.status(400).json({ error: 'Content is required.' });
    if (Buffer.byteLength(content, 'utf8') > 1024 * 1024)
      return res.status(413).json({ error: 'Paste too large (max 1MB).' });

    const id = generateId();
    
    const crowRes = await axios.post(
      process.env.CROW_SERVICE_URL + '/save',
      { id, content }
    );

    await Paste.create({ id, filename: `pastes/${id}.txt` });

    res.json({ id });
  } catch (err) {
    console.error('Error in POST /paste:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/share', async (req, res) => {
  try {
    const { pasteId, expirationHours = 24 } = req.body;
    
    if (!pasteId || typeof pasteId !== 'string' || pasteId.length !== 8)
      return res.status(400).json({ error: 'Valid paste ID is required.' });

    const paste = await Paste.findOne({ id: pasteId });
    if (!paste)
      return res.status(404).json({ error: 'Paste not found.' });

    const crowRes = await axios.get(
      process.env.CROW_SERVICE_URL + '/get/' + pasteId
    );
    
    const content = crowRes.data.content;
    
    const shareId = generateShareId();
    const expiresAt = new Date(Date.now() + (expirationHours * 60 * 60 * 1000));
    
    await Share.create({
      shareId,
      pasteId,
      content,
      expiresAt
    });

    res.json({ 
      shareId, 
      shareUrl: `pastebin:${shareId}`,
      expiresAt: expiresAt.toISOString(),
      expirationHours 
    });
  } catch (err) {
    console.error('Error in POST /share:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/import/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    if (!shareId || typeof shareId !== 'string' || shareId.length !== 12)
      return res.status(400).json({ error: 'Valid share ID is required.' });

    const share = await Share.findOne({ shareId });
    if (!share)
      return res.status(404).json({ error: 'Share not found or expired.' });

    if (share.expiresAt < new Date())
      return res.status(410).json({ error: 'Share has expired.' });

    if (share.accessCount >= share.maxAccess)
      return res.status(429).json({ error: 'Share access limit reached.' });

    share.accessCount += 1;
    await share.save();

    res.json({
      content: share.content,
      pasteId: share.pasteId,
      accessCount: share.accessCount,
      maxAccess: share.maxAccess,
      expiresAt: share.expiresAt.toISOString()
    });
  } catch (err) {
    console.error('Error in GET /import/:shareId:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/p/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const crowRes = await axios.get(
      process.env.CROW_SERVICE_URL + '/get/' + id
    );
    
    const content = crowRes.data.content;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>BinStack - ${id}</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 min-h-screen">
        <div class="max-w-2xl mx-auto mt-16 bg-white rounded-lg shadow p-8">
          <h2 class="text-xl font-bold mb-4">Paste: <code>${id}</code></h2>
          <pre id="paste-content" class="bg-gray-50 p-4 rounded mb-4 overflow-x-auto text-sm">${content.replace(/</g, '&lt;')}</pre>
          <button onclick="copyPaste()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Copy</button>
        </div>
        <script>
          function copyPaste() {
            const text = document.getElementById('paste-content').innerText;
            navigator.clipboard.writeText(text).then(() => {
              const btn = document.querySelector('button');
              btn.innerText = 'Copied!';
              setTimeout(() => btn.innerText = 'Copy', 1200);
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error in GET /p/:id:', err);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
