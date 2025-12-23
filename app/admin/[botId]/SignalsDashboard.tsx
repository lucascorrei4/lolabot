'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BriefingShowcase, SCENARIOS, BriefingScenario } from '../../../landing/BriefingShowcase';
import { Signal } from '../../../lib/types';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import {
    Cog6ToothIcon,
    ChatBubbleLeftRightIcon,
    BellAlertIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ListBulletIcon,
    Squares2X2Icon,
    CalendarIcon,
    ChatBubbleOvalLeftIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

type SignalType = 'success' | 'warning' | 'danger';
type ViewMode = 'card' | 'list';
type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';

interface SignalsDashboardProps {
    botId: string;
    signals: Signal[];
}

export default function SignalsDashboard({ botId, signals }: SignalsDashboardProps) {
    const [currentSignalType, setCurrentSignalType] = useState<SignalType>('success');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const signalTypes = [
        { type: 'success', label: 'Opportunity', icon: ShieldCheckIcon, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
        { type: 'warning', label: 'Churn Risk', icon: ExclamationTriangleIcon, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
        { type: 'danger', label: 'Critical Alert', icon: BellAlertIcon, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    ];

    // Date filtering logic
    const getDateFilterRange = (): { start: Date | null; end: Date | null } => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (dateFilter) {
            case 'today':
                return { start: today, end: now };
            case 'week': {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return { start: weekAgo, end: now };
            }
            case 'month': {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return { start: monthAgo, end: now };
            }
            case 'custom':
                return {
                    start: customDateStart ? new Date(customDateStart) : null,
                    end: customDateEnd ? new Date(customDateEnd + 'T23:59:59') : null
                };
            default:
                return { start: null, end: null };
        }
    };

    // Filter signals by type and date
    const filteredSignals = useMemo(() => {
        let filtered = signals.filter(s => s.type === currentSignalType);

        const { start, end } = getDateFilterRange();
        if (start || end) {
            filtered = filtered.filter(s => {
                const signalDate = new Date(s.createdAt);
                if (start && signalDate < start) return false;
                if (end && signalDate > end) return false;
                return true;
            });
        }

        return filtered;
    }, [signals, currentSignalType, dateFilter, customDateStart, customDateEnd]);

    // Get current signal based on index
    const currentSignal = filteredSignals[currentIndex];

    // Navigation handlers
    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredSignals.length - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev < filteredSignals.length - 1 ? prev + 1 : 0));
    };

    // Reset index when changing signal type or filter
    const handleSignalTypeChange = (type: SignalType) => {
        setCurrentSignalType(type);
        setCurrentIndex(0);
    };

    const handleDateFilterChange = (filter: DateFilterType) => {
        setDateFilter(filter);
        setCurrentIndex(0);
        if (filter !== 'custom') {
            setShowDatePicker(false);
        }
    };

    const mapSignalToScenario = (signal: Signal): BriefingScenario => {
        const defaultScenario = SCENARIOS[signal.type as keyof typeof SCENARIOS] || SCENARIOS.success;

        return {
            ...defaultScenario,
            emailTitle: signal.title,
            priorityLabel: signal.priority,
            summaryTitle: signal.summaryTitle,
            summaryText: signal.summaryText,
            sentimentLabel: signal.sentimentLabel,
            sentimentIcon: signal.sentimentIcon,
            sentimentScore: signal.sentimentScore,
            actionLabel: signal.actionLabel,
            actionText: signal.actionText,
        };
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSignalTypeInfo = (type: string) => {
        return signalTypes.find(s => s.type === type) || signalTypes[0];
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex font-sans">
            {/* Sidebar */}
            <AdminSidebar botId={botId} />

            {/* Main content - responsive margin for sidebar */}
            <main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col pt-16 lg:pt-0">
                <header className="bg-gray-900 border-b border-gray-800 py-4 lg:py-6 px-4 lg:px-8 lg:sticky lg:top-0 z-10 backdrop-blur-md bg-opacity-90">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-white">Live Intelligence Signals</h2>
                            <p className="text-gray-400 mt-1 text-sm lg:text-base">Real-time alerts and briefings from your visitor sessions.</p>
                        </div>

                        {/* View Mode Toggle & Date Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Date Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors text-sm"
                                >
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-300">
                                        {dateFilter === 'all' && 'All Time'}
                                        {dateFilter === 'today' && 'Today'}
                                        {dateFilter === 'week' && 'Last 7 Days'}
                                        {dateFilter === 'month' && 'Last 30 Days'}
                                        {dateFilter === 'custom' && 'Custom Range'}
                                    </span>
                                </button>

                                {showDatePicker && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 p-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-300">Filter by Date</span>
                                            <button onClick={() => setShowDatePicker(false)} className="text-gray-500 hover:text-gray-300">
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            {[
                                                { value: 'all', label: 'All Time' },
                                                { value: 'today', label: 'Today' },
                                                { value: 'week', label: 'Last 7 Days' },
                                                { value: 'month', label: 'Last 30 Days' },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleDateFilterChange(option.value as DateFilterType)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === option.value
                                                        ? 'bg-indigo-500/20 text-indigo-400'
                                                        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="border-t border-gray-700 mt-3 pt-3">
                                            <p className="text-xs text-gray-500 mb-2">Custom Range</p>
                                            <div className="space-y-2">
                                                <input
                                                    type="date"
                                                    value={customDateStart}
                                                    onChange={(e) => {
                                                        setCustomDateStart(e.target.value);
                                                        setDateFilter('custom');
                                                    }}
                                                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
                                                    placeholder="Start date"
                                                />
                                                <input
                                                    type="date"
                                                    value={customDateEnd}
                                                    onChange={(e) => {
                                                        setCustomDateEnd(e.target.value);
                                                        setDateFilter('custom');
                                                    }}
                                                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
                                                    placeholder="End date"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 p-1">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'card'
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                    title="Card View"
                                >
                                    <Squares2X2Icon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                    title="List View"
                                >
                                    <ListBulletIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 flex-1">
                    {/* Signal Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
                        {signalTypes.map((signal) => {
                            const isActive = currentSignalType === signal.type;
                            const count = signals.filter(s => s.type === signal.type).length;
                            const latestOfThisType = signals.find(s => s.type === signal.type);
                            const latestTime = latestOfThisType ? timeAgo(latestOfThisType.createdAt) : 'None';

                            return (
                                <button
                                    key={signal.type}
                                    onClick={() => handleSignalTypeChange(signal.type as SignalType)}
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

                    {/* Card View */}
                    {viewMode === 'card' && (
                        <div className="bg-gray-900/50 rounded-2xl lg:rounded-3xl border border-gray-800 p-4 lg:p-8 min-h-[400px] lg:min-h-[600px] flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-indigo-500/[0.05] -z-10" />

                            {filteredSignals.length > 0 && currentSignal ? (
                                <>
                                    {/* Signal Info Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-800">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-xs text-gray-500">
                                                Signal {currentIndex + 1} of {filteredSignals.length}
                                            </span>
                                            <span className="text-gray-700">•</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                {formatDate(currentSignal.createdAt)}
                                            </span>
                                            {/* Lead Score Badge */}
                                            {currentSignal.leadScore !== undefined && (
                                                <>
                                                    <span className="text-gray-700">•</span>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${currentSignal.leadScore >= 80
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                        : currentSignal.leadScore >= 50
                                                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                            : 'bg-gray-700 text-gray-400 border border-gray-600'
                                                        }`}>
                                                        {currentSignal.leadScore >= 80 && <span>🔥</span>}
                                                        Lead Score: {currentSignal.leadScore}/100
                                                    </span>
                                                </>
                                            )}
                                            {/* Estimated Value */}
                                            {currentSignal.estimatedValue !== undefined && currentSignal.estimatedValue > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                                    💰 ${currentSignal.estimatedValue.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Chat Link */}
                                            {currentSignal.sessionId && (
                                                <Link
                                                    href={`/chat/${currentSignal.sessionId}`}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-xs font-medium"
                                                >
                                                    <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                                                    View Conversation
                                                </Link>
                                            )}

                                            {/* Navigation Arrows */}
                                            {filteredSignals.length > 1 && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={goToPrevious}
                                                        className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-700 transition-colors"
                                                        title="Previous signal"
                                                    >
                                                        <ChevronLeftIcon className="h-4 w-4 text-gray-400" />
                                                    </button>
                                                    <button
                                                        onClick={goToNext}
                                                        className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-700 transition-colors"
                                                        title="Next signal"
                                                    >
                                                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Showcase */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <BriefingShowcase
                                            type={currentSignalType}
                                            data={mapSignalToScenario(currentSignal)}
                                        />
                                    </div>

                                    {/* Pagination Dots */}
                                    {filteredSignals.length > 1 && filteredSignals.length <= 10 && (
                                        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-800">
                                            {filteredSignals.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                                        ? 'bg-indigo-500 w-6'
                                                        : 'bg-gray-700 hover:bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center text-gray-500 px-4">
                                        <BellAlertIcon className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-base lg:text-lg font-medium">No signals found for this category</p>
                                        <p className="text-sm">
                                            {dateFilter !== 'all'
                                                ? 'Try adjusting your date filter or wait for new intelligence...'
                                                : 'Waiting for new intelligence...'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="bg-gray-900/50 rounded-2xl lg:rounded-3xl border border-gray-800 overflow-hidden">
                            {filteredSignals.length > 0 ? (
                                <div className="divide-y divide-gray-800">
                                    {filteredSignals.map((signal, idx) => {
                                        const typeInfo = getSignalTypeInfo(signal.type);
                                        return (
                                            <div
                                                key={signal._id || idx}
                                                className={`p-4 lg:p-6 hover:bg-gray-800/50 transition-colors ${idx === currentIndex ? 'bg-gray-800/30' : ''
                                                    }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    {/* Type Icon */}
                                                    <div className={`p-2 rounded-lg ${typeInfo.bgColor} ${typeInfo.color} flex-shrink-0 self-start`}>
                                                        <typeInfo.icon className="h-5 w-5" />
                                                    </div>

                                                    {/* Signal Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-white truncate">{signal.title}</h3>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.bgColor} ${typeInfo.color}`}>
                                                                    {signal.priority}
                                                                </span>
                                                                {/* Lead Score in List View */}
                                                                {signal.leadScore !== undefined && (
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${signal.leadScore >= 80
                                                                            ? 'bg-green-500/20 text-green-400'
                                                                            : signal.leadScore >= 50
                                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                                : 'bg-gray-700 text-gray-400'
                                                                        }`}>
                                                                        {signal.leadScore >= 80 && '🔥 '}{signal.leadScore}/100
                                                                    </span>
                                                                )}
                                                                {/* Estimated Value in List View */}
                                                                {signal.estimatedValue !== undefined && signal.estimatedValue > 0 && (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                                                                        💰 ${signal.estimatedValue.toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-400 line-clamp-2">{signal.summaryText}</p>

                                                        {/* Meta Info */}
                                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                                {formatDate(signal.createdAt)}
                                                            </span>
                                                            {signal.sentimentLabel && (
                                                                <span>Sentiment: {signal.sentimentLabel}</span>
                                                            )}
                                                            {/* Buying Signals in List View */}
                                                            {signal.buyingSignals && signal.buyingSignals.length > 0 && (
                                                                <span className="text-indigo-400">
                                                                    🎯 {signal.buyingSignals.length} buying signals
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {signal.sessionId && (
                                                            <Link
                                                                href={`/chat/${signal.sessionId}`}
                                                                target="_blank"
                                                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-xs font-medium"
                                                            >
                                                                <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                                                                <span className="hidden sm:inline">View Chat</span>
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setCurrentIndex(idx);
                                                                setViewMode('card');
                                                            }}
                                                            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 transition-colors text-xs font-medium"
                                                        >
                                                            Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <BellAlertIcon className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-base lg:text-lg font-medium">No signals found for this category</p>
                                    <p className="text-sm">
                                        {dateFilter !== 'all'
                                            ? 'Try adjusting your date filter or wait for new intelligence...'
                                            : 'Waiting for new intelligence...'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
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
