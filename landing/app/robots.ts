import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://bizaigpt.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/_next/',
                    '/admin/',
                    '/private/',
                    '/embed/',
                    '/test-embed.html',
                    '/*.json$',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

