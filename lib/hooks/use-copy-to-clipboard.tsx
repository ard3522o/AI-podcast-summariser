import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (
    text: string,
    id: string,
    successMessage = "Copied to clipboard!",
    timeout = 2000
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(successMessage);
      setTimeout(() => setCopiedId(null), timeout);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy failed:", error);
    }
  };

  const isCopied = (id: string) => copiedId === id;

  return { copy, isCopied, copiedId };
}