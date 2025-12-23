import Link from 'next/link';
import { listSignals, countSessions, getBotSettings } from '../../../lib/db/mongo';
import { getBotByIdAsync, getDefaultBotAsync } from '../../../lib/env';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import {
    BellAlertIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ArrowRightIcon,
    UsersIcon,
    BoltIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default async function AdminHomePage({ params }: { params: Promise<{ botId: string }> }) {
    const { botId } = await params;

    // Fetch data for the dashboard
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [rawSignals, totalSessions, todaySessions, botDbSettings, botEnvSettings] = await Promise.all([
        listSignals(botId, 5),
        countSessions(botId),
        countSessions(botId, today),
        getBotSettings(botId),
        getBotByIdAsync(botId) || getDefaultBotAsync()
    ]);

    const signals = JSON.parse(JSON.stringify(rawSignals));
    const botTitle = botDbSettings?.title || (botEnvSettings as any)?.title || botId;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex font-sans">
            <AdminSidebar botId={botId} />

            <main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col pt-16 lg:pt-0">
                <header className="bg-gray-900 border-b border-gray-800 py-4 lg:py-6 px-4 lg:px-8 lg:sticky lg:top-0 z-10 backdrop-blur-md bg-opacity-90">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-white">Welcome back, Admin</h2>
                        <p className="text-gray-400 mt-1 text-sm lg:text-base">Overview for {botTitle}</p>
                    </div>
                </header>

                <div className="p-4 lg:p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <UsersIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sessions</p>
                                <p className="text-2xl font-bold text-white">{totalSessions}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                <BoltIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Sessions Today</p>
                                <p className="text-2xl font-bold text-white">{todaySessions}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <SparklesIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Signals</p>
                                <p className="text-2xl font-bold text-white">{signals.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Signals */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <BellAlertIcon className="h-5 w-5 text-indigo-400" />
                                    Recent Intelligence
                                </h3>
                                <Link
                                    href={`/admin/${botId}/signals` as any}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                                >
                                    View all <ArrowRightIcon className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden divide-y divide-gray-800">
                                {signals.length > 0 ? (
                                    signals.map((signal: any, idx: number) => (
                                        <div key={idx} className="p-4 hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${signal.type === 'danger' ? 'bg-red-500 animate-pulse' :
                                                    signal.type === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                                    }`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white line-clamp-1">{signal.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{signal.summaryText}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-medium whitespace-nowrap">
                                                    {new Date(signal.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p className="text-sm font-medium">No intelligence signals yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link
                                    href={`/admin/${botId}/logs` as any}
                                    className="group bg-gray-800/30 hover:bg-gray-800/60 rounded-2xl border border-gray-700 p-5 transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-gray-900 text-indigo-400 group-hover:scale-110 transition-transform">
                                            <ChatBubbleLeftRightIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Review Chat Logs</p>
                                            <p className="text-xs text-gray-500 mt-0.5 text-balance">Check how users interact with your bot and monitor performance.</p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                                </Link>

                                <Link
                                    href={`/admin/${botId}/settings` as any}
                                    className="group bg-gray-800/30 hover:bg-gray-800/60 rounded-2xl border border-gray-700 p-5 transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-gray-900 text-amber-400 group-hover:scale-110 transition-transform">
                                            <Cog6ToothIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Bot Configuration</p>
                                            <p className="text-xs text-gray-500 mt-0.5 text-balance">Update your bot's system prompt, greeting, and webhook settings.</p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

