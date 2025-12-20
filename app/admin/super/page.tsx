import { getSession } from "../../../lib/auth";
import { getUserByEmail, getCollections, updateUserBotPermissions, createUser } from "../../../lib/db/mongo";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Link from "next/link";

export default async function SuperAdminPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const currentUser = await getUserByEmail(session.email);
    if (currentUser?.role !== 'super_admin') {
        redirect("/admin/portal"); // Unauthorized
    }

    const { users } = await getCollections();
    const allUsers = await users.find({}).sort({ createdAt: -1 }).toArray();

    // Server Action for updating permissions
    // Server Action for adding a new user
    async function addUser(formData: FormData) {
        "use server";
        const email = formData.get("newEmail") as string;
        const botIds = (formData.get("newBotIds") as string).split(",").map(s => s.trim()).filter(Boolean);

        if (!email) return;

        let user = await getUserByEmail(email);
        if (!user) {
            await createUser(email, 'user');
        }

        // Update permissions regardless of whether they existed or were just created
        await updateUserBotPermissions(email, botIds);
        revalidatePath("/admin/super");
    }

    // Server Action for updating permissions (used by the table list)
    async function updatePermissions(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const botIds = (formData.get("botIds") as string).split(",").map(s => s.trim()).filter(Boolean);
        await updateUserBotPermissions(email, botIds);
        revalidatePath("/admin/super");
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-gray-800 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Super Admin Console</h1>
                        <p className="text-gray-400">Manage user access and bot permissions.</p>
                    </div>
                    <Link
                        href="/admin/portal"
                        className="px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Back to Portal
                    </Link>
                </header>

                {/* Add User Section */}
                <div className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4 text-white">Provision New User</h2>
                    <form action={addUser} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Email Address</label>
                            <input
                                type="email"
                                name="newEmail"
                                required
                                placeholder="user@example.com"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex-[2]">
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Allowed Bots (Comma Separated)</label>
                            <input
                                type="text"
                                name="newBotIds"
                                placeholder="lola-demo, support-bot"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Add User
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-950 border-b border-gray-800 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Allowed Bots (Comma Separated)</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {allUsers.map((u) => (
                                    <tr key={u._id?.toString()} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{u.email}</div>
                                            <div className="text-xs text-gray-600 font-mono mt-1">{u._id?.toString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'super_admin' ? 'bg-purple-900/50 text-purple-400 border border-purple-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={updatePermissions} className="flex gap-2">
                                                <input type="hidden" name="email" value={u.email} />
                                                <input
                                                    type="text"
                                                    name="botIds"
                                                    defaultValue={u.allowedBotIds?.join(", ")}
                                                    className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-sm w-64 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="e.g. lola-demo, bot-2"
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                >
                                                    Save
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-gray-600 text-xs">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
