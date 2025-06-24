import { NextRequest, NextResponse } from 'next/server';

// Helper: sanitize string input
function sanitize(input: string, maxLen: number = 64) {
  return input.replace(/[^\w\s\-.,'!]/g, '').trim().slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  const { name, category, number, absurdity } = await req.json();
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
  const prompt = `Generate ${safeNumber} funny, absurd and ridiculous achievements in the format:\n"${safeName} unlocked: [ACHIEVEMENT NAME] — [DESCRIPTION]"\nMake the achievements themed around "${safeCategory}" and tailored to the selected absurdity level: "${safeAbsurdity}".\nMake them creative, funny, and shareable. Do not use markdown or asterisks for bold. Output in plain text only.`;

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
  } catch (e) {
    return NextResponse.json({ error: 'Failed to generate achievements' }, { status: 500 });
  }
} 