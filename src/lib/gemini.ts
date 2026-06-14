export async function callGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API Error');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'பதில் கிடைக்கவில்லை';
}
