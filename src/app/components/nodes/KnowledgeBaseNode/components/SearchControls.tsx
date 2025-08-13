import React from "react";

interface SearchControlsProps {
  searchQuery: string;
  searchLimit: number;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onLimitChange: (limit: number) => void;
  onSearch: () => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  searchLimit,
  isLoading,
  onQueryChange,
  onLimitChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search Wikipedia..."
          value={searchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500"
        />
        <select
          value={searchLimit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <button
        onClick={onSearch}
        disabled={!searchQuery.trim() || isLoading}
        className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchControls;
