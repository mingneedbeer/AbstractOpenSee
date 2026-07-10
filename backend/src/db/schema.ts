import { Database } from "bun:sqlite";

export function initDb(db: Database) {
  db.run(`
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

  db.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      listing_id INTEGER NOT NULL,
      seller TEXT NOT NULL,
      nft_contract TEXT NOT NULL,
      token_id INTEGER NOT NULL,
      price TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      signature TEXT
    )
  `);

  db.run(`
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

  db.run(`
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
}
