'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BriefingShowcase, SCENARIOS, BriefingScenario } from '../../../landing/BriefingShowcase';
import { Signal } from '../../../lib/types';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import {
    Cog6ToothIcon,
    ChatBubbleLeftRightIcon,
    BellAlertIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type SignalType = 'success' | 'warning' | 'danger';

interface SignalsDashboardProps {
    botId: string;
    signals: Signal[];
}

export default function SignalsDashboard({ botId, signals }: SignalsDashboardProps) {
    const [currentSignalType, setCurrentSignalType] = useState<SignalType>('success');

    const navItems = [
        { name: 'Signals', icon: BellAlertIcon, href: `/admin/${botId}`, current: true },
        { name: 'Chat Logs', icon: ChatBubbleLeftRightIcon, href: `/logs/${botId}`, current: false },
        { name: 'Settings', icon: Cog6ToothIcon, href: `/admin/${botId}/settings`, current: false },
    ];

    const signalTypes = [
        { type: 'success', label: 'Opportunity', icon: ShieldCheckIcon, color: 'text-indigo-400' },
        { type: 'warning', label: 'Churn Risk', icon: ExclamationTriangleIcon, color: 'text-orange-400' },
        { type: 'danger', label: 'Critical Alert', icon: BellAlertIcon, color: 'text-red-400' },
    ];

    // Filter signals by type
    const filteredSignals = signals.filter(s => s.type === currentSignalType);

    // Get the latest signal (listSignals is already sorted by date desc)
    const latestSignal = filteredSignals[0];

    const mapSignalToScenario = (signal: Signal): BriefingScenario => {
        // Use default scenario as base to ensure all required fields are present
        // (even those not in Signal, like accentColor, chatIcon, messages)
        const defaultScenario = SCENARIOS[signal.type as keyof typeof SCENARIOS] || SCENARIOS.success;

        return {
            ...defaultScenario,
            // Override with dynamic content from Signal
            emailTitle: signal.title,
            priorityLabel: signal.priority,
            summaryTitle: signal.summaryTitle,
            summaryText: signal.summaryText,
            sentimentLabel: signal.sentimentLabel,
            sentimentIcon: signal.sentimentIcon,
            sentimentScore: signal.sentimentScore,
            actionLabel: signal.actionLabel,
            actionText: signal.actionText,
            // We can add more mappings if Signal has more fields, e.g. userDetails could be used in chatMessage
        };
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex font-sans">
            {/* Sidebar */}
            <AdminSidebar botId={botId} />

            {/* Main content - responsive margin for sidebar */}
            <main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col pt-16 lg:pt-0">
                <header className="bg-gray-900 border-b border-gray-800 py-4 lg:py-6 px-4 lg:px-8 lg:sticky lg:top-0 z-10 backdrop-blur-md bg-opacity-90">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">Live Intelligence Signals</h2>
                    <p className="text-gray-400 mt-1 text-sm lg:text-base">Real-time alerts and briefings from your visitor sessions.</p>
                </header>

                <div className="p-4 lg:p-8 flex-1">
                    {/* Signal Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
                        {signalTypes.map((signal) => {
                            const isActive = currentSignalType === signal.type;
                            // Count signals of this type
                            const count = signals.filter(s => s.type === signal.type).length;
                            const latestOfThisType = signals.find(s => s.type === signal.type);
                            const latestTime = latestOfThisType ? timeAgo(latestOfThisType.createdAt) : 'None';

                            return (
                                <button
                                    key={signal.type}
                                    onClick={() => setCurrentSignalType(signal.type as SignalType)}
                                    className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-6 py-3 lg:py-4 rounded-xl border transition-all duration-300 ${isActive
                                        ? 'bg-gray-800 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                                        }`}
                                >
                                    <div className={`p-1.5 lg:p-2 rounded-lg bg-gray-900 ${signal.color} flex-shrink-0`}>
                                        <signal.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                        <p className={`font-semibold text-sm lg:text-base truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                            {signal.label} <span className="text-xs opacity-50">({count})</span>
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">Latest: {latestTime}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Showcase Container */}
                    <div className="bg-gray-900/50 rounded-2xl lg:rounded-3xl border border-gray-800 p-4 lg:p-8 min-h-[400px] lg:min-h-[600px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-indigo-500/[0.05] -z-10" />

                        {filteredSignals.length > 0 && latestSignal ? (
                            <BriefingShowcase
                                type={currentSignalType}
                                data={mapSignalToScenario(latestSignal)}
                            />
                        ) : (
                            <div className="text-center text-gray-500 px-4">
                                <BellAlertIcon className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-4 opacity-20" />
                                <p className="text-base lg:text-lg font-medium">No signals found for this category</p>
                                <p className="text-sm">Waiting for new intelligence...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function timeAgo(date: Date | string) {
    const d = new Date(date);
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
