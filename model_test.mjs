import dotenv from "dotenv";
dotenv.config();
const key = process.env.GEMINI_API_KEY?.trim();
const tests = [
  'gemini-1.5-flash',
  'gemini-1.5',
  'gemini-2.0',
  'text-bison-001',
  'chat-bison',
  'gemini-1.0'
];
for (const model of tests) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({
        prompt: { text: 'Hello' },
        temperature: 0.2,
        maxOutputTokens: 20
      })
    });
    const text = await res.text();
    console.log('MODEL', model, 'STATUS', res.status);
    console.log(text.slice(0, 1000));
  } catch (e) {
    console.error('MODEL', model, 'ERROR', e.message);
  }
}
