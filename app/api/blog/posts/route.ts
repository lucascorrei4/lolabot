import { NextRequest, NextResponse } from "next/server";
import { getPublishedBlogPosts, getFeaturedBlogPosts, getAllBlogSlugs, getBlogPostStats } from "../../../../lib/db/mongo";

// CORS headers for cross-origin requests from the landing page
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * OPTIONS /api/blog/posts
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/blog/posts
 * 
 * Get all published blog posts for the landing page
 * 
 * Query params:
 * - featured: boolean - If true, only return featured posts
 * - limit: number - Max posts to return (default 50)
 * - slugs: boolean - If true, only return slugs (for sitemap)
 * - stats: boolean - If true, return post stats
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';
        const slugsOnly = searchParams.get('slugs') === 'true';
        const stats = searchParams.get('stats') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50', 10);

        // Return stats
        if (stats) {
            const postStats = await getBlogPostStats();
            return NextResponse.json({
                success: true,
                data: postStats,
            }, { headers: corsHeaders });
        }

        // Return slugs only (for sitemap)
        if (slugsOnly) {
            const slugs = await getAllBlogSlugs();
            return NextResponse.json({
                success: true,
                data: slugs,
            }, { headers: corsHeaders });
        }

        // Return featured posts
        if (featured) {
            const posts = await getFeaturedBlogPosts(limit);
            return NextResponse.json({
                success: true,
                data: posts,
                count: posts.length,
            }, { headers: corsHeaders });
        }

        // Return all published posts
        const posts = await getPublishedBlogPosts(limit);
        return NextResponse.json({
            success: true,
            data: posts,
            count: posts.length,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch blog posts",
        }, { status: 500, headers: corsHeaders });
    }
}
