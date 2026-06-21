export default async function handler(req, res) {
  const gNewsKey      = "943d86528cc130669cb2545c9e5a02b1";
  const theNewsKey    = "GhaBnyy378Doz9USk0qbCpejmzomPfZYXFQW0Zrm";
  const newsDataKey   = "pub_fd24b974388b4c80a979076a1d7817aa";
  const mediaStackKey = "715b334441eecb09121d81484d348e19";

  let headlines = [];
  const seen = new Set();

  const add = (items) => {
    for (const h of items) {
      if (!seen.has(h.url) && h.title && h.title !== '[Removed]') {
        seen.add(h.url);
        headlines.push(h);
      }
    }
  };

  // 1. TheNewsAPI — instant, 3 free/request
  try {
    const r = await fetch(`https://api.thenewsapi.com/v1/news/top?api_token=${theNewsKey}&locale=in&limit=3&language=en`);
    const d = await r.json();
    if (r.ok && d.data?.length)
      add(d.data.map((a,i) => ({ id:`tna-${i}-${Date.parse(a.published_at)||Date.now()}`, title:a.title, source:a.source||'Unknown', url:a.url, publishedAt:a.published_at })));
  } catch(_) {}

  // 2. GNews — 5 queries x 3 = up to 15 articles
  try {
    const queries = ['India government policy scheme','Tamil Nadu news','India economy RBI budget','India science ISRO space','India sports award'];
    const results = await Promise.all(queries.map(q =>
      fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&country=in&max=3&lang=en&apikey=${gNewsKey}`)
        .then(r => r.json()).catch(() => ({ articles:[] }))
    ));
    for (const d of results)
      add((d.articles||[]).map((a,i) => ({ id:`gn-${Date.parse(a.publishedAt)||Date.now()}-${i}`, title:a.title, source:a.source?.name||'Unknown', url:a.url, publishedAt:a.publishedAt })));
  } catch(_) {}

  // 3. MediaStack — 500/month, fills gaps
  if (headlines.length < 15) {
    try {
      const r = await fetch(`http://api.mediastack.com/v1/news?access_key=${mediaStackKey}&countries=in&limit=10&languages=en`);
      const d = await r.json();
      if (r.ok && d.data?.length)
        add(d.data.map((a,i) => ({ id:`ms-${i}-${Date.now()+i}`, title:a.title, source:a.source||'Unknown', url:a.url, publishedAt:a.published_at })));
    } catch(_) {}
  }

  // 4. NewsData.io — 200/day fallback
  if (headlines.length < 15) {
    try {
      const r = await fetch(`https://newsdata.io/api/1/latest?apikey=${newsDataKey}&country=in&language=en`);
      const d = await r.json();
      if (r.ok && d.results?.length)
        add(d.results.slice(0,10).map((a,i) => ({ id:`nd-${i}-${Date.now()+i}`, title:a.title, source:a.source_id||'Unknown', url:a.link, publishedAt:a.pubDate })));
    } catch(_) {}
  }

  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=120');
  res.status(200).json({ headlines: headlines.slice(0,20), fetchedAt: new Date().toISOString() });
}
