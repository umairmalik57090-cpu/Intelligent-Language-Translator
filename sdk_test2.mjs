import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = process.env.GEMINI_API_KEY?.trim();
console.log('apiKey present', !!apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
console.log('model created', typeof model.generateContent, typeof model.generateContentStream);
try {
  const res = await model.generateContent('Translate Hello to French.');
  console.log('response ok', res && res.response && typeof res.response === 'object');
  console.log('response candidates', res.response.candidates?.length);
  console.log('response text', res.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'no text');
} catch (err) {
  console.error('sdk error', err && err.message);
}
