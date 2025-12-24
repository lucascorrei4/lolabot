'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showUI, setShowUI] = useState(false);

    useEffect(() => {
        // Check if this is a chunk/cache error
        const isChunkError = error.message?.includes('ChunkLoadError') ||
            error.message?.includes('Loading chunk') ||
            error.message?.includes('Failed to fetch dynamically imported module') ||
            error.message?.includes('Failed to load') ||
            error.name === 'ChunkLoadError';

        const hasReloaded = sessionStorage.getItem('chunk_reload');

        if (isChunkError && !hasReloaded) {
            // Reload immediately - user sees nothing
            sessionStorage.setItem('chunk_reload', '1');
            window.location.reload();
            return;
        }

        // Only show UI for real errors
        setShowUI(true);
        console.error('Global error:', error);
    }, [error]);

    // Don't render anything until we've checked for chunk errors
    if (!showUI) {
        return (
            <html lang="en">
                <body>
                    <div className="min-h-screen bg-gray-900"></div>
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-16 w-16 text-indigo-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            We encountered an unexpected error. Please try again.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('chunk_reload');
                                    reset();
                                }}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('chunk_reload');
                                    window.location.href = '/';
                                }}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
