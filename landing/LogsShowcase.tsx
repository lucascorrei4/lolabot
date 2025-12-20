'use client';
import React, { useEffect, useState } from 'react';

// Mock data for the logs list
const LOGS_DATA = [
    { id: '6945dd90ae71ac2a1fcc7564', user: 'Visitor #4092', date: 'Dec 19, 2025', time: '5:25 PM' },
    { id: '6944a67c153c9bcd2e92ad78', user: 'Visitor #3821', date: 'Dec 18, 2025', time: '7:13 PM' },
    { id: '6944a5d7153c9bcd2e92ad72', user: 'Visitor #3815', date: 'Dec 18, 2025', time: '7:10 PM' },
    { id: '6944a3c1153c9bcd2e92ad6c', user: 'Visitor #3801', date: 'Dec 18, 2025', time: '7:01 PM' },
    { id: '6944a00e153c9bcd2e92ad67', user: 'Visitor #3788', date: 'Dec 18, 2025', time: '6:55 PM' },
    { id: '69448c549c51dbae1bc4ed0', user: 'Visitor #3750', date: 'Dec 18, 2025', time: '6:30 PM' },
];

export const LogsShowcase: React.FC = () => {
    const [step, setStep] = useState(0);
    // 0 = Showing List, 1 = Clicking Item, 2 = Showing Detail, 3 = Clicking Back

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3500); // Transition every 3.5s
        return () => clearInterval(interval);
    }, []);

    // Derived state for smoother animations
    const showDetail = step === 2 || step === 3;
    const isClickingItem = step === 1;

    return (
        <section className="bg-gray-900 py-16 sm:py-24 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-16">
                    <h2 className="text-base font-semibold leading-7 text-indigo-400">Total Visibility</h2>
                    <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Audit Every Conversation
                    </p>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-300">
                        Never guess what your users are asking. Search, filter, and review full chat transcripts to improve your agent perfectly.
                    </p>
                </div>

                <div className="relative mx-auto max-w-5xl bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden min-h-[500px] sm:min-h-[600px] flex flex-col font-sans">

                    {/* TOP BAR - Always Visible but content changes */}
                    <div className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 p-3 sm:p-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center z-10">
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                                {showDetail ? 'Conversation History' : 'Chat Logs'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 truncate">
                                {showDetail ? 'Session ID: 694454e3079f894334f38b38 • User: Visitor #4092' : 'Acme Corp Portal'}
                            </p>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                            {!showDetail ? (
                                <>
                                    <div className="relative flex-1 sm:flex-none">
                                        <input
                                            type="text"
                                            placeholder="Search by User ID..."
                                            className="bg-gray-900 border border-gray-600 rounded-md py-2 pl-8 sm:pl-10 pr-2 sm:pr-4 text-xs sm:text-sm text-gray-300 w-full sm:w-48 lg:w-64 focus:outline-none focus:border-indigo-500"
                                            readOnly
                                        />
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 absolute left-2.5 sm:left-3 top-2.5 sm:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <button className="hidden sm:block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Back to Home
                                    </button>
                                </>
                            ) : (
                                <button className={`bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${step === 3 ? 'scale-95 bg-gray-600' : ''}`}>
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                    Back to Logs
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="relative flex-1 bg-gray-900 p-3 sm:p-6 overflow-hidden">

                        {/* LIST VIEW */}
                        <div className={`absolute inset-0 p-3 sm:p-6 transition-all duration-500 transform ${showDetail ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                            {/* Filters */}
                            <div className="bg-gray-800/40 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-700/50 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From Date</label>
                                    <div className="relative">
                                        <input type="text" value="mm/dd/yyyy" readOnly className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-gray-400 text-xs sm:text-sm" />
                                        <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To Date</label>
                                    <div className="relative">
                                        <input type="text" value="mm/dd/yyyy" readOnly className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-gray-400 text-xs sm:text-sm" />
                                        <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 rounded text-sm font-medium">Filter</button>
                            </div>

                            <p className="text-xs text-green-400 font-medium mb-3 sm:mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Found 16 sessions
                            </p>

                            <div className="space-y-0 border-t border-gray-700">
                                {LOGS_DATA.map((log, idx) => (
                                    <div
                                        key={log.id}
                                        className={`group py-3 sm:py-4 px-2 sm:px-4 border-b border-gray-800 flex justify-between items-center cursor-pointer transition-all duration-200 
                                            ${idx === 0 && isClickingItem ? 'bg-gray-800 scale-[0.99] border-l-4 border-l-blue-500' : 'hover:bg-gray-800/50'}
                                        `}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-white font-medium text-xs sm:text-sm group-hover:text-blue-400 transition-colors">{log.user}</h4>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-mono truncate">{log.id}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            <p className="text-[10px] sm:text-xs text-gray-400">{log.date}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cursor Simulation for Click */}
                            <div
                                className={`absolute top-[280px] left-[200px] w-8 h-8 pointer-events-none transition-opacity duration-300 ${isClickingItem ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <svg className="w-full h-full text-white/80 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M5.5 3.21l10.08 15.66c.22.34.02.82-.38.86l-2.45.24-2.86 6.54c-.16.37-.6.53-.96.37l-1.39-.61c-.37-.16-.53-.6-.37-.96l2.85-6.52-3.17.31c-.4.04-.68-.38-.49-.75L5.5 3.21z" />
                                </svg>
                                {isClickingItem && (
                                    <span className="absolute -top-2 -left-2 w-12 h-12 bg-white/30 rounded-full animate-ping"></span>
                                )}
                            </div>
                        </div>

                        {/* DETAIL VIEW */}
                        <div className={`absolute inset-0 p-3 sm:p-6 overflow-y-auto transition-all duration-500 transform ${showDetail ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                            <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pt-2 sm:pt-4">
                                {/* Message 1: User */}
                                <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                    <div className="max-w-[85%] sm:max-w-[80%]">
                                        <div className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-lg">
                                            What is the status of my order?
                                        </div>
                                        <p className="text-[10px] text-gray-500 text-right mt-1 mr-1">02:28 PM</p>
                                    </div>
                                </div>

                                {/* Message 2: Bot */}
                                <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                    <div className="max-w-[85%] sm:max-w-[80%]">
                                        <div className="bg-gray-800 border border-gray-700 text-gray-200 p-2.5 sm:p-3 rounded-2xl rounded-tl-sm text-xs sm:text-sm shadow-sm">
                                            Hello! I'm the ACME virtual assistant. I'm here to help you check your order status, rewards, and benefits!
                                        </div>
                                        <p className="text-[10px] text-gray-500 ml-1 mt-1">02:28 PM</p>
                                    </div>
                                </div>

                                {/* Message 3: Bot */}
                                <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                                    <div className="max-w-[85%] sm:max-w-[80%]">
                                        <div className="bg-gray-800 border border-gray-700 text-gray-200 p-2.5 sm:p-3 rounded-2xl rounded-tl-sm text-xs sm:text-sm shadow-sm">
                                            To check your order, I need your Order ID or Email. Please reply with your Order ID (e.g., #12345) or registered Email.
                                        </div>
                                        <p className="text-[10px] text-gray-500 ml-1 mt-1">02:28 PM</p>
                                    </div>
                                </div>

                                {/* Message 4: User (Latest) */}
                                <div className={`flex justify-end transform transition-all duration-500 ${showDetail ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
                                    <div className="max-w-[85%] sm:max-w-[80%]">
                                        <div className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-lg">
                                            My Order ID is #98210
                                        </div>
                                        <p className="text-[10px] text-gray-500 text-right mt-1 mr-1">02:29 PM</p>
                                    </div>
                                </div>

                                {/* Message 5: Bot (Typing then appear) */}
                                <div className={`flex justify-start transform transition-all duration-500 ${showDetail ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '2000ms' }}>
                                    <div className="max-w-[85%] sm:max-w-[80%]">
                                        <div className="bg-gray-800 border border-gray-700 text-gray-200 p-2.5 sm:p-3 rounded-2xl rounded-tl-sm text-xs sm:text-sm shadow-sm">
                                            Thanks, Sarah! Your order #98210 has been shipped and is arriving tomorrow.
                                        </div>
                                        <p className="text-[10px] text-gray-500 ml-1 mt-1">02:29 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
