import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.string(),

    deletedAt: v.optional(v.number()),

    inputUrl: v.string(), // Vercel Blob URL (public access)
    fileName: v.string(), // Original filename for display
    displayName: v.optional(v.string()), // User-editable display name (defaults to fileName in UI)
    fileSize: v.number(), // Bytes - used for billing/limits
    fileDuration: v.optional(v.number()), // Seconds - extracted or estimated
    fileFormat: v.string(), // Extension (mp3, mp4, wav, etc.)
    mimeType: v.string(), // MIME type for validation

    status: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),

    jobStatus: v.optional(
      v.object({
        transcription: v.optional(
          v.union(
            v.literal("pending"),
            v.literal("running"),
            v.literal("completed"),
            v.literal("failed")
          )
        ),
        contentGeneration: v.optional(
          v.union(
            v.literal("pending"),
            v.literal("running"),
            v.literal("completed"),
            v.literal("failed")
          )
        ),
        keyMoments: v.optional(v.string()), 
        summary: v.optional(v.string()),
        social: v.optional(v.string()),
        titles: v.optional(v.string()),
        hashtags: v.optional(v.string()),
        youtubeTimestamps: v.optional(v.string()),
      })
    ),

    error: v.optional(
      v.object({
        message: v.string(), // User-friendly error message
        step: v.string(), // Which job failed (transcription, summary, etc.)
        timestamp: v.number(), // When the error occurred
        details: v.optional(
          v.object({
            statusCode: v.optional(v.number()), // HTTP status if applicable
            stack: v.optional(v.string()), // Stack trace for debugging
          })
        ),
      })
    ),

    jobErrors: v.optional(
      v.object({
        keyMoments: v.optional(v.string()),
        summary: v.optional(v.string()),
        socialPosts: v.optional(v.string()),
        titles: v.optional(v.string()),
        hashtags: v.optional(v.string()),
        youtubeTimestamps: v.optional(v.string()),
      })
    ),

    transcript: v.optional(
      v.object({
        text: v.string(), // Full transcript as plain text
        segments: v.array(
          v.object({
            id: v.number(),
            start: v.number(), // Start time in seconds
            end: v.number(), // End time in seconds
            text: v.string(), // Segment text
            words: v.optional(
              v.array(
                v.object({
                  word: v.string(),
                  start: v.number(),
                  end: v.number(),
                })
              )
            ),
          })
        ),
        speakers: v.optional(
          v.array(
            v.object({
              speaker: v.string(), // Speaker label (A, B, C, etc.)
              start: v.number(),
              end: v.number(),
              text: v.string(),
              confidence: v.number(), // Detection confidence (0-1)
            })
          )
        ),
        chapters: v.optional(
          v.array(
            v.object({
              start: v.number(), // Start time in milliseconds
              end: v.number(), // End time in milliseconds
              headline: v.string(), // Chapter title
              summary: v.string(), // Chapter summary
              gist: v.string(), // Short gist
            })
          )
        ),
      })
    ),

    keyMoments: v.optional(
      v.array(
        v.object({
          time: v.string(), // Human-readable time (e.g., "12:34")
          timestamp: v.number(), // Seconds for programmatic use
          text: v.string(), // What was said at this moment
          description: v.string(), // Why this moment is interesting
        })
      )
    ),

    summary: v.optional(
      v.object({
        full: v.string(), // 200-300 word overview
        bullets: v.array(v.string()), // 5-7 key points
        insights: v.array(v.string()), // 3-5 actionable takeaways
        tldr: v.string(), // One sentence hook
      })
    ),

    socialPosts: v.optional(
      v.object({
        twitter: v.string(), // 280 chars, punchy and engaging
        linkedin: v.string(), // Professional tone, longer form
        instagram: v.string(), // Visual description + engagement hooks
        tiktok: v.string(), // Casual, trend-aware
        youtube: v.string(), // Description with timestamps and CTAs
        facebook: v.string(), // Community-focused, conversation starters
      })
    ),

    titles: v.optional(
      v.object({
        youtubeShort: v.array(v.string()), // Catchy, clickable (60 chars)
        youtubeLong: v.array(v.string()), // Descriptive, SEO-friendly
        podcastTitles: v.array(v.string()), // Episode titles
        seoKeywords: v.array(v.string()), // Keywords for discoverability
      })
    ),

    hashtags: v.optional(
      v.object({
        youtube: v.array(v.string()),
        instagram: v.array(v.string()),
        tiktok: v.array(v.string()),
        linkedin: v.array(v.string()),
        twitter: v.array(v.string()),
      })
    ),

    youtubeTimestamps: v.optional(
      v.array(
        v.object({
          timestamp: v.string(), // Format: "12:34"
          description: v.string(), // Chapter title/description
        })
      )
    ),

    createdAt: v.number(), // Project creation time
    updatedAt: v.number(), // Last modification time
    completedAt: v.optional(v.number()), // When processing finished
  })
    .index("by_user", ["userId"]) // List all projects for a user
    .index("by_status", ["status"]) // Filter by processing status
    .index("by_user_and_status", ["userId", "status"]) // User's active/completed projects
    .index("by_created_at", ["createdAt"]), // Sort by newest first
});