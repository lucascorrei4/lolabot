/**
 * Script to migrate bot ID from lolabot-landing-demo to bizai-agent-demo
 * This updates:
 * - botSettings collection (the bot configuration)
 * - sessions collection (all existing sessions)
 * - signals collection (all existing signals)
 * 
 * Run with: npx tsx scripts/migrate-bot-id.ts
 */
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'lolabot';

const OLD_BOT_ID = 'lolabot-landing-demo';
const NEW_BOT_ID = 'bizai-agent-demo';

async function migrateBotId() {
    console.log('🚀 Starting bot ID migration...');
    console.log(`   Old ID: ${OLD_BOT_ID}`);
    console.log(`   New ID: ${NEW_BOT_ID}\n`);

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db(MONGODB_DB);

        // 1. Update botSettings collection
        console.log('📦 Updating botSettings...');
        const botSettings = db.collection('botSettings');
        const botResult = await botSettings.updateOne(
            { botId: OLD_BOT_ID },
            {
                $set: {
                    botId: NEW_BOT_ID,
                    slug: NEW_BOT_ID,
                    title: 'BizAI Agent Demo',
                    shortName: 'BizAI Agent',
                    description: 'BizAI Agent AI Assistant',
                    updatedAt: new Date(),
                    updatedBy: 'system@migration'
                }
            }
        );
        console.log(`   Modified: ${botResult.modifiedCount} bot settings`);

        // 2. Update sessions collection
        console.log('\n📦 Updating sessions...');
        const sessions = db.collection('sessions');
        const sessionsResult = await sessions.updateMany(
            { botId: OLD_BOT_ID },
            { $set: { botId: NEW_BOT_ID } }
        );
        console.log(`   Modified: ${sessionsResult.modifiedCount} sessions`);

        // 3. Update signals collection
        console.log('\n📦 Updating signals...');
        const signals = db.collection('signals');
        const signalsResult = await signals.updateMany(
            { botId: OLD_BOT_ID },
            { $set: { botId: NEW_BOT_ID } }
        );
        console.log(`   Modified: ${signalsResult.modifiedCount} signals`);

        // 4. Verify the migration
        console.log('\n📋 Verification:');
        const newBot = await botSettings.findOne({ botId: NEW_BOT_ID });
        if (newBot) {
            console.log(`   ✅ Bot found with new ID: ${newBot.botId}`);
            console.log(`      Title: ${newBot.title}`);
            console.log(`      Slug: ${newBot.slug}`);
        } else {
            console.log('   ❌ Bot not found with new ID!');
        }

        const oldBot = await botSettings.findOne({ botId: OLD_BOT_ID });
        if (oldBot) {
            console.log(`   ⚠️  Warning: Old bot still exists: ${oldBot.botId}`);
        } else {
            console.log(`   ✅ Old bot ID no longer exists`);
        }

        // Count remaining old references
        const oldSessionsCount = await sessions.countDocuments({ botId: OLD_BOT_ID });
        const oldSignalsCount = await signals.countDocuments({ botId: OLD_BOT_ID });
        console.log(`   Old sessions remaining: ${oldSessionsCount}`);
        console.log(`   Old signals remaining: ${oldSignalsCount}`);

        console.log('\n✨ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    } finally {
        await client.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

migrateBotId().catch(console.error);
