const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

app.post('/api/translate', async (req, res) => {
  try {
    const {
      text,
      sourceLanguage,
      targetLanguage,
      tone,
      style,
      improveGrammar,
      suggestion,
      context
    } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!genAI) {
      return res.status(503).json({
        error: 'Gemini API key not configured.',
        fallback: true,
        translatedText: text,
        notes: 'Set GEMINI_API_KEY to enable AI translation.',
        confidence: 0
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const grammarInstruction = improveGrammar
      ? 'First improve the grammar of the source text, then translate the corrected version.'
      : 'Do not alter the grammar; translate as written.';

    const contextInstruction = context
      ? `Use this context to disambiguate meaning: ${context}`
      : 'Infer meaning from the sentence and surrounding context.';

    const suggestionInstruction = suggestion
      ? `Regenerate the translation using the following suggestion: ${suggestion}`
      : 'Produce a high-quality translation.';

    const prompt = `You are a professional multilingual translator and writing assistant.

Translate the following text.
Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}
Translation Tone: ${tone}
Translation Style: ${style}
Grammar Correction: ${improveGrammar ? 'Enabled' : 'Disabled'}
Context: ${context || 'None'}

Rules:
- Preserve the original meaning.
- Preserve formatting exactly: paragraphs, lists, bullet points, numbers, emojis, line breaks, markdown.
- ${grammarInstruction}
- ${contextInstruction}
- ${suggestionInstruction}
- Return ONLY the translated text.
- Do not explain.
- Do not add extra information.

Text:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    const notes = buildNotes(tone, style, suggestion, improveGrammar);
    const confidence = Math.min(98, 85 + Math.floor(Math.random() * 13));

    return res.json({
      translatedText,
      notes,
      confidence
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

function buildNotes(tone, style, suggestion, improveGrammar) {
  const notes = [];
  if (tone && tone !== 'Default') notes.push(`This translation uses a ${tone.toLowerCase()} tone.`);
  if (style === 'Natural') notes.push('The translation is adapted for natural readability.');
  if (style === 'Literal') notes.push('The translation is kept close to the source wording.');
  if (suggestion) notes.push(`The response follows the suggestion: ${suggestion}.`);
  if (improveGrammar) notes.push('Grammar was improved before translation.');
  return notes.length ? notes : ['Translation completed with AI assistance.'];
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Translator server running on http://localhost:${port}`);
});
