import { WebflowClient } from 'webflow-api';
import { WebflowPage, WebflowPageList, WebflowPageContent, WebflowNode, WebflowApiError } from '@/types/webflow';

class WebflowService {
  private api: WebflowClient;
  private siteId: string;

  constructor() {
    const token = process.env.WEBFLOW_SITE_TOKEN;
    const siteId = process.env.WEBFLOW_SITE_ID;

    if (!token) {
      throw new Error('WEBFLOW_SITE_TOKEN environment variable is required');
    }
    if (!siteId) {
      throw new Error('WEBFLOW_SITE_ID environment variable is required');
    }

    this.api = new WebflowClient({ accessToken: token });
    this.siteId = siteId;
  }

  /**
   * Fetch all pages from the Webflow site
   */
  async getPageList(): Promise<WebflowPageList> {
    try {
      console.log(`Fetching page list for site: ${this.siteId}`);
      
      const response = await this.api.pages.list(this.siteId);
      
      console.log(`Successfully fetched ${response.pages?.length || 0} pages`);
      
      return {
        pages: (response.pages || []) as WebflowPage[]
      };
    } catch (error) {
      console.error('Error fetching page list:', error);
      throw this.handleApiError(error, 'Failed to fetch page list');
    }
  }

  /**
   * Fetch DOM content for a specific page by slug
   */
  async getPageContent(pageSlug: string): Promise<WebflowPageContent | null> {
    try {
      console.log(`Fetching content for page: ${pageSlug}`);
      
      const pageList = await this.getPageList();
      const page = pageList.pages.find(p => p.slug === pageSlug);
      
      if (!page) {
        console.warn(`Page with slug "${pageSlug}" not found`);
        return null;
      }

      console.log(`Found page ID ${page.id} for slug "${pageSlug}"`);
      
      const response = await this.api.pages.getContent(page.id);
      
      console.log(`Successfully fetched content for page: ${pageSlug}`);
      
      return {
        pageId: page.id,
        nodes: (response.nodes || []) as WebflowNode[]
      };
    } catch (error) {
      console.error(`Error fetching content for page "${pageSlug}":`, error);
      throw this.handleApiError(error, `Failed to fetch content for page "${pageSlug}"`);
    }
  }

  /**
   * Fetch DOM content for both /korey and /agents pages
   */
  async getTargetPagesContent(): Promise<{
    korey: WebflowPageContent | null;
    agents: WebflowPageContent | null;
  }> {
    try {
      console.log('Fetching content for target pages: /korey and /agents');
      
      const [koreyContent, agentsContent] = await Promise.allSettled([
        this.getPageContent('korey'),
        this.getPageContent('agents')
      ]);

      const result = {
        korey: koreyContent.status === 'fulfilled' ? koreyContent.value : null,
        agents: agentsContent.status === 'fulfilled' ? agentsContent.value : null
      };

      if (koreyContent.status === 'rejected') {
        console.error('Failed to fetch /korey page:', koreyContent.reason);
      }
      if (agentsContent.status === 'rejected') {
        console.error('Failed to fetch /agents page:', agentsContent.reason);
      }

      return result;
    } catch (error) {
      console.error('Error fetching target pages content:', error);
      throw this.handleApiError(error, 'Failed to fetch target pages content');
    }
  }

  /**
   * Handle and format API errors
   */
  private handleApiError(error: unknown, context: string): WebflowApiError {
    const errorObj = error as { message?: string; code?: string; status?: number };
    const apiError: WebflowApiError = {
      message: `${context}: ${errorObj?.message || 'Unknown error'}`,
      code: errorObj?.code || errorObj?.status?.toString(),
      details: error
    };

    if (errorObj?.status === 401) {
      apiError.message = `${context}: Invalid or expired API token`;
    } else if (errorObj?.status === 403) {
      apiError.message = `${context}: Insufficient permissions. Check token scopes (pages:read, assets:read, sites:read)`;
    } else if (errorObj?.status === 404) {
      apiError.message = `${context}: Resource not found. Check site ID and page slugs`;
    } else if (errorObj?.status === 429) {
      apiError.message = `${context}: Rate limit exceeded. Please try again later`;
    } else if (errorObj?.code === 'ENOTFOUND' || errorObj?.code === 'ECONNREFUSED') {
      apiError.message = `${context}: Network error. Check internet connection`;
    }

    return apiError;
  }
}

export const webflowService = new WebflowService();
export default WebflowService;
