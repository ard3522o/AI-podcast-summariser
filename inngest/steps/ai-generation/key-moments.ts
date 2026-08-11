import { formatTimestamp } from "@/lib/format";
import type { TranscriptWithExtras } from "@/types/assemblyai";

type KeyMoment = {
  time: string; 
  timestamp: number; 
  text: string; 
  description: string; 
};

export async function generateKeyMoments(
  transcript: TranscriptWithExtras
): Promise<KeyMoment[]> {
  console.log("Generating key moments from AssemblyAI chapters");


  const chapters = transcript.chapters || [];

  if (chapters.length === 0) {
    console.log(
      "No chapters detected by AssemblyAI - returning empty key moments"
    );
    return [];
  }

  const keyMoments = chapters.map((chapter) => {
    const startSeconds = chapter.start / 1000; 

    return {
      time: formatTimestamp(startSeconds, { padHours: true, forceHours: true }),
      timestamp: startSeconds,
      text: chapter.headline, 
      description: chapter.summary, 
    };
  });

  return keyMoments;
}