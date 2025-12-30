'use client';
import React, { useEffect, useState } from 'react';

interface ChatMessage {
    role: 'visitor' | 'bot';
    text: string;
    typing?: boolean;
}

interface LeadSignal {
    text: string;
    value: string;
    icon: string;
}

export function LeadScoringShowcase() {
    const [stage, setStage] = useState(0);
    const [score, setScore] = useState(0);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [signals, setSignals] = useState<LeadSignal[]>([]);
    const [showEmail, setShowEmail] = useState(false);

    // Conversation flow
    const conversation: ChatMessage[] = [
        { role: 'visitor', text: "Hi, I need help with my customer support" },
        { role: 'bot', text: "Hello! I'd be happy to help. Are you looking to improve your current support system?" },
        { role: 'visitor', text: "Yes, we're using Intercom but it's getting too expensive for our 50-person team" },
        { role: 'bot', text: "I understand! BizAI Agent offers enterprise features at a fraction of the cost. What features matter most to you?" },
        { role: 'visitor', text: "We need SSO, good sentiment analysis, and integrations with Salesforce" },
        { role: 'bot', text: "Perfect match! We support all of those. Would you like to see our enterprise pricing?" },
        { role: 'visitor', text: "Yes please! Can I schedule a demo for tomorrow?" },
    ];

    // Signals that appear as conversation progresses
    const signalSequence: { atMessage: number; signal: LeadSignal; scoreAdd: number }[] = [
        { atMessage: 0, signal: { text: "Intent", value: "Support Interest", icon: "💬" }, scoreAdd: 15 },
        { atMessage: 2, signal: { text: "Team Size", value: "50 employees", icon: "👥" }, scoreAdd: 20 },
        { atMessage: 2, signal: { text: "Competitor", value: "Leaving Intercom", icon: "🔀" }, scoreAdd: 15 },
        { atMessage: 4, signal: { text: "Need", value: "Enterprise Features", icon: "🎯" }, scoreAdd: 18 },
        { atMessage: 4, signal: { text: "Integration", value: "Salesforce Required", icon: "🔗" }, scoreAdd: 12 },
        { atMessage: 6, signal: { text: "Urgency", value: "Demo Tomorrow", icon: "⚡" }, scoreAdd: 14 },
    ];

    // Animation loop
    useEffect(() => {
        let currentMessage = 0;
        let currentScore = 0;
        const currentSignals: LeadSignal[] = [];

        const interval = setInterval(() => {
            if (currentMessage < conversation.length) {
                // Add message
                setChatMessages(prev => [...prev, conversation[currentMessage]]);

                // Check for signals at this message
                const newSignals = signalSequence.filter(s => s.atMessage === currentMessage);
                newSignals.forEach(s => {
                    currentSignals.push(s.signal);
                    currentScore += s.scoreAdd;
                });

                setSignals([...currentSignals]);
                setScore(currentScore);
                currentMessage++;
            } else if (currentMessage === conversation.length) {
                // Show email notification
                setShowEmail(true);
                currentMessage++;
            } else {
                // Reset animation
                setChatMessages([]);
                setSignals([]);
                setScore(0);
                setShowEmail(false);
                currentMessage = 0;
                currentScore = 0;
                currentSignals.length = 0;
            }
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    const getScoreColor = () => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-orange-400';
    };

    const getScoreBg = () => {
        if (score >= 80) return 'from-green-500/20 to-green-500/5';
        if (score >= 50) return 'from-yellow-500/20 to-yellow-500/5';
        return 'from-orange-500/20 to-orange-500/5';
    };

    return (
        <section className="py-16 sm:py-24 bg-gray-900 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-4">
                        🎯 Lead Scoring in Action
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                        Watch How AI Scores Your Leads in Real-Time
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                        As visitors chat, our AI analyzes buying signals and assigns a lead score.
                        <span className="text-white font-semibold"> High scores (80+) mean hot leads ready to buy.</span>
                    </p>
                </div>

                {/* Main Demo Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Left: Chat Window */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center gap-3">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            </div>
                            <span className="text-gray-400 text-sm font-mono">Live Chat Session</span>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-green-400 text-xs">Recording</span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-4 sm:p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                            {chatMessages.filter(msg => msg && msg.role).map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 animate-fadeIn ${msg.role === 'visitor' ? 'justify-start' : 'justify-end'}`}
                                >
                                    {msg.role === 'visitor' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm flex-shrink-0">
                                            👤
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'visitor'
                                        ? 'bg-gray-700 text-gray-200 rounded-tl-sm'
                                        : 'bg-indigo-600 text-white rounded-tr-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    {msg.role === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm flex-shrink-0">
                                            🤖
                                        </div>
                                    )}
                                </div>
                            ))}

                            {chatMessages.length === 0 && (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3 animate-pulse">
                                            💬
                                        </div>
                                        <p className="text-sm">Starting conversation...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Lead Intelligence Panel */}
                    <div className="space-y-4">
                        {/* Lead Score Card */}
                        <div className={`bg-gradient-to-br ${getScoreBg()} rounded-2xl border border-gray-700 p-6 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm font-medium">LEAD SCORE</span>
                                    {score >= 80 && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">
                                            🔥 HOT LEAD
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-end gap-2 mb-4">
                                    <span className={`text-5xl sm:text-6xl font-bold ${getScoreColor()} transition-all duration-500`}>
                                        {score}
                                    </span>
                                    <span className="text-gray-500 text-xl mb-2">/100</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>

                                <p className="text-gray-500 text-xs mt-2">
                                    {score >= 80 ? 'Ready to buy - Call immediately!' :
                                        score >= 50 ? 'Warming up - Keep engaging' :
                                            'Just browsing - Nurture over time'}
                                </p>
                            </div>
                        </div>

                        {/* Detected Signals */}
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="text-lg">🎯</span>
                                Buying Signals Detected
                            </h3>

                            <div className="space-y-2 min-h-[180px]">
                                {signals.map((signal, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg animate-slideIn"
                                    >
                                        <span className="text-lg">{signal.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs text-gray-500">{signal.text}</span>
                                            <p className="text-sm text-white font-medium truncate">{signal.value}</p>
                                        </div>
                                        <span className="text-green-400 text-xs">✓</span>
                                    </div>
                                ))}

                                {signals.length === 0 && (
                                    <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                                        Analyzing conversation...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Preview (appears when score is high) */}
                        {showEmail && (
                            <div className="bg-gray-800 rounded-2xl border border-green-500/50 p-4 animate-slideUp">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                                    <span className="text-green-400 text-sm font-semibold">Email Sent to Founder</span>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-3 text-sm">
                                    <p className="text-white font-semibold mb-1">🔥 Hot Lead: Enterprise Opportunity</p>
                                    <p className="text-gray-400 text-xs">Score: 94/100 • Team: 50 people • Ready to demo</p>
                                    <div className="mt-2 flex gap-2">
                                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg">
                                            📞 Call Now
                                        </button>
                                        <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg">
                                            View Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">
                        Never miss a hot lead again. <span className="text-white">Start scoring leads in minutes.</span>
                    </p>
                    <a
                        href="#pricing"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-all"
                    >
                        Get Lead Scoring
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                .animate-slideIn { animation: slideIn 0.3s ease-out; }
                .animate-slideUp { animation: slideUp 0.4s ease-out; }
            `}</style>
        </section>
    );
}
