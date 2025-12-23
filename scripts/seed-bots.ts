/**
 * Seed script to migrate bot configurations from BOTS_CONFIG env var to MongoDB.
 * 
 * Usage: npx tsx scripts/seed-bots.ts
 * 
 * This script:
 * 1. Reads bot configurations from BOTS_CONFIG environment variable (if present)
 * 2. Inserts them into the MongoDB botSettings collection
 * 3. Creates indexes for the collection
 * 
 * After running this script, you can remove BOTS_CONFIG from your .env file.
 */

import "dotenv/config";
import { MongoClient } from "mongodb";

interface BotConfig {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortName: string;
    initialGreeting?: string;
    webhookOutgoingUrl: string;
}

interface BotSettingsDoc {
    botId: string;
    title: string;
    description: string;
    shortName: string;
    slug: string;
    initialGreeting?: string;
    webhookOutgoingUrl: string;
    systemPrompt?: string;
    notificationEmail?: string;
    timezone?: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
}

const BOTS_CONFIG_JSON = process.env.BOTS_CONFIG;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "lolabot";

// Default bot configurations to seed (used if BOTS_CONFIG is not set)
const DEFAULT_BOTS: BotConfig[] = [
    {
        id: "lolabot-landing-demo",
        slug: "lolabot-landing-demo",
        title: "Lolabot Demo",
        description: "Lola Bot AI Assistant",
        shortName: "Lola Bot Demo",
        initialGreeting: "Hi, I am BizAI. I want to work for you in your projects!",
        webhookOutgoingUrl: "https://agents.n8n.bizaigpt.com/webhook/b9051d3b-f8cf-40a2-845c-ea8383d93c6e"
    }
];

async function seedBots() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI environment variable is not set");
        console.log("   Make sure your .env file is loaded or pass env vars directly:");
        console.log("   MONGODB_URI=... MONGODB_DB=... npx tsx scripts/seed-bots.ts");
        process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(MONGODB_DB);
        const botSettings = db.collection<BotSettingsDoc>("botSettings");

        // Create index
        await botSettings.createIndex({ botId: 1 }, { unique: true });
        console.log("✅ Created index on botSettings.botId");

        // Parse bot configs
        let botsToSeed: BotConfig[] = DEFAULT_BOTS;

        if (BOTS_CONFIG_JSON) {
            try {
                const parsed = JSON.parse(BOTS_CONFIG_JSON);
                botsToSeed = Array.isArray(parsed) ? parsed : [parsed];
                console.log(`📦 Found ${botsToSeed.length} bots in BOTS_CONFIG`);
            } catch (e) {
                console.warn("⚠️ Failed to parse BOTS_CONFIG, using default bots");
            }
        } else {
            console.log("📦 No BOTS_CONFIG found, using default bots");
        }

        const now = new Date();
        let inserted = 0;
        let updated = 0;

        for (const bot of botsToSeed) {
            const doc: BotSettingsDoc = {
                botId: bot.id,
                title: bot.title,
                description: bot.description,
                shortName: bot.shortName,
                slug: bot.slug,
                initialGreeting: bot.initialGreeting,
                webhookOutgoingUrl: bot.webhookOutgoingUrl,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                createdAt: now,
                updatedAt: now,
                updatedBy: "system@seed",
            };

            const result = await botSettings.updateOne(
                { botId: bot.id },
                {
                    $set: {
                        title: doc.title,
                        description: doc.description,
                        shortName: doc.shortName,
                        slug: doc.slug,
                        initialGreeting: doc.initialGreeting,
                        webhookOutgoingUrl: doc.webhookOutgoingUrl,
                        updatedAt: now,
                        updatedBy: "system@seed",
                    },
                    $setOnInsert: {
                        botId: doc.botId,
                        timezone: doc.timezone,
                        createdAt: now,
                    },
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                inserted++;
                console.log(`  ✅ Inserted: ${bot.id} (${bot.title})`);
            } else if (result.modifiedCount > 0) {
                updated++;
                console.log(`  🔄 Updated: ${bot.id} (${bot.title})`);
            } else {
                console.log(`  ⏭️ Skipped (no changes): ${bot.id} (${bot.title})`);
            }
        }

        console.log("\n📊 Summary:");
        console.log(`   Inserted: ${inserted}`);
        console.log(`   Updated: ${updated}`);
        console.log(`   Total: ${botsToSeed.length}`);

        // List all bots in database
        console.log("\n📋 Current bots in database:");
        const allBots = await botSettings.find({}).toArray();
        for (const bot of allBots) {
            console.log(`   - ${bot.botId}: ${bot.title} (${bot.slug})`);
        }

        console.log("\n✅ Seed complete!");
        console.log("\n💡 You can now remove BOTS_CONFIG from your .env file.");
        console.log("   Bot configurations will be loaded from MongoDB.");

    } catch (error) {
        console.error("❌ Error seeding bots:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 Disconnected from MongoDB");
    }
}

seedBots();
