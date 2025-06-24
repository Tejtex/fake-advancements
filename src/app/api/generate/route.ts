import { NextRequest, NextResponse } from 'next/server';

// Helper: sanitize string input
function sanitize(input: string, maxLen: number = 64) {
  return input.replace(/[^\w\s\-.,'!]/g, '').trim().slice(0, maxLen);
}

// In-memory rate limiting (per IP, simple, resets on server restart)
const rateLimitMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT = 10; // max 10 requests per 10 minutes
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in ms

export async function POST(req: NextRequest) {
  // Use x-forwarded-for for IP, fallback to 'unknown'
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const rl = rateLimitMap.get(ip) || { count: 0, last: 0 };
  if (now - rl.last > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now });
  } else if (rl.count >= RATE_LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  } else {
    rateLimitMap.set(ip, { count: rl.count + 1, last: rl.last });
  }

  const { name, category, number, absurdity, language, languagePrompt } = await req.json();
  // Validate and sanitize inputs
  const safeName = sanitize(String(name), 32);
  const safeCategory = sanitize(String(category), 32);
  const safeAbsurdity = ['Low', 'Medium', 'High'].includes(absurdity) ? absurdity : 'Medium';
  let safeNumber = Number(number);
  if (isNaN(safeNumber) || safeNumber < 1 || safeNumber > 10) safeNumber = 5;

  if (!safeName || !safeCategory) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Build prompt
  let prompt = "";
  if (languagePrompt && language !== 'en') {
    prompt += `ALL OUTPUT MUST BE IN ${languagePrompt.toUpperCase()}.\n`;
  }
  prompt += `Generate ${safeNumber} funny, absurd and ridiculous achievements in the format:\n"${safeName} unlocked: [ACHIEVEMENT NAME] — [DESCRIPTION]"\nMake the achievements themed around "${safeCategory}" and tailored to the selected absurdity level: "${safeAbsurdity}".\nMake them creative, funny, and shareable. Do not use markdown or asterisks for bold. Output in plain text only.`;

  // Call Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: missing Gemini API key' }, { status: 500 });
  }

  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: safeAbsurdity === 'High' ? 1.2 : safeAbsurdity === 'Low' ? 0.4 : 0.7 }
      })
    });
    const data = await geminiRes.json();
    console.log('Gemini API response:', data); // Debug log
    // Parse Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Split into achievements
    const achievements = text
      .split(/\n+/)
      .map((line: string) => line.trim())
      .filter((line: string) => line && line.includes('unlocked:'));
    return NextResponse.json({ achievements });
  } catch {
    return NextResponse.json({ error: 'Failed to generate achievements' }, { status: 500 });
  }
} 