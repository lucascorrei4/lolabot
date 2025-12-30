import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'lolabot';

interface BlogPost {
    _id: any;
    title: string;
    description: string;
    content: string;
    author?: {
        name: string;
        role?: string;
    };
}

// Replacement patterns - order matters (more specific first)
const replacements: [RegExp, string][] = [
    // Product names and variations
    [/LolaBot Intelligence/gi, 'BizAI Agent Intelligence'],
    [/LolaBot AI Agent/gi, 'BizAI Agent'],
    [/Lolabot AI Agent/gi, 'BizAI Agent'],
    [/LolaBot's/gi, "BizAI Agent's"],
    [/Lolabot's/gi, "BizAI Agent's"],
    [/LolaBot/g, 'BizAI Agent'], // Case sensitive for brand name
    [/Lolabot/g, 'BizAI Agent'],
    [/lolabot/g, 'BizAI Agent'], // lowercase instances

    // Author role updates
    [/Founder, LolaBot/gi, 'Founder, BizAI Agent'],
    [/Founder of LolaBot/gi, 'Founder of BizAI Agent'],

    // URLs and technical references (keep backwards compatible where needed)
    [/lolabot-landing-demo/g, 'bizai-agent-demo'],
];

function applyReplacements(text: string): string {
    let result = text;
    for (const [pattern, replacement] of replacements) {
        result = result.replace(pattern, replacement);
    }
    return result;
}

async function updateBlogPosts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(MONGODB_DB);
        const blogPosts = db.collection<BlogPost>('blogPosts');

        // Get all blog posts
        const posts = await blogPosts.find({}).toArray();
        console.log(`📚 Found ${posts.length} blog posts to process`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const post of posts) {
            const originalTitle = post.title;
            const originalDescription = post.description;
            const originalContent = post.content;
            const originalAuthorRole = post.author?.role;

            // Apply replacements
            const newTitle = applyReplacements(post.title);
            const newDescription = applyReplacements(post.description);
            const newContent = applyReplacements(post.content);
            const newAuthorRole = post.author?.role ? applyReplacements(post.author.role) : undefined;

            // Check if anything changed
            const hasChanges =
                newTitle !== originalTitle ||
                newDescription !== originalDescription ||
                newContent !== originalContent ||
                (newAuthorRole && newAuthorRole !== originalAuthorRole);

            if (hasChanges) {
                const updateData: any = {
                    title: newTitle,
                    description: newDescription,
                    content: newContent,
                    updatedAt: new Date(),
                };

                if (newAuthorRole) {
                    updateData['author.role'] = newAuthorRole;
                }

                await blogPosts.updateOne(
                    { _id: post._id },
                    { $set: updateData }
                );

                console.log(`✏️  Updated: "${post.slug}"`);

                // Show what changed
                if (newTitle !== originalTitle) {
                    console.log(`   Title: "${originalTitle}" → "${newTitle}"`);
                }
                if (newDescription !== originalDescription) {
                    console.log(`   Description updated`);
                }
                if (newContent !== originalContent) {
                    const lolaMatches = (originalContent.match(/lola/gi) || []).length;
                    console.log(`   Content: ${lolaMatches} "lola" references replaced`);
                }
                if (newAuthorRole && newAuthorRole !== originalAuthorRole) {
                    console.log(`   Author role: "${originalAuthorRole}" → "${newAuthorRole}"`);
                }

                updatedCount++;
            } else {
                skippedCount++;
                console.log(`⏭️  Skipped (no changes): "${post.slug}"`);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Updated: ${updatedCount} posts`);
        console.log(`   ⏭️  Skipped: ${skippedCount} posts`);
        console.log('\n🎉 Blog posts rebranding complete!');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await client.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
updateBlogPosts().catch(console.error);
