/**
 * Quick script to add a single bot to MongoDB
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const bot = {
    id: "focus-organize-ai",
    slug: "focus-organize-ai",
    title: "Focus Organize AI",
    description: "Focus Organize AI Assistant",
    shortName: "Focus Organize AI",
    initialGreeting: "Hi, I'm Focus Organize AI Assistant. How can I help you?",
    webhookOutgoingUrl: "https://agents.n8n.bizaigpt.com/webhook/e5f63dbd-2bbd-4242-bf67-8435a21c9aed"
};

async function addBot() {
    const client = new MongoClient(process.env.MONGODB_URI!);
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(process.env.MONGODB_DB || "lolabot");
        const now = new Date();

        const result = await db.collection("botSettings").updateOne(
            { botId: bot.id },
            {
                $set: {
                    botId: bot.id,
                    title: bot.title,
                    description: bot.description,
                    shortName: bot.shortName,
                    slug: bot.slug,
                    initialGreeting: bot.initialGreeting,
                    webhookOutgoingUrl: bot.webhookOutgoingUrl,
                    updatedAt: now,
                    updatedBy: "system@seed",
                },
                $setOnInsert: {
                    createdAt: now,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            },
            { upsert: true }
        );

        console.log(result.upsertedCount ? `✅ Inserted: ${bot.id}` : `🔄 Updated: ${bot.id}`);

        // List all bots
        const allBots = await db.collection("botSettings").find({}).toArray();
        console.log("\n📋 Current bots in database:");
        for (const b of allBots) {
            console.log(`   - ${b.botId}: ${b.title}`);
        }
    } finally {
        await client.close();
    }
}

addBot();
