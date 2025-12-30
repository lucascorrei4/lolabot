import { MetadataRoute } from 'next';
import { getAllSlugs, blogCategories } from '../lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://bizaigpt.com';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/compare/bizai-agent-vs-intercom`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Blog categories
    const categoryPages: MetadataRoute.Sitemap = blogCategories.map((category) => ({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Blog posts from MongoDB
    let postPages: MetadataRoute.Sitemap = [];
    try {
        const slugs = await getAllSlugs();
        postPages = slugs.map((slug) => ({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Error fetching blog slugs for sitemap:', error);
    }

    return [...staticPages, ...categoryPages, ...postPages];
}
