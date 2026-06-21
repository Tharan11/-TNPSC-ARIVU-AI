export default async function handler(req, res) {
  const gNewsKey = process.env.GNEWS_API_KEY;
  const newsApiKey = process.env.NEWS_API_KEY;
  let headlines = [];

  if (gNewsKey) {
    try {
      const queries = [
        'India government scheme policy',
        'Tamil Nadu government',
        'India economy budget RBI',
        'India science technology space ISRO',
        'India sports award',
      ];
      const results = await Promise.all(queries.map(q =>
        fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&country=in&max=4&lang=en&apikey=${gNewsKey}`)
          .then(r => r.json()).catch(() => ({ articles: [] }))
      ));
      const seen = new Set();
      for (const data of results) {
        for (const a of (data.articles || [])) {
          if (!seen.has(a.url) && a.title) {
            seen.add(a.url);
            headlines.push({
              id: `gnews-${Date.parse(a.publishedAt) || Date.now()}-${seen.size}`,
              title: a.title,
              source: a.source?.name || 'Unknown',
              url: a.url,
              publishedAt: a.publishedAt,
            });
          }
        }
      }
    } catch (_) {}
  }

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
