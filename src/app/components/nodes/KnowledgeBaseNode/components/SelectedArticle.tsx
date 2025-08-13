import React from "react";
import { WikipediaPageContent } from "../types";

interface SelectedArticleProps {
  articleContent: WikipediaPageContent | null;
}

const SelectedArticle: React.FC<SelectedArticleProps> = ({
  articleContent,
}) => {
  if (!articleContent) return null;

  return (
    <div className="p-2 bg-purple-50 border border-purple-200 rounded">
      <div className="text-xs font-medium text-purple-800">
        Selected: {articleContent.title}
      </div>
      <div className="text-xs text-purple-600 mt-1">s;
        Content Length: {articleContent.content.length.toLocaleString()}{" "}
        characters
      </div>
      <a
        href={articleContent.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-purple-600 hover:text-purple-800 underline block mt-1"
      >
        View on Wikipedia →
      </a>
    </div>
  );
};

export default SelectedArticle;
