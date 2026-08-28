import OpenAI from "openai";

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("[Gemini] ERROR: No API key found! Set GEMINI_API_KEY in your .env.local or Vercel environment variables.");
}

export const openai = new OpenAI({
  apiKey: apiKey || "missing-key",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
