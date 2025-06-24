# Fake Achievement Generator

Generate funny, absurd, and creative fake achievements for any name and category. Powered by Google Gemini AI, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features
- Input: Name, category, number of achievements, absurdity level
- Generate, clear, and generate again buttons
- Achievements styled like unlock popups
- Copy to clipboard and favorite per achievement (saved in localStorage)
- Responsive, modern UI (Tailwind CSS)
- About page and dummy contact
- SEO meta tags and Open Graph
- Minimal rate limiting and input validation

## Getting Started

### 1. Clone & Install
```bash
npm install
# or
yarn install
```

### 2. Set up API Key
Create a `.env.local` file in the project root:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```
Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Locally
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 4. Deploy
Deploy easily to [Vercel](https://vercel.com/) (recommended). Set the `GEMINI_API_KEY` in your Vercel project environment variables.

## Usage Notes
- Input fields are sanitized client- and server-side.
- API is rate-limited per IP (5 requests per 5 minutes).
- Favorites are stored in your browser's localStorage.

## Credits
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Google Gemini API](https://aistudio.google.com/).

---

© 2024 Fake Achievement Generator. For fun only.
