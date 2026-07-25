import dotenv from "dotenv";
dotenv.config();
const key = process.env.GEMINI_API_KEY?.trim();
const tests = ['gemini-1.5-flash', 'gemini-1.5', 'gemini-2.0', 'text-bison-001', 'chat-bison', 'gemini-1.0'];
for (const model of tests) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  console.log('TEST', model);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Hello from test.' }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 20,
          temperature: 0.2
        }
      })
    });
    const data = await res.text();
    console.log('STATUS', res.status);
    console.log(data.slice(0, 1500), '\n---\n');
  } catch (error) {
    console.error('ERROR', error);
  }
}
