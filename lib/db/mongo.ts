import { MongoClient, Document, ObjectId } from "mongodb";
import { env } from "../env";
import type { Message, Session, Upload, Signal, User, Otp, BotSettings, GlobalSettings, BlogPost } from "../types";

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client;
  client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  return client;
}

function col<T extends Document>(name: string) {
  if (!env.MONGODB_DB) throw new Error("MONGODB_DB not set");
  const db = client!.db(env.MONGODB_DB);
  return db.collection<T>(name);
}

export async function getCollections() {
  const c = await getMongoClient();
  const db = c.db(env.MONGODB_DB);
  return {
    sessions: db.collection<Session>("sessions"),
    messages: db.collection<Message>("messages"),
    uploads: db.collection<Upload>("uploads"),
    signals: db.collection<Signal>("signals"),
    users: db.collection<User>("users"),
    otps: db.collection<Otp>("otps"),
    botSettings: db.collection<BotSettings>("botSettings"),
    globalSettings: db.collection<GlobalSettings>("globalSettings"),
    blogPosts: db.collection<BlogPost>("blogPosts"),
  };
}

export async function ensureIndexes() {
  const { sessions, messages, uploads, signals, users, otps, botSettings, blogPosts } = await getCollections();
  await sessions.createIndex({ botId: 1, userId: 1, chatId: 1 }, { unique: false });
  await messages.createIndex({ sessionId: 1, createdAt: 1 });
  await uploads.createIndex({ sessionId: 1, createdAt: 1 });
  await signals.createIndex({ botId: 1, createdAt: -1 });
  await users.createIndex({ email: 1 }, { unique: true });
  await otps.createIndex({ email: 1 });
  await otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire OTPs
  await botSettings.createIndex({ botId: 1 }, { unique: true });
  // Blog post indexes
  await blogPosts.createIndex({ slug: 1 }, { unique: true });
  await blogPosts.createIndex({ status: 1, publishedAt: -1 });
  await blogPosts.createIndex({ category: 1, status: 1 });
  await blogPosts.createIndex({ tags: 1 });
}

export async function resolveSession(params: {
  botId: string;
  userId?: string;
  chatId?: string;
  createIfMissing?: boolean;
}): Promise<Session> {
  const { sessions } = await getCollections();

  let doc: Session | null = null;

  // Only query for existing session if userId or chatId is provided
  // If anonymous (only botId), we should NOT match any existing session to avoid sharing history
  if (params.userId || params.chatId) {
    const query: any = { botId: params.botId };
    if (params.userId) query.userId = params.userId;
    if (params.chatId) query.chatId = params.chatId;

    doc = await sessions.findOne(query, { sort: { lastActivityAt: -1 } });
  }

  // Check if session is expired (older than 24 hours)
  if (doc) {
    const now = new Date();
    const lastActivity = new Date(doc.lastActivityAt || doc.updatedAt || doc.createdAt);
    const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    // Reset session if inactive for more than 24 hours
    if (hoursSinceLastActivity > 24) {
      doc = null;
    }
  }

  if (!doc && params.createIfMissing) {
    const now = new Date();
    const toInsert: Session = {
      botId: params.botId,
      userId: params.userId,
      chatId: params.chatId,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    };
    const res = await sessions.insertOne(toInsert as any);
    doc = { ...toInsert, _id: res.insertedId.toString() } as any;
  }
  if (!doc) throw new Error("Session not found");
  return doc;
}

export async function getSessionById(sessionId: string) {
  const { sessions } = await getCollections();
  try {
    const doc = await sessions.findOne({ _id: new ObjectId(sessionId) } as any);
    return doc;
  } catch (e) {
    return null;
  }
}

export async function touchSession(sessionId: string) {
  const { sessions } = await getCollections();
  await sessions.updateOne({ _id: new ObjectId(sessionId) } as any, {
    $set: { updatedAt: new Date(), lastActivityAt: new Date() },
  });
}

export async function insertMessage(message: Message) {
  const { messages } = await getCollections();
  await messages.insertOne(message as any);
}

export async function listMessages(sessionId: string, limit = 50) {
  const { messages } = await getCollections();
  return messages
    .find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .toArray();
}

export async function recordUpload(upload: Upload) {
  const { uploads } = await getCollections();
  await uploads.insertOne(upload as any);
}

