import Link from "next/link";
import { getSession } from "../../../lib/auth";
import { getUserByEmail, getCollections } from "../../../lib/db/mongo";
import { redirect } from "next/navigation";
import { RectangleStackIcon, CpuChipIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "../../../components/auth/LogoutButton";

export default async function AdminPortal() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await getUserByEmail(session.email);
    if (!user) redirect("/login");

    const { messages } = await getCollections(); // Just to get something? No, we need logic.

    // If user is super admin, they can access everything? Or we list all bots?
    // Let's assume Super Admin sees all bots or a special dashboard.
    // Regular user sees their `allowedBotIds`.

    let allowedBots: { id: string, name: string }[] = [];

    // For demo/MVP, if no allowedBotIds, we might show empty.
    // Or if super admin, show hardcoded or fetched list.
    // Since we don't have a "Bots" collection (Bots are in env/config), 
    // we might need to iterate valid bot IDs from environment or config.
    // For now, let's just list the ones in `user.allowedBotIds`.

    // Simulating retrieval of bot metadata.
    // In a real app, we'd look up bot details.
    allowedBots = (user.allowedBotIds || []).map(id => ({ id, name: id.toUpperCase() })); // Placeholder name logic

    // If super admin, maybe push a "Manage Users" card
    const isSuperAdmin = user.role === 'super_admin';

    // Auto-redirect if only 1 bot? Maybe. But Portal is safer.

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center py-12 sm:py-20 px-4">
            <div className="max-w-4xl w-full">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8 sm:mb-12">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                            Admin Portal
                        </h1>
                        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base truncate">{user.email}</p>
                    </div>
                    <div>
                        <LogoutButton />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Bot Cards */}
                    {allowedBots.map((bot) => (
                        <Link
                            key={bot.id}
                            href={`/admin/${bot.id}`}
                            className="group relative bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-indigo-500/50 hover:bg-gray-800/50 transition-all"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                <CpuChipIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-indigo-400" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors truncate">
                                {bot.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                                View signals, logs, and settings.
                            </p>
                        </Link>
                    ))}

                    {/* Super Admin Card */}
                    {isSuperAdmin && (
                        <Link
                            href="/admin/super"
                            className="group relative bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-indigo-500/70 hover:bg-indigo-900/30 transition-all border-dashed"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-900/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-indigo-400">
                                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                                Super Admin
                            </h3>
                            <p className="text-xs sm:text-sm text-indigo-300/60">
                                Manage users and permissions.
                            </p>
                        </Link>
                    )}

                    {allowedBots.length === 0 && !isSuperAdmin && (
                        <div className="col-span-full py-10 sm:py-12 text-center border border-gray-800 border-dashed rounded-xl sm:rounded-2xl px-4">
                            <RectangleStackIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-700 mb-3 sm:mb-4" />
                            <p className="text-gray-500 font-medium text-sm sm:text-base">No bots assigned to your account.</p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">Contact your administrator for access.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
