import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function checkBots() {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const bots = await client.db(process.env.MONGODB_DB || 'lolabot').collection('botSettings').find({}).toArray();
    console.log('All bots in database:');
    bots.forEach(b => {
        console.log(`  - botId: "${b.botId}" | title: "${b.title}"`);
    });

    // Check if old bot still exists
    const oldBot = bots.find(b => b.botId === 'lolabot-landing-demo');
    if (oldBot) {
        console.log('\n⚠️  Old bot "lolabot-landing-demo" still exists!');
    } else {
        console.log('\n✅ Old bot "lolabot-landing-demo" does not exist');
    }

    await client.close();
}

checkBots();
