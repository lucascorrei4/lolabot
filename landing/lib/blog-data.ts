/**
 * Blog data client for the landing page
 * 
 * Fetches blog posts from the main BizAI Agent API (/api/blog/*)
 * This avoids MongoDB connection issues with Turbopack on Windows.
 */

// Blog post type
export interface BlogPost {
    _id?: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    publishedAt: Date | string;
    updatedAt?: Date | string;
    author: {
        name: string;
        role?: string;
        avatar?: string;
    };
    category: 'ai-automation' | 'lead-generation' | 'customer-support' | 'case-studies' | 'product-updates';
    tags: string[];
    readingTime: number;
    featured?: boolean;
    image?: string;
    status: 'draft' | 'published' | 'archived';
    seo?: {
        targetKeyword?: string;
        metaTitle?: string;
        metaDescription?: string;
        canonicalUrl?: string;
    };
    createdAt: Date | string;
}

export interface BlogCategory {
    name: string;
    slug: string;
    description: string;
}

// Blog categories (static, for UI)
export const blogCategories: BlogCategory[] = [
    {
        name: 'AI & Automation',
        slug: 'ai-automation',
        description: 'Learn about AI chatbots, automation, and how they transform business operations.',
    },
    {
        name: 'Lead Generation',
        slug: 'lead-generation',
        description: 'Strategies and tools for generating more qualified leads for your business.',
    },
    {
        name: 'Customer Support',
        slug: 'customer-support',
        description: 'Best practices for providing exceptional customer support with AI.',
    },
    {
        name: 'Case Studies',
        slug: 'case-studies',
        description: 'Real-world success stories from businesses using BizAI Agent.',
    },
    {
        name: 'Product Updates',
        slug: 'product-updates',
        description: 'Latest features and improvements to the BizAI Agent platform.',
    },
];

// API base URL - uses the main BizAI Agent app
const API_BASE = process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'http://localhost:3000';

// Static fallback posts for development/build when API is unavailable
const staticPosts: BlogPost[] = [
    {
        slug: 'ai-chatbot-for-website-complete-guide-2024',
        title: 'AI Chatbot for Website: The Complete Guide for 2024',
        description: 'Learn how to implement an AI chatbot on your website. Discover best practices and maximize ROI.',
        content: `## What is an AI Chatbot?\n\nAn AI chatbot uses natural language processing to understand and respond to queries...\n\n[Full content available from API]`,
        publishedAt: '2025-12-20',
        author: { name: 'Lucas Correia', role: 'Founder, BizAI Agent' },
        category: 'ai-automation',
        tags: ['ai chatbot', 'website chatbot', 'customer support'],
        readingTime: 8,
        featured: true,
        status: 'published',
        createdAt: '2025-12-20',
    },
    {
        slug: 'lead-generation-chatbot-increase-conversions',
        title: 'Lead Generation Chatbot: How to Increase Conversions by 45%',
        description: 'Discover how lead generation chatbots work and capture more qualified leads.',
        content: `## What is a Lead Generation Chatbot?\n\nA lead generation chatbot engages visitors in real-time...\n\n[Full content available from API]`,
        publishedAt: '2025-12-18',
        author: { name: 'Lucas Correia', role: 'Founder, BizAI Agent' },
        category: 'lead-generation',
        tags: ['lead generation', 'chatbot', 'conversion'],
        readingTime: 6,
        featured: true,
        status: 'published',
        createdAt: '2025-12-18',
    },
];

// ============================================
// Blog Post Query Functions (API-based)
// ============================================

/**
 * Get all published blog posts
 */
export async function getAllPosts(limit = 50): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/posts?limit=${limit}&sort=createdAt:desc`, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        return data.success ? data.data : staticPosts;
    } catch (error) {
        console.error('Error fetching posts from API:', error);
        return staticPosts;
    }
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/posts/${slug}?related=true`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            if (res.status === 404) return staticPosts.find(p => p.slug === slug) || null;
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching post from API:', error);
        return staticPosts.find(p => p.slug === slug) || null;
    }
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(limit = 2): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/posts?featured=true&limit=${limit}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        return data.success ? data.data : staticPosts.filter(p => p.featured).slice(0, limit);
    } catch (error) {
        console.error('Error fetching featured posts from API:', error);
        return staticPosts.filter(p => p.featured).slice(0, limit);
    }
}

/**
 * Get blog posts by category
 */
export async function getPostsByCategory(category: string, limit = 20): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/category/${category}?limit=${limit}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        return data.success ? data.data : staticPosts.filter(p => p.category === category).slice(0, limit);
    } catch (error) {
        console.error('Error fetching posts by category from API:', error);
        return staticPosts.filter(p => p.category === category).slice(0, limit);
    }
}

/**
 * Get all blog post slugs (for sitemap generation)
 */
export async function getAllSlugs(): Promise<string[]> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/posts?slugs=true`, {
            next: { revalidate: 300 }, // Cache longer for sitemap
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        return data.success ? data.data : staticPosts.map(p => p.slug);
    } catch (error) {
        console.error('Error fetching slugs from API:', error);
        return staticPosts.map(p => p.slug);
    }
}

/**
 * Get related posts
 */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    try {
        const res = await fetch(`${API_BASE}/api/blog/posts/${slug}?related=true`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        return data.success && data.related ? data.related.slice(0, limit) : [];
    } catch (error) {
        console.error('Error fetching related posts from API:', error);
        const currentPost = staticPosts.find(p => p.slug === slug);
        if (!currentPost) return [];
        return staticPosts
            .filter(p => p.category === currentPost.category && p.slug !== slug)
            .slice(0, limit);
    }
}

/**
 * Format date for display with time in New York timezone
 * Example output: "December 25, 2025 at 8:35 PM EST"
 */
export function formatDate(date: Date | string, includeTime = true): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/New_York',
    };

    if (includeTime) {
        options.hour = 'numeric';
        options.minute = '2-digit';
        options.hour12 = true;
        options.timeZoneName = 'short';
    }

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(d);

    if (includeTime) {
        // Build: "December 25, 2025 at 8:35 PM EST"
        const month = parts.find(p => p.type === 'month')?.value || '';
        const day = parts.find(p => p.type === 'day')?.value || '';
        const year = parts.find(p => p.type === 'year')?.value || '';
        const hour = parts.find(p => p.type === 'hour')?.value || '';
        const minute = parts.find(p => p.type === 'minute')?.value || '';
        const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value || '';
        const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value || '';

        return `${month} ${day}, ${year} at ${hour}:${minute} ${dayPeriod} ${timeZoneName}`;
    }

    // Date only: "December 25, 2025"
    return formatter.format(d);
}

/**
 * Format date for display (short format, date only)
 * Example output: "Dec 25, 2025"
 */
export function formatDateShort(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/New_York',
    }).format(d);
}
