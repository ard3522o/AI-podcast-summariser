import OpenAI from "openai";

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "missing";

export const openai = new OpenAI({
  apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
