import type { step as InngestStep } from "inngest";
import { type Titles, titlesSchema } from "@/schemas/ai-outputs";
import type { TranscriptWithExtras } from "@/types/assemblyai";
import { openai } from "../../lib/openai-client";

const TITLES_SYSTEM_PROMPT =
  "You are an expert in SEO, content marketing, and viral content creation. You understand what makes titles clickable while maintaining credibility and search rankings. You MUST respond with a valid JSON object containing exactly these keys: 'youtubeShort' (array of strings), 'youtubeLong' (array of strings), 'podcastTitles' (array of strings), and 'seoKeywords' (array of strings).";

function buildTitlesPrompt(transcript: TranscriptWithExtras): string {
  return `Create optimized titles for this podcast episode.

TRANSCRIPT PREVIEW:
${transcript.text.substring(0, 2000)}...

${
  transcript.chapters.length > 0
    ? `MAIN TOPICS COVERED:\n${transcript.chapters
        .map((ch, idx) => `${idx + 1}. ${ch.headline}`)
        .join("\n")}`
    : ""
}

Generate 4 types of titles:

1. YOUTUBE SHORT TITLES (exactly 3):
   - 40-60 characters each
   - Hook-focused, curiosity-driven
   - Clickable but not clickbait
   - Use power words and numbers when relevant

2. YOUTUBE LONG TITLES (exactly 3):
   - 70-100 characters each
   - Include SEO keywords naturally
   - Descriptive and informative
   - Format: "Main Topic: Subtitle | Context or Value Prop"

3. PODCAST EPISODE TITLES (exactly 3):
   - Creative, memorable titles
   - Balance intrigue with clarity
   - Good for RSS feeds and directories
   - Can use "Episode #" format or standalone

4. SEO KEYWORDS (5-10):
   - High-traffic search terms
   - Relevant to podcast content
   - Mix of broad and niche terms
   - Focus on what people actually search for

Make titles compelling, accurate, and optimized for discovery.`;
}

export async function generateTitles(
  step: typeof InngestStep,
  transcript: TranscriptWithExtras,
): Promise<Titles> {
  console.log("[Titles] Generating titles with Gemini...");

  try {
    console.log("[Titles] Calling Gemini API...");

    const response = await step.run("call-groq-titles", async () => {
      return openai.chat.completions.create({
        model: "gemini-3.5-flash",
        messages: [
          { role: "system", content: TITLES_SYSTEM_PROMPT },
          { role: "user", content: buildTitlesPrompt(transcript) },
        ],
        response_format: { type: "json_object" },
      });
    });

    console.log("[Titles] Gemini response received");

    const titlesContent = response.choices[0]?.message?.content;
    const titles = titlesContent
      ? titlesSchema.parse(JSON.parse(titlesContent))
      : {
          youtubeShort: ["Podcast Episode"],
          youtubeLong: ["Podcast Episode - Full Discussion"],
          podcastTitles: ["New Episode"],
          seoKeywords: ["podcast"],
        };

    return titles;
  } catch (error) {
    console.error("GPT titles error:", error);

    return {
      youtubeShort: ["⚠️ Title generation failed"],
      youtubeLong: ["⚠️ Title generation failed - check logs"],
      podcastTitles: ["⚠️ Title generation failed"],
      seoKeywords: ["error"],
    };
  }
}
