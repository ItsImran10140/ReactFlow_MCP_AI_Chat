/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { KnowledgeBaseNode } from "../types";

export const useKnowledgeBase = (knowledgeInput: any) => {
  const connectedKnowledgeNodes = useMemo(() => {
    if (!knowledgeInput) return [];

    if (knowledgeInput.type === "knowledge_base") {
      return [knowledgeInput];
    }

    if (Array.isArray(knowledgeInput)) {
      return knowledgeInput.filter(
        (input: any) => input && input.type === "knowledge_base"
      );
    }

    return [];
  }, [knowledgeInput]);

  const getWikipediaContext = useMemo(() => {
    if (connectedKnowledgeNodes.length === 0) return "";

    const context = connectedKnowledgeNodes
      .map(
        (node: KnowledgeBaseNode) =>
          `Wikipedia Article: ${node.title}\nContent: ${node.content}\nSource: ${node.url}\n---`
      )
      .join("\n\n");

    return `Here is some relevant information from Wikipedia:\n\n${context}\n\nPlease use this information to help answer the user's question:`;
  }, [connectedKnowledgeNodes]);

  return {
    connectedKnowledgeNodes,
    getWikipediaContext,
    hasKnowledgeBase: connectedKnowledgeNodes.length > 0,
  };
};
