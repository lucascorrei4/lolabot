---
description: How to configure bots in MongoDB instead of .env
---

# Bot Configuration in MongoDB

This workflow describes how bot configurations are managed in MongoDB instead of the `.env` file's `BOTS_CONFIG` variable.

## Overview

Bot configurations are now stored in the `botSettings` MongoDB collection. This allows:
- Managing bot settings through the Admin UI (Settings page)
- Adding/removing bots without restarting the application
- Storing additional settings like notification email and timezone per bot

## Initial Setup (Seeding Bots)

To seed the initial bot configurations into MongoDB:

// turbo
1. Run the seed script with your environment variables:
```bash
npm run seed:bots
```

Or with inline environment variables:
```bash
MONGODB_URI="your-mongodb-uri" MONGODB_DB="lolabot" npm run seed:bots
```

2. The script will:
   - Parse `BOTS_CONFIG` from environment if present
   - Otherwise use default bot configurations
   - Insert/update bot configurations in MongoDB
   - Show a summary of what was done

## Default Bot Configurations

If no `BOTS_CONFIG` is set, the seed script uses these defaults:

1. **real-vision-ai** - Real Vision AI Assistant
2. **lolabot-landing-demo** - Lolabot Demo

## Managing Bots After Seeding

Once bots are in MongoDB, you can manage them:

1. **Via Admin UI**: Navigate to `/admin/[botId]/settings`
2. **Super Admin Only**: Can edit slug and webhook URL
3. **Regular Admins**: Can edit title, description, greeting, etc.

## Bot Settings Schema

Each bot configuration in MongoDB contains:

| Field | Description | Editable By |
|-------|-------------|-------------|
| botId | Unique identifier | Super Admin |
| title | Display title | All Admins |
| description | Bot description | All Admins |
| shortName | Compact display name | All Admins |
| slug | URL path identifier | Super Admin |
| initialGreeting | First chat message | All Admins |
| webhookOutgoingUrl | AI agent webhook | Super Admin |
| notificationEmail | Alert recipient | All Admins |
| timezone | Timestamp display | All Admins |

## Removing BOTS_CONFIG from .env

After running the seed script successfully:

1. You can remove `BOTS_CONFIG` from your `.env` file
2. Keep the legacy `NEXT_PUBLIC_BOT_*` variables as fallbacks
3. Bot configurations will be loaded from MongoDB

## Adding a New Bot

To add a new bot after initial setup:

1. Log in as Super Admin
2. Go to Super Admin panel (`/admin/super`)
3. Create the bot entry in MongoDB manually or via API
4. Configure the bot settings via the Settings page

## Troubleshooting

**Bot not found error:**
- Ensure the bot ID exists in MongoDB `botSettings` collection
- Run `npm run seed:bots` to seed default bots

**Webhook URL not working:**
- Check the `webhookOutgoingUrl` field in bot settings
- Ensure the URL is accessible from your server

**Settings not saving:**
- Check user has appropriate role (super_admin for slug/webhook)
- Verify MongoDB connection is working
