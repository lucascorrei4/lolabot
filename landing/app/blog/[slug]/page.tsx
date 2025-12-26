'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPostBySlug, getRelatedPosts, blogCategories, BlogPost, formatDate } from '../../../lib/blog-data';

// Reading progress bar component
function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const readProgress = (scrollTop / docHeight) * 100;
            setProgress(Math.min(100, Math.max(0, readProgress)));
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-800/50">
            <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

// Table of Contents component
function TableOfContents({ content }: { content: string }) {
    const [activeId, setActiveId] = useState('');
    const headings = content.match(/^##\s+(.+)$/gm)?.map(h => {
        const text = h.replace(/^##\s+/, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { text, id };
    }) || [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 3) return null;

    return (
        <nav className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 max-w-[200px]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                On this page
            </p>
            <ul className="space-y-2">
                {headings.map(({ text, id }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className={`text-sm transition-all duration-200 block py-1 border-l-2 pl-3 ${activeId === id
                                ? 'text-indigo-400 border-indigo-400 font-medium'
                                : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
                                }`}
                        >
                            {text.length > 30 ? text.slice(0, 30) + '...' : text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// Share buttons component
function ShareButtons({ title, slug }: { title: string; slug: string }) {
    const url = `https://bizaigpt.com/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Share</span>
            <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Share on Twitter"
            >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Share on LinkedIn"
            >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            </a>
            <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                aria-label="Copy link"
            >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
    );
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            const resolvedParams = await params;
            const fetchedPost = await getPostBySlug(resolvedParams.slug);
            if (fetchedPost) {
                setPost(fetchedPost);
                const related = await getRelatedPosts(resolvedParams.slug);
                setRelatedPosts(related);
            }
            setLoading(false);
        }
        loadPost();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    const category = blogCategories.find(c => c.slug === post.category);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
            <ReadingProgress />
            <TableOfContents content={post.content} />

            {/* Floating Navigation */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gray-900/80 backdrop-blur-xl rounded-full border border-gray-800/50 shadow-2xl">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        LolaBot
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
                        <Link href="/blog" className="text-white font-medium">Blog</Link>
                        <Link href="/#pricing" className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-500 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in">
                        <Link href="/blog" className="hover:text-indigo-400 transition">Blog</Link>
                        <span className="text-gray-700">/</span>
                        <Link href={`/blog/category/${post.category}`} className="hover:text-indigo-400 transition">
                            {category?.name || post.category}
                        </Link>
                    </div>

                    {/* Category & Reading Time */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href={`/blog/category/${post.category}`}
                            className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium hover:bg-indigo-500/20 transition"
                        >
                            {category?.name || post.category}
                        </Link>
                        <span className="text-gray-500 text-sm flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.readingTime} min read
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
                        {post.description}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-gray-800/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold ring-4 ring-gray-900">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-semibold">{post.author.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {post.author.role} · {formatDate(post.publishedAt)}
                                </p>
                            </div>
                        </div>
                        <ShareButtons title={post.title} slug={post.slug} />
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <article className="px-4 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />
                    <style jsx global>{`
                        .article-content {
                            font-size: 1.125rem;
                            line-height: 1.9;
                            color: #d1d5db;
                        }
                        
                        .article-content h2 {
                            font-size: 1.875rem;
                            font-weight: 700;
                            color: white;
                            margin-top: 3.5rem;
                            margin-bottom: 1.5rem;
                            letter-spacing: -0.025em;
                            scroll-margin-top: 6rem;
                        }
                        
                        .article-content h3 {
                            font-size: 1.375rem;
                            font-weight: 600;
                            color: white;
                            margin-top: 2.5rem;
                            margin-bottom: 1rem;
                        }
                        
                        .article-content h4 {
                            font-size: 1.125rem;
                            font-weight: 600;
                            color: #a5b4fc;
                            margin-top: 2rem;
                            margin-bottom: 0.75rem;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        
                        .article-content p {
                            margin-bottom: 1.75rem;
                            color: #d1d5db;
                        }
                        
                        .article-content strong {
                            color: white;
                            font-weight: 600;
                        }
                        
                        .article-content a {
                            color: #818cf8;
                            text-decoration: none;
                            font-weight: 500;
                            transition: color 0.2s;
                        }
                        
                        .article-content a:hover {
                            color: #a5b4fc;
                        }
                        
                        .article-content ul {
                            margin: 2rem 0;
                            padding-left: 0;
                            list-style: none;
                        }
                        
                        .article-content ul li {
                            position: relative;
                            padding-left: 2rem;
                            margin-bottom: 1rem;
                            color: #d1d5db;
                        }
                        
                        .article-content ul li::before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: 0.65rem;
                            width: 8px;
                            height: 8px;
                            background: linear-gradient(135deg, #6366f1, #a855f7);
                            border-radius: 50%;
                        }
                        
                        .article-content ol {
                            margin: 2rem 0;
                            padding-left: 0;
                            list-style: none;
                            counter-reset: item;
                        }
                        
                        .article-content ol li {
                            position: relative;
                            padding-left: 3rem;
                            margin-bottom: 1.5rem;
                            color: #d1d5db;
                            counter-increment: item;
                        }
                        
                        .article-content ol li::before {
                            content: counter(item);
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 2rem;
                            height: 2rem;
                            background: linear-gradient(135deg, #6366f1, #a855f7);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.875rem;
                            font-weight: 600;
                            color: white;
                        }
                        
                        .article-content blockquote {
                            margin: 2.5rem 0;
                            padding: 1.5rem 2rem;
                            background: rgba(99, 102, 241, 0.1);
                            border-left: 4px solid #6366f1;
                            border-radius: 0 1rem 1rem 0;
                        }
                        
                        .article-content blockquote p {
                            margin: 0;
                            font-style: italic;
                            color: #e5e7eb;
                        }
                        
                        .article-content code {
                            background: #1f2937;
                            color: #a5b4fc;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.375rem;
                            font-size: 0.875rem;
                        }
                        
                        .article-content pre {
                            background: #0f172a;
                            border: 1px solid #1e293b;
                            border-radius: 1rem;
                            padding: 1.5rem;
                            overflow-x: auto;
                            margin: 2rem 0;
                        }
                        
                        .article-content table {
                            width: 100%;
                            margin: 2rem 0;
                            border-collapse: collapse;
                            border-radius: 1rem;
                            overflow: hidden;
                        }
                        
                        .article-content th {
                            background: rgba(31, 41, 55, 0.5);
                            color: white;
                            font-weight: 600;
                            text-align: left;
                            padding: 1rem;
                        }
                        
                        .article-content td {
                            padding: 1rem;
                            border-bottom: 1px solid #1f2937;
                            color: #d1d5db;
                        }
                        
                        .article-content hr {
                            border: none;
                            height: 1px;
                            background: #374151;
                            margin: 3rem 0;
                        }
                        
                        .article-content img {
                            border-radius: 1rem;
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                            margin: 2rem 0;
                        }
                    `}</style>
                </div>
            </article>

            {/* Tags */}
            <section className="px-4 pb-16">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-full text-sm hover:bg-gray-800 transition cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Author Bio Card */}
            <section className="px-4 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800/50">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Written by {post.author.name}</h3>
                                <p className="text-indigo-400 text-sm mb-3">{post.author.role}</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Building LolaBot to help businesses convert more visitors into customers with AI-powered conversations.
                                    Passionate about automation, lead generation, and creating delightful user experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="px-4 py-20 border-t border-gray-800/50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-10 text-center">Continue Reading</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost: BlogPost) => (
                                <Link
                                    key={relatedPost.slug}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group p-6 bg-gray-800/30 rounded-2xl border border-gray-800/50 hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-300"
                                >
                                    <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">
                                        {blogCategories.find(c => c.slug === relatedPost.category)?.name}
                                    </span>
                                    <h3 className="text-lg font-semibold text-white mt-3 mb-2 group-hover:text-indigo-400 transition line-clamp-2">
                                        {relatedPost.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {relatedPost.description}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-500 mt-4 group-hover:text-indigo-400 transition">
                                        Read article
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter CTA */}
            <section className="px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/10 rounded-[2rem] border border-indigo-500/20 relative overflow-hidden">
                        {/* Glow effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to convert more visitors?
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                                Join thousands of businesses using LolaBot to capture leads and provide 24/7 support.
                            </p>
                            <Link
                                href="/#pricing"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition shadow-xl shadow-white/10"
                            >
                                Start Free Trial
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800/50 py-12 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            LolaBot
                        </span>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-500 text-sm">AI-powered sales chatbot</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-gray-500">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <Link href="/blog" className="hover:text-white transition">Blog</Link>
                        <Link href="/#pricing" className="hover:text-white transition">Pricing</Link>
                    </div>
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} LolaBot
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Enhanced markdown content formatter
function formatContent(content: string): string {
    // First, normalize line endings
    let html = content.replace(/\r\n/g, '\n');

    // Remove H1 headings (title is already shown in header)
    html = html.replace(/^# .+$/gm, '');

    // Process headings from most specific to least (H4 before H3 before H2)
    // This prevents ### from partially matching ####

    // H4 headings
    html = html.replace(/^#### (.+)$/gm, '\n<h4>$1</h4>\n');

    // H3 headings
    html = html.replace(/^### (.+)$/gm, '\n<h3>$1</h3>\n');

    // Add IDs to H2 headings for TOC navigation
    html = html.replace(/^## (.+)$/gm, (_, title) => {
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        return `\n<h2 id="${id}">${title}</h2>\n`;
    });

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic (but not bold)
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    // Numbered lists (1. 2. 3. etc) - handle as ordered list
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<oli>$2</oli>');

    // Unordered lists (- items)
    html = html.replace(/^[-•]\s+(.+)$/gm, '<uli>$1</uli>');

    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(Boolean);
        if (match.includes('---') || match.includes(':--')) return '';
        const isHeader = cells.some(c => c.trim().startsWith('**'));
        const tag = isHeader ? 'th' : 'td';
        return '<tr>' + cells.map(cell => {
            const content = cell.trim().replace(/^\*\*|\*\*$/g, '');
            return `<${tag}>${content}</${tag}>`;
        }).join('') + '</tr>';
    });

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr />');

    // Process paragraphs - split by double newlines
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        block = block.trim();
        if (!block) return '';

        // Skip if already wrapped in HTML tags
        if (block.startsWith('<h') ||
            block.startsWith('<blockquote') ||
            block.startsWith('<hr') ||
            block.startsWith('<table') ||
            block.startsWith('<tr') ||
            block.startsWith('<ul') ||
            block.startsWith('<ol') ||
            block.startsWith('<uli') ||
            block.startsWith('<oli')) {
            return block;
        }

        // Wrap in paragraph
        return `<p>${block}</p>`;
    }).join('\n\n');

    // Convert uli markers to proper unordered list
    html = html.replace(/(<uli>.*?<\/uli>\n*)+/gs, (match) => {
        const items = match.replace(/<\/?uli>/g, '').split('\n').filter(Boolean);
        return '<ul>\n' + items.map(item => `  <li>${item.trim()}</li>`).join('\n') + '\n</ul>';
    });

    // Convert oli markers to proper ordered list
    html = html.replace(/(<oli>.*?<\/oli>\n*)+/gs, (match) => {
        const items = match.replace(/<\/?oli>/g, '').split('\n').filter(Boolean);
        return '<ol>\n' + items.map(item => `  <li>${item.trim()}</li>`).join('\n') + '\n</ol>';
    });

    // Wrap consecutive table rows
    html = html.replace(/(<tr>.*?<\/tr>\n*)+/gs, (match) => {
        return '<table><tbody>\n' + match + '</tbody></table>';
    });

    // Clean up empty paragraphs and fix nested tags
    html = html
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p>\s*(<h[23])/g, '$1')
        .replace(/(<\/h[23]>)\s*<\/p>/g, '$1')
        .replace(/<p>\s*(<ul|<ol)/g, '$1')
        .replace(/(<\/ul>|<\/ol>)\s*<\/p>/g, '$1')
        .replace(/<p>\s*<hr\s*\/>\s*<\/p>/g, '<hr />')
        .replace(/<p>\s*(<blockquote)/g, '$1')
        .replace(/(<\/blockquote>)\s*<\/p>/g, '$1')
        .replace(/<p>\s*(<table)/g, '$1')
        .replace(/(<\/table>)\s*<\/p>/g, '$1');

    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\s*<blockquote>/g, '');

    return html;
}

