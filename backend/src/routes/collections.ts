import { Elysia, t } from "elysia";
import { getDb } from "../db";
import type { Collection, NFT } from "../types";

export const collectionsRoutes = new Elysia({ prefix: "/api/collections" })
  .get("/", ({ query }) => {
    const db = getDb();
    const page = Math.max(1, parseInt(query.page || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "24")));
    const offset = (page - 1) * limit;

    const countRow = db.query("SELECT COUNT(*) as total FROM collections").get() as { total: number };
    const items = db.query(
      "SELECT * FROM collections ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).all(limit, offset) as Collection[];

    return { items, total: countRow.total, page, limit, totalPages: Math.ceil(countRow.total / limit) };
  })

  .get("/:address", ({ params: { address }, set }) => {
    const db = getDb();
    const collection = db.query(
      "SELECT * FROM collections WHERE LOWER(address) = LOWER(?)"
    ).get(address) as Collection | undefined;
    if (!collection) {
      set.status = 404;
      return { error: "Collection not found" };
    }
    return collection;
  })

  .post("/", ({ body, set }) => {
    const db = getDb();
    const existing = db.query(
      "SELECT address FROM collections WHERE LOWER(address) = LOWER(?)"
    ).get(body.address);
    if (existing) {
      set.status = 409;
      return { error: "Collection already exists" };
    }
    db.query(
      `INSERT INTO collections (address, name, description, image, banner, owner)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(body.address, body.name, body.description || null, body.image || null, body.banner || null, body.owner);
    set.status = 201;
    return db.query("SELECT * FROM collections WHERE address = ?").get(body.address);
  }, {
    body: t.Object({
      address: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      image: t.Optional(t.String()),
      banner: t.Optional(t.String()),
      owner: t.String(),
    }),
  })

  .get("/:address/nfts", ({ params: { address }, query }) => {
    const db = getDb();
    const page = Math.max(1, parseInt(query.page || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "24")));
    const offset = (page - 1) * limit;

    const countRow = db.query(
      "SELECT COUNT(*) as total FROM nfts WHERE LOWER(collection_address) = LOWER(?)"
    ).get(address) as { total: number };

    const items = db.query(
      "SELECT * FROM nfts WHERE LOWER(collection_address) = LOWER(?) ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).all(address, limit, offset) as NFT[];

    return { items, total: countRow.total, page, limit, totalPages: Math.ceil(countRow.total / limit) };
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  });
