export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export interface WikipediaPageContent {
  title: string;
  content: string;
  url: string;
}

export interface KnowledgeBaseNodeData {
  nodeName?: string;
  searchQuery?: string;
  selectedArticle?: string;
  articleContent?: WikipediaPageContent | null;
  searchResults?: WikipediaSearchResult[];
  knowledge_output?: {
    type: string;
    title: string;
    content: string;
    url: string;
    sourceNodeId: string;
    nodeName: string;
  };
}
