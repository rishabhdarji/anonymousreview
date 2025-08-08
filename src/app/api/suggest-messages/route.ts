// app/api/suggest-messages/route.ts

import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Required to call localhost from Next.js API

export async function POST() {
  const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience.`;

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        model: 'llama2',
        prompt,
        stream: false,
      }),
    });
    
    const data = await res.json();
    console.log('Ollama raw response:', data);

    // Remove code fences and explanation text
    let text = data.response ?? '';
    const match = text.match(/```([\s\S]*?)```/);
    if (match) {
      text = match[1].trim();
    } else {
      // Find all lines containing '||'
      const lines = text.split('\n').map(l => l.trim());
      const questionLines = lines.filter(line => line.includes('||'));
      if (questionLines.length) {
        text = questionLines.join(' ');
      } else {
        // Fallback: find the last non-empty line
        text = lines.reverse().find(line => line.length > 0) ?? '';
      }
    }

    // Now split into questions
    // Remove wrapping quotes if present
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
    }
    const questions = text.split('||').map((q: string) => q.trim()).filter(Boolean);

    // If no valid questions, return error
    if (!questions.length) {
      return NextResponse.json({ error: 'No valid suggestions generated.' }, { status: 500 });
    }

    // Return as expected by useCompletion
    return NextResponse.json({ text: questions.join('||') });
  } catch (error) {
    console.error('Ollama API Error:', error);
    return NextResponse.json({ error: 'Failed to connect to Ollama' }, { status: 500 });
  }
}
