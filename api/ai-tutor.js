export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, lang } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key not configured' });
  }

  const systemPrompt = lang === 'TAMIL'
    ? 'நீங்கள் ARIVU என்ற AI ஆசிரியர். TNPSC தேர்வுகளுக்கு மாணவர்களுக்கு உதவுகிறீர்கள். தமிழிலும் ஆங்கிலத்திலும் பதில் அளிக்கவும். TNPSC Group 1, 2, 2A, 4, VAO தேர்வு பாடங்கள் பற்றி விளக்கமாக பதில் அளிக்கவும்.'
    : 'You are ARIVU, an AI tutor helping students prepare for TNPSC exams. Answer clearly about Tamil history, Indian constitution, geography, science, and current affairs.';

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ error: data.error?.message || 'Groq API error' });
    }

    const reply = data.choices?.[0]?.message?.content || 'பதில் கிடைக்கவில்லை';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
