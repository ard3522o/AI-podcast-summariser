import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld } from "@/inngest/functions/hello";
import { podcastProcessor } from "@/inngest/functions/podcast-processor";
import { retryJobFunction } from "@/inngest/functions/retry-job";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    podcastProcessor,
    retryJobFunction
  ],
});