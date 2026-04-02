const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// ---------- Helpers ----------

// Check if a string (without the #) looks like a hex color code
function isHexColor(str) {
  // Remove the leading #
  const val = str.startsWith('#') ? str.slice(1) : str;
  // Hex colors are 3, 4, 6, or 8 hex characters (RGB, RGBA, RRGGBB, RRGGBBAA)
  if (!/^[0-9a-fA-F]+$/.test(val)) return false;
  return [3, 4, 6, 8].includes(val.length);
}

// Extract hashtags from any text string, filtering out hex color codes
function extractHashtags(text) {
  if (!text) return [];
  // Match #word patterns (supports unicode letters, digits, underscores)
  const matches = text.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/gu);
  if (!matches) return [];
  // Return unique hashtags, excluding hex color codes
  const seen = new Set();
  return matches.filter((tag) => {
    // Skip hex color codes
    if (isHexColor(tag)) return false;
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

// Extract text content from meta tags and JSON-LD data in HTML
// This avoids picking up CSS hex colors from stylesheets
function extractDescriptionText(html) {
  const texts = [];

  // 1. Extract og:description and description meta tags
  const metaPatterns = [
    /< *meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/gi,
    /< *meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/gi,
    /< *meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/gi,
    /< *meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/gi,
    /< *meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/gi,
    /< *meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/gi,
  ];

  for (const pattern of metaPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      texts.push(match[1]);
    }
  }

  // 2. Extract from title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) texts.push(titleMatch[1]);

  // 3. Look for hashtag links (e.g. <a href="/explore/tags/snow/">#snow</a>)
  const hashtagLinks = html.match(/\/explore\/tags\/([^/"']+)/gi);
  if (hashtagLinks) {
    hashtagLinks.forEach((link) => {
      const tagMatch = link.match(/\/explore\/tags\/([^/"']+)/i);
      if (tagMatch) texts.push('#' + tagMatch[1]);
    });
  }

  // 4. Extract from JSON-LD or embedded JSON data (caption, description fields)
  const jsonPatterns = [
    /"caption"\s*:\s*"([^"]*)"/g,
    /"description"\s*:\s*"([^"]*)"/g,
    /"text"\s*:\s*"([^"]*#[^"]*)"/g,
    /"accessibility_caption"\s*:\s*"([^"]*)"/g,
  ];

  for (const pattern of jsonPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      // Unescape JSON string
      try {
        const unescaped = JSON.parse('"' + match[1] + '"');
        texts.push(unescaped);
      } catch {
        texts.push(match[1]);
      }
    }
  }

  return texts.join(' ');
}

// Try to scrape hashtags from a page's meta/structured data
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
    // Extract hashtags only from meta descriptions and structured data
    const descriptionText = extractDescriptionText(html);
    console.log('[DEBUG] Extracted description text:', descriptionText.substring(0, 500));
    return extractHashtags(descriptionText);
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
