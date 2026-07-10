import { Elysia, t } from "elysia";
import { getDb } from "../db";
import type { NFT, PaginatedResult } from "../types";

export const nftsRoutes = new Elysia({ prefix: "/api/nfts" })
  .get("/", ({ query }) => {
    const db = getDb();
    const page = Math.max(1, parseInt(query.page || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "24")));
    const offset = (page - 1) * limit;
    const { search, sort, collection, owner } = query;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (collection) {
      where += " AND collection_address = ?";
      params.push(collection);
    }
    if (owner) {
      where += " AND owner = ?";
      params.push(owner);
    }

    let orderBy = "ORDER BY created_at DESC";
    if (sort === "oldest") orderBy = "ORDER BY created_at ASC";
    if (sort === "name") orderBy = "ORDER BY name ASC";

    const countRow = db.query(
      `SELECT COUNT(*) as total FROM nfts ${where}`
    ).get(...params) as { total: number };

    const items = db.query(
      `SELECT * FROM nfts ${where} ${orderBy} LIMIT ? OFFSET ?`
    ).all(...params, limit, offset) as NFT[];

    return {
      items,
      total: countRow.total,
      page,
      limit,
      totalPages: Math.ceil(countRow.total / limit),
    } satisfies PaginatedResult<NFT>;
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      search: t.Optional(t.String()),
      sort: t.Optional(t.String()),
      collection: t.Optional(t.String()),
      owner: t.Optional(t.String()),
    }),
  })

  .get("/:id", ({ params: { id }, set }) => {
    const db = getDb();
    const nft = db.query("SELECT * FROM nfts WHERE id = ?").get(id) as NFT | undefined;
    if (!nft) {
      set.status = 404;
      return { error: "NFT not found" };
    }
    return nft;
  })

  .post("/", ({ body, set }) => {
    const db = getDb();
    const { token_id, contract_address, name, description, image, owner, collection_address, metadata_uri } = body as any;
    const id = `${contract_address}:${token_id}`;
    const existing = db.query("SELECT id FROM nfts WHERE id = ?").get(id);
    if (existing) {
      set.status = 409;
      return { error: "NFT already exists" };
    }
    db.query(
      `INSERT INTO nfts (id, token_id, contract_address, name, description, image, owner, collection_address, metadata_uri)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, token_id, contract_address, name, description, image, owner, collection_address, metadata_uri);
    set.status = 201;
    return { id, ...body };
  }, {
    body: t.Object({
      token_id: t.Number(),
      contract_address: t.String(),
      name: t.String(),
      description: t.Optional(t.String()),
      image: t.Optional(t.String()),
      owner: t.String(),
      collection_address: t.Optional(t.String()),
      metadata_uri: t.Optional(t.String()),
    }),
  });
