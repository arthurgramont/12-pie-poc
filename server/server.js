const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ---------- Video Import Route ----------
app.post('/api/video/import', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Detect platform
    if (url.includes('tiktok.com')) {
      // TikTok oEmbed (free, no auth)
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        return res.status(400).json({ error: 'Failed to fetch TikTok data' });
      }

      const data = await response.json();
      return res.json({
        platform: 'tiktok',
        title: data.title || 'Vidéo TikTok',
        author_name: data.author_name || 'Utilisateur',
        thumbnail_url: data.thumbnail_url || null,
        embed_html: data.html || null,
      });

    } else if (url.includes('instagram.com')) {
      // Instagram: basic metadata (no API key needed for basic approach)
      // For the POC, return generic info since Instagram oEmbed requires app review
      return res.json({
        platform: 'instagram',
        title: 'Vidéo Instagram',
        author_name: extractInstagramUsername(url),
        thumbnail_url: null,
        embed_html: null,
      });

    } else {
      return res.status(400).json({ error: 'Platform not supported. Use TikTok or Instagram links.' });
    }
  } catch (error) {
    console.error('Video import error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper to extract Instagram username from URL
function extractInstagramUsername(url) {
  const match = url.match(/instagram\.com\/([^/?]+)/);
  return match ? match[1] : 'Utilisateur';
}

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
