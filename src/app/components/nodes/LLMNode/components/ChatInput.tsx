import React, { useState, useCallback } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  onStop: () => void;
  isLoading: boolean;
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onClear,
  onStop,
  isLoading,
  placeholder,
}) => {
  const [userInput, setUserInput] = useState<string>("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);
    },
    []
  );

  const handleSend = useCallback(() => {
    if (!userInput.trim() || isLoading) return;
    onSend(userInput);
    setUserInput("");
  }, [userInput, isLoading, onSend]);

  const handleInputKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Ask the LLM:</label>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-vertical min-h-[80px]"
        rows={3}
        disabled={isLoading}
      />

      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={!userInput.trim() || isLoading}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Send"}
        </button>

        {isLoading && (
          <button
            onClick={onStop}
            className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Stop
          </button>
        )}

        <button
          onClick={onClear}
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
  );
};

export default ChatInput;
