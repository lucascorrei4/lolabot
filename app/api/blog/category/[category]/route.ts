import { NextRequest, NextResponse } from "next/server";
import { getBlogPostsByCategory } from "../../../../../lib/db/mongo";

// CORS headers for cross-origin requests from the landing page
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * OPTIONS /api/blog/category/[category]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/blog/category/[category]
 * 
 * Get blog posts by category
 * 
 * Query params:
 * - limit: number - Max posts to return (default 20)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const { category } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        // Validate category
        const validCategories = ['ai-automation', 'lead-generation', 'customer-support', 'case-studies', 'product-updates'];
        if (!validCategories.includes(category)) {
            return NextResponse.json({
                success: false,
                error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
            }, { status: 400, headers: corsHeaders });
        }

        const posts = await getBlogPostsByCategory(category as any, limit);

        return NextResponse.json({
            success: true,
            data: posts,
            count: posts.length,
            category,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error("Error fetching posts by category:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch posts by category",
        }, { status: 500, headers: corsHeaders });
    }
}
