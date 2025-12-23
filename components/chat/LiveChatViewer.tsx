'use client';

import { useState, useEffect, useCallback } from 'react';
import MessageList from './MessageList';
import { ArrowPathIcon, SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline';

interface Message {
    _id?: string;
    role: string;
    type: string;
    text?: string;
    url?: string;
    mime?: string;
    choices?: { label: string; value: string }[];
    createdAt: string;
    sessionId: string;
}

interface Session {
    _id: string;
    botId: string;
    userId?: string;
    chatId?: string;
    userEmail?: string;
    userName?: string;
    createdAt: string;
    lastActivityAt?: string;
}

interface LiveChatViewerProps {
    sessionId: string;
    initialMessages: Message[];
    session: Session | null;
    botId: string;
    timezone?: string;
}

export function LiveChatViewer({
    sessionId,
    initialMessages,
    session,
    botId,
    timezone,
}: LiveChatViewerProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLive, setIsLive] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(15); // seconds

    // Determine if conversation is recent (within last 30 minutes)
    const isRecent = useCallback(() => {
        if (!session?.lastActivityAt && messages.length === 0) return false;

        const lastActivity = session?.lastActivityAt
            ? new Date(session.lastActivityAt)
            : messages.length > 0
                ? new Date(messages[messages.length - 1].createdAt)
                : null;

        if (!lastActivity) return false;

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        return lastActivity > thirtyMinutesAgo;
    }, [session, messages]);

    // Refresh messages
    const refreshMessages = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch(`/api/messages?sessionId=${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.messages) {
                    setMessages(data.messages);
                    setLastRefresh(new Date());

                    // Check if there are new messages (conversation is live)
                    if (data.messages.length > messages.length) {
                        setIsLive(true);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to refresh messages:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [sessionId, messages.length]);

    // Auto-refresh effect
    useEffect(() => {
        if (!autoRefresh) return;

        // Use shorter interval if conversation is recent
        const interval = isRecent() ? refreshInterval * 1000 : 60 * 1000; // 15s if recent, 60s otherwise

        const timer = setInterval(() => {
            refreshMessages();
        }, interval);

        return () => clearInterval(timer);
    }, [autoRefresh, refreshInterval, isRecent, refreshMessages]);

    // Update live status based on activity
    useEffect(() => {
        const checkLiveStatus = () => {
            const recent = isRecent();
            setIsLive(recent);

            // Adjust refresh interval based on recency
            if (recent) {
                setRefreshInterval(15); // More frequent for recent
            } else {
                setRefreshInterval(60); // Less frequent for old
            }
        };

        checkLiveStatus();
        const timer = setInterval(checkLiveStatus, 30000); // Check every 30s

        return () => clearInterval(timer);
    }, [isRecent]);

    const colors = {
        text: "#e5e7eb",
        textSecondary: "#9ca3af",
        userBubble: "#4f46e5",
        botBubble: "#374151",
    };

    return (
        <div className="flex flex-col h-full">
            {/* Live Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                {/* Live Indicator */}
                <div className="flex items-center gap-3">
                    {isLive ? (
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-green-400">Live Conversation</span>
                            <SignalIcon className="w-4 h-4 text-green-400" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                            <span className="text-sm font-medium text-gray-400">Inactive</span>
                            <SignalSlashIcon className="w-4 h-4 text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Refresh Controls */}
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-gray-400">Auto-refresh</span>
                    </label>

                    <button
                        onClick={refreshMessages}
                        disabled={isRefreshing}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 transition-colors"
                        title="Refresh now"
                    >
                        <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    <span className="text-xs text-gray-500 hidden sm:inline">
                        {isRefreshing ? 'Refreshing...' : `Every ${refreshInterval}s`}
                    </span>
                </div>
            </div>

            {/* User Info Card (if available) */}
            {session && (session.userId || session.userName || session.userEmail) && (
                <div className="mb-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                    <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">User Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        {session.userId && (
                            <div>
                                <span className="text-gray-500">User ID: </span>
                                <span className="text-gray-200 font-mono">{session.userId}</span>
                            </div>
                        )}
                        {session.userName && (
                            <div>
                                <span className="text-gray-500">Name: </span>
                                <span className="text-gray-200">{session.userName}</span>
                            </div>
                        )}
                        {session.userEmail && (
                            <div>
                                <span className="text-gray-500">Email: </span>
                                <span className="text-gray-200">{session.userEmail}</span>
                            </div>
                        )}
                        {session.chatId && (
                            <div>
                                <span className="text-gray-500">Chat ID: </span>
                                <span className="text-gray-200 font-mono">{session.chatId}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-gray-500">Started: </span>
                            <span className="text-gray-200">
                                {new Date(session.createdAt).toLocaleString()}
                            </span>
                        </div>
                        {session.lastActivityAt && (
                            <div>
                                <span className="text-gray-500">Last Active: </span>
                                <span className="text-gray-200">
                                    {new Date(session.lastActivityAt).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden min-h-[400px] lg:min-h-[500px] flex flex-col p-4 lg:p-6">
                {messages.length > 0 ? (
                    <MessageList
                        items={messages}
                        colors={colors}
                        timezone={timezone}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        No messages found for this session.
                    </div>
                )}
            </div>

            {/* Last Refresh Info */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{messages.length} messages</span>
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
