/**
 * Script to update user allowedBotIds from lolabot-landing-demo to bizai-agent-demo
 * 
 * Run with: npx tsx scripts/update-user-bot-ids.ts
 */
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'lolabot';

const OLD_BOT_ID = 'lolabot-landing-demo';
const NEW_BOT_ID = 'bizai-agent-demo';

async function updateUserBotIds() {
    console.log('🚀 Updating user allowedBotIds...');
    console.log(`   Replacing: "${OLD_BOT_ID}" → "${NEW_BOT_ID}"\n`);

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db(MONGODB_DB);
        const users = db.collection('users');

        // Find users with old bot ID in allowedBotIds
        const usersWithOldBot = await users.find({
            allowedBotIds: OLD_BOT_ID
        }).toArray();

        console.log(`📦 Found ${usersWithOldBot.length} users with old bot ID\n`);

        let updated = 0;
        for (const user of usersWithOldBot) {
            // Replace old ID with new ID in the array
            const newAllowedBotIds = user.allowedBotIds.map((id: string) =>
                id === OLD_BOT_ID ? NEW_BOT_ID : id
            );

            await users.updateOne(
                { _id: user._id },
                {
                    $set: {
                        allowedBotIds: newAllowedBotIds,
                        updatedAt: new Date()
                    }
                }
            );

            console.log(`   ✅ Updated: ${user.email}`);
            console.log(`      Old: [${user.allowedBotIds.join(', ')}]`);
            console.log(`      New: [${newAllowedBotIds.join(', ')}]\n`);
            updated++;
        }

        console.log(`📊 Summary: Updated ${updated} users`);

        // Verify
        const remainingOld = await users.countDocuments({ allowedBotIds: OLD_BOT_ID });
        console.log(`\n✅ Users still with old bot ID: ${remainingOld}`);

        console.log('\n✨ User bot IDs update completed!');

    } catch (error) {
        console.error('❌ Error updating user bot IDs:', error);
        throw error;
    } finally {
        await client.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

updateUserBotIds().catch(console.error);
