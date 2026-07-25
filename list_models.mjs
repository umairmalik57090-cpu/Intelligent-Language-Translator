import dotenv from "dotenv";
dotenv.config();
const key = process.env.GEMINI_API_KEY?.trim();
const urls = [
  'https://generativelanguage.googleapis.com/v1beta/models',
  'https://generativelanguage.googleapis.com/v1/models'
];
for (const url of urls) {
  console.log('LISTING', url);
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }
    });
    const data = await res.text();
    console.log('STATUS', res.status);
    console.log(data.slice(0, 500));
  } catch (err) {
    console.error('ERROR', err.message);
  }
}
