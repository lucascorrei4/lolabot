'use client';
import React, { useEffect, useState } from 'react';

type ShowcaseType = 'success' | 'warning' | 'danger';

interface BriefingShowcaseProps {
    type?: ShowcaseType;
}

export const SCENARIOS = {
    success: {
        accentColor: 'indigo',
        chatIcon: '🤖',
        chatMessage: "I've analyzed your visitor's session. They seem interested in the Enterprise plan.",
        responseMessage: "Great! Can you summarize the key points?",
        processingTitle: "GENERATING INTELLIGENCE...",
        emailHeaderColor: 'bg-green-500', // dots
        emailTitle: "📝 Lead Briefing: Enterprise Opportunity",
        priorityLabel: "High Priority",
        priorityClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        summaryTitle: "Executive Summary",
        summaryText: 'Visitor spent 4m 30s on Pricing page. Explicitly asked about "SSO" and "SLA guarantees". High probability of conversion for Enterprise Tier.',
        sentimentLabel: "Sentiment Score",
        sentimentIcon: "🔥",
        sentimentScore: "92/100",
        actionLabel: "Recommended Action",
        actionText: "Email Sales Team",
        actionClass: "text-green-400",
    },
    warning: {
        accentColor: 'orange',
        chatIcon: '⚠️',
        chatMessage: "Heads up! I'm detecting some friction in this user's session.",
        responseMessage: "What seems to be the issue?",
        processingTitle: "ANALYZING BEHAVIOR...",
        emailHeaderColor: 'bg-yellow-500',
        emailTitle: "⚠️ Alert: Potential Churn Risk",
        priorityLabel: "Attention Needed",
        priorityClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        summaryTitle: "Risk Assessment",
        summaryText: "User visited 'Cancel Subscription' page twice. Searched for 'Refund Policy' and 'Competitors'. Session duration indicates struggle.",
        sentimentLabel: "Frustration Level",
        sentimentIcon: "😟",
        sentimentScore: "High",
        actionLabel: "Recommended Action",
        actionText: "Offer Support Session",
        actionClass: "text-orange-400",
    },
    danger: {
        accentColor: 'red',
        chatIcon: '🚨',
        chatMessage: "URGENT! Visitor is reporting a critical emergency situation.",
        responseMessage: "alert the on-call team immediately!",
        processingTitle: "ESCALATING PRIORITY...",
        emailHeaderColor: 'bg-red-500',
        emailTitle: "🚨 CRITICAL: Emergency Support",
        priorityLabel: "Immediate Action",
        priorityClass: "bg-red-500/10 text-red-400 border-red-500/20",
        summaryTitle: "Incident Report",
        summaryText: "Visitor keywords: 'Data Loss', 'System Down', 'Emergency'. Requesting immediate human intervention. Ticket created #URG-992.",
        sentimentLabel: "Urgency Score",
        sentimentIcon: "⚡",
        sentimentScore: "CRITICAL",
        actionLabel: "System Action",
        actionText: "Trigger PagerDuty",
        actionClass: "text-red-500",
    }
};

export interface BriefingScenario {
    accentColor: string;
    chatIcon: string;
    chatMessage: string;
    responseMessage: string;
    processingTitle: string;
    emailTitle: string;
    priorityLabel: string;
    priorityClass: string;
    summaryTitle: string;
    summaryText: string;
    sentimentLabel: string;
    sentimentIcon: string;
    sentimentScore: string;
    actionLabel: string;
    actionText: string;
    actionClass: string;
    emailHeaderColor?: string;
}

