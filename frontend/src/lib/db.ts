import { sql as pgSql } from "@vercel/postgres";

let initialized = false;

export async function ensureDb() {
  if (initialized) return;
  initialized = true;
  try {
    await pgSql`
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
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint),
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint)
      )
    `;
    await pgSql`
      CREATE TABLE IF NOT EXISTS users (
        address TEXT PRIMARY KEY,
        username TEXT,
        bio TEXT,
        avatar TEXT,
        twitter TEXT,
        website TEXT,
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint),
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint)
      )
    `;
    await pgSql`
      CREATE TABLE IF NOT EXISTS collections (
        address TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        banner TEXT,
        owner TEXT NOT NULL,
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint),
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::bigint)
      )
    `;
  } catch (err) {
    initialized = false;
    throw err;
  }
}

export const sql = pgSql;
