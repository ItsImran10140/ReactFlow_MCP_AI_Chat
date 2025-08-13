import React from "react";
import { WikipediaSearchResult } from "../types";

interface SearchResultsProps {
  results: WikipediaSearchResult[];
  selectedArticle: string;
  onArticleSelect: (title: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  selectedArticle,
  onArticleSelect,
}) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-600">Search Results:</div>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {results.map((result) => (
          <button
            key={result.pageid}
            onClick={() => onArticleSelect(result.title)}
            className={`w-full p-2 text-xs text-left border rounded hover:bg-purple-50 transition-colors ${
              selectedArticle === result.title
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200"
            }`}
          >
            <div className="font-medium truncate">{result.title}</div>
            <div
              className="text-gray-500 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
