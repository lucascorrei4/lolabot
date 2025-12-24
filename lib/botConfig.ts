/**
 * Bot configuration helpers that fetch from MongoDB.
 * These are async functions since they need to query the database.
 */

import { getAllBotConfigs, getBotSettings } from "./db/mongo";
import type { BotConfig, BotSettings } from "./types";

// Convert BotSettings (MongoDB) to BotConfig (legacy interface)
function toBotConfig(settings: BotSettings): BotConfig {
    return {
        id: settings.botId,
        slug: settings.slug,
        title: settings.title,
        description: settings.description,
        shortName: settings.shortName,
        initialGreeting: settings.initialGreeting,
        webhookOutgoingUrl: settings.webhookOutgoingUrl,
    };
}

/**
 * Get all bot configurations from MongoDB.
 */
export async function getBotsConfigAsync(): Promise<BotConfig[]> {
    try {
        const allSettings = await getAllBotConfigs();
        return allSettings.map(toBotConfig);
    } catch (error) {
        console.error("Failed to fetch bot configs from MongoDB:", error);
        return [];
    }
}

/**
 * Get a specific bot by its ID.
 */
export async function getBotByIdAsync(botId: string): Promise<BotConfig | null> {
    try {
        const settings = await getBotSettings(botId);
        if (!settings) return null;
        return toBotConfig(settings);
    } catch (error) {
        console.error(`Failed to fetch bot ${botId} from MongoDB:`, error);
        return null;
    }
}

/**
 * Get full bot settings (including systemPrompt, pageContexts, etc.) by its ID.
 * This is used for webhook payloads to send complete context to the AI.
 */
export async function getBotSettingsFullAsync(botId: string): Promise<BotSettings | null> {
    try {
        const settings = await getBotSettings(botId);
        return settings || null;
    } catch (error) {
        console.error(`Failed to fetch full bot settings for ${botId}:`, error);
        return null;
    }
}

/**
 * Get a bot by its slug.
 */
export async function getBotBySlugAsync(slug: string): Promise<BotConfig | null> {
    try {
        const allSettings = await getAllBotConfigs();
        const settings = allSettings.find(s => s.slug === slug);
        if (!settings) return null;
        return toBotConfig(settings);
    } catch (error) {
        console.error(`Failed to fetch bot by slug ${slug} from MongoDB:`, error);
        return null;
    }
}

/**
 * Get the default (first) bot configuration.
 */
export async function getDefaultBotAsync(): Promise<BotConfig | null> {
    const bots = await getBotsConfigAsync();
    return bots[0] || null;
}
