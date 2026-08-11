import type { step as InngestStep } from "inngest";
import type OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "../../lib/openai-client";
import { type Summary, summarySchema } from "@/schemas/ai-outputs";
import type { TranscriptWithExtras } from "@/types/assemblyai";

const SUMMARY_SYSTEM_PROMPT =
  "You are an expert podcast content analyst and marketing strategist. Your summaries are engaging, insightful, and highlight the most valuable takeaways for listeners.You MUST respond with a valid JSON object containing exactly these keys: 'full' (string), 'bullets' (array of strings), 'insights' (array of strings), and 'tldr' (string)";

function buildSummaryPrompt(transcript: TranscriptWithExtras): string {
  return `Analyze this podcast transcript in detail and create a comprehensive summary package.

TRANSCRIPT (first 5000 chars):
${transcript.text.substring(0, 5000)}...

${
  transcript.chapters.length > 0
    ? `\nAUTO-DETECTED CHAPTERS:\n${transcript.chapters
        .map((ch, idx) => `${idx + 1}. ${ch.headline} - ${ch.summary}`)
        .join("\n")}`
    : ""
}

Create a summary with:

1. FULL OVERVIEW (200-300 words):
   - What is this podcast about?
   - Who is speaking and what's their perspective?
   - What are the main themes and arguments?
   - Why should someone listen to this?

2. KEY BULLET POINTS (5-7 items):
   - Main topics discussed in order
   - Important facts or statistics mentioned
   - Key arguments or positions taken
   - Notable quotes or moments

3. ACTIONABLE INSIGHTS (3-5 items):
   - What can listeners learn or apply?
   - Key takeaways that provide value
   - Perspectives that challenge conventional thinking
   - Practical advice or recommendations

4. TL;DR (one compelling sentence):
   - Capture the essence and hook interest
   - Make someone want to listen

Be specific, engaging, and valuable. Focus on what makes this podcast unique and worth listening to.`;
}

export async function generateSummary(
  step: typeof InngestStep,
  transcript: TranscriptWithExtras
): Promise<Summary> {
  console.log("Generating podcast summary with GPT-4");

  try {
    const createCompletion = openai.chat.completions.create.bind(
      openai.chat.completions
    );

    const response = (await step.ai.wrap(
      "generate-summary-with-",
      createCompletion,
      {
        model: "llama-3.3-70b-versatile", 
        messages: [
          { role: "system", content: SUMMARY_SYSTEM_PROMPT },
          { role: "user", content: buildSummaryPrompt(transcript) },
        ],
        response_format: { type: "json_object" },
      }
    )) as OpenAI.Chat.Completions.ChatCompletion;

    const content = response.choices[0]?.message?.content;
    const summary = content
      ? summarySchema.parse(JSON.parse(content))
      : {
          full: transcript.text.substring(0, 500),
          bullets: ["Full transcript available"],
          insights: ["See transcript"],
          tldr: transcript.text.substring(0, 200),
        };

    return summary;
  } catch (error) {
    console.error("llama-3.3-70b-versatile summary generation error:", error);

    return {
      full: "⚠️ Error generating summary with llama-3.3-70b-versatile. Please check logs or try again.",
      bullets: ["Summary generation failed - see full transcript"],
      insights: ["Error occurred during AI generation"],
      tldr: "Summary generation failed",
    };
  }
}