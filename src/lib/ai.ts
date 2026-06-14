export async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API Error');
  return data.choices?.[0]?.message?.content || 'பதில் கிடைக்கவில்லை';
}
