export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    // Create temporary URL for file (revoked after use)
    const objectUrl = URL.createObjectURL(file);

    // Success: Metadata loaded, duration available
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(objectUrl); // Clean up memory
      resolve(Math.floor(audio.duration)); // Return duration in whole seconds
    });

    // Error: File couldn't be decoded or is corrupted
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl); // Clean up memory
      reject(new Error("Failed to load audio file"));
    });

    // Start loading audio file
    audio.src = objectUrl;
  });
}

export function estimateDurationFromSize(fileSize: number): number {
  // Convert bytes to MB, multiply by 8 (minutes per MB), convert to seconds
  return Math.floor((fileSize / (1024 * 1024)) * 8 * 60);
}