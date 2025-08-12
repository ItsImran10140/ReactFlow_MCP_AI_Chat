/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import BaseNode from "./BaseNode/BaseNodes";
import { FaRegCopy } from "react-icons/fa6";

const OutputNode = memo(({ id, data }: any) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Debug: Log the data prop to see what's being passed
  useEffect(() => {
    console.log("OutputNode data:", data);
    console.log("Chat history:", data?.chatHistory);
    console.log("Output object:", data?.output);
  }, [data]);

  // Try to get chat history from multiple possible sources
  let chatHistory = [];
  let parsedData = null;
  let isJson = false;

  // First, try to parse the display text as JSON (new format from LLM node)
  const displayText = data?.display || "";
  if (displayText) {
    try {
      parsedData = JSON.parse(displayText);
      isJson = true;

      // Extract chat history from parsed JSON
      if (parsedData?.chatHistory && Array.isArray(parsedData.chatHistory)) {
        chatHistory = parsedData.chatHistory;
      } else if (data?.chatHistory && Array.isArray(data?.chatHistory)) {
        chatHistory = data.chatHistory;
      } else if (
        data?.output?.chatHistory &&
        Array.isArray(data.output.chatHistory)
      ) {
        chatHistory = data.output.chatHistory;
      } else {
        // If no chat history in data, create one from the current response
        chatHistory = [
          ...(data?.chatHistory || []),
          {
            role: "user",
            content: data?.input || "User question",
            timestamp: Date.now(),
          },
          {
            role: "assistant",
            content: parsedData?.response || parsedData?.answer || displayText,
            timestamp: Date.now(),
          },
        ];
      }
    } catch (e) {
      // Not JSON, try other sources for chat history
      if (data?.chatHistory && Array.isArray(data?.chatHistory)) {
        chatHistory = data?.chatHistory;
      } else if (
        data?.output?.chatHistory &&
        Array.isArray(data.output.chatHistory)
      ) {
        chatHistory = data.output.chatHistory;
      } else {
        // Create chat history from available data
        chatHistory = [
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
  } else if (data?.chatHistory && Array.isArray(data?.chatHistory)) {
    chatHistory = data?.chatHistory;
  } else if (
    data?.output?.chatHistory &&
    Array.isArray(data.output.chatHistory)
  ) {
    chatHistory = data.output.chatHistory;
  }

  // Function to extract and clean content from JSON response
  const extractContent = (text: any) => {
    if (!text) return "";

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(text);
      // Return the actual content from various possible keys
      return (
        parsed.answer ||
        parsed.response ||
        parsed.content ||
        parsed.message ||
        text
      );
    } catch (e) {
      // If not JSON, return as is
      return text;
    }
  };

  // Enhanced text formatting for better LLM-like responses
  const formatText = (text: any) => {
    if (!text) return "";

    // First extract clean content if it's JSON
    const cleanText = extractContent(text);

    return (
      cleanText
        // Handle code blocks first (multiline)
        .replace(
          /```(\w+)?\n?([\s\S]*?)```/g,
          '<div class="code-block-container my-4"><div class="code-header bg-gray-800 text-gray-300 px-3 py-2 text-xs font-mono rounded-t-md">$1</div><pre class="bg-gray-900 text-gray-100 p-4 rounded-b-md overflow-x-auto font-mono text-sm"><code>$2</code></pre></div>'
        )
        // Handle inline code
        .replace(
          /`([^`\n]+)`/g,
          '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
        )
        // Handle bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-gray-900">$1</strong>'
        )
        // Handle italic text
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
        // Handle headers (### first to avoid conflicts) - Remove trailing colons
        .replace(
          /^### (.*?):?\s*$/gm,
          '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 border-b border-gray-200 pb-2">$1</h3>'
        )
        .replace(
          /^## (.*?):?\s*$/gm,
          '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h2>'
        )
        .replace(
          /^# (.*?):?\s*$/gm,
          '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>'
        )
        // Handle numbered lists
        .replace(
          /^\d+\.\s+(.+)$/gm,
          '<div class="list-item numbered mb-2 pl-4">$1</div>'
        )
        // Handle bullet points with better spacing
        .replace(
          /^\s*[\*\-\+]\s+(.+)$/gm,
          '<div class="list-item bullet mb-2 pl-4 relative"><span class="absolute -left-3 text-gray-600">•</span>$1</div>'
        )
        // Handle blockquotes
        .replace(
          /^>\s+(.+)$/gm,
          '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic rounded-r">$1</blockquote>'
        )
        // Clean up multiple newlines and split into paragraphs
        .replace(/\n{3,}/g, "\n\n")
        .split("\n\n")
        .map((paragraph: any) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return "";

          // Skip if already formatted as special element
          if (
            trimmed.includes('<div class="list-item"') ||
            trimmed.includes("<h1") ||
            trimmed.includes("<h2") ||
            trimmed.includes("<h3") ||
            trimmed.includes("<blockquote") ||
            trimmed.includes('<div class="code-block-container"')
          ) {
            return trimmed;
          }

          // Regular paragraph
          return `<p class="mb-4 leading-relaxed text-gray-800">${trimmed.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        })
        .filter((p: any) => p)
        .join("")
    );
  };

  // Copy functionality for individual messages
  const handleCopy = useCallback(async (text: any) => {
    if (!text) return;

    try {
      // Strip HTML tags for copying
      const plainText = text.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(plainText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, []);

  // Configure BaseNode props
  const baseNodeData = {
    label: "Output",
    handles: [
      {
        type: "target" as const,
        position: "left" as const,
        id: "display",
        className: "bg-purple-500",
      },
    ],
  };

  return (
    <BaseNode data={baseNodeData} className="w-[700px]">
      <div className="flex flex-col h-[600px]">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          {chatHistory.length > 0 ? (
            <div className="space-y-1">
              {chatHistory.map((message: any, index: any) => (
                <div
                  key={index}
                  className={`px-4 py-4 ${
                    message.role === "user"
                      ? "bg-blue-50 border-b border-gray-100"
                      : "bg-white border-b border-gray-100"
                  }`}
                >
                  <div
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Message Content */}
                    <div className="flex-1 min-w-0 ">
                      {/* Role Label */}
                      <div
                        className={`flex items-center mb-2 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="flex items-center gap-2 ">
                          {/* Copy button */}
                          <button
                            onClick={() => handleCopy(message.content)}
                            className=" text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                            title="Copy message"
                          >
                            {copySuccess ? (
                              "✓ Copied!"
                            ) : (
                              <FaRegCopy size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Message Text */}
                      <div
                        className={`prose prose-sm max-w-none text-gray-800 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}
                        style={{
                          // Custom styles for better formatting
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: formatText(message.content || "No content"),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium mb-2">No conversation yet</p>
              <p className="text-sm">Connect an LLM node to start chatting</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-gray-500 px-3 py-2 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 text-xs">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .list-item {
          margin: 0.25rem 0;
          padding-left: 0.75rem;
        }
        .list-item.bullet {
          position: relative;
        }
        .list-item.numbered {
          counter-increment: list-counter;
        }
        .code-block-container {
          border-radius: 0.375rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .prose h1,
        .prose h2,
        .prose h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose p {
          margin-bottom: 1rem;
        }
        .prose blockquote {
          margin: 1rem 0;
        }
      `}</style>
    </BaseNode>
  );
});

OutputNode.displayName = "OutputNode";

export default OutputNode;
