import { useState, useCallback } from "react";

export const useCopyToClipboard = (resetDelay: number = 2000) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!text) return false;

      try {
        // Strip HTML tags for copying
        const plainText = text.replace(/<[^>]*>/g, "");
        await navigator.clipboard.writeText(plainText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), resetDelay);
        return true;
      } catch (err) {
        console.error("Failed to copy text: ", err);
        return false;
      }
    },
    [resetDelay]
  );

  return { copySuccess, copyToClipboard };
};
