import type { step as InngestStep } from "inngest";
import type OpenAI from "openai";
import { formatTimestamp } from "@/lib/format";
import { openai } from "../../lib/openai-client";
import type { TranscriptWithExtras } from "@/types/assemblyai";

type YouTubeTimestamp = {
  timestamp: string; 
  description: string; 
};

export async function generateYouTubeTimestamps(
  step: typeof InngestStep,
  transcript: TranscriptWithExtras
): Promise<YouTubeTimestamp[]> {
  console.log(
    "Generating YouTube timestamps from AssemblyAI chapters with AI-enhanced titles"
  );

  const chapters = transcript.chapters || [];

  if (!chapters || chapters.length === 0) {
    throw new Error(
      "No chapters available from AssemblyAI. Cannot generate YouTube timestamps."
    );
  }

  const chaptersToUse = chapters.slice(0, 100);

  console.log(`Using ${chaptersToUse.length} chapters from AssemblyAI`);

  const chapterData = chaptersToUse.map((chapter, idx) => ({
    index: idx,
    timestamp: Math.floor(chapter.start / 1000),
    headline: chapter.headline, 
    summary: chapter.summary, 
    gist: chapter.gist, 
  }));

  const prompt = `You are a YouTube content optimization expert. Create SHORT CHAPTER TITLES for a video.

CRITICAL INSTRUCTIONS:
- DO NOT copy the transcript text
- DO NOT write full sentences
- Create 3-6 word TITLES only
- Think of these as chapter headings, not subtitles

I have ${
    chapterData.length
  } chapters with timestamps. For each one, create a SHORT, CATCHY TITLE.

CHAPTERS:
${chapterData
  .map(
    (ch, idx) =>
      `Chapter ${idx}: [${ch.timestamp}s]\nContext: ${ch.headline}\nSummary: ${ch.summary}`
  )
  .join("\n\n")}

YOUR TASK:
Transform each chapter into a 3-6 word YouTube chapter title.

EXAMPLES OF GOOD TITLES:
✓ "Introduction to N8N Automation" (5 words, descriptive title)
✓ "Setting Up Your Account" (4 words, action-oriented)
✓ "Telegram Bot Creation" (3 words, clear and concise)
✓ "Building Multi-Agent Workflows" (3 words, technical but clear)
✓ "Testing the News Agent" (4 words, specific feature)

EXAMPLES OF BAD RESPONSES (DO NOT DO THIS):
✗ "Today we are diving into n8n one of the most underrated" (transcript excerpt)
✗ "One click setup with n8n com allows you to get" (full sentence from transcript)
✗ "So we want to give Sarah some instructions so she knows" (conversational transcript)

Return ONLY valid JSON in this exact format:
{
  "titles": [
    {"index": 0, "title": "Introduction to N8N Automation"},
    {"index": 1, "title": "Setting Up Your Account"},
    {"index": 2, "title": "Building Your First Bot"}
  ]
}

Remember: Create TITLES, not transcript excerpts!`;

  const createCompletion = openai.chat.completions.create.bind(
    openai.chat.completions
  );

  const response = (await step.ai.wrap(
    "generate-youtube-titles-with-llama-3.3-70b-versatile",
    createCompletion,
    {
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, 
      messages: [
        {
          role: "system",
          content:
            "You are a YouTube content expert who creates SHORT, DESCRIPTIVE TITLES for video chapters. CRITICAL: You create TITLES (like 'Introduction to AI'), NOT transcript text or full sentences. You MUST respond with a valid JSON object containing a 'titles' array.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 1500, 
    }
  )) as OpenAI.Chat.Completions.ChatCompletion;

  const content = response.choices[0]?.message?.content || '{"titles":[]}';

  console.log("Raw GPT response:", content.substring(0, 500));

  let aiTitles: { index: number; title: string }[] = [];
  try {
    const parsed = JSON.parse(content);
    aiTitles = parsed.titles || [];
    console.log(`Successfully parsed ${aiTitles.length} AI-generated titles`);
    if (aiTitles.length > 0) {
      console.log("First 3 AI titles:", aiTitles.slice(0, 3));
    }
  } catch (error) {
    console.error("Failed to parse AI titles, using original headlines", error);
    console.error("Attempted to parse:", content);
  }

  const aiTimestamps = chapterData.map((chapter) => {
    const aiTitle = aiTitles.find((t) => t.index === chapter.index);

    if (!aiTitle) {
      console.warn(
        `No AI title found for chapter ${chapter.index}, using fallback: "${chapter.headline}"`
      );
    }

    return {
      timestamp: chapter.timestamp,
      description: aiTitle?.title || chapter.headline,
    };
  });

  console.log(
    `Generated ${aiTimestamps.length} YouTube timestamps (first 3):`,
    aiTimestamps.slice(0, 3).map((t) => `${t.timestamp}s: ${t.description}`)
  );

  const youtubeTimestamps = aiTimestamps.map((item) => ({
    timestamp: formatTimestamp(item.timestamp, { padHours: false }),
    description: item.description,
  }));

  console.log(`Generated ${youtubeTimestamps.length} YouTube timestamps`);

  return youtubeTimestamps;
}