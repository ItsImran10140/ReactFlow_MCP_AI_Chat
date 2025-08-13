// /* eslint-disable @typescript-eslint/no-explicit-any */
// // File: src/nodes/KnowledgeBasedNode/KnowledgeBasedNode.tsx

// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useState,
//   memo,
//   ChangeEvent,
// } from "react";
// import { graph } from "../../core/DependencyGraph";
// import BaseNode from "../../app/nodes/BaseNode/BaseNodes";
// import { wikipediaService } from "../../services/wikipedia.client";

// export interface WikipediaSearchResult {
//   title: string;
//   snippet: string;
//   pageid: number;
// }

// export interface WikipediaPageContent {
//   title: string;
//   content: string;
//   url: string;
// }

// const KnowledgeBasedNode = memo(({ id, data }: any) => {
//   const [nodeName, setNodeName] = useState<string>(
//     data.nodeName || "Knowledge Base"
//   );
//   const [isEditingName, setIsEditingName] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [selectedArticle, setSelectedArticle] = useState<string>("");
//   const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>(
//     []
//   );
//   const [articleContent, setArticleContent] =
//     useState<WikipediaPageContent | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [searchLimit, setSearchLimit] = useState<number>(5);

//   // Handle search functionality
//   const handleSearch = useCallback(async () => {
//     if (!searchQuery.trim()) return;

//     setIsLoading(true);
//     setError("");
//     try {
//       const results = await wikipediaService.searchPages(
//         searchQuery,
//         searchLimit
//       );
//       setSearchResults(results);
//     } catch (err) {
//       setError("Failed to search Wikipedia");
//       console.error("Search error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [searchQuery, searchLimit]);

//   // Handle article selection
//   const handleArticleSelect = useCallback(
//     async (title: string) => {
//       setSelectedArticle(title);
//       setIsLoading(true);
//       setError("");

//       try {
//         const content = await wikipediaService.getPageContent(title);
//         setArticleContent(content);

//         const knowledgeOutput = {
//           type: "knowledge_base",
//           title: content.title,
//           content: content.content,
//           url: content.url,
//           sourceNodeId: id,
//           nodeName: nodeName,
//         };

//         // Update node data with the knowledge base content
//         // IMPORTANT: Set data using the handle ID as the key
//         graph.updateNodeData(id, {
//           nodeName,
//           searchQuery,
//           selectedArticle: title,
//           articleContent: content,
//           searchResults,
//           knowledge_output: knowledgeOutput, // This matches the source handle ID
//         });

//         console.log(
//           "Knowledge Base Node setting knowledge_output:",
//           knowledgeOutput
//         );
//       } catch (err) {
//         setError("Failed to fetch article content");
//         console.error("Article fetch error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [id, nodeName, searchQuery, searchResults]
//   );

//   // Handle search query change
//   const handleSearchQueryChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//     },
//     []
//   );

//   // Handle search limit change
//   const handleSearchLimitChange = useCallback(
//     (e: ChangeEvent<HTMLSelectElement>) => {
//       setSearchLimit(parseInt(e.target.value));
//     },
//     []
//   );

//   // Handle node name changes
//   const handleNameChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const newName = e.target.value;
//       setNodeName(newName);

//       const knowledgeOutput = articleContent
//         ? {
//             type: "knowledge_base",
//             title: articleContent.title,
//             content: articleContent.content,
//             url: articleContent.url,
//             sourceNodeId: id,
//             nodeName: newName,
//           }
//         : undefined;

//       // Update node data
//       graph.updateNodeData(id, {
//         nodeName: newName,
//         searchQuery,
//         selectedArticle,
//         articleContent,
//         searchResults,
//         knowledge_output: knowledgeOutput, // This matches the source handle ID
//       });
//     },
//     [id, searchQuery, selectedArticle, articleContent, searchResults]
//   );

//   const handleNameKeyPress = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         setIsEditingName(false);
//       }
//     },
//     []
//   );

//   const handleNameBlur = useCallback(() => {
//     setIsEditingName(false);
//   }, []);

//   const handleNameClick = useCallback(() => {
//     setIsEditingName(true);
//   }, []);

//   // Handle Enter key for search
//   const handleSearchKeyPress = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         handleSearch();
//       }
//     },
//     [handleSearch]
//   );

