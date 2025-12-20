"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SearchResult {
    id: string;
    userId: string;
    lastActivity: string;
}

export function LogSearch({ botId }: { botId: string }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Initialize query from URL if present
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setQuery(q);
    }, [searchParams]);

    // Handle outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/logs/${botId}/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results);
                setIsOpen(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, botId]);

    const handleSelect = (result: SearchResult) => {
        // Navigate to specific chat? Or just filter the list?
        // "Autocomplete" implies picking a specific item usually.
        // Let's optimize for picking a specific user/session.
        // But since the list supports filtering, let's filter the list first.
        // Actually, picking a result likely means "Go to this result".
        // But let's support both: Enter key -> Filter list; Click Item -> Go to Chat.

        // For now, let's filter the list with the exact user ID or just the query.
        // If I select a result, I probably want to see that session.
        router.push(`/chat/${result.id}`);
        setIsOpen(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        // Update URL params to filter the list
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }
        // Reset page on new search
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                    placeholder="Search by User ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length >= 2 && results.length > 0) setIsOpen(true);
                    }}
                />
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                    </div>
                )}
            </form>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {results.map((result) => (
                        <li
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 group"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium truncate">{result.userId}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(result.lastActivity).toLocaleDateString()} • {result.id}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && results.length === 0 && !isLoading && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-3 px-4 text-sm text-gray-500 text-center border border-gray-100 dark:border-gray-700">
                    No results found. Press Enter to filter list.
                </div>
            )}
        </div>
    );
}
