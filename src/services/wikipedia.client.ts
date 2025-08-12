/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/services/wikipedia.client.ts

import axios from "axios";

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

export interface WikipediaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class WikipediaClientService {
  private baseUrl: string;

  constructor(baseUrl: string = "https://vs-mcp-server.onrender.com/api") {
    this.baseUrl = baseUrl;
  }

  async searchPages(
    query: string,
    limit: number = 5
  ): Promise<WikipediaSearchResult[]> {
    try {
      const response = await axios.get<
        WikipediaApiResponse<WikipediaSearchResult[]>
      >(`${this.baseUrl}/search`, {
        params: {
          query,
          limit,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to search pages");
      }
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        throw new Error(`Network error: ${e.message}`);
      }
      throw e;
    }
  }

  async getPageContent(title: string): Promise<WikipediaPageContent> {
    try {
      const response = await axios.get<
        WikipediaApiResponse<WikipediaPageContent>
      >(`${this.baseUrl}/page`, {
        params: {
          title,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to get page content");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async getPageSummary(title: string): Promise<WikipediaPageContent> {
    try {
      const response = await axios.get<
        WikipediaApiResponse<WikipediaPageContent>
      >(`${this.baseUrl}/summary`, {
        params: {
          title,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to get page summary");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data.success === true;
    } catch (e: any) {
      return false;
    }
  }
}

// Export singleton instance
export const wikipediaService = new WikipediaClientService();

// Export class for custom instances
export { WikipediaClientService };