//   // Update state from data changes
//   useEffect(() => {
//     if (data.nodeName !== undefined && data.nodeName !== nodeName) {
//       setNodeName(data.nodeName);
//     }
//     if (data.searchQuery !== undefined && data.searchQuery !== searchQuery) {
//       setSearchQuery(data.searchQuery);
//     }
//     if (
//       data.selectedArticle !== undefined &&
//       data.selectedArticle !== selectedArticle
//     ) {
//       setSelectedArticle(data.selectedArticle);
//     }
//     if (
//       data.articleContent !== undefined &&
//       data.articleContent !== articleContent
//     ) {
//       setArticleContent(data.articleContent);
//     }
//     if (
//       data.searchResults !== undefined &&
//       data.searchResults !== searchResults
//     ) {
//       setSearchResults(data.searchResults);
//     }
//   }, [
//     data,
//     nodeName,
//     searchQuery,
//     selectedArticle,
//     articleContent,
//     searchResults,
//   ]);

//   // Configure BaseNode props
//   const baseNodeData = {
//     handles: [
//       {
//         type: "source" as const,
//         position: "right" as const,
//         id: "knowledge_output",
//         className: "bg-purple-500",
//       },
//       {
//         type: "target" as const,
//         position: "left" as const,
//         id: "knowledge_input",
//         className: "bg-purple-500",
//       },
//     ],
//   };

//   return (
//     <BaseNode data={baseNodeData} className="w-80">
//       <div className="space-y-3">
//         {/* Editable Node Name */}
//         <div className="mb-2">
//           {isEditingName ? (
//             <input
//               type="text"
//               value={nodeName}
//               onChange={handleNameChange}
//               onKeyPress={handleNameKeyPress}
//               onBlur={handleNameBlur}
//               className="w-full px-2 py-1 text-sm font-medium text-center border border-purple-300 rounded focus:outline-none focus:border-purple-500"
//               autoFocus
//             />
//           ) : (
//             <div
//               onClick={handleNameClick}
//               className="w-full px-2 py-1 text-sm font-medium text-center cursor-pointer hover:bg-gray-50 rounded border border-transparent hover:border-gray-200"
//               title="Click to edit node name"
//             >
//               {nodeName}
//             </div>
//           )}
//         </div>

//         {/* Search Controls */}
//         <div className="space-y-2">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Search Wikipedia..."
//               value={searchQuery}
//               onChange={handleSearchQueryChange}
//               onKeyPress={handleSearchKeyPress}
//               className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500"
//             />
//             <select
//               value={searchLimit}
//               onChange={handleSearchLimitChange}
//               className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500"
//             >
//               <option value={3}>3</option>
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//             </select>
//           </div>

//           <button
//             onClick={handleSearch}
//             disabled={!searchQuery.trim() || isLoading}
//             className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Searching..." : "Search"}
//           </button>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
//             {error}
//           </div>
//         )}

//         {/* Search Results */}
//         {searchResults.length > 0 && (
//           <div className="space-y-2">
//             <div className="text-xs font-medium text-gray-600">
//               Search Results:
//             </div>
//             <div className="max-h-32 overflow-y-auto space-y-1">
//               {searchResults.map((result) => (
//                 <button
//                   key={result.pageid}
//                   onClick={() => handleArticleSelect(result.title)}
//                   className={`w-full p-2 text-xs text-left border rounded hover:bg-purple-50 ${
//                     selectedArticle === result.title
//                       ? "border-purple-500 bg-purple-50"
//                       : "border-gray-200"
//                   }`}
//                 >
//                   <div className="font-medium truncate">{result.title}</div>
//                   <div
//                     className="text-gray-500 line-clamp-2"
//                     dangerouslySetInnerHTML={{ __html: result.snippet }}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Selected Article Info */}
//         {articleContent && (
//           <div className="p-2 bg-purple-50 border border-purple-200 rounded">
//             <div className="text-xs font-medium text-purple-800">
//               Selected: {articleContent.title}
//             </div>
//             <div className="text-xs text-purple-600 mt-1">
//               Content Length: {articleContent.content.length} characters
//             </div>
//             <a
//               href={articleContent.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-xs text-purple-600 hover:text-purple-800 underline"
//             >
//               View on Wikipedia
//             </a>
//           </div>
//         )}

//         {/* Status Indicator */}
//         <div className="text-center">
//           <div
//             className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
//               articleContent
//                 ? "bg-green-100 text-green-800"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <div
//               className={`w-2 h-2 rounded-full mr-1 ${
//                 articleContent ? "bg-green-500" : "bg-gray-400"
//               }`}
//             />
//             {articleContent ? "Knowledge Loaded" : "No Knowledge Selected"}
//           </div>
//         </div>
//       </div>
//     </BaseNode>
//   );
// });

// KnowledgeBasedNode.displayName = "KnowledgeBasedNode";

// export default KnowledgeBasedNode;
