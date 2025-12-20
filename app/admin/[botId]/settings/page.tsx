'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../../components/admin/AdminSidebar';
import {
    SunIcon,
    MoonIcon,
    BellIcon,
    ArrowDownTrayIcon,
    GlobeAltIcon,
    TagIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark';
type Timezone = string;

interface BotSettings {
    title: string;
    description: string;
    shortName: string;
    slug: string;
    initialGreeting: string;
    notificationEmail: string;
    timezone: Timezone;
}

export default function SettingsPage({ params }: { params: Promise<{ botId: string }> }) {
    const [botId, setBotId] = useState<string>('');
    const [theme, setTheme] = useState<Theme>('dark');
    const [settings, setSettings] = useState<BotSettings>({
        title: '',
        description: '',
        shortName: '',
        slug: '',
        initialGreeting: '',
        notificationEmail: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        params.then(async p => {
            setBotId(p.botId);

            // Load theme from localStorage
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme) setTheme(savedTheme);

            // Load settings from API
            try {
                const response = await fetch(`/api/bot-settings/${p.botId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.settings) {
                        setSettings({
                            title: data.settings.title || '',
                            description: data.settings.description || '',
                            shortName: data.settings.shortName || '',
                            slug: data.settings.slug || p.botId,
                            initialGreeting: data.settings.initialGreeting || '',
                            notificationEmail: data.settings.notificationEmail || '',
                            timezone: data.settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                        });
                    }
                }

                // Check if user is super admin
                const userResponse = await fetch('/api/auth/me');
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setIsSuperAdmin(userData.user?.role === 'super_admin');
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setIsLoading(false);
            }
        });
    }, [params]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            const response = await fetch(`/api/bot-settings/${botId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save settings');
            }

            setSaveMessage('Settings saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error: any) {
            setSaveMessage(error.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportData = async (format: 'json' | 'csv') => {
        setIsExporting(true);

        try {
            const response = await fetch(`/api/export/${botId}?format=${format}`);

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${botId}_chat_logs_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const timezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Sao_Paulo',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
        'UTC',
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex font-sans">
                <AdminSidebar botId={botId} />
                <main className="flex-1 ml-64 flex items-center justify-center">
                    <div className="text-gray-400">Loading settings...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex font-sans">
            <AdminSidebar botId={botId} />

            <main className="flex-1 ml-64 overflow-auto min-h-screen">
                <header className="bg-gray-900 border-b border-gray-800 py-6 px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                    <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <p className="text-gray-400 mt-1">Manage your bot configuration and preferences</p>
                </header>

                <div className="p-8 max-w-4xl">
                    {saveMessage && (
                        <div className={`mb-6 p-4 rounded-xl text-sm ${saveMessage.includes('success')
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            {saveMessage}
                        </div>
                    )}

                    {/* Theme Settings */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            {theme === 'dark' ? (
                                <MoonIcon className="w-6 h-6 text-indigo-400" />
                            ) : (
                                <SunIcon className="w-6 h-6 text-yellow-400" />
                            )}
                            <h3 className="text-lg font-semibold text-white">Appearance</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 font-medium">Theme</p>
                                <p className="text-sm text-gray-500 mt-1">Choose your preferred color scheme</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                <span
                                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${theme === 'dark' ? 'translate-x-10' : 'translate-x-1'
                                        }`}
                                >
                                    {theme === 'dark' ? (
                                        <MoonIcon className="w-5 h-5 m-1.5 text-gray-900" />
                                    ) : (
                                        <SunIcon className="w-5 h-5 m-1.5 text-yellow-500" />
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Bot Configuration */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TagIcon className="w-6 h-6 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Bot Configuration</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bot Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.title}
                                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="LolaBot"
                                />
                                <p className="text-xs text-gray-500 mt-1">The main title of your bot</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={settings.description}
                                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Immigration Advisor USA (EB2 NIW, EB1A, O1)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Brief description of what your bot does</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Short Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.shortName}
                                    onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="LolaBot"
                                />
                                <p className="text-xs text-gray-500 mt-1">Short display name for compact views</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Slug (URL Identifier)
                                    </label>
                                    {!isSuperAdmin && (
                                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                                            <ShieldCheckIcon className="w-3 h-3" />
                                            Super Admin Only
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={settings.slug}
                                    onChange={(e) => setSettings({ ...settings, slug: e.target.value })}
                                    disabled={!isSuperAdmin}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="immigration-advisor"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Used in URLs and API endpoints {!isSuperAdmin && '(read-only)'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Initial Greeting
                                </label>
                                <textarea
                                    value={settings.initialGreeting}
                                    onChange={(e) => setSettings({ ...settings, initialGreeting: e.target.value })}
                                    rows={3}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    placeholder="Hi, I'm your AI Assistant. How can I help you?"
                                />
                                <p className="text-xs text-gray-500 mt-1">The first message users see when starting a chat</p>
                            </div>
                        </div>
                    </div>

                    {/* Timezone Settings */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <GlobeAltIcon className="w-6 h-6 text-green-400" />
                            <h3 className="text-lg font-semibold text-white">Regional Settings</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Timezone
                            </label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {timezones.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">All timestamps will be displayed in this timezone</p>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BellIcon className="w-6 h-6 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Notification Email
                            </label>
                            <input
                                type="email"
                                value={settings.notificationEmail}
                                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="admin@example.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">Receive critical alerts and summaries at this email</p>
                        </div>
                    </div>

                    {/* Export Data */}
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ArrowDownTrayIcon className="w-6 h-6 text-orange-400" />
                            <h3 className="text-lg font-semibold text-white">Export Data</h3>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">Download all chat logs and session data</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleExportData('json')}
                                disabled={isExporting}
                                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                {isExporting ? 'Exporting...' : 'Export as JSON'}
                            </button>
                            <button
                                onClick={() => handleExportData('csv')}
                                disabled={isExporting}
                                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                {isExporting ? 'Exporting...' : 'Export as CSV'}
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                        >
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
