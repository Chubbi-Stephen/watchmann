import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-key',
});

/**
 * Generate viral content strategies based on news trends and user identity
 */
export const generateContentStrategy = async ({ trend, identity, tone, platform }) => {
  // If no key, return the mock fallback gracefully
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[Neural Link] Using mock logic. Missing API Key.");
    return null; 
  }

  const prompt = `
    You are an elite content strategist for a high-performance creator.
    Your mission: Convert this tech trend into a high-converting ${platform} post.
    
    Target Identity: ${identity.identityRole}
    Market Niche: ${identity.niche}
    Vocal Tone Signature: ${tone}
    Platform Ecosystem: ${platform}
    
    News Headline: ${trend.headline}
    Context: ${trend.description}
    
    Instructions:
    - Act as the ${identity.identityRole}.
    - Use the ${tone} voice.
    - Tailor the structure perfectly for ${platform}.
    - Include 3 viral hooks or takeaways.
    - End with a strong call to action.
    - Use industrial/tech metaphors where appropriate.
    
    Output format: Just the post content.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("[Neural Link] Generation Failure:", error);
    return null;
  }
};
