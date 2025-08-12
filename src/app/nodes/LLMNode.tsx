/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  memo,
  ChangeEvent,
  useRef,
} from "react";
import { graph } from "../../core/DependencyGraph";
import BaseNode from "./BaseNode/BaseNodes";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const LLMNode = memo(({ id, data }: any) => {
  const [nodeName, setNodeName] = useState<string>(data.nodeName || "LLM Node");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    data.chatHistory || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasWikipediaContext, setHasWikipediaContext] =
    useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Get connected input nodes from the knowledge_input handle
  const knowledgeInput = data.knowledge_input;

  // Extract connected knowledge base nodes
  let connectedKnowledgeNodes: any[] = [];

  if (knowledgeInput) {
    if (knowledgeInput.type === "knowledge_base") {
      connectedKnowledgeNodes = [knowledgeInput];
    } else if (Array.isArray(knowledgeInput)) {
      connectedKnowledgeNodes = knowledgeInput.filter(
        (input: any) => input && input.type === "knowledge_base"
      );
    }
  }

  // Get Wikipedia context from connected Knowledge Base Nodes
  const getWikipediaContext = useCallback(() => {
    if (connectedKnowledgeNodes.length === 0) {
      return "";
    }

    const context = connectedKnowledgeNodes
      .map(
        (node: any) =>
          `Wikipedia Article: ${node.title}\nContent: ${node.content}\nSource: ${node.url}\n---`
      )
      .join("\n\n");

    return `Here is some relevant information from Wikipedia:\n\n${context}\n\nPlease use this information to help answer the user's question:`;
  }, [connectedKnowledgeNodes]);

  // Handle sending message to LLM
  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;

    // Add user message to chat history
    const userMessage: ChatMessage = {
      role: "user",
      content: userInput.trim(),
      timestamp: Date.now(),
    };

    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setUserInput("");

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError("");

    try {
      const wikipediaContext = getWikipediaContext();
      const hasContext = wikipediaContext.length > 0;
      setHasWikipediaContext(hasContext);

      const fullPrompt = hasContext
        ? `${wikipediaContext}\n\nUser Question: ${userMessage.content}`
        : userMessage.content;

      const response = await fetch(
        "https://vs-mcp-server.onrender.com/geminiai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: fullPrompt,
          }),
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

      // Add empty assistant message to chat history for streaming
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

        // Update the last message (assistant) in chat history
        const streamingHistory = [...updatedHistory];
        streamingHistory[streamingHistory.length - 1].content =
          accumulatedResponse;
        setChatHistory(streamingHistory);

        // Create a comprehensive data object that includes chat history
        const outputData = {
          response: accumulatedResponse,
          chatHistory: streamingHistory,
          hasWikipediaContext,
          sourceNodeId: id,
          nodeName: nodeName,
          type: "llm_response",
          timestamp: Date.now(),
        };

        // Update node data with BOTH display and chatHistory data
        graph.updateNodeData(id, {
          nodeName,
          chatHistory: streamingHistory,
          hasWikipediaContext,
          // The display handle should carry the comprehensive data
          display: JSON.stringify(outputData), // Pass as JSON string
          // Also keep individual fields for internal use
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
  }, [userInput, chatHistory, getWikipediaContext, id, nodeName]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);
    },
    []
  );

  // Handle Enter key to send message (Shift+Enter for new line)
  const handleInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Handle stop generation
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Handle clear chat
  const handleClearChat = useCallback(() => {
    setUserInput("");
    setChatHistory([]);
    setError("");
    setHasWikipediaContext(false);

    // Clear the output data as well
    graph.updateNodeData(id, {
      nodeName,
      chatHistory: [],
      hasWikipediaContext: false,
      display: "",
      currentResponse: "",
      output: undefined,
    });
  }, [id, nodeName]);

  // Handle node name changes
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setNodeName(newName);

      graph.updateNodeData(id, {
        nodeName: newName,
        chatHistory,
        hasWikipediaContext,
        output: data.output
          ? {
              ...data.output,
              nodeName: newName,
            }
          : undefined,
      });
    },
    [id, chatHistory, hasWikipediaContext, data.output]
  );

  const handleNameKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setIsEditingName(false);
      }
    },
    []
  );

  const handleNameBlur = useCallback(() => {
    setIsEditingName(false);
  }, []);

  const handleNameClick = useCallback(() => {
    setIsEditingName(true);
  }, []);

  // Update state from data changes
  useEffect(() => {
    if (data.nodeName !== undefined && data.nodeName !== nodeName) {
      setNodeName(data.nodeName);
    }
    if (
      data.chatHistory !== undefined &&
      JSON.stringify(data.chatHistory) !== JSON.stringify(chatHistory)
    ) {
      setChatHistory(data.chatHistory);
    }
    if (
      data.hasWikipediaContext !== undefined &&
      data.hasWikipediaContext !== hasWikipediaContext
    ) {
      setHasWikipediaContext(data.hasWikipediaContext);
    }
  }, [
    data,
    nodeName,
    chatHistory,
    hasWikipediaContext,
    connectedKnowledgeNodes,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Configure BaseNode props
  const baseNodeData = {
    handles: [
      {
        type: "target" as const,
        position: "left" as const,
        id: "knowledge_input",
        className: "bg-purple-500",
      },
      {
        type: "source" as const,
        position: "right" as const,
        id: "display",
        className: "bg-blue-500",
      },
    ],
  };

  const knowledgeBasesConnected = connectedKnowledgeNodes;

  return (
    <BaseNode data={baseNodeData} className="w-96">
      <div className="space-y-3">
        {/* Editable Node Name */}
        <div className="mb-2">
          {isEditingName ? (
            <input
              type="text"
              value={nodeName}
              onChange={handleNameChange}
              onKeyPress={handleNameKeyPress}
              onBlur={handleNameBlur}
              className="w-full px-2 py-1 text-sm font-medium text-center border border-blue-300 rounded focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div
              onClick={handleNameClick}
              className="w-full px-2 py-1 text-sm font-medium text-center cursor-pointer hover:bg-gray-50 rounded border border-transparent hover:border-gray-200"
              title="Click to edit node name"
            >
              {nodeName}
            </div>
          )}
        </div>

        {/* Knowledge Base Status */}
        {knowledgeBasesConnected.length > 0 && (
          <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs">
            <div className="font-medium text-purple-800">
              📚 Connected Knowledge Bases:
            </div>
            {knowledgeBasesConnected.map((kb: any, index: number) => (
              <div key={index} className="text-purple-600 ml-2">
                • {kb.title || "Wikipedia Article"}
              </div>
            ))}
            <div className="text-purple-600 mt-1 italic">
              Wikipedia content will be automatically included in responses
            </div>
          </div>
        )}

        {/* User Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ask the LLM:
          </label>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            placeholder={
              knowledgeBasesConnected.length > 0
                ? "Ask a question about the connected Wikipedia articles..."
                : "Ask the LLM anything... (Connect Knowledge Base for context)"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-vertical min-h-[80px]"
            rows={3}
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Send"}
            </button>

            {isLoading && (
              <button
                onClick={handleStopGeneration}
                className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Stop
              </button>
            )}

            <button
              onClick={handleClearChat}
              disabled={isLoading}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
            >
              Clear
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              chatHistory.length > 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                isLoading
                  ? "bg-yellow-500 animate-pulse"
                  : chatHistory.length > 0
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
            {isLoading
              ? "Generating Response..."
              : chatHistory.length > 0
              ? `${chatHistory.length} Messages`
              : "Ready to Chat"}
          </div>
        </div>
      </div>
    </BaseNode>
  );
});

LLMNode.displayName = "LLMNode";

export default LLMNode;
