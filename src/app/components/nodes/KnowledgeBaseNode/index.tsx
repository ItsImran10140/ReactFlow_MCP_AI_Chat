/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, memo } from "react";
import BaseNode from "../BaseNode/BaseNodes";
import EditableNodeName from "../shared/components/EditableNodeName";
import StatusIndicator from "../shared/components/StatusIndicator";
import ErrorDisplay from "../shared/components/ErrorDisplay";
import SearchControls from "./components/SearchControls";
import SearchResults from "./components/SearchResults";
import SelectedArticle from "./components/SelectedArticle";
import { useNodeName } from "../shared/hooks/useNodeName";
import { useWikipediaSearch } from "./hooks/useWikipediaSearch";
import { KnowledgeBaseNodeData } from "./types";
import { BaseNodeProps } from "../shared/types";

const KnowledgeBaseNode = memo(({ id, data }: BaseNodeProps) => {
  const typedData = data as KnowledgeBaseNodeData;

  const nodeNameHook = useNodeName(id, typedData.nodeName || "Knowledge Base");
  const searchHook = useWikipediaSearch(id, nodeNameHook.nodeName);

  // Handle node name changes with graph update
  const handleNameChange = (newName: string) => {
    nodeNameHook.handleNameChange(newName);
    searchHook.updateWithNewNodeName(newName);
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
      typedData.searchQuery !== undefined &&
      typedData.searchQuery !== searchHook.searchQuery
    ) {
      searchHook.setSearchQuery(typedData.searchQuery);
    }
    if (
      typedData.selectedArticle !== undefined &&
      typedData.selectedArticle !== searchHook.selectedArticle
    ) {
      searchHook.setSelectedArticle(typedData.selectedArticle);
    }
    if (
      typedData.articleContent !== undefined &&
      typedData.articleContent !== searchHook.articleContent
    ) {
      searchHook.setArticleContent(typedData.articleContent);
    }
    if (
      typedData.searchResults !== undefined &&
      JSON.stringify(typedData.searchResults) !==
        JSON.stringify(searchHook.searchResults)
    ) {
      searchHook.setSearchResults(typedData.searchResults);
    }
  }, [typedData]);

  const baseNodeData = {
    handles: [
      {
        type: "source" as const,
        position: "right" as const,
        id: "knowledge_output",
        className: "bg-purple-500",
      },
      {
        type: "target" as const,
        position: "left" as const,
        id: "knowledge_input",
        className: "bg-purple-500",
      },
    ],
  };

  return (
    <BaseNode data={baseNodeData} className="w-80">
      <div className="space-y-3">
        <EditableNodeName
          nodeName={nodeNameHook.nodeName}
          isEditing={nodeNameHook.isEditingName}
          onChange={handleNameChange}
          onKeyPress={nodeNameHook.handleNameKeyPress}
          onBlur={nodeNameHook.handleNameBlur}
          onClick={nodeNameHook.handleNameClick}
          className="border-purple-300 focus:border-purple-500"
        />

        <SearchControls
          searchQuery={searchHook.searchQuery}
          searchLimit={searchHook.searchLimit}
          isLoading={searchHook.isLoading}
          onQueryChange={searchHook.handleSearchQueryChange}
          onLimitChange={searchHook.handleSearchLimitChange}
          onSearch={searchHook.handleSearch}
        />

        <ErrorDisplay
          error={searchHook.error}
          className="text-red-600 bg-red-50 border-red-200"
        />

        <SearchResults
          results={searchHook.searchResults}
          selectedArticle={searchHook.selectedArticle}
          onArticleSelect={searchHook.handleArticleSelect}
        />

        <SelectedArticle articleContent={searchHook.articleContent} />

        <StatusIndicator
          isLoading={searchHook.isLoading}
          isActive={!!searchHook.articleContent}
          loadingText="Processing..."
          activeText="Knowledge Loaded"
          inactiveText="No Knowledge Selected"
        />
      </div>
    </BaseNode>
  );
});

KnowledgeBaseNode.displayName = "KnowledgeBaseNode";
export default KnowledgeBaseNode;
