import type { APIRoute } from "astro";
import { getDb, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ params }) => {
  await ensureDb();
  const db = getDb();

  const result = await db.execute({
    sql: "SELECT * FROM users WHERE LOWER(address) = LOWER(?)",
    args: [params.address],
  });

  if (result.rows.length === 0) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(result.rows[0]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const PUT: APIRoute = async ({ params, request }) => {
  await ensureDb();
  const db = getDb();
  const { address } = params;
  const body = await request.json();
  const { username, bio, avatar, twitter, website } = body;

  const existing = await db.execute({
    sql: "SELECT address FROM users WHERE LOWER(address) = LOWER(?)",
    args: [address],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: `UPDATE users SET
        username = COALESCE(?, username),
        bio = COALESCE(?, bio),
        avatar = COALESCE(?, avatar),
        twitter = COALESCE(?, twitter),
        website = COALESCE(?, website),
        updated_at = unixepoch()
       WHERE LOWER(address) = LOWER(?)`,
      args: [username || null, bio || null, avatar || null, twitter || null, website || null, address],
    });
  } else {
    await db.execute({
      sql: `INSERT INTO users (address, username, bio, avatar, twitter, website)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [address, username || null, bio || null, avatar || null, twitter || null, website || null],
    });
  }

  const result = await db.execute({
    sql: "SELECT * FROM users WHERE LOWER(address) = LOWER(?)",
    args: [address],
  });

  return new Response(
    JSON.stringify(result.rows[0]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