// Updated signature to support date filtering and text search
export async function listSessions(
  limit = 20,
  offset = 0,
  botId?: string,
  startDate?: Date,
  endDate?: Date,
  searchQuery?: string
) {
  const { sessions, messages } = await getCollections();
  const query: any = {};

  if (botId) query.botId = botId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: 'i' };

    // Find session IDs where messages have matching text
    // We limit this to avoid huge performance hit, effectively simplified for now
    // Ideally we would use aggregation, but two-step is fine for reasonable dataset size
    const matchingMessages = await messages
      .find({ text: searchRegex }, { projection: { sessionId: 1 } })
      .limit(1000) // Limit to avoid memory issues
      .toArray();

    const matchingSessionIds = [...new Set(matchingMessages.map(m => m.sessionId))];

    const orConditions: any[] = [
      { userId: searchRegex },
    ];

    // If we found sessions with matching text, add them to OR
    if (matchingSessionIds.length > 0) {
      // Convert string sessionIds to ObjectIds if stored as such,
      // but Message.sessionId is likely string. Session._id is ObjectId.
      // matchingMessages sessionId is likely string if we look at `sessionId: m.sessionId` in page.tsx
      // Let's assume stored as string referencing ObjectId string, or check schema.
      // In getSessionById: _id: new ObjectId(sessionId).
      // In insertMessage: sessionId is string.
      // So we need to convert string IDs to ObjectIds for the $in query on Session._id
      const objectIds = matchingSessionIds
        .map(id => {
          try { return new ObjectId(id); } catch (e) { return null; }
        })
        .filter(id => id !== null);

      if (objectIds.length > 0) {
        orConditions.push({ _id: { $in: objectIds } });
      }
    }

    if (/^[0-9a-fA-F]{24}$/.test(searchQuery)) {
      try {
        orConditions.push({ _id: new ObjectId(searchQuery) });
      } catch (e) { /* ignore */ }
    }

    query.$or = orConditions;
  }

  // Use aggregation to filter sessions with at least 1 user message at DB level
  const pipeline: any[] = [
    { $match: query },
    {
      $lookup: {
        from: "messages",
        let: { sessionId: { $toString: "$_id" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sessionId", "$$sessionId"] },
                  { $eq: ["$role", "user"] }
                ]
              }
            }
          },
          { $count: "count" }
        ],
        as: "userMessages"
      }
    },
    {
      $addFields: {
        interactionCount: {
          $ifNull: [{ $arrayElemAt: ["$userMessages.count", 0] }, 0]
        }
      }
    },
    { $match: { interactionCount: { $gt: 0 } } },
    { $sort: { lastActivityAt: -1, createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
    { $project: { userMessages: 0 } }
  ];

  return sessions.aggregate(pipeline).toArray();
}

export async function countSessions(botId?: string, startDate?: Date, endDate?: Date, searchQuery?: string) {
  const { sessions, messages } = await getCollections();
  const query: any = {};

  if (botId) query.botId = botId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: 'i' };

    const matchingMessages = await messages
      .find({ text: searchRegex }, { projection: { sessionId: 1 } })
      .limit(1000)
      .toArray();

    const matchingSessionIds = [...new Set(matchingMessages.map(m => m.sessionId))];

    const orConditions: any[] = [
      { userId: searchRegex },
    ];

    if (matchingSessionIds.length > 0) {
      const objectIds = matchingSessionIds
        .map(id => {
          try { return new ObjectId(id); } catch (e) { return null; }
        })
        .filter(id => id !== null);

      if (objectIds.length > 0) {
        orConditions.push({ _id: { $in: objectIds } });
      }
    }

    if (/^[0-9a-fA-F]{24}$/.test(searchQuery)) {
      try {
        orConditions.push({ _id: new ObjectId(searchQuery) });
      } catch (e) { /* ignore */ }
    }

    query.$or = orConditions;
  }

  // Use aggregation to count only sessions with at least 1 user message
  const pipeline: any[] = [
    { $match: query },
    {
      $lookup: {
        from: "messages",
        let: { sessionId: { $toString: "$_id" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sessionId", "$$sessionId"] },
                  { $eq: ["$role", "user"] }
                ]
              }
            }
          },
          { $count: "count" }
        ],
        as: "userMessages"
      }
    },
    {
      $addFields: {
        interactionCount: {
          $ifNull: [{ $arrayElemAt: ["$userMessages.count", 0] }, 0]
        }
      }
    },
    { $match: { interactionCount: { $gt: 0 } } },
    { $count: "total" }
  ];

  const result = await sessions.aggregate(pipeline).toArray();
  return result.length > 0 ? result[0].total : 0;
}

export async function insertSignal(signal: Signal) {
  const { signals } = await getCollections();
  await signals.insertOne(signal as any);
}

