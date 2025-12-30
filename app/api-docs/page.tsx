"use client";

import React, { useState } from 'react';
import {
    ClipboardDocumentCheckIcon,
    ClipboardDocumentIcon,
    ServerIcon
} from '@heroicons/react/24/outline';

interface EndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    params?: Array<{ name: string; type: string; required: boolean; description: string }>;
    body?: string; // JSON string for body example
    response?: string; // JSON string for response example
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg bg-gray-900 border border-gray-800 overflow-hidden font-mono text-sm">
            {label && (
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-800 text-xs text-gray-400 font-sans font-medium uppercase tracking-wider flex justify-between items-center">
                    {label}
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                        {copied ? <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                    </button>
                </div>
            )}
            <pre className="p-4 overflow-x-auto text-gray-300 scrollbar-thin scrollbar-thumb-gray-700">
                <code>{code}</code>
            </pre>
        </div>
    );
}

function Endpoint({ method, path, description, params, body, response }: EndpointProps) {
    const methodColors = {
        GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        POST: 'bg-green-500/10 text-green-400 border-green-500/20',
        PUT: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 font-mono">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${methodColors[method]}`}>
                        {method}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {path}
                    </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    {params && params.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Parameters</h4>
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                        {params.map((param) => (
                                            <tr key={param.name}>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-mono">{param.name}{param.required && <span className="text-red-400">*</span>}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{param.type}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{param.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {body && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Request Body</h4>
                            <CodeBlock code={body} label="JSON Payload" />
                        </div>
                    )}
                </div>

                <div>
                    {response && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Example Response</h4>
                            <CodeBlock code={response} label="200 OK" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl text-white">
                            <ServerIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Integrate BizAI Agent Intelligence directly into your applications.</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-6">Signals & Intelligence</h2>
                    <Endpoint
                        method="POST"
                        path="/api/signals/[botId]"
                        description="Push intelligence signals (leads, opportunities, risks, alerts) from your AI agent or n8n workflows."
                        params={[
                            { name: "botId", type: "string", required: true, description: "Your bot identifier, e.g. 'my-bot-id'" }
                        ]}
                        body={JSON.stringify({
                            sessionId: "optional-session-id",
                            type: "success",
                            title: "🔥 Hot Lead: Enterprise Inquiry",
                            priority: "High Priority",
                            summaryTitle: "Executive Summary",
                            summaryText: "User asked about SSO integration and team pricing. Strong buying signals detected.",
                            sentimentLabel: "Interested",
                            sentimentScore: "85%",
                            sentimentIcon: "😊",
                            actionLabel: "Recommended Action",
                            actionText: "Schedule demo call immediately",
                            leadScore: 85,
                            estimatedValue: 12000,
                            buyingSignals: ["Asked about pricing", "Requested demo", "Enterprise features"],
                            userDetails: {
                                name: "John Doe",
                                email: "john@example.com",
                                company: "Acme Inc"
                            }
                        }, null, 2)}
                        response={JSON.stringify({
                            success: true,
                            signalId: "654321..."
                        }, null, 2)}
                    />

                    <h2 className="text-xl font-semibold mb-6 pt-8 border-t border-gray-200 dark:border-gray-800">Chat & Messages</h2>
                    <Endpoint
                        method="POST"
                        path="/api/messages"
                        description="Send a message to the bot or user."
                        body={JSON.stringify({
                            sessionId: "session-123",
                            botId: "bizai-agent-demo",
                            role: "user",
                            type: "text",
                            text: "Hello world"
                        }, null, 2)}
                        response={JSON.stringify({
                            success: true,
                            data: { _id: "msg-123", text: "Hello world", ...{} }
                        }, null, 2)}
                    />

                    <Endpoint
                        method="GET"
                        path="/api/messages"
                        description="List messages for a specific session."
                        params={[
                            { name: "sessionId", type: "string", required: true, description: "ID of the chat session" }
                        ]}
                        response={JSON.stringify({
                            messages: [
                                { role: "user", text: "Hi", createdAt: "2023-..." },
                                { role: "bot", text: "Hello! How can I help?", createdAt: "2023-..." }
                            ]
                        }, null, 2)}
                    />

                    <h2 className="text-xl font-semibold mb-6 pt-8 border-t border-gray-200 dark:border-gray-800">Sessions & Logs</h2>
                    <Endpoint
                        method="GET"
                        path="/api/sessions"
                        description="List all chat sessions for a specific bot."
                        params={[
                            { name: "botId", type: "string", required: true, description: "Filter by bot ID" },
                            { name: "limit", type: "number", required: false, description: "Max results (default 20)" },
                            { name: "offset", type: "number", required: false, description: "Pagination offset" }
                        ]}
                        response={JSON.stringify({
                            data: [
                                { _id: "sess-1", lastActivityAt: "...", userId: "user-1" }
                            ]
                        }, null, 2)}
                    />

                    <Endpoint
                        method="GET"
                        path="/api/logs/[botId]/search"
                        description="Search for sessions by user ID or message content."
                        params={[
                            { name: "botId", type: "string", required: true, description: "Bot ID" },
                            { name: "q", type: "string", required: true, description: "Search query string" }
                        ]}
                        response={JSON.stringify({
                            results: [
                                { id: "sess-123", userId: "Alice", lastActivity: "2023-..." }
                            ]
                        }, null, 2)}
                    />

                    <h2 className="text-xl font-semibold mb-6 pt-8 border-t border-gray-200 dark:border-gray-800">Blog API</h2>
                    <Endpoint
                        method="GET"
                        path="/api/blog/posts"
                        description="Get all published blog posts for the landing page."
                        params={[
                            { name: "featured", type: "boolean", required: false, description: "If true, only return featured posts" },
                            { name: "limit", type: "number", required: false, description: "Max posts to return (default 50)" },
                            { name: "slugs", type: "boolean", required: false, description: "If true, only return slugs (for sitemap)" },
                            { name: "stats", type: "boolean", required: false, description: "If true, return post statistics" }
                        ]}
                        response={JSON.stringify({
                            success: true,
                            data: [
                                {
                                    slug: "ai-chatbot-for-website-complete-guide-2024",
                                    title: "AI Chatbot for Website: The Complete Guide",
                                    description: "Learn how to implement an AI chatbot...",
                                    category: "ai-automation",
                                    readingTime: 8,
                                    featured: true,
                                    publishedAt: "2025-12-20T00:00:00Z"
                                }
                            ],
                            count: 1
                        }, null, 2)}
                    />

                    <Endpoint
                        method="GET"
                        path="/api/blog/posts/[slug]"
                        description="Get a single blog post by its URL slug."
                        params={[
                            { name: "slug", type: "string", required: true, description: "The URL slug of the post" },
                            { name: "related", type: "boolean", required: false, description: "If true, include related posts" }
                        ]}
                        response={JSON.stringify({
                            success: true,
                            data: {
                                slug: "ai-chatbot-for-website-complete-guide-2024",
                                title: "AI Chatbot for Website: The Complete Guide",
                                description: "Learn how to implement an AI chatbot...",
                                content: "## Full markdown content here...",
                                author: { name: "Lucas Correia", role: "Founder" },
                                category: "ai-automation",
                                tags: ["ai chatbot", "website"],
                                readingTime: 8,
                                publishedAt: "2025-12-20T00:00:00Z"
                            },
                            related: [
                                { slug: "best-chatbot-for-small-business", title: "..." }
                            ]
                        }, null, 2)}
                    />

                    <Endpoint
                        method="GET"
                        path="/api/blog/category/[category]"
                        description="Get blog posts filtered by category."
                        params={[
                            { name: "category", type: "string", required: true, description: "Category slug: ai-automation, lead-generation, customer-support, case-studies, product-updates" },
                            { name: "limit", type: "number", required: false, description: "Max posts to return (default 20)" }
                        ]}
                        response={JSON.stringify({
                            success: true,
                            data: [
                                { slug: "ai-chatbot-for-website", title: "...", category: "ai-automation" }
                            ],
                            count: 1,
                            category: "ai-automation"
                        }, null, 2)}
                    />
                </div>
            </div>
        </div>
    );
}
