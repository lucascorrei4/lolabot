'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
    ExclamationTriangleIcon,
    SparklesIcon,
    ClockIcon,
    CheckCircleIcon,
    BoltIcon
} from '@heroicons/react/24/solid';

// Email notification type
type EmailType = 'urgency' | 'opportunity';

interface EmailData {
    type: EmailType;
    title: string;
    subtitle: string;
    timestamp: string;
    userName: string;
    email: string;
    sentiment: string;
    sentimentColor: string;
    topic: string;
    briefing: string;
    action: string;
    actionColor: string;
    headerBg: string;
    headerAccent: string;
    icon: React.ReactNode;
    pulseColor: string;
}

const emailScenarios: Record<EmailType, EmailData> = {
    urgency: {
        type: 'urgency',
        title: '🚨 URGENT: System Issue Reported',
        subtitle: 'AI Agent Notification',
        timestamp: 'Just now',
        userName: 'Critical Customer',
        email: 'priority@enterprise.com',
        sentiment: 'Frustrated',
        sentimentColor: 'text-red-400',
        topic: 'Technical Emergency',
        briefing: 'User is experiencing critical data sync issues affecting their production environment. They mentioned losing access to important dashboards and need immediate assistance to prevent business impact.',
        action: 'Escalate to On-Call Team immediately',
        actionColor: 'text-red-400',
        headerBg: 'bg-gradient-to-r from-red-600 to-orange-600',
        headerAccent: 'border-red-500',
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-white" />,
        pulseColor: 'bg-red-500',
    },
    opportunity: {
        type: 'opportunity',
        title: 'New Lead: Talk with Founders',
        subtitle: 'AI Agent Notification',
        timestamp: '12/22/2025, 08:41 PM UTC',
        userName: 'Anonymous',
        email: 'Not provided',
        sentiment: 'Interested',
        sentimentColor: 'text-green-400',
        topic: 'Sales',
        briefing: 'User started with casual questions about the company and services, then directly requested to speak with the founders, indicating potential interest in our services or custom needs.',
        action: 'Sales team should reach out to discuss and schedule a call.',
        actionColor: 'text-blue-400',
        headerBg: 'bg-gradient-to-r from-slate-800 to-slate-700',
        headerAccent: 'border-blue-500',
        icon: <SparklesIcon className="w-5 h-5 text-blue-400" />,
        pulseColor: 'bg-blue-500',
    },
};

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 30, startDelay: number = 0, shouldStart: boolean = true) {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!shouldStart) {
            setDisplayText('');
            setIsComplete(false);
            return;
        }

        let index = 0;
        setDisplayText('');
        setIsComplete(false);

        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    setDisplayText(text.slice(0, index + 1));
                    index++;
                } else {
                    setIsComplete(true);
                    clearInterval(interval);
                }
            }, speed);

            return () => clearInterval(interval);
        }, startDelay);

        return () => clearTimeout(startTimeout);
    }, [text, speed, startDelay, shouldStart]);

    return { displayText, isComplete };
}

