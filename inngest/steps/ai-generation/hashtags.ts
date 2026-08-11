import type { step as InngestStep } from "inngest";
import type OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "../../lib/openai-client";
import { type Hashtags, hashtagsSchema } from "@/schemas/ai-outputs";
import type { TranscriptWithExtras } from "@/types/assemblyai";

const HASHTAGS_SYSTEM_PROMPT =
  "You are a social media growth expert who understands platform algorithms and trending hashtag strategies. You create hashtag sets that maximize reach and engagement. You MUST respond with a valid JSON object. The JSON object must contain exactly these keys: 'youtube', 'instagram', 'tiktok', 'linkedin', and 'twitter', where each key contains an array of string hashtags.";
  
function buildHashtagsPrompt(transcript: TranscriptWithExtras): string {
  return `Create platform-optimized hashtag strategies for this podcast.

TOPICS COVERED:
${
  transcript.chapters
    ?.map((ch, idx) => `${idx + 1}. ${ch.headline}`)
    .join("\n") || "General discussion"
}

Generate hashtags for each platform following their best practices:

1. YOUTUBE (exactly 5 hashtags):
   - Broad reach, discovery-focused
   - Mix of general and niche
   - Trending in podcast/content space
   - Good for recommendations algorithm

2. INSTAGRAM (6-8 hashtags):
   - Mix of highly popular (100k+ posts) and niche (10k-50k posts)
   - Community-building tags
   - Content discovery tags
   - Trending but relevant

3. TIKTOK (5-6 hashtags):
   - Currently trending tags
   - Gen Z relevant
   - FYP optimization
   - Mix viral and niche

4. LINKEDIN (exactly 5 hashtags):
   - Professional, B2B focused
   - Industry-relevant
   - Thought leadership tags
   - Career/business oriented

5. TWITTER (exactly 5 hashtags):
   - Concise, trending
   - Topic-specific
   - Conversation-starting
   - Mix broad and niche

All hashtags should include the # symbol and be relevant to the actual content discussed.`;
}

export async function generateHashtags(
  step: typeof InngestStep,
  transcript: TranscriptWithExtras
): Promise<Hashtags> {
  console.log("Generating hashtags with GPT");

  try {
    const createCompletion = openai.chat.completions.create.bind(
      openai.chat.completions
    );

    const response = (await step.ai.wrap(
      "generate-hashtags-with-llama-3.3-70b-versatile",
      createCompletion,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: HASHTAGS_SYSTEM_PROMPT },
          { role: "user", content: buildHashtagsPrompt(transcript) },
        ],
      response_format: { type: "json_object" },      }
    )) as OpenAI.Chat.Completions.ChatCompletion;

    const content = response.choices[0]?.message?.content;
    const hashtags = content
      ? hashtagsSchema.parse(JSON.parse(content))
      : {
          youtube: ["#Podcast"],
          instagram: ["#Podcast", "#Content"],
          tiktok: ["#Podcast"],
          linkedin: ["#Podcast"],
          twitter: ["#Podcast"],
        };

    return hashtags;
  } catch (error) {
    console.error("GPT hashtags error:", error);

    return {
      youtube: ["⚠️ Hashtag generation failed"],
      instagram: ["⚠️ Hashtag generation failed"],
      tiktok: ["⚠️ Hashtag generation failed"],
      linkedin: ["⚠️ Hashtag generation failed"],
      twitter: ["⚠️ Hashtag generation failed"],
    };
  }
}