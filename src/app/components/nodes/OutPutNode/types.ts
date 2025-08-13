import { ChatMessage } from "../shared/types";

export interface OutputNodeData {
  display?: string;
  chatHistory?: ChatMessage[];
  output?: {
    chatHistory?: ChatMessage[];
    response?: string;
    answer?: string;
  };
  input?: string;
}

export interface ChatMessageProps {
  message: ChatMessage;
  onCopy: (text: string) => void;
  copySuccess: boolean;
}
