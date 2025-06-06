export interface WebflowPage {
  id: string;
  title?: string;
  slug?: string;
  createdOn?: Date;
  lastUpdated?: Date;
  archived?: boolean;
  draft?: boolean;
  canBranch?: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
  };
}

export interface WebflowPageList {
  pages: WebflowPage[];
}

export interface WebflowPageContent {
  pageId: string;
  nodes: WebflowNode[];
}

export interface WebflowNode {
  id?: string;
  type?: string;
  text?: string;
  html?: string;
  attributes?: Record<string, unknown>;
}

export interface WebflowApiError {
  message: string;
  code?: string;
  details?: unknown;
}
