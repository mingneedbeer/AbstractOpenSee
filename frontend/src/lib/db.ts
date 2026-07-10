import { createClient } from "@libsql/client";

let client: ReturnType<typeof createClient>;
let initialized = false;

export function getDb() {
  if (!client) {
    client = createClient({
      url: import.meta.env.TURSO_DATABASE_URL || "file:local.db",
      authToken: import.meta.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function ensureDb() {
  if (initialized) return;
  initialized = true;
  const db = getDb();
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS nfts (
        id TEXT PRIMARY KEY,
        token_id INTEGER NOT NULL,
        contract_address TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        owner TEXT NOT NULL,
        collection_address TEXT,
        metadata_uri TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        address TEXT PRIMARY KEY,
        username TEXT,
        bio TEXT,
        avatar TEXT,
        twitter TEXT,
        website TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS collections (
        address TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        banner TEXT,
        owner TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
  } catch (err) {
    initialized = false;
    throw err;
  }
}
