// api/news.js
// Server-side NewsAPI proxy. Keeps NEWS_API_KEY off the client entirely.
// Set NEWS_API_KEY in Vercel project settings (Settings > Environment Variables)
// — NOT prefixed with VITE_, or it will be bundled into the client JS.

module.exports = async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=12&apiKey=${apiKey}`;
    const upstream = await fetch(url);

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `NewsAPI error: ${upstream.statusText}` });
      return;
    }

    const data = await upstream.json();

    const headlines = (data.articles || [])
      .filter((a) => a.title && a.title !== '[Removed]')
      .map((a, i) => ({
        id: `live-${i}-${Date.parse(a.publishedAt) || Date.now()}`,
        title: a.title,
        source: a.source && a.source.name ? a.source.name : 'Unknown',
        url: a.url,
        publishedAt: a.publishedAt,
      }));

    // Cache at Vercel's edge so the client's 60s polling doesn't hit NewsAPI
    // on every request — real upstream calls happen at most every 15 minutes,
    // which keeps usage well inside NewsAPI's free-tier 100 requests/day cap
    // no matter how many users have the page open.
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
    res.status(200).json({ headlines, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', detail: String(err) });
  }
};
