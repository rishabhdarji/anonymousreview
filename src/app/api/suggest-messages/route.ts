// app/api/suggest-messages/route.ts

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client with your API key from .env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) throw new Error('Groq API key is not configured');

    const { message } = await request.json().catch(() => ({}));

    const defaultPrompt = `
      Create a list of three open-ended and engaging questions formatted as a single string.
      Each question should be separated by '||'.
      These questions are for an anonymous messaging app, so they should be suitable for strangers or friends to ask.
      The questions should be about giving feedback, constructive criticism, or a friendly confession.
      For example: "What is one thing you admire about me?" or "What is a habit I should break?" or "If you could give me one piece of advice, what would it be?".
      Do not include any introductory text or numbering, just the questions separated by ||.
    `;

    let prompt = defaultPrompt;

    if (typeof message === 'string' && message.trim().length > 0) {
      prompt = `
        Create a list of three open-ended and engaging questions related to the topic: "${message}".
        Format them as a single string separated by '||' with no extra text.
        The questions should be framed as anonymous feedback, a review, or a confession related to the topic.
        Do not include the original topic in the output, just the questions.
      `;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 150,
      stream: false,
    });

    console.log('[suggest-messages] Groq completion payload:', completion);

    const suggestions = completion.choices[0]?.message?.content?.trim();
    if (!suggestions) throw new Error('No suggestions generated from Groq.');

    const cleanedSuggestions = suggestions.replace(/["`]/g, '').trim();
    const normalizedSuggestions = cleanedSuggestions.replace(/\s*\|\|\s*/g, '||');
    console.log('[suggest-messages] Cleaned suggestions:', normalizedSuggestions);

    return NextResponse.json({ completion: normalizedSuggestions });
  } catch (error: unknown) {
    console.error('Failed to connect to Groq AI', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions', details: (error as Error)?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
