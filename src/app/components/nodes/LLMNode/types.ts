/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage } from "../shared/types";

export interface LLMNodeData {
  nodeName?: string;
  chatHistory?: ChatMessage[];
  knowledge_input?: any;
  hasWikipediaContext?: boolean;
  output?: any;
}

export interface KnowledgeBaseNode {
  type: string;
  title: string;
  content: string;
  url: string;
}
