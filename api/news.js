export default async function handler(req, res) {
  const gNewsKey      = process.env.GNEWS_API_KEY;
  const theNewsKey    = process.env.THENEWS_API_KEY;
  const newsDataKey   = process.env.NEWSDATA_API_KEY;
  const mediaStackKey = process.env.MEDIASTACK_API_KEY;
  let headlines = [];

  if (!headlines.length && theNewsKey) {
    try {
      const url = `https://api.thenewsapi.com/v1/news/top?api_token=${theNewsKey}&locale=in&limit=10&language=en`;
      const r = await fetch(url);
      const data = await r.json();
      if (r.ok && data.data?.length) {
        headlines = data.data.map((a, i) => ({
          id: `tna-${i}-${Date.parse(a.published_at)||Date.now()}`,
          title: a.title, source: a.source||'Unknown',
          url: a.url, publishedAt: a.published_at,
        }));
      }
    } catch (_) {}
  }

  if (!headlines.length && mediaStackKey) {
    try {
      const url = `http://api.mediastack.com/v1/news?access_key=${mediaStackKey}&countries=in&limit=10&languages=en`;
      const r = await fetch(url);
      const data = await r.json();
      if (r.ok && data.data?.length) {
        headlines = data.data.map((a, i) => ({
          id: `ms-${i}-${Date.now()}`,
          title: a.title, source: a.source||'Unknown',
          url: a.url, publishedAt: a.published_at,
        }));
      }
    } catch (_) {}
  }

  if (!headlines.length && gNewsKey) {
    try {
      const queries = ['India government scheme','Tamil Nadu','India economy RBI','ISRO science India','India sports'];
      const results = await Promise.all(queries.map(q =>
        fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&country=in&max=3&lang=en&apikey=${gNewsKey}`)
          .then(r => r.json()).catch(() => ({ articles: [] }))
      ));
      const seen = new Set();
      for (const data of results) {
        for (const a of (data.articles||[])) {
          if (!seen.has(a.url) && a.title) {
            seen.add(a.url);
            headlines.push({ id: `gnews-${Date.parse(a.publishedAt)||Date.now()}-${seen.size}`, title: a.title, source: a.source?.name||'Unknown', url: a.url, publishedAt: a.publishedAt });
          }
        }
      }
    } catch (_) {}
  }

  if (!headlines.length && newsDataKey) {
    try {
      const url = `https://newsdata.io/api/1/latest?apikey=${newsDataKey}&country=in&language=en`;
      const r = await fetch(url);
      const data = await r.json();
      if (r.ok && data.results?.length) {
        headlines = data.results.slice(0,10).map((a, i) => ({
          id: `nd-${i}-${Date.now()}`,
          title: a.title, source: a.source_id||'Unknown',
          url: a.link, publishedAt: a.pubDate,
        }));
      }
    } catch (_) {}
  }

  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
  res.status(200).json({ headlines, fetchedAt: new Date().toISOString() });
}
