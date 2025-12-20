'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Cog6ToothIcon,
    ChatBubbleLeftRightIcon,
    BellAlertIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export function AdminSidebar({ botId }: { botId: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { name: 'Signals', icon: BellAlertIcon, href: `/admin/${botId}` },
        { name: 'Chat Logs', icon: ChatBubbleLeftRightIcon, href: `/admin/${botId}/logs` },
        { name: 'Settings', icon: Cog6ToothIcon, href: `/admin/${botId}/settings` },
    ];

    // Helper to check if item is active (exact match or subpath)
    const isActive = (href: string) => {
        if (href === `/admin/${botId}` && pathname === href) return true;
        if (href !== `/admin/${botId}` && pathname?.startsWith(href)) return true;
        return false;
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.push('/login');
            } else {
                console.error('Logout failed');
                setIsLoggingOut(false);
            }
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                    <Image
                        src="/assets/img/favicon.png"
                        alt="LolaBot"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        LolaBot Admin
                    </h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">{botId}</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-4">
                    Menu
                </div>
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium text-white">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </div>
    );
}
