import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testGroq() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello!' }],
      model: 'llama3-8b-8192',
    });
    console.log("SUCCESS:", completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("GROQ ERROR:");
    console.dir(err, { depth: null });
  }
}

testGroq();