// Single Email Card Component
function AnimatedEmailCard({ data, animationDelay = 0 }: { data: EmailData; animationDelay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection observer for scroll-triggered animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), animationDelay);
                    setTimeout(() => setShowContent(true), animationDelay + 400);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [animationDelay]);

    const { displayText: briefingText, isComplete: briefingComplete } = useTypewriter(
        data.briefing,
        20,
        600,
        showContent
    );

    return (
        <div
            ref={cardRef}
            className={`
        relative transform transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}
      `}
        >
            {/* Glow effect */}
            <div className={`absolute -inset-1 ${data.headerBg} opacity-20 blur-xl rounded-2xl`} />

            {/* Email Card */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                {/* Header */}
                <div className={`${data.headerBg} px-4 sm:px-6 py-4 sm:py-5`}>
                    <div className="flex items-start gap-3">
                        <div className={`${data.pulseColor} p-2 rounded-lg animate-pulse`}>
                            {data.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white truncate">
                                {data.title}
                            </h3>
                            <p className="text-xs text-white/70 mt-1 flex items-center gap-2">
                                <span>{data.subtitle}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {data.timestamp}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-5">
                    {/* User Context Section */}
                    <div className={`transition-all duration-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3 pb-2 border-b border-gray-100">
                            User Context
                        </h4>
                        <dl className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-y-2.5 text-sm">
                            <dt className="text-gray-500 font-medium">User Name</dt>
                            <dd className="font-semibold text-gray-900">{data.userName}</dd>

                            <dt className="text-gray-500 font-medium">Email</dt>
                            <dd className={`font-semibold ${data.email === 'Not provided' ? 'text-red-500' : 'text-blue-600'}`}>
                                {data.email}
                            </dd>

                            <dt className="text-gray-500 font-medium">Detected Sentiment</dt>
                            <dd className={`font-medium ${data.sentimentColor} flex items-center gap-1.5`}>
                                <span className={`w-2 h-2 rounded-full ${data.sentimentColor.replace('text-', 'bg-')}`} />
                                {data.sentiment}
                            </dd>

                            <dt className="text-gray-500 font-medium">Topic Category</dt>
                            <dd className="font-semibold text-gray-900">{data.topic}</dd>
                        </dl>
                    </div>

                    {/* Conversation Briefing */}
                    <div className={`transition-all duration-500 delay-200 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3">
                            Conversation Briefing
                        </h4>
                        <div className={`bg-blue-50 border-l-4 ${data.headerAccent} p-3 sm:p-4 rounded-r-md min-h-[80px]`}>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {briefingText}
                                {!briefingComplete && (
                                    <span className="inline-block w-0.5 h-4 bg-gray-600 ml-0.5 animate-pulse" />
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Recommended Action */}
                    <div className={`transition-all duration-500 delay-300 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-sm font-medium">Recommended Action</span>
                            <span className={`font-bold ${data.actionColor} text-sm flex items-center gap-2`}>
                                <BoltIcon className="w-4 h-4" />
                                {data.action}
                            </span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className={`
            border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-50/50
            transition-all duration-500 delay-500 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}>
                        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                            Open Live Chat
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-3 font-mono">
                            Link ID: {data.type === 'urgency' ? '8a3f2e91c7b4d' : '6949a5aa90f240ff69275b59'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-800 px-4 py-3 text-center border-t border-gray-700">
                    <p className="text-[10px] text-gray-400">
                        © 2025 • Automatically generated notification
                    </p>
                </div>
            </div>
        </div>
    );
}

// Main Showcase Component
export function AnimatedEmailShowcase() {
    return (
        <section
            id="email-intelligence"
            className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
            aria-labelledby="email-showcase-title"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-1/4 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header with Mental Triggers */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                    {/* Authority Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 animate-pulse">
                        <SparklesIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-400">⚡ Real-Time AI Intelligence</span>
                    </div>

                    {/* Main Headline - Urgency + Benefit */}
                    <h2
                        id="email-showcase-title"
                        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6"
                    >
                        Stop Losing Leads<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            {' '}While You Sleep
                        </span>
                    </h2>

                    {/* Subheadline - Pain Point + Solution */}
                    <h3 className="text-lg sm:text-xl text-gray-300 font-medium mb-4 max-w-xl mx-auto">
                        Your AI assistant monitors every conversation 24/7 and sends you
                        <span className="text-white font-bold"> instant briefings</span>—so you can act
                        <span className="text-green-400 font-bold"> before your competitors even wake up.</span>
                    </h3>

                    {/* Description with Mental Triggers */}
                    <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
                        Whether it's a{' '}
                        <span className="text-red-400 font-semibold">🚨 critical emergency</span> requiring immediate escalation, or a{' '}
                        <span className="text-green-400 font-semibold">💰 golden sales opportunity</span> ready to close—
                        you'll receive a complete email briefing with{' '}
                        <span className="text-white font-medium">sentiment analysis</span>,{' '}
                        <span className="text-white font-medium">context summary</span>, and{' '}
                        <span className="text-white font-medium">recommended next action</span>.
                    </p>

                    {/* Social Proof Micro-Element */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <span className="flex -space-x-2">
                            {['🟢', '🟢', '🟢'].map((dot, i) => (
                                <span key={i} className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                            ))}
                        </span>
                        <span>Trusted by teams who can't afford to miss a lead</span>
                    </div>
                </div>

                {/* Email Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Opportunity Email (Left) */}
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                                Opportunity Detected
                            </span>
                        </div>
                        <AnimatedEmailCard data={emailScenarios.opportunity} animationDelay={0} />
                    </div>

                    {/* Urgency Email (Right) */}
                    <div className="flex flex-col">
                        <div className="mb-4 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                            <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                                Urgency Alert
                            </span>
                        </div>
                        <AnimatedEmailCard data={emailScenarios.urgency} animationDelay={300} />
                    </div>
                </div>

                {/* Bottom CTA Section - Mental Triggers */}
                <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        {/* Trust Signal */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold text-sm">Never Miss a Lead</p>
                                <p className="text-gray-400 text-xs">AI monitors 24/7</p>
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-12 bg-white/20" />

                        {/* Urgency Signal */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <BoltIcon className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold text-sm">Instant Escalation</p>
                                <p className="text-gray-400 text-xs">Critical issues = fast alerts</p>
                            </div>
                        </div>

                        <div className="hidden sm:block w-px h-12 bg-white/20" />

                        {/* FOMO Signal */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold text-sm">Works While You Sleep</p>
                                <p className="text-gray-400 text-xs">Close deals faster</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
