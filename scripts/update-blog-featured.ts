/**
 * Update blog posts: fix featured articles and dates
 * 
 * Run with: npx ts-node scripts/update-blog-featured.ts
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "lolabot";

// Best articles based on strategy (high-intent buyer keywords)
const FEATURED_SLUGS = [
    'lead-generation-chatbot-increase-conversions',  // High-intent: lead generation
    'how-to-qualify-leads-automatically-with-ai',    // High-intent: lead qualification
];

async function updateBlogPosts() {
    console.log("🚀 Updating blog posts...\n");

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(MONGODB_DB);
        const collection = db.collection("blogPosts");

        // 1. Remove year-based suffixes from titles
        console.log("\n📝 Removing years from titles...");
        const yearPatterns = [
            { filter: { title: /for 2024/i }, update: { $set: { title: { $replaceOne: { input: "$title", find: " for 2024", replacement: "" } } } } },
            { filter: { title: /in 2024/i }, update: { $set: { title: { $replaceOne: { input: "$title", find: " in 2024", replacement: "" } } } } },
            { filter: { title: /2024/i }, update: { $set: { title: { $replaceOne: { input: "$title", find: " 2024", replacement: "" } } } } },
        ];

        // Use aggregation pipeline for updates
        const postsWithYears = await collection.find({
            $or: [
                { title: /2024/i },
                { title: /2025/i },
                { title: /2026/i },
                { slug: /2024/i },
                { slug: /2025/i },
                { slug: /2026/i },
            ]
        }).toArray();

        console.log(`   Found ${postsWithYears.length} posts with years`);

        for (const post of postsWithYears) {
            const newTitle = post.title
                .replace(/ for 2024/gi, '')
                .replace(/ in 2024/gi, '')
                .replace(/ 2024/gi, '')
                .replace(/ for 2025/gi, '')
                .replace(/ in 2025/gi, '')
                .replace(/ 2025/gi, '')
                .replace(/ for 2026/gi, '')
                .replace(/ in 2026/gi, '')
                .replace(/ 2026/gi, '')
                .replace(/:$/g, '');  // Remove trailing colon if any

            const newSlug = post.slug
                .replace(/-2024/gi, '')
                .replace(/-2025/gi, '')
                .replace(/-2026/gi, '');

            if (newTitle !== post.title || newSlug !== post.slug) {
                console.log(`   Updating: "${post.title}" → "${newTitle}"`);
                await collection.updateOne(
                    { _id: post._id },
                    { $set: { title: newTitle, slug: newSlug, updatedAt: new Date() } }
                );
            }
        }

        // 2. Reset all featured flags to false
        console.log("\n📝 Resetting featured flags...");
        await collection.updateMany({}, { $set: { featured: false } });

        // 3. Set featured flag on strategic articles
        console.log("\n⭐ Setting featured articles...");
        const featuredResult = await collection.updateMany(
            { slug: { $in: FEATURED_SLUGS } },
            { $set: { featured: true, updatedAt: new Date() } }
        );
        console.log(`   Updated ${featuredResult.modifiedCount} featured articles`);

        // 4. Update dates to be more recent (spread across last 30 days)
        console.log("\n📅 Updating publish dates...");
        const allPosts = await collection.find({}).sort({ publishedAt: 1 }).toArray();
        const now = new Date();

        for (let i = 0; i < allPosts.length; i++) {
            const daysAgo = (allPosts.length - 1 - i) * 3; // Spread posts 3 days apart
            const newDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

            await collection.updateOne(
                { _id: allPosts[i]._id },
                { $set: { publishedAt: newDate, updatedAt: new Date() } }
            );
            console.log(`   ${allPosts[i].slug}: ${newDate.toISOString().split('T')[0]}`);
        }

        // 5. List featured articles
        console.log("\n⭐ Featured articles:");
        const featured = await collection.find({ featured: true }).toArray();
        for (const post of featured) {
            console.log(`   - ${post.title}`);
        }

        // 6. List all articles sorted by date
        console.log("\n📋 All articles (newest first):");
        const sorted = await collection.find({}).sort({ publishedAt: -1 }).toArray();
        for (const post of sorted) {
            const date = new Date(post.publishedAt).toISOString().split('T')[0];
            console.log(`   ${date}: ${post.title}${post.featured ? ' ⭐' : ''}`);
        }

        console.log("\n✨ Blog posts update completed!");

    } catch (error) {
        console.error("❌ Error updating blog posts:", error);
        throw error;
    } finally {
        await client.close();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the script
updateBlogPosts().catch(console.error);
