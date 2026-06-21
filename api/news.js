export default async function handler(req, res) {
  const newsApiKey = process.env.NEWS_API_KEY;
  const gNewsKey = process.env.GNEWS_API_KEY;

  let headlines = [];

  // Try GNews first (works server-side, free tier)
  if (gNewsKey) {
    try {
      const url = `https://gnews.io/api/v4/top-headlines?country=in&max=10&lang=en&apikey=${gNewsKey}`;
      const r = await fetch(url);
      const data = await r.json();
      if (r.ok && data.articles?.length) {
        headlines = data.articles.map((a, i) => ({
          id: `gnews-${i}-${Date.parse(a.publishedAt) || Date.now()}`,
          title: a.title,
          source: a.source?.name || 'Unknown',
          url: a.url,
          publishedAt: a.publishedAt,
        }));
      }
    } catch (_) {}
  }

  // Fallback to NewsAPI (works only from localhost, but try anyway)
  if (!headlines.length && newsApiKey) {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=${newsApiKey}`;
      const r = await fetch(url);
      const data = await r.json();
      if (r.ok && data.articles?.length) {
        headlines = data.articles
          .filter(a => a.title && a.title !== '[Removed]')
          .map((a, i) => ({
            id: `newsapi-${i}-${Date.parse(a.publishedAt) || Date.now()}`,
            title: a.title,
            source: a.source?.name || 'Unknown',
            url: a.url,
            publishedAt: a.publishedAt,
          }));
      }
    } catch (_) {}
  }

  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
  res.status(200).json({ headlines, fetchedAt: new Date().toISOString() });
}
