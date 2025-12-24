import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getFeaturedPosts, blogCategories, BlogPost, BlogCategory, formatDate } from '../../lib/blog-data';

export const metadata: Metadata = {
    title: 'Blog - AI Chatbot Insights & Lead Generation Tips',
    description: 'Expert insights on AI chatbots, lead generation, customer support automation, and business growth strategies. Learn from real-world case studies.',
    openGraph: {
        title: 'LolaBot Blog - AI Chatbot & Lead Generation Insights',
        description: 'Expert insights on AI chatbots, lead generation, and customer support automation.',
        type: 'website',
    },
    alternates: {
        canonical: 'https://bizaigpt.com/blog',
    },
};

// Force dynamic rendering to always fetch fresh data from MongoDB
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const allPosts = await getAllPosts();
    const featuredPosts = await getFeaturedPosts();

    return (
        <div className="min-h-screen bg-gray-900">
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
                            <Link href="/blog" className="text-indigo-400 font-medium">
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

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        The LolaBot Blog
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Expert insights on AI chatbots, lead generation, and customer support automation.
                        Learn how to grow your business with intelligent automation.
                    </p>
                </div>
            </header>

            {/* Categories */}
            <section className="px-4 pb-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        {blogCategories.map((category: BlogCategory) => (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm font-medium hover:bg-gray-700 hover:text-white transition"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Featured Articles</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {featuredPosts.map((post: BlogPost) => (
                                <article
                                    key={post.slug}
                                    className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium uppercase">
                                            Featured
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {post.readingTime} min read
                                        </span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 mb-4 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {post.author.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{post.author.name}</p>
                                                <p className="text-gray-500 text-xs">{formatDate(post.publishedAt)}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-indigo-400 text-sm font-medium hover:text-indigo-300"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">All Articles</h2>
                    {allPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No articles yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allPosts.map((post: BlogPost) => (
                                <article
                                    key={post.slug}
                                    className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                                            {blogCategories.find((c: BlogCategory) => c.slug === post.category)?.name || post.category}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {post.readingTime} min
                                        </span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-indigo-400 font-medium hover:text-indigo-300"
                                        >
                                            Read →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 border border-indigo-500/30">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Transform Your Website?
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Join thousands of businesses using LolaBot to convert more visitors into customers.
                        </p>
                        <Link
                            href="/#pricing"
                            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25"
                        >
                            Start Free Trial
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
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
                        <Link href="/#pricing" className="text-gray-400 hover:text-white text-sm transition">
                            Pricing
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
