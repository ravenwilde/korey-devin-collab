'use client';

import { useState } from 'react';
import { webflowService } from '@/services/webflow';
import { WebflowPageList, WebflowPageContent, WebflowApiError } from '@/types/webflow';

export default function Home() {
  const [pageList, setPageList] = useState<WebflowPageList | null>(null);
  const [targetPages, setTargetPages] = useState<{
    korey: WebflowPageContent | null;
    agents: WebflowPageContent | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPageList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await webflowService.getPageList();
      setPageList(result);
      console.log('Page list fetched successfully:', result);
    } catch (err) {
      const apiError = err as WebflowApiError;
      setError(apiError.message);
      console.error('Failed to fetch page list:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTargetPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await webflowService.getTargetPagesContent();
      setTargetPages(result);
      console.log('Target pages content fetched successfully:', result);
    } catch (err) {
      const apiError = err as WebflowApiError;
      setError(apiError.message);
      console.error('Failed to fetch target pages:', apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Webflow API Integration Demo
        </h1>
        
        <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Environment Setup Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            Please configure your <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">.env.local</code> file with:
          </p>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
            <li><code>WEBFLOW_SITE_TOKEN</code> - Your Webflow site token with scopes: pages:read, assets:read, sites:read</li>
            <li><code>WEBFLOW_SITE_ID</code> - Your shortcut.com site ID from Webflow</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Fetch Page List</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Retrieve all pages from the shortcut.com Webflow site.
            </p>
            <button
              onClick={handleFetchPageList}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Fetch Page List'}
            </button>
            
            {pageList && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Success! Found {pageList.pages.length} pages:
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  {pageList.pages.slice(0, 5).map((page) => (
                    <li key={page.id} className="truncate">
                      <span className="font-medium">/{page.slug || 'no-slug'}</span> - {page.title || 'Untitled'}
                    </li>
                  ))}
                  {pageList.pages.length > 5 && (
                    <li className="text-green-600 dark:text-green-400">
                      ... and {pageList.pages.length - 5} more pages
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Fetch Target Pages</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Retrieve DOM content from /korey and /agents pages specifically.
            </p>
            <button
              onClick={handleFetchTargetPages}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Fetch Target Pages'}
            </button>
            
            {targetPages && (
              <div className="mt-4 space-y-3">
                <div className={`p-3 rounded border ${
                  targetPages.korey 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <h4 className={`font-medium ${
                    targetPages.korey 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    /korey page: {targetPages.korey ? 'Found' : 'Not found'}
                  </h4>
                  {targetPages.korey && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {targetPages.korey.nodes.length} DOM nodes retrieved
                    </p>
                  )}
                </div>
                
                <div className={`p-3 rounded border ${
                  targetPages.agents 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <h4 className={`font-medium ${
                    targetPages.agents 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    /agents page: {targetPages.agents ? 'Found' : 'Not found'}
                  </h4>
                  {targetPages.agents && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {targetPages.agents.nodes.length} DOM nodes retrieved
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Error:</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Implementation Details</h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>✅ Webflow JavaScript SDK (webflow-api v3.1.3) installed</li>
            <li>✅ TypeScript interfaces for API responses</li>
            <li>✅ Comprehensive error handling for API failures</li>
            <li>✅ Service layer with singleton pattern</li>
            <li>✅ Environment variable configuration</li>
            <li>✅ Logging for debugging and monitoring</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
