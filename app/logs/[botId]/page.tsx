import Link from "next/link";
import { listSessions, countSessions } from "../../../lib/db/mongo";
import { getBotById, getDefaultBot } from "../../../lib/env";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { LogSearch } from "../../../components/logs/LogSearch";

export default async function LogsPage({
    params,
    searchParams
}: {
    params: Promise<{ botId: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { botId } = resolvedParams;

    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const from = resolvedSearchParams.from;
    const to = resolvedSearchParams.to;

    const limit = 20;
    const offset = (page - 1) * limit;

    const startDate = from ? new Date(from) : undefined;
    // If 'to' is provided, we might want to set it to end of day if it's just a date, 
    // but for simplicity we'll pass the date as parsed (usually 00:00 UTC).
    // A perfect implementation would handle timezones or set time to 23:59:59.
    // For now, let's assume strict date matching > startDate and < endDate.
    const endDate = to ? new Date(to) : undefined;

    if (endDate) {
        // Set to end of day
        endDate.setHours(23, 59, 59, 999);
    }

    const [sessions, total] = await Promise.all([
        listSessions(limit, offset, botId, startDate, endDate),
        countSessions(botId, startDate, endDate)
    ]);

    const totalPages = Math.ceil(total / limit);
    const bot = getBotById(botId) || getDefaultBot();

    // Helper to build pagination URL
    const getPageUrl = (newPage: number) => {
        const sp = new URLSearchParams();
        if (newPage > 1) sp.set("page", String(newPage));
        if (from) sp.set("from", from);
        if (to) sp.set("to", to);
        return `/logs/${botId}?${sp.toString()}`;
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 shadow-sm min-h-screen flex flex-col border-x border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Chat Logs</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{bot?.title || botId}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="w-full md:w-64">
                                <LogSearch botId={botId} />
                            </div>
                            <Link href={`/admin/${botId}`} className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium whitespace-nowrap">
                                Back to Admin
                            </Link>
                        </div>
                    </div>

                    {/* Filter Toolbar */}
                    <form className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-1.5 flex-1 w-full sm:w-auto">
                            <label htmlFor="from" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From Date</label>
                            <input
                                type="date"
                                name="from"
                                defaultValue={from}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1 w-full sm:w-auto">
                            <label htmlFor="to" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">To Date</label>
                            <input
                                type="date"
                                name="to"
                                defaultValue={to}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Filter
                            </button>
                            {(from || to) && (
                                <Link
                                    href={`/logs/${botId}`}
                                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Clear
                                </Link>
                            )}
                        </div>
                    </form>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Found {total} sessions
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <Link
                            key={session._id ? session._id.toString() : Math.random()}
                            href={`/chat/${session._id}`}
                            className="group block p-5 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {session.userId ? session.userId : "Anonymous User"}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded w-fit">
                                        {session._id?.toString()}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2">
                                        {(session as any).interactionCount !== undefined && (
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${(session as any).interactionCount > 15
                                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                                : (session as any).interactionCount > 8
                                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {(session as any).interactionCount} interactions
                                            </span>
                                        )}
                                        <time className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(session.lastActivityAt || session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </time>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(session.lastActivityAt || session.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {sessions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium">No sessions found</p>
                            <p className="text-sm mt-1">Try adjusting your date filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center sticky bottom-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{offset + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(offset + limit, total)}</span> of {total}
                        </div>
                        <div className="flex items-center gap-2">
                            {page > 1 ? (
                                <Link
                                    href={getPageUrl(page - 1)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700"
                                    title="Previous Page"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </Link>
                            ) : (
                                <button disabled className="p-2 rounded-lg text-gray-300 dark:text-gray-600 border border-transparent cursor-not-allowed">
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                            )}

                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Logic to show reasonable page numbers around current page
                                    let p = i + 1;
                                    if (totalPages > 5) {
                                        if (page > 3) p = page - 2 + i;
                                        if (p > totalPages) p = totalPages - (4 - i);
                                    }
                                    // Ensuring p is valid logic is a bit complex for inline, let's just show simple Prev/Next for robustness or simple list
                                    // Let's just stick to "Page X of Y" which is error proof
                                    return null;
                                })}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Page {page} of {totalPages}
                                </span>
                            </div>

                            {page < totalPages ? (
                                <Link
                                    href={getPageUrl(page + 1)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700"
                                    title="Next Page"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </Link>
                            ) : (
                                <button disabled className="p-2 rounded-lg text-gray-300 dark:text-gray-600 border border-transparent cursor-not-allowed">
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
