import { Elysia, t } from "elysia";
import { getDb } from "../db";
import type { User, NFT } from "../types";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .get("/:address", ({ params: { address }, set }) => {
    const db = getDb();
    const user = db.query("SELECT * FROM users WHERE LOWER(address) = LOWER(?)").get(address) as User | undefined;
    if (!user) {
      set.status = 404;
      return { error: "User not found" };
    }
    return user;
  })

  .put("/:address", ({ params: { address }, body }) => {
    const db = getDb();
    const existing = db.query("SELECT address FROM users WHERE LOWER(address) = LOWER(?)").get(address);
    if (existing) {
      db.query(
        `UPDATE users SET username = COALESCE(?, username), bio = COALESCE(?, bio),
         avatar = COALESCE(?, avatar), twitter = COALESCE(?, twitter),
         website = COALESCE(?, website), updated_at = unixepoch()
         WHERE LOWER(address) = LOWER(?)`
      ).run(body.username, body.bio, body.avatar, body.twitter, body.website, address);
    } else {
      db.query(
        `INSERT INTO users (address, username, bio, avatar, twitter, website)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(address, body.username || null, body.bio || null, body.avatar || null, body.twitter || null, body.website || null);
    }
    return db.query("SELECT * FROM users WHERE LOWER(address) = LOWER(?)").get(address);
  }, {
    body: t.Object({
      username: t.Optional(t.String()),
      bio: t.Optional(t.String()),
      avatar: t.Optional(t.String()),
      twitter: t.Optional(t.String()),
      website: t.Optional(t.String()),
    }),
  })

  .get("/:address/nfts", ({ params: { address }, query }) => {
    const db = getDb();
    const page = Math.max(1, parseInt(query.page || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "24")));
    const offset = (page - 1) * limit;

    const countRow = db.query(
      "SELECT COUNT(*) as total FROM nfts WHERE LOWER(owner) = LOWER(?)"
    ).get(address) as { total: number };

    const items = db.query(
      "SELECT * FROM nfts WHERE LOWER(owner) = LOWER(?) ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).all(address, limit, offset) as NFT[];

    return {
      items,
      total: countRow.total,
      page,
      limit,
      totalPages: Math.ceil(countRow.total / limit),
    };
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  });
