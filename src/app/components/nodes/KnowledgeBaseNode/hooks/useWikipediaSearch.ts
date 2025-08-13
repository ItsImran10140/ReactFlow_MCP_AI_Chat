import { useState, useCallback } from "react";
import { graph } from "../../../../../core/DependencyGraph";
import { wikipediaService } from "../../../../../services/wikipedia.client";
import { WikipediaSearchResult, WikipediaPageContent } from "../types";

export const useWikipediaSearch = (id: string, nodeName: string) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>(
    []
  );
  const [articleContent, setArticleContent] =
    useState<WikipediaPageContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchLimit, setSearchLimit] = useState<number>(5);

  const updateNodeOutput = useCallback(
    (content: WikipediaPageContent | null, currentNodeName: string) => {
      const knowledgeOutput = content
        ? {
            type: "knowledge_base",
            title: content.title,
            content: content.content,
            url: content.url,
            sourceNodeId: id,
            nodeName: currentNodeName,
          }
        : undefined;

      graph.updateNodeData(id, {
        nodeName: currentNodeName,
        searchQuery,
        selectedArticle,
        articleContent: content,
        searchResults,
        knowledge_output: knowledgeOutput,
      });

      if (knowledgeOutput) {
        console.log(
          "Knowledge Base Node setting knowledge_output:",
          knowledgeOutput
        );
      }
    },
    [id, searchQuery, selectedArticle, searchResults]
  );

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const results = await wikipediaService.searchPages(
        searchQuery,
        searchLimit
      );
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search Wikipedia");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchLimit]);

  const handleArticleSelect = useCallback(
    async (title: string) => {
      setSelectedArticle(title);
      setIsLoading(true);
      setError("");

      try {
        const content = await wikipediaService.getPageContent(title);
        setArticleContent(content);
        updateNodeOutput(content, nodeName);
      } catch (err) {
        setError("Failed to fetch article content");
        console.error("Article fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [nodeName, updateNodeOutput]
  );

  const updateWithNewNodeName = useCallback(
    (newNodeName: string) => {
      updateNodeOutput(articleContent, newNodeName);
    },
    [articleContent, updateNodeOutput]
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSearchLimitChange = useCallback((limit: number) => {
    setSearchLimit(limit);
  }, []);

  return {
    searchQuery,
    selectedArticle,
    searchResults,
    articleContent,
    isLoading,
    error,
    searchLimit,
    handleSearch,
    handleArticleSelect,
    handleSearchQueryChange,
    handleSearchLimitChange,
    updateWithNewNodeName,
    setSearchQuery,
    setSelectedArticle,
    setSearchResults,
    setArticleContent,
  };
};