export async function listSignals(botId: string, limit = 20) {
  const { signals } = await getCollections();
  return signals
    .find({ botId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

// User & Auth Functions

export async function getUserByEmail(email: string) {
  const { users } = await getCollections();
  return users.findOne({ email });
}

export async function createUser(email: string, role: 'super_admin' | 'user' = 'user') {
  const { users } = await getCollections();

  // Auto-promote specific email for initial setup
  if (email === 'admin@lolabot.com') role = 'super_admin';

  const now = new Date();
  const user: User = {
    email,
    role,
    allowedBotIds: [],
    createdAt: now,
    updatedAt: now,
  };
  const res = await users.insertOne(user as any);
  return { ...user, _id: res.insertedId.toString() };
}

export async function updateUserBotPermissions(email: string, botIds: string[]) {
  const { users } = await getCollections();
  await users.updateOne({ email }, { $set: { allowedBotIds: botIds, updatedAt: new Date() } });
}

export async function createOTP(email: string) {
  const { otps } = await getCollections();
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  const now = new Date();

  // Invalidate previous OTPs for this email
  await otps.deleteMany({ email });

  await otps.insertOne({
    email,
    code,
    expiresAt,
    createdAt: now
  } as any);

  return code;
}

export async function verifyOTP(email: string, code: string) {
  const { otps } = await getCollections();
  const otp = await otps.findOne({ email, code });

  if (!otp) return false;
  if (new Date() > otp.expiresAt) return false;

  // Consume OTP
  await otps.deleteOne({ _id: otp._id });
  return true;
}

// Bot Settings Functions

export async function getBotSettings(botId: string) {
  const { botSettings } = await getCollections();
  return botSettings.findOne({ botId });
}

export async function getAllBotConfigs() {
  const { botSettings } = await getCollections();
  return botSettings.find({}).toArray();
}

export async function upsertBotSettings(settings: Omit<BotSettings, '_id'>) {
  const { botSettings } = await getCollections();

  const now = new Date();
  await botSettings.updateOne(
    { botId: settings.botId },
    {
      $set: {
        ...settings,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  return getBotSettings(settings.botId);
}

export async function deleteBotConfig(botId: string) {
  const { botSettings } = await getCollections();
  return botSettings.deleteOne({ botId });
}

// Global Settings Functions
export async function getGlobalSetting(key: string): Promise<GlobalSettings | null> {
  const { globalSettings } = await getCollections();
  return globalSettings.findOne({ key }) as Promise<GlobalSettings | null>;
}

export async function setGlobalSetting(key: string, value: string, updatedBy: string, description?: string): Promise<GlobalSettings | null> {
  const { globalSettings } = await getCollections();
  const now = new Date();

  await globalSettings.updateOne(
    { key },
    {
      $set: {
        key,
        value,
        description,
        updatedAt: now,
        updatedBy,
      },
    },
    { upsert: true }
  );

  return getGlobalSetting(key);
}

export async function getAllGlobalSettings(): Promise<GlobalSettings[]> {
  const { globalSettings } = await getCollections();
  return globalSettings.find({}).toArray() as Promise<GlobalSettings[]>;
}

// Convenience function to get the default system prompt
export async function getDefaultSystemPrompt(): Promise<string | null> {
  const setting = await getGlobalSetting('default_system_prompt');
  return setting?.value ?? null;
}

// ============================================
// Blog Post Functions
// ============================================

/**
 * Get all published blog posts, sorted by publishedAt descending
 */
export async function getPublishedBlogPosts(limit = 50): Promise<BlogPost[]> {
  const { blogPosts } = await getCollections();
  return blogPosts
    .find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray() as Promise<BlogPost[]>;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { blogPosts } = await getCollections();
  return blogPosts.findOne({ slug, status: 'published' }) as Promise<BlogPost | null>;
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(limit = 2): Promise<BlogPost[]> {
  const { blogPosts } = await getCollections();
  return blogPosts
    .find({ status: 'published', featured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray() as Promise<BlogPost[]>;
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: BlogPost['category'], limit = 20): Promise<BlogPost[]> {
  const { blogPosts } = await getCollections();
  return blogPosts
    .find({ status: 'published', category })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray() as Promise<BlogPost[]>;
}

/**
 * Get all blog post slugs (for sitemap generation)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const { blogPosts } = await getCollections();
  const posts = await blogPosts
    .find({ status: 'published' }, { projection: { slug: 1 } })
    .toArray();
  return posts.map(p => p.slug);
}

/**
 * Get related posts (same category, excluding current post)
 */
export async function getRelatedBlogPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const { blogPosts } = await getCollections();
  const currentPost = await blogPosts.findOne({ slug });
  if (!currentPost) return [];

  return blogPosts
    .find({
      status: 'published',
      category: currentPost.category,
      slug: { $ne: slug }
    })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray() as Promise<BlogPost[]>;
}

/**
 * Insert a new blog post
 */
export async function insertBlogPost(post: Omit<BlogPost, '_id' | 'createdAt'>): Promise<BlogPost> {
  const { blogPosts } = await getCollections();
  const now = new Date();
  const toInsert = {
    ...post,
    createdAt: now,
    updatedAt: now,
  };
  const res = await blogPosts.insertOne(toInsert as any);
  return { ...toInsert, _id: res.insertedId.toString() } as BlogPost;
}

/**
 * Update a blog post by slug
 */
export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const { blogPosts } = await getCollections();
  const now = new Date();
  await blogPosts.updateOne(
    { slug },
    { $set: { ...updates, updatedAt: now } }
  );
  return blogPosts.findOne({ slug }) as Promise<BlogPost | null>;
}

/**
 * Delete a blog post by slug
 */
export async function deleteBlogPost(slug: string): Promise<boolean> {
  const { blogPosts } = await getCollections();
  const result = await blogPosts.deleteOne({ slug });
  return result.deletedCount > 0;
}

/**
 * Get blog post count by status
 */
export async function getBlogPostStats(): Promise<{ published: number; draft: number; total: number }> {
  const { blogPosts } = await getCollections();
  const published = await blogPosts.countDocuments({ status: 'published' });
  const draft = await blogPosts.countDocuments({ status: 'draft' });
  return { published, draft, total: published + draft };
}
