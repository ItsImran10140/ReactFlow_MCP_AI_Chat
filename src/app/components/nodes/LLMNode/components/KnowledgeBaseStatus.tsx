import React from "react";
import { KnowledgeBaseNode } from "../types";

interface KnowledgeBaseStatusProps {
  connectedNodes: KnowledgeBaseNode[];
}

const KnowledgeBaseStatus: React.FC<KnowledgeBaseStatusProps> = ({
  connectedNodes,
}) => {
  if (connectedNodes.length === 0) return null;

  return (
    <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs">
      <div className="font-medium text-purple-800">
        📚 Connected Knowledge Bases:
      </div>
      {connectedNodes.map((kb, index) => (
        <div key={index} className="text-purple-600 ml-2">
          • {kb.title || "Wikipedia Article"}
        </div>
      ))}
      <div className="text-purple-600 mt-1 italic">
        Wikipedia content will be automatically included in responses
      </div>
    </div>
  );
};

export default KnowledgeBaseStatus;
