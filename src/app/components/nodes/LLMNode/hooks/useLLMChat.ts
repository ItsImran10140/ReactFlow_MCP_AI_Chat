/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef } from "react";
import { ChatMessage } from "../../shared/types";
import { graph } from "../../../../../core/DependencyGraph";

export const useLLMChat = (
  id: string,
  nodeName: string,
  getWikipediaContext: string,
  hasKnowledgeBase: boolean
) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasWikipediaContext, setHasWikipediaContext] =
    useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: userInput.trim(),
        timestamp: Date.now(),
      };

      const newChatHistory = [...chatHistory, userMessage];
      setChatHistory(newChatHistory);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError("");

      try {
        const wikipediaContext = getWikipediaContext;
        const hasContext = wikipediaContext.length > 0;
        setHasWikipediaContext(hasContext);

        const fullPrompt = hasContext
          ? `${wikipediaContext}\n\nUser Question: ${userMessage.content}`
          : userMessage.content;

        const response = await fetch(
          "https://vs-mcp-server.onrender.com/geminiai/chat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: fullPrompt }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };
        const updatedHistory = [...newChatHistory, assistantMessage];
        setChatHistory(updatedHistory);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          const streamingHistory = [...updatedHistory];
          streamingHistory[streamingHistory.length - 1].content =
            accumulatedResponse;
          setChatHistory(streamingHistory);

          const outputData = {
            response: accumulatedResponse,
            chatHistory: streamingHistory,
            hasWikipediaContext,
            sourceNodeId: id,
            nodeName: nodeName,
            type: "llm_response",
            timestamp: Date.now(),
          };

          graph.updateNodeData(id, {
            nodeName,
            chatHistory: streamingHistory,
            hasWikipediaContext,
            display: JSON.stringify(outputData),
            currentResponse: accumulatedResponse,
            output: outputData,
          });
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request cancelled");
        } else {
          setError(`Failed to get LLM response: ${err.message}`);
          console.error("LLM request error:", err);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [chatHistory, getWikipediaContext, id, nodeName, isLoading]
  );

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleClearChat = useCallback(() => {
    setChatHistory([]);
    setError("");
    setHasWikipediaContext(false);

    graph.updateNodeData(id, {
      nodeName,
      chatHistory: [],
      hasWikipediaContext: false,
      display: "",
      currentResponse: "",
      output: undefined,
    });
  }, [id, nodeName]);

  return {
    chatHistory,
    isLoading,
    error,
    hasWikipediaContext,
    handleSendMessage,
    handleStopGeneration,
    handleClearChat,
    setChatHistory,
    setError,
    setHasWikipediaContext,
  };
};
