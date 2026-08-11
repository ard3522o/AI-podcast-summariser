import { AssemblyAI } from "assemblyai";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import type { PlanName } from "@/lib/tier-config";
import type {
  AssemblyAIChapter,
  AssemblyAISegment,
  AssemblyAIUtterance,
  AssemblyAIWord,
  TranscriptWithExtras,
} from "@/types/assemblyai";

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

export async function transcribeWithAssemblyAI(
  audioUrl: string,
  projectId: Id<"projects">,
  userPlan: PlanName = "free"
): Promise<TranscriptWithExtras> {
  console.log(
    `Starting AssemblyAI transcription for project ${projectId} (${userPlan} plan)`
  );

  try {
    const transcriptResponse = await assemblyai.transcripts.transcribe({
      audio: audioUrl, // Public URL - AssemblyAI downloads the file
      speaker_labels: true, // Always enable speaker diarization (UI-gated for ULTRA)
      auto_chapters: true, // Detect topic changes automatically
      format_text: true, // Add punctuation and capitalization
      speech_models: ["universal-3-pro","universal-2"]
    });

    if (transcriptResponse.status === "error") {
      throw new Error(
        transcriptResponse.error || "AssemblyAI transcription failed"
      );
    }

    console.log("AssemblyAI transcription completed");

    const response = transcriptResponse as unknown as {
      text: string;
      segments: AssemblyAISegment[];
      chapters: AssemblyAIChapter[];
      utterances: AssemblyAIUtterance[];
      words: AssemblyAIWord[];
      audio_duration?: number; 
    };

    console.log(
      `Transcribed ${response.words?.length || 0} words, ${
        response.segments?.length || 0
      } segments, ${response.chapters?.length || 0} chapters, ${
        response.utterances?.length || 0
      } speakers`
    );

    const assemblySegments: AssemblyAISegment[] = response.segments || [];
    const assemblyChapters: AssemblyAIChapter[] = response.chapters || [];
    const assemblyUtterances: AssemblyAIUtterance[] = response.utterances || [];

    const formattedSegments = assemblySegments.map((segment, idx) => ({
      id: idx,
      start: segment.start,
      end: segment.end,
      text: segment.text,
      words: (segment.words || []).map((word) => ({
        word: word.text,
        start: word.start,
        end: word.end,
      })),
    }));

    const formattedTranscript = {
      text: response.text || "",
      segments: formattedSegments,
    };

    const speakers = assemblyUtterances.map(
      (utterance: AssemblyAIUtterance) => ({
        speaker: utterance.speaker,
        start: utterance.start / 1000, 
        end: utterance.end / 1000, 
        text: utterance.text,
        confidence: utterance.confidence,
      })
    );

    const chapters = assemblyChapters.map((chapter: AssemblyAIChapter) => ({
      start: chapter.start,
      end: chapter.end,
      headline: chapter.headline,
      summary: chapter.summary,
      gist: chapter.gist,
    }));

    await convex.mutation(api.projects.saveTranscript, {
      projectId,
      transcript: {
        ...formattedTranscript,
        speakers,
        chapters,
      },
    });

    return {
      text: response.text || "",
      segments: formattedSegments,
      chapters: assemblyChapters,
      utterances: assemblyUtterances,
      audio_duration: response.audio_duration,
    };
  } catch (error) {
    console.error("AssemblyAI transcription error:", error);

    await convex.mutation(api.projects.recordError, {
      projectId,
      message: error instanceof Error ? error.message : "Transcription failed",
      step: "transcription",
      details: { 
        stack: error instanceof Error ? error.stack : String(error) 
      },
    });

    throw error;
  }
}