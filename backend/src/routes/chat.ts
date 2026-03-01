import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// System prompt that defines the AI's persona and knowledge boundary
const SYSTEM_PROMPT = `
You are an AI assistant embedded in Sandeepan Kalita's portfolio website. 
Your goal is to answer questions about Sandeepan's experience, skills, and projects in a professional, helpful, and concise manner.
You should act as a representative for Sandeepan, answering questions on his behalf to prospective recruiters or clients.

Here is the core information you know about Sandeepan:
- Name: Sandeepan Kalita
- Role: Full Stack Developer / Software Engineer
- Contact: kalitasandeepan@gmail.com
- Tech Stack: React, Next.js, TypeScript, Node.js, Express, Spring Boot, PostgreSQL, Prisma, Tailwind CSS, Three.js, Docker.

EXPERIENCE:
1. System Engineer at Tata Consultancy Services (11/2024 - Present):
   - Contributed to building a transaction-level monitoring framework from scratch using Java, MySQL, and an internal job scheduler.
   - Developed a configurable silent-period module supporting one-time and recurring schedules, reducing alert fatigue by 40%.
   - Re-architected the analytics pipeline by replacing a SQL ETL datamart with Kafka–Cassandra architecture to improve scalability.
   - Implemented severity-based email alerting with CSV reports for detailed incident insights.
   - Implemented admin-bypass audit logging in the AEC module to capture candidate-level overrides.
2. Project Intern at IIT Guwahati (05/2023 - 07/2023):
   - Built a voice-assisted web application for banking intent detection using the Web Speech API.
   - Fine-tuned BERT Base Uncased on the BANKING77 dataset for NLP.
   - Evaluated model performance using confusion-matrix analysis.

KEY PROJECTS:
1. Enterprise Parking Management:
   - Enterprise-grade backend utilizing Strategy Design patterns to handle complex, dynamic payment routing and parking flows.
   - Stack: Java, Spring Boot, PostgreSQL, Docker.
2. Gmail Auto Replier:
   - Automated vacation responses and label organization using official Gmail APIs.
   - Stack: Node.js, Express.js, OAuth2.
3. Aesthetic Portfolio V1 (This website!):
   - Highly immersive 3D developer portfolio focused on 'First Principles' architecture and modern cinematic UX.
   - Stack: React, Next.js, Framer Motion, Tailwind CSS, Llama 3 API.

IMPORTANT RULES:
1. Always be polite, concise, and professional.
2. If asked something completely unrelated to software engineering, Sandeepan, or this portfolio, politely decline to answer and guide them back to his work.
3. Keep answers under 3 paragraphs to avoid overwhelming the user.
4. Use Markdown for formatting (bolding key tech stacks, bullet points).
5. Never invent or hallucinate experience that is not listed above. If you don't know, say "I don't have that specific information, but you can email Sandeepan directly!"
`;

// ── Rate Limiter (per-IP, no external deps) ──
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;    // max requests
const RATE_LIMIT_WINDOW = 60000; // per 60 seconds

function getRateLimitKey(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.socket.remoteAddress 
    || 'unknown';
}

router.post('/', async (req: Request, res: Response) => {
  // ── Rate limit check ──
  const ip = getRateLimitKey(req);
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.status(429).json({ 
        error: `Too many requests. Please try again in ${retryAfter}s.` 
      });
      return;
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  // Clean up old entries every 100 requests
  if (rateLimitMap.size > 100) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'A messages array is required.' });
      return;
    }

    // Prepare the message array for Groq including the System Prompt
    const groqMessages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: String(m.content)
      }))
    ];

    // Request the chat completion
    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama-3.1-8b-instant', // Upgrading to the actively supported Llama 3.1 8B model
      temperature: 0.5,
      max_tokens: 1024,
      stream: false, // We will start with a simple non-streaming response for V1
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Disconnect: In production, we'd log this conversation to Prisma here.
    // await prisma.chatLog.create({ ... })

    res.status(200).json({ 
      role: 'assistant', 
      content: aiResponse 
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

export default router;
