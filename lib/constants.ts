
import type { LucideIcon } from "lucide-react";
import {
  FileSignature,
  Hash,
  Heading,
  MessageSquare,
  Target,
  Youtube,
} from "lucide-react";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit
export const ALLOWED_AUDIO_TYPES = {
        "audio/mpeg": [".mp3"], // MP3
        "audio/x-m4a": [".m4a"], // M4A (iOS/Apple)
        "audio/wav": [".wav", ".wave"], // WAV
        "audio/x-wav": [".wav", ".wave"], // WAV (alternate MIME)
        "audio/aac": [".aac"], // AAC
        "audio/ogg": [".ogg", ".oga"], // OGG Vorbis
        "audio/opus": [".opus"], // Opus
        "audio/webm": [".webm"], // WebM Audio
        "audio/flac": [".flac"], // FLAC
        "audio/x-flac": [".flac"], // FLAC (alternate MIME)
        "audio/3gpp": [".3gp"], // 3GP
        "audio/3gpp2": [".3g2"], // 3G2
        }


export const PROGRESS_CAP_PERCENTAGE = 95;
export const ANIMATION_INTERVAL_MS = 4000;
export const PROGRESS_UPDATE_INTERVAL_MS = 1000;


export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;
export const MS_PER_DAY = 86400000;

export interface GenerationOutput {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const GENERATION_OUTPUTS: GenerationOutput[] = [
  {
    name: "Summary",
    icon: FileSignature,
    description:
      "Creating comprehensive podcast summary with key insights and takeaways",
  },
  {
    name: "Key Moments",
    icon: Target,
    description:
      "Identifying important timestamps, highlights, and memorable quotes",
  },
  {
    name: "Social Posts",
    icon: MessageSquare,
    description:
      "Crafting platform-optimized posts for Twitter, LinkedIn, Instagram, TikTok, YouTube, and Facebook",
  },
  {
    name: "Titles",
    icon: Heading,
    description:
      "Generating engaging SEO-optimized titles and keywords for maximum reach",
  },
  {
    name: "Hashtags",
    icon: Hash,
    description:
      "Creating trending platform-specific hashtag strategies for better discoverability",
  },
  {
    name: "YouTube Timestamps",
    icon: Youtube,
    description:
      "Formatting clickable chapter markers for YouTube video descriptions",
  },
];