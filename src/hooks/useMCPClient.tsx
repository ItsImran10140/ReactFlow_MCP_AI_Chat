/* eslint-disable @typescript-eslint/no-explicit-any */
// Types for MCP Protocol
export interface MCPMessage {
  jsonrpc: "2.0";
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  url: string;
  pageid: number;
}

export interface WikipediaPageContent {
  title: string;
  content: string;
  url: string;
  extract: string;
}

// MCP Client Hook
import { useState, useCallback, useRef, useEffect } from "react";

export const useMCPClient = (serverUrl: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageCallbacksRef = useRef<
    Map<string, (response: MCPMessage) => void>
  >(new Map());
  const messageIdRef = useRef(0);

  const generateMessageId = useCallback(() => {
    return (++messageIdRef.current).toString();
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(serverUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log("MCP connection established");
      };

      eventSource.onmessage = (event) => {
        try {
          const message: MCPMessage = JSON.parse(event.data);

          // Handle response messages
          if (
            message.id &&
            messageCallbacksRef.current.has(message.id.toString())
          ) {
            const callback = messageCallbacksRef.current.get(
              message.id.toString()
            );
            if (callback) {
              callback(message);
              messageCallbacksRef.current.delete(message.id.toString());
            }
          }
        } catch (err) {
          console.error("Error parsing MCP message:", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("MCP connection error:", error);
        setError("Connection failed");
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsConnecting(false);
    }
  }, [serverUrl, isConnecting, isConnected]);

  const sendMessage = useCallback(
    async (method: string, params?: any): Promise<MCPMessage> => {
      return new Promise((resolve, reject) => {
        if (!isConnected || !eventSourceRef.current) {
          reject(new Error("Not connected to MCP server"));
          return;
        }

        const messageId = generateMessageId();
        const message: MCPMessage = {
          jsonrpc: "2.0",
          id: messageId,
          method,
          params,
        };

        // Store callback for response
        messageCallbacksRef.current.set(messageId, (response) => {
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response);
          }
        });

        // Send via POST to maintain MCP protocol compatibility
        fetch(serverUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }).catch(reject);

        // Timeout after 30 seconds
        setTimeout(() => {
          if (messageCallbacksRef.current.has(messageId)) {
            messageCallbacksRef.current.delete(messageId);
            reject(new Error("Request timeout"));
          }
        }, 30000);
      });
    },
    [isConnected, generateMessageId, serverUrl]
  );

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    messageCallbacksRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};

// Wikipedia MCP Service Hook
export const useWikipediaMCP = () => {
  const mcpClient = useMCPClient("https://vs-mcp-server.onrender.com/mcp"); // Adjust URL as needed
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPage, setSelectedPage] = useState<WikipediaPageContent | null>(
    null
  );
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const searchWikipedia = useCallback(
    async (query: string, limit: number = 10) => {
      if (!query.trim()) return;

      setIsSearching(true);
      try {
        const response = await mcpClient.sendMessage("wikipedia/search", {
          query: query.trim(),
          limit,
        });

        if (response.result?.results) {
          setSearchResults(response.result.results);
        }
      } catch (error) {
        console.error("Wikipedia search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [mcpClient]
  );

  const getPageContent = useCallback(
    async (title: string) => {
      setIsLoadingPage(true);
      try {
        const response = await mcpClient.sendMessage("wikipedia/get_page", {
          title,
        });

        if (response.result) {
          const pageContent: WikipediaPageContent = {
            title: response.result.title,
            content: response.result.content,
            url: response.result.url,
            extract:
              response.result.extract ||
              response.result.content.substring(0, 500),
          };
          setSelectedPage(pageContent);
          return pageContent;
        }
      } catch (error) {
        console.error("Error getting Wikipedia page:", error);
      } finally {
        setIsLoadingPage(false);
      }
      return null;
    },
    [mcpClient]
  );

  return {
    ...mcpClient,
    searchResults,
    isSearching,
    selectedPage,
    isLoadingPage,
    searchWikipedia,
    getPageContent,
    clearResults: () => {
      setSearchResults([]);
      setSelectedPage(null);
    },
  };
};
