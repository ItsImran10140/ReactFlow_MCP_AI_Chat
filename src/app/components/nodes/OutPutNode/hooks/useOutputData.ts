import { useMemo, useEffect } from "react";
import { ChatMessage } from "../../shared/types";
import { OutputNodeData } from "../types";

export const useOutputData = (data: OutputNodeData) => {
  const chatHistory = useMemo(() => {
    let history: ChatMessage[] = [];
    let parsedData = null;

    const displayText = data?.display || "";

    if (displayText) {
      try {
        parsedData = JSON.parse(displayText);

        if (parsedData?.chatHistory && Array.isArray(parsedData.chatHistory)) {
          history = parsedData.chatHistory;
        } else if (data?.chatHistory && Array.isArray(data.chatHistory)) {
          history = data.chatHistory;
        } else if (
          data?.output?.chatHistory &&
          Array.isArray(data.output.chatHistory)
        ) {
          history = data.output.chatHistory;
        } else {
          // Create history from current response
          history = [
            ...(data?.chatHistory || []),
            {
              role: "user",
              content: data?.input || "User question",
              timestamp: Date.now(),
            },
            {
              role: "assistant",
              content:
                parsedData?.response || parsedData?.answer || displayText,
              timestamp: Date.now(),
            },
          ];
        }
      } catch (e) {
        // Not JSON, try other sources
        if (data?.chatHistory && Array.isArray(data.chatHistory)) {
          history = data.chatHistory;
        } else if (
          data?.output?.chatHistory &&
          Array.isArray(data.output.chatHistory)
        ) {
          history = data.output.chatHistory;
        } else {
          history = [
            ...(data?.chatHistory || []),
            {
              role: "user",
              content: data?.input || "User question",
              timestamp: Date.now(),
            },
            {
              role: "assistant",
              content: displayText,
              timestamp: Date.now(),
            },
          ];
        }
      }
    } else if (data?.chatHistory && Array.isArray(data.chatHistory)) {
      history = data.chatHistory;
    } else if (
      data?.output?.chatHistory &&
      Array.isArray(data.output.chatHistory)
    ) {
      history = data.output.chatHistory;
    }

    return history;
  }, [data]);

  // Debug logging
  useEffect(() => {
    console.log("OutputNode data:", data);
    console.log("Processed chat history:", chatHistory);
  }, [data, chatHistory]);

  return { chatHistory };
};
