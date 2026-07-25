# Intelligent Language Translator

This project is a browser-based translator app with AI-powered enhancements using Google Gemini.

## Features
- Translation tone selection
- Natural vs literal translation style
- Grammar improvement toggle
- Formatting preservation
- Context-aware translation
- Translation notes and confidence
- Translation statistics
- Recent language pairs
- AI suggestions
- Copy, download, favorites, and history

## Run locally
1. Install dependencies:
   npm install
2. Create a .env file based on .env.example and add your Gemini API key.
3. Start the server:
   node server.js
4. Open http://localhost:3000

## Notes
- Without a Gemini API key, the app will run in a safe fallback mode and return the original text.
- To enable full AI translation, set GEMINI_API_KEY in your environment.
