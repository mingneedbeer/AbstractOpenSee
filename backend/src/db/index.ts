import { Database } from "bun:sqlite";
import { initDb } from "./schema";

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database(process.env.DATABASE_URL || "./data/marketplace.db");
    db.exec("PRAGMA journal_mode=WAL");
    db.exec("PRAGMA foreign_keys=ON");
    initDb(db);
  }
  return db;
}
