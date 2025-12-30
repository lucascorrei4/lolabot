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
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export function AdminSidebar({ botId }: { botId: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', icon: HomeIcon, href: `/admin/${botId}` },
        { name: 'Signals', icon: BellAlertIcon, href: `/admin/${botId}/signals` },
        { name: 'Chat Logs', icon: ChatBubbleLeftRightIcon, href: `/admin/${botId}/logs` },
        { name: 'Settings', icon: Cog6ToothIcon, href: `/admin/${botId}/settings` },
    ];

    const adminItems = [
        { name: 'Admin Portal', icon: ShieldCheckIcon, href: '/admin/portal' },
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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const SidebarContent = () => (
        <>
            <div className="p-4 lg:p-6">
                <Link href={`/admin/${botId}`} className="flex items-center gap-3 mb-1 hover:opacity-80 transition-opacity">
                    <Image
                        src="/assets/img/favicon.png"
                        alt="BizAI Agent"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
                    <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        BizAI Agent Admin
                    </h1>
                </Link>
                <p className="text-xs text-gray-500 mt-1 truncate">{botId}</p>
            </div>

            <nav className="flex-1 px-3 lg:px-4 space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-2 lg:mt-4">
                    Menu
                </div>
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={`group flex items-center px-3 py-2.5 lg:py-2 text-sm font-medium rounded-md transition-colors ${active
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Admin Section */}
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-6">
                    Admin
                </div>
                {adminItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={`group flex items-center px-3 py-2.5 lg:py-2 text-sm font-medium rounded-md transition-colors ${active
                                ? 'bg-indigo-600 text-white'
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
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                        AD
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 lg:py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center px-4 z-30">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    aria-label="Open menu"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
                <Link href={`/admin/${botId}`} className="flex items-center gap-2 ml-2">
                    <Image
                        src="/assets/img/favicon.png"
                        alt="BizAI Agent"
                        width={24}
                        height={24}
                        className="rounded"
                    />
                    <span className="text-sm font-semibold text-white">BizAI Agent Admin</span>
                </Link>
            </div>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-gray-900 border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-end p-4 border-b border-gray-800">
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        aria-label="Close menu"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <SidebarContent />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col fixed h-full z-10">
                <SidebarContent />
            </div>
        </>
    );
}
