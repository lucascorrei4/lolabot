import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug, getRelatedBlogPosts } from "../../../../../lib/db/mongo";

// CORS headers for cross-origin requests from the landing page
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * OPTIONS /api/blog/posts/[slug]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/blog/posts/[slug]
 * 
 * Get a single blog post by slug
 * 
 * Query params:
 * - related: boolean - If true, also include related posts
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const includeRelated = searchParams.get('related') === 'true';

        const post = await getBlogPostBySlug(slug);

        if (!post) {
            return NextResponse.json({
                success: false,
                error: "Post not found",
            }, { status: 404, headers: corsHeaders });
        }

        // Optionally include related posts
        let relatedPosts: any[] = [];
        if (includeRelated) {
            relatedPosts = await getRelatedBlogPosts(slug, 3);
        }

        return NextResponse.json({
            success: true,
            data: post,
            related: includeRelated ? relatedPosts : undefined,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch blog post",
        }, { status: 500, headers: corsHeaders });
    }
}
