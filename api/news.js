// api/news.js
// Server-side NewsAPI proxy. Keeps NEWS_API_KEY off the client entirely.
// Set NEWS_API_KEY in Vercel project settings (Settings > Environment Variables)
// — NOT prefixed with VITE_, or it will be bundled into the client JS.
//
// Written as ESM (export default) because Vite projects almost always set
// "type": "module" in package.json, which makes Vercel's Node runtime treat
// every .js file as ESM — a CommonJS module.exports here silently crashes
// the function before it ever runs, which is what was causing
// "Live news unavailable" on the live site.

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=12&apiKey=${apiKey}`;
    const upstream = await fetch(url);

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      res.status(upstream.status).json({ error: `NewsAPI error: ${upstream.statusText}`, detail });
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

    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
    res.status(200).json({ headlines, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', detail: String(err) });
  }
}
