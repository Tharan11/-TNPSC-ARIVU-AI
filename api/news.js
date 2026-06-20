// api/news.js — Vercel serverless function
// Combines NewsAPI (Tamil Nadu news) + TNPSC official RSS

const NEWS_API_KEY = process.env.NEWS_API_KEY || '690d13b4576e40979403d5febcd0f75a';

// Simple in-memory cache (60 seconds)
let cache = { data: null, ts: 0 };

async function fetchNewsAPI() {
  const url = `https://newsapi.org/v2/everything?q=TNPSC+OR+"Tamil+Nadu"+government+exam&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.articles) return [];
  return json.articles.map(a => ({
    id: a.url,
    title: a.title,
    titleTamil: a.title, // translate later if needed
    summary: a.description || '',
    summaryTamil: a.description || '',
    source: a.source?.name || 'NewsAPI',
    url: a.url,
    date: a.publishedAt,
    category: 'NATIONAL',
    importanceLevel: 3,
  }));
}

async function fetchTNPSCRSS() {
  try {
    const res = await fetch('https://www.tnpsc.gov.in/rss/latestnews.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return items.slice(0, 10).map((m, i) => {
      const title = (m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || m[1].match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link  = (m[1].match(/<link>(.*?)<\/link>/) || [])[1] || 'https://www.tnpsc.gov.in';
      const date  = (m[1].match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || new Date().toISOString();
      return {
        id: `tnpsc-${i}-${Date.now()}`,
        title: title.trim(),
        titleTamil: title.trim(),
        summary: title.trim(),
        summaryTamil: title.trim(),
        source: 'TNPSC Official',
        url: link.trim(),
        date: new Date(date).toISOString(),
        category: 'TAMILNADU',
        importanceLevel: 5,
      };
    }).filter(i => i.title);
  } catch(e) {
    console.error('TNPSC RSS failed:', e.message);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  // Serve from cache if fresh
  if (cache.data && Date.now() - cache.ts < 60000) {
    return res.json({ articles: cache.data, cached: true });
  }

  try {
    const [newsItems, tnpscItems] = await Promise.allSettled([
      fetchNewsAPI(),
      fetchTNPSCRSS(),
    ]);

    const news = newsItems.status === 'fulfilled' ? newsItems.value : [];
    const tnpsc = tnpscItems.status === 'fulfilled' ? tnpscItems.value : [];

    // TNPSC items first (importance 5), then news, dedupe by url
    const seen = new Set();
    const combined = [...tnpsc, ...news].filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    cache = { data: combined, ts: Date.now() };
    return res.json({ articles: combined });
  } catch(e) {
    console.error('News API error:', e);
    return res.status(500).json({ error: e.message });
  }
}
