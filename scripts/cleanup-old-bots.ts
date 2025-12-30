/**
 * Cleanup script to remove old bots and sessions
 */
import "dotenv/config";
import { MongoClient } from "mongodb";

async function cleanup() {
    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(process.env.MONGODB_DB || "bizai-agent");

        // Delete old bots
        console.log("\n🗑️  Deleting old bots...");
        const r1 = await db.collection("botSettings").deleteOne({ botId: "real-vision-ai" });
        console.log(`   Deleted real-vision-ai: ${r1.deletedCount}`);

        const r2 = await db.collection("botSettings").deleteOne({ botId: "focus-organize-ai" });
        console.log(`   Deleted focus-organize-ai: ${r2.deletedCount}`);

        // Delete sessions with old botIds (keep only bizai-agent-demo)
        console.log("\n🗑️  Deleting sessions with old botIds...");
        const r3 = await db.collection("sessions").deleteMany({
            botId: { $ne: "bizai-agent-demo" }
        });
        console.log(`   Deleted old sessions: ${r3.deletedCount}`);

        // Show remaining
        console.log("\n📋 Remaining data:");
        const bots = await db.collection("botSettings").find({}).toArray();
        console.log("   Bots:", bots.map(b => b.botId));

        const sessCount = await db.collection("sessions").countDocuments({});
        console.log("   Sessions:", sessCount);

        console.log("\n✅ Cleanup complete!");

    } finally {
        await client.close();
    }
}

cleanup();
