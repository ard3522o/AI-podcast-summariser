/**
 * Extract JSON from AI response that may contain thinking tokens
 * Gemini 3.x models include thinking tokens that can break JSON parsing
 */
export function extractJsonFromResponse(text: string): string {
  if (!text) return '{}';

  // Try parsing directly first
  try {
    JSON.parse(text);
    return text;
  } catch {
    // Not clean JSON, try to extract it
  }

  // Try to find JSON object in the response
  // Look for first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Still not valid, try deeper extraction
    }
  }

  // Try to find JSON array
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');

  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const candidate = text.substring(firstBracket, lastBracket + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Not valid
    }
  }

  // Last resort: try to clean thinking tokens
  // Gemini thinking tokens start with < and end with >
  const cleaned = text.replace(/<[^>]*>/g, '').trim();
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // Give up, return empty object
    console.error('Failed to extract JSON from response:', text.substring(0, 200));
    return '{}';
  }
}
