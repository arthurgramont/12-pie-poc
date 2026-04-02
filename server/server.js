const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ---------- Helpers ----------

// Extract hashtags from any text string
function extractHashtags(text) {
  if (!text) return [];
  // Match #word patterns (supports unicode letters, digits, underscores)
  const matches = text.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/gu);
  if (!matches) return [];
  // Return unique hashtags (lowercase for dedup, keep original casing)
  const seen = new Set();
  return matches.filter((tag) => {
    const lower = tag.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

// Extract Instagram username from URL
function extractInstagramUsername(url) {
  const match = url.match(/instagram\.com\/([^/?]+)/);
  return match ? match[1] : 'Utilisateur';
}

// Try to scrape hashtags from a page's HTML (fallback approach)
async function scrapeHashtagsFromPage(url, fetchFn) {
  try {
    const response = await fetchFn(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      timeout: 8000,
    });
    if (!response.ok) return [];
    const html = await response.text();
    // Look for hashtags in the HTML content
    return extractHashtags(html);
  } catch (err) {
    console.warn('Scrape hashtags failed:', err.message);
    return [];
  }
}

// ---------- Video Import Route ----------
app.post('/api/video/import', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;

    // Detect platform
    if (url.includes('tiktok.com')) {
      // TikTok oEmbed (free, no auth)
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        return res.status(400).json({ error: 'Failed to fetch TikTok data' });
      }

      const data = await response.json();
      const title = data.title || '';

      // Extract hashtags from the oEmbed title (caption)
      let hashtags = extractHashtags(title);

      // If no hashtags found in title, try scraping the page
      if (hashtags.length === 0) {
        hashtags = await scrapeHashtagsFromPage(url, fetch);
      }

      return res.json({
        platform: 'tiktok',
        title: title || 'Vidéo TikTok',
        author_name: data.author_name || 'Utilisateur',
        thumbnail_url: data.thumbnail_url || null,
        embed_html: data.html || null,
        hashtags,
      });

    } else if (url.includes('instagram.com')) {
      // Instagram: try to scrape hashtags from page
      let hashtags = await scrapeHashtagsFromPage(url, fetch);

      return res.json({
        platform: 'instagram',
        title: 'Vidéo Instagram',
        author_name: extractInstagramUsername(url),
        thumbnail_url: null,
        embed_html: null,
        hashtags,
      });

    } else {
      return res.status(400).json({
        error: 'Platform not supported. Use TikTok or Instagram links.',
      });
    }
  } catch (error) {
    console.error('Video import error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
