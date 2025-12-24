import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts, getRelatedPosts, blogCategories, BlogPost } from '../../../lib/blog-data';

// Generate static params for all blog posts
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.title,
        description: post.description,
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt || post.publishedAt,
            authors: [post.author.name],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
        },
        alternates: {
            canonical: `https://bizaigpt.com/blog/${slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug);
    const category = blogCategories.find(c => c.slug === post.category);

    // JSON-LD structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        author: {
            '@type': 'Person',
            name: post.author.name,
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        publisher: {
            '@type': 'Organization',
            name: 'LolaBot',
            logo: {
                '@type': 'ImageObject',
                url: 'https://bizaigpt.com/assets/img/favicon.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://bizaigpt.com/blog/${slug}`,
        },
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-xl font-bold text-white">
                            LolaBot
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition">
                                Home
                            </Link>
                            <Link href="/blog" className="text-gray-300 hover:text-white transition">
                                Blog
                            </Link>
                            <Link
                                href="/#pricing"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Article */}
            <article className="pt-32 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-white transition">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-500 truncate">{post.title}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Link
                                href={`/blog/category/${post.category}`}
                                className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium hover:bg-indigo-500/30 transition"
                            >
                                {category?.name || post.category}
                            </Link>
                            <span className="text-gray-500 text-sm">
                                {post.readingTime} min read
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl text-gray-400 mb-8">
                            {post.description}
                        </p>

                        <div className="flex items-center gap-4 pb-8 border-b border-gray-800">
                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-medium">{post.author.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {post.author.role && `${post.author.role} • `}
                                    Published {post.publishedAt}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none 
                            prose-headings:text-white prose-headings:font-bold
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
                            prose-strong:text-white prose-strong:font-semibold
                            prose-ul:text-gray-300 prose-ol:text-gray-300
                            prose-li:text-gray-300
                            prose-blockquote:border-indigo-500 prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                            prose-code:text-indigo-400 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
                            prose-table:text-gray-300
                            prose-th:text-white prose-th:bg-gray-800 prose-th:px-4 prose-th:py-3
                            prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-800
                        "
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />

                    {/* Tags */}
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="px-4 py-16 border-t border-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <article
                                    key={relatedPost.slug}
                                    className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition"
                                >
                                    <Link href={`/blog/${relatedPost.slug}`}>
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {relatedPost.description}
                                    </p>
                                    <span className="text-gray-500 text-sm">{relatedPost.readingTime} min read</span>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-10 border border-indigo-500/30">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Transform your website with AI-powered lead generation.
                        </p>
                        <Link
                            href="/#pricing"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition"
                        >
                            Start Free Trial →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} LolaBot. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-400 hover:text-white text-sm transition">
                            Home
                        </Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition">
                            Blog
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Simple markdown-like content formatter
function formatContent(content: string): string {
    return content
        // Remove H1 headings (title is already shown in header)
        .replace(/^# .+$/gm, '')
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        // Blockquotes
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Checkboxes
        .replace(/^- \[ \] (.+)$/gm, '<li>☐ $1</li>')
        .replace(/^- \[x\] (.+)$/gm, '<li>☑ $1</li>')
        // Tables (basic)
        .replace(/\|(.+)\|/g, (match) => {
            const cells = match.split('|').filter(Boolean);
            if (match.includes('---')) {
                return '';
            }
            return '<tr>' + cells.map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>';
        })
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/^([^<].+)$/gm, '<p>$1</p>')
        // Clean up
        .replace(/<p><\/p>/g, '')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h(\d)><\/p>/g, '</h$1>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/li><\/p>/g, '</li></ul>')
        .replace(/<\/ul><ul>/g, '')
        .replace(/<p><tr>/g, '<table><tbody><tr>')
        .replace(/<\/tr><\/p>/g, '</tr></tbody></table>')
        .replace(/<\/table><table>/g, '');
}
