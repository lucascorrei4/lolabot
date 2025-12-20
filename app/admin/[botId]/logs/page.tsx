import Link from "next/link";
import { listSessions, countSessions } from "../../../../lib/db/mongo";
import { getBotById, getDefaultBot } from "../../../../lib/env";
import { ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { LogSearch } from "../../../../components/logs/LogSearch";
import { AdminSidebar } from "../../../../components/admin/AdminSidebar";

export default async function AdminLogsPage({
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
    const q = resolvedSearchParams.q;

    const limit = 20;
    const offset = (page - 1) * limit;

    const startDate = from ? new Date(from) : undefined;
    const endDate = to ? new Date(to) : undefined;
    if (endDate) {
        endDate.setHours(23, 59, 59, 999);
    }

    const [sessions, total] = await Promise.all([
        listSessions(limit, offset, botId, startDate, endDate, q),
        countSessions(botId, startDate, endDate, q)
    ]);

    const totalPages = Math.ceil(total / limit);
    const bot = getBotById(botId) || getDefaultBot();

    const getPageUrl = (newPage: number) => {
        const sp = new URLSearchParams();
        if (newPage > 1) sp.set("page", String(newPage));
        if (from) sp.set("from", from);
        if (to) sp.set("to", to);
        if (q) sp.set("q", q);
        return `/admin/${botId}/logs?${sp.toString()}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex font-sans">
            <AdminSidebar botId={botId} />

            {/* Main content - add ml-64 to offset fixed sidebar */}
            <main className="flex-1 ml-64 overflow-auto min-h-screen flex flex-col">
                <header className="bg-gray-900 border-b border-gray-800 py-6 px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Chat Logs</h2>
                        <p className="text-gray-400 mt-1">Review interaction history for {bot?.title || botId}</p>
                    </div>
                </header>

                <div className="p-8 flex-1">
                    {/* Filter Toolbar */}
                    <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="w-full xl:w-96">
                            {/* Passed admin param to LogSearch to determine redirect path */}
                            <LogSearch botId={botId} />
                        </div>

                        <form className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="from" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From</label>
                                    <input
                                        type="date"
                                        name="from"
                                        defaultValue={from}
                                        className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="to" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">To</label>
                                    <input
                                        type="date"
                                        name="to"
                                        defaultValue={to}
                                        className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Filter
                                </button>
                                {(from || to || q) && (
                                    <Link
                                        href={`/admin/${botId}/logs`}
                                        className="flex items-center justify-center px-4 py-2.5 bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Clear
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Found {total} sessions
                    </div>

                    {/* List */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
                        {sessions.map(session => (
                            <Link
                                key={session._id ? session._id.toString() : Math.random()}
                                href={`/chat/${session._id}`}
                                className="group block p-5 border-b border-gray-700 hover:bg-gray-800/80 transition-all last:border-0"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                            {session.userId ? session.userId : "Anonymous User"}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono bg-gray-800/50 px-1.5 py-0.5 rounded w-fit">
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
                                            <time className="text-sm text-gray-400">
                                                {new Date(session.lastActivityAt || session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </time>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(session.lastActivityAt || session.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {sessions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <ChatBubbleLeftRightIcon className="w-16 h-16 opacity-20 mb-4" />
                                <p className="text-lg font-medium">No sessions found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-between items-center bg-gray-900 border-t border-gray-800 pt-4">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium text-white">{offset + 1}</span> to <span className="font-medium text-white">{Math.min(offset + limit, total)}</span> of {total}
                            </div>
                            <div className="flex items-center gap-2">
                                {page > 1 ? (
                                    <Link
                                        href={getPageUrl(page - 1)}
                                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors border border-gray-700"
                                        title="Previous Page"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <button disabled className="p-2 rounded-lg text-gray-700 border border-transparent cursor-not-allowed">
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                )}

                                <span className="px-4 text-sm font-medium text-gray-400">
                                    Page {page} of {totalPages}
                                </span>

                                {page < totalPages ? (
                                    <Link
                                        href={getPageUrl(page + 1)}
                                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors border border-gray-700"
                                        title="Next Page"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <button disabled className="p-2 rounded-lg text-gray-700 border border-transparent cursor-not-allowed">
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
