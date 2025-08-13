/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, memo } from "react";
import { graph } from "../../../../core/DependencyGraph";
import BaseNode from "../BaseNode/BaseNodes";
import EditableNodeName from "../shared/components/EditableNodeName";
import StatusIndicator from "../shared/components/StatusIndicator";
import ErrorDisplay from "../shared/components/ErrorDisplay";
import KnowledgeBaseStatus from "./components/KnowledgeBaseStatus";
import ChatInput from "./components/ChatInput";
import { useNodeName } from "../shared/hooks/useNodeName";
import { useKnowledgeBase } from "./hooks/useKnowledgeBase";
import { useLLMChat } from "./hooks/useLLMChat";
import { LLMNodeData } from "./types";
import { BaseNodeProps } from "../shared/types";

const LLMNode = memo(({ id, data }: BaseNodeProps) => {
  const typedData = data as LLMNodeData;

  const nodeNameHook = useNodeName(id, typedData.nodeName || "LLM Node");
  const knowledgeHook = useKnowledgeBase(typedData.knowledge_input);
  const chatHook = useLLMChat(
    id,
    nodeNameHook.nodeName,
    knowledgeHook.getWikipediaContext,
    knowledgeHook.hasKnowledgeBase
  );

  // Handle node name changes with graph update
  const handleNameChange = (newName: string) => {
    nodeNameHook.handleNameChange(newName);

    graph.updateNodeData(id, {
      nodeName: newName,
      chatHistory: chatHook.chatHistory,
      hasWikipediaContext: chatHook.hasWikipediaContext,
      output: typedData.output
        ? { ...typedData.output, nodeName: newName }
        : undefined,
    });
  };

  // Update state from external data changes
  useEffect(() => {
    if (
      typedData.nodeName !== undefined &&
      typedData.nodeName !== nodeNameHook.nodeName
    ) {
      nodeNameHook.setNodeName(typedData.nodeName);
    }
    if (
      typedData.chatHistory !== undefined &&
      JSON.stringify(typedData.chatHistory) !==
        JSON.stringify(chatHook.chatHistory)
    ) {
      chatHook.setChatHistory(typedData.chatHistory);
    }
    if (
      typedData.hasWikipediaContext !== undefined &&
      typedData.hasWikipediaContext !== chatHook.hasWikipediaContext
    ) {
      chatHook.setHasWikipediaContext(typedData.hasWikipediaContext);
    }
  }, [
    typedData,
    nodeNameHook.nodeName,
    chatHook.chatHistory,
    chatHook.hasWikipediaContext,
  ]);

  const baseNodeData = {
    handles: [
      {
        type: "target" as const,
        position: "left" as const,
        id: "knowledge_input",
        className: "bg-purple-500",
      },
      {
        type: "source" as const,
        position: "right" as const,
        id: "display",
        className: "bg-blue-500",
      },
    ],
  };

  const placeholder = knowledgeHook.hasKnowledgeBase
    ? "Ask a question about the connected Wikipedia articles..."
    : "Ask the LLM anything... (Connect Knowledge Base for context)";

  return (
    <BaseNode data={baseNodeData} className="w-96">
      <div className="space-y-3">
        <EditableNodeName
          nodeName={nodeNameHook.nodeName}
          isEditing={nodeNameHook.isEditingName}
          onChange={handleNameChange}
          onKeyPress={nodeNameHook.handleNameKeyPress}
          onBlur={nodeNameHook.handleNameBlur}
          onClick={nodeNameHook.handleNameClick}
        />

        <KnowledgeBaseStatus
          connectedNodes={knowledgeHook.connectedKnowledgeNodes}
        />

        <ChatInput
          onSend={chatHook.handleSendMessage}
          onClear={chatHook.handleClearChat}
          onStop={chatHook.handleStopGeneration}
          isLoading={chatHook.isLoading}
          placeholder={placeholder}
        />

        <ErrorDisplay error={chatHook.error} />

        <StatusIndicator
          isLoading={chatHook.isLoading}
          messageCount={chatHook.chatHistory.length}
          loadingText="Generating Response..."
          activeText="Ready to Chat"
        />
      </div>
    </BaseNode>
  );
});

LLMNode.displayName = "LLMNode";
export default LLMNode;
