import React, { useState, useCallback } from "react";
import { ChatMessage as ChatMessageType } from "../../shared/types";
import ChatMessage from "./ChatMessage";

interface MessageListProps {
  chatHistory: ChatMessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ chatHistory }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopy = useCallback(async (text: string) => {
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

  return (
    <div className="space-y-1">
      {chatHistory.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          onCopy={handleCopy}
          copySuccess={copySuccess}
        />
      ))}
    </div>
  );
};

export default MessageList;
