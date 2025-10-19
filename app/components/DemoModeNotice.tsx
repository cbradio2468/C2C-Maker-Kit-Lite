'use client';

import { useState } from 'react';

/**
 * DemoModeNotice Component
 * 
 * Displays a prominent notice that the application is running in demo mode
 * with mock data and placeholder credentials. Provides links to setup guides.
 */
export function DemoModeNotice() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-warning-50 border-l-4 border-warning-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-warning-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-warning-800">
            🚨 Demo Mode Active
          </h3>
          <div className="mt-2 text-sm text-warning-700">
            <p>
              This application is running with <strong>mock data and placeholder credentials</strong>.
              To build your own application, you'll need to set up real services.
            </p>
            <div className="mt-3">
              <div className="-mx-2 -my-1.5 flex">
                <a
                  href="https://github.com/catalysttocourage/c2c-community-starter/blob/main/docs/SETUP-GUIDE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-warning-50 px-2 py-1.5 rounded-md text-sm font-medium text-warning-800 hover:bg-warning-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-warning-50 focus:ring-warning-600"
                >
                  📋 Complete Setup Guide
                </a>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 bg-warning-50 px-2 py-1.5 rounded-md text-sm font-medium text-warning-800 hover:bg-warning-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-warning-50 focus:ring-warning-600"
                >
                  🔗 Supabase Setup
                </a>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="ml-3 bg-warning-50 px-2 py-1.5 rounded-md text-sm font-medium text-warning-800 hover:bg-warning-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-warning-50 focus:ring-warning-600"
                >
                  ✕ Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
