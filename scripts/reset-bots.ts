/**
 * Reset script: Re-add client bots and clean up all sessions/messages
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

const CLIENT_BOTS = [
    {
        botId: "real-vision-ai",
        slug: "real-vision-ai",
        title: "Real Vision AI",
        description: "Real Vision AI Assistant",
        shortName: "Real Vision AI",
        initialGreeting: "Hi, I am Real Vision AI Assistant. How can I help you?",
        webhookOutgoingUrl: "https://agents.n8n.bizaigpt.com/webhook/89ba81e1-292c-4b16-b98e-e506a6aa4f2c",
        timezone: "America/Chicago",
    },
    {
        botId: "focus-organize-ai",
        slug: "focus-organize-ai",
        title: "Focus Organize AI",
        description: "Focus Organize AI Assistant",
        shortName: "Focus Organize AI",
        initialGreeting: "Hi, I'm Focus Organize AI Assistant. How can I help you?",
        webhookOutgoingUrl: "https://agents.n8n.bizaigpt.com/webhook/e5f63dbd-2bbd-4242-bf67-8435a21c9aed",
        timezone: "America/Chicago",
    }
];

async function reset() {
    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
        await client.connect();
        console.log("Connected to MongoDB\n");

        const db = client.db(process.env.MONGODB_DB || "bizai-agent");
        const now = new Date();

        // Re-add client bots
        console.log("📦 Re-adding client bots...");
        for (const bot of CLIENT_BOTS) {
            const result = await db.collection("botSettings").updateOne(
                { botId: bot.botId },
                {
                    $set: {
                        ...bot,
                        updatedAt: now,
                        updatedBy: "system@reset",
                    },
                    $setOnInsert: {
                        createdAt: now,
                    },
                },
                { upsert: true }
            );
            console.log(`   ${result.upsertedCount ? '✅ Inserted' : '🔄 Updated'}: ${bot.botId}`);
        }

        // Clean up all sessions
        console.log("\n🗑️  Cleaning up all sessions...");
        const sessResult = await db.collection("sessions").deleteMany({});
        console.log(`   Deleted ${sessResult.deletedCount} sessions`);

        // Clean up all messages
        console.log("\n🗑️  Cleaning up all messages...");
        const msgResult = await db.collection("messages").deleteMany({});
        console.log(`   Deleted ${msgResult.deletedCount} messages`);

        // Show final state
        console.log("\n📋 Current bots in database:");
        const bots = await db.collection("botSettings").find({}).toArray();
        for (const bot of bots) {
            console.log(`   - ${bot.botId}: ${bot.title}`);
            console.log(`     Webhook: ${bot.webhookOutgoingUrl?.substring(0, 60)}...`);
        }

        console.log("\n✅ Reset complete! All sessions and messages cleared. Bots restored.");
        console.log("   Users will start fresh conversations with the correct bot configurations.");

    } finally {
        await client.close();
    }
}

reset();
