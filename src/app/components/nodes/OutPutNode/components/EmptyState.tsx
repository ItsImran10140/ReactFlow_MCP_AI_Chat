import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
      <div className="text-6xl mb-4">💬</div>
      <p className="text-lg font-medium mb-2">No conversation yet</p>
      <p className="text-sm">Connect an LLM node to start chatting</p>
    </div>
  );
};

export default EmptyState;
