import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    console.log('Processing chat request with messages:', messages);

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful AI learning assistant. Provide clear, concise, and educational responses."
          },
          ...messages
        ],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log('Received response from Groq:', response);

      return NextResponse.json({ 
        message: response.choices[0].message.content 
      });
    } catch (groqError: any) {
      console.error('Groq API Error:', groqError);
      // If the model is not available, try an alternative model
      if (groqError.status === 404 || groqError.status === 400) {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a helpful AI learning assistant. Provide clear, concise, and educational responses."
            },
            ...messages
          ],
          model: "llama2-70b-4096",
          temperature: 0.7,
          max_tokens: 1000,
        });

        return NextResponse.json({ 
          message: response.choices[0].message.content 
        });
      }
      throw groqError;
    }
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 