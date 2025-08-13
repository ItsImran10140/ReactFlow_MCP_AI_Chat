import React from "react";
import { FaRegCopy } from "react-icons/fa6";
import { ChatMessageProps } from "../types";
import { formatText } from "../utils/textFormatting";

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onCopy,
  copySuccess,
}) => {
  const handleCopy = () => {
    onCopy(message.content);
  };

  return (
    <div
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
        <div className="flex-1 min-w-0">
          {/* Role Label with Copy Button */}
          <div
            className={`flex items-center mb-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                title="Copy message"
              >
                {copySuccess ? "✓ Copied!" : <FaRegCopy size={16} />}
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div
            className={`prose prose-sm max-w-none text-gray-800 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
            style={{
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
  );
};

export default ChatMessage;
