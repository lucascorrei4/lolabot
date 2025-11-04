import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "../env";
import type { Message, Session, Upload } from "../types";

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client;
  client = new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
}

function col<T>(name: string) {
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
  };
}

export async function ensureIndexes() {
  const { sessions, messages, uploads } = await getCollections();
  await sessions.createIndex({ botId: 1, userId: 1, chatId: 1 }, { unique: false });
  await messages.createIndex({ sessionId: 1, createdAt: 1 });
  await uploads.createIndex({ sessionId: 1, createdAt: 1 });
}

export async function resolveSession(params: {
  botId: string;
  userId?: string;
  chatId?: string;
  createIfMissing?: boolean;
}): Promise<Session> {
  const { sessions } = await getCollections();
  const query: any = { botId: params.botId };
  if (params.userId) query.userId = params.userId;
  if (params.chatId) query.chatId = params.chatId;

  let doc = await sessions.findOne(query);
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
    doc = { ...toInsert, _id: res.insertedId.toHexString() } as Session;
  }
  if (!doc) throw new Error("Session not found");
  return doc;
}

export async function touchSession(sessionId: string) {
  const { sessions } = await getCollections();
  await sessions.updateOne({ _id: new (await import("mongodb")).ObjectId(sessionId) } as any, {
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


