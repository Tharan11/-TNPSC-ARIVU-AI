export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?country=in&max=10&lang=en&apikey=${apiKey}`;
    const upstream = await fetch(url);
    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.errors || upstream.statusText });
      return;
    }

    const headlines = (data.articles || [])
      .map((a, i) => ({
        id: `live-${i}-${Date.parse(a.publishedAt) || Date.now()}`,
        title: a.title,
        source: a.source?.name || 'Unknown',
        url: a.url,
        publishedAt: a.publishedAt,
      }));

    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
    res.status(200).json({ headlines, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', detail: String(err) });
  }
}