export const BriefingShowcase: React.FC<BriefingShowcaseProps & { data?: BriefingScenario }> = ({ type = 'success', data }) => {
    const [step, setStep] = useState(0);
    const defaultScenario = SCENARIOS[type];
    const scenario = { ...defaultScenario, ...data };

    // Animation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000); // Change step every 4s
        return () => clearInterval(interval);
    }, []);

    // Color mapping helper
    const getAccentColors = (color: string) => {
        const colors = {
            indigo: {
                bg: 'bg-indigo-500',
                text: 'text-indigo-400',
                border: 'border-indigo-500',
                borderLight: 'border-indigo-500/30',
                borderTop: 'border-t-indigo-500',
                gradient: 'from-indigo-500/10 to-purple-500/10',
                button: 'bg-indigo-600',
            },
            orange: {
                bg: 'bg-orange-500',
                text: 'text-orange-400',
                border: 'border-orange-500',
                borderLight: 'border-orange-500/30',
                borderTop: 'border-t-orange-500',
                gradient: 'from-orange-500/10 to-red-500/10',
                button: 'bg-orange-600',
            },
            red: {
                bg: 'bg-red-500',
                text: 'text-red-400',
                border: 'border-red-500',
                borderLight: 'border-red-500/30',
                borderTop: 'border-t-red-500',
                gradient: 'from-red-500/10 to-orange-500/10',
                button: 'bg-red-600',
            }
        };
        return colors[color as keyof typeof colors] || colors.indigo;
    };

    const theme = getAccentColors(scenario.accentColor);

    return (
        <div className="relative w-full mx-auto max-w-4xl bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[320px] sm:min-h-[400px] flex items-center justify-center">

            {/* Background Ambience */}
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${theme.gradient} pointer-events-none transition-colors duration-500`} />

            {/* STAGE 1: CHAT */}
            <div className={`absolute transition-all duration-700 transform px-2 sm:px-0 w-full sm:w-auto ${step === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95'}`}>
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4 w-full sm:w-80 lg:w-96 shadow-xl border border-white/10 mx-auto">
                    <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${theme.bg} flex items-center justify-center text-white text-sm flex-shrink-0`}>{scenario.chatIcon}</div>
                        <div className="bg-gray-800 p-2 sm:p-3 rounded-r-xl rounded-bl-xl text-xs sm:text-sm text-gray-200">
                            {scenario.chatMessage}
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 justify-end">
                        <div className={`${theme.button} p-2 sm:p-3 rounded-l-xl rounded-br-xl text-xs sm:text-sm text-white`}>
                            {scenario.responseMessage}
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm flex-shrink-0">👤</div>
                    </div>
                </div>
            </div>

            {/* STAGE 2: PROCESSING */}
            <div className={`absolute flex flex-col items-center transition-all duration-700 transform ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 ${theme.borderLight} ${theme.borderTop} animate-spin mb-3 sm:mb-4`}></div>
                <p className={`${theme.text} font-mono text-xs sm:text-sm tracking-widest uppercase text-center px-4`}>{scenario.processingTitle}</p>
            </div>

            {/* STAGE 3: EMAIL NOTIFICATION */}
            <div className={`absolute w-full max-w-[95%] sm:max-w-xl lg:max-w-2xl transition-all duration-700 transform ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                {/* Fake Email Interface - Dark Mode */}
                <div className="bg-[#1a1f2e] rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                    {/* Header */}
                    <div className="bg-[#252a3a] px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-700/50 flex justify-between items-center">
                        <div className="flex gap-2 sm:gap-4">
                            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></span>
                            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></span>
                            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-mono hidden sm:block">Message from BizAI Agent Intelligence</div>
                    </div>

                    {/* Body */}
                    <div className="p-3 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 truncate">{scenario.emailTitle}</h2>
                                <p className="text-xs sm:text-sm text-gray-400">From: <span className={theme.text}>BizAI Agent Intelligence</span></p>
                            </div>
                            <span className={`${scenario.priorityClass} text-[10px] sm:text-xs px-2 py-1 rounded border flex-shrink-0 self-start`}>{scenario.priorityLabel}</span>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className={`bg-gray-800/60 p-3 sm:p-4 rounded-lg border-l-4 ${theme.border}`}>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase mb-1 sm:mb-2">{scenario.summaryTitle}</h4>
                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    {scenario.summaryText}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <div className="bg-gray-800/60 p-2 sm:p-3 rounded border border-gray-700/50">
                                    <span className="block text-[10px] sm:text-xs text-gray-500 mb-1">{scenario.sentimentLabel}</span>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="text-lg sm:text-2xl">{scenario.sentimentIcon}</span>
                                        <span className="text-white font-bold text-xs sm:text-base">{scenario.sentimentScore}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-800/60 p-2 sm:p-3 rounded border border-gray-700/50">
                                    <span className="block text-[10px] sm:text-xs text-gray-500 mb-1">{scenario.actionLabel}</span>
                                    <div className={`flex items-center gap-1 sm:gap-2 ${scenario.actionClass} text-xs sm:text-sm font-bold`}>
                                        <span className="truncate">{scenario.actionText}</span>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
