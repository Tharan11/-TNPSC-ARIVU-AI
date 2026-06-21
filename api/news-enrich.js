export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { headline } = req.body || {};
  if (!headline) return res.status(400).json({ error: 'no headline' });

  const groqKey = process.env.NEWS_GROQ_KEY;
  const geminiKey = process.env.NEWS_GEMINI_KEY;

  const prompt = `You are a TNPSC exam expert. Given this Indian news headline, respond ONLY with valid JSON (no markdown, no explanation):
{"tamilSummary":"one sentence summary in Tamil","importance":<1-5 number>,"examQuestion":"one possible TNPSC exam question in English"}
Headline: "${headline}"`;

  if (groqKey) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.3 })
      });
      const d = await r.json();
      const text = d.choices?.[0]?.message?.content?.trim();
      if (text) {
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());
        return res.status(200).json(json);
      }
    } catch(_) {}
  }

  if (geminiKey) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());
        return res.status(200).json(json);
      }
    } catch(_) {}
  }

  return res.status(200).json({ tamilSummary: '', importance: 3, examQuestion: '' });
}
