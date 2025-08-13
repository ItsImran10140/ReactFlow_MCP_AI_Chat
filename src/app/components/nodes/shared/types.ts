/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseNodeProps {
  id: string;
  data: any;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface NodeHandle {
  type: "source" | "target";
  position: "left" | "right" | "top" | "bottom";
  id: string;
  className: string;
}
