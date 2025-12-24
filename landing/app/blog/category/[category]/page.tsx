import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByCategory, blogCategories, BlogCategory, BlogPost } from '../../../../lib/blog-data';

// Generate static params for all categories
export async function generateStaticParams() {
    return blogCategories.map((category: BlogCategory) => ({
        category: category.slug,
    }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const category = blogCategories.find((c: BlogCategory) => c.slug === categorySlug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.name} - LolaBot Blog`,
        description: category.description,
        openGraph: {
            title: `${category.name} Articles - LolaBot Blog`,
            description: category.description,
            type: 'website',
        },
        alternates: {
            canonical: `https://bizaigpt.com/blog/category/${categorySlug}`,
        },
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params;
    const category = blogCategories.find((c: BlogCategory) => c.slug === categorySlug);

    if (!category) {
        notFound();
    }

    const posts = getPostsByCategory(categorySlug);

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

            {/* Header */}
            <header className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-white transition">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-500">{category.name}</span>
                    </nav>

                    <h1 className="text-4xl font-bold text-white mb-4">
                        {category.name}
                    </h1>
                    <p className="text-xl text-gray-400">
                        {category.description}
                    </p>
                </div>
            </header>

            {/* Category Filter */}
            <section className="px-4 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/blog"
                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm font-medium hover:bg-gray-700 transition"
                        >
                            All
                        </Link>
                        {blogCategories.map((cat: BlogCategory) => (
                            <Link
                                key={cat.slug}
                                href={`/blog/category/${cat.slug}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat.slug === categorySlug
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts */}
            <section className="px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No articles in this category yet.</p>
                            <Link
                                href="/blog"
                                className="inline-block mt-4 text-indigo-400 hover:text-indigo-300"
                            >
                                ← Back to all articles
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {posts.map((post: BlogPost) => (
                                <article
                                    key={post.slug}
                                    className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-gray-500 text-sm">
                                            {post.publishedAt}
                                        </span>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-gray-500 text-sm">
                                            {post.readingTime} min read
                                        </span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`}>
                                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-400 mb-4">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {post.author.name.charAt(0)}
                                            </div>
                                            <span className="text-white text-sm">{post.author.name}</span>
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
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 px-4 mt-16">
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
