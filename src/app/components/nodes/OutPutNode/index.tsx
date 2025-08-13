import React, { memo } from "react";
import BaseNode from "../BaseNode/BaseNodes";
import MessageList from "./components/MessageList";
import EmptyState from "./components/EmptyState";
import { useOutputData } from "./hooks/useOutputData";
import { OutputNodeData } from "./types";
import { BaseNodeProps } from "../shared/types";

const OutputNode = memo(({ id, data }: BaseNodeProps) => {
  const typedData = data as OutputNodeData;
  const { chatHistory } = useOutputData(typedData);

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
            <MessageList chatHistory={chatHistory} />
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center text-xs text-gray-500 px-3 py-2 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-3 items-center">
            <span className="text-gray-400 text-xs">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {chatHistory.length > 0 && (
              <span className="text-gray-400 text-xs">
                {chatHistory.length} messages
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
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
