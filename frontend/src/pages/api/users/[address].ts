import type { APIRoute } from "astro";
import { sql, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ params }) => {
  await ensureDb();
  const { address } = params;
  const result = await sql.query(
    "SELECT * FROM users WHERE LOWER(address) = LOWER($1)",
    [address]
  );

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
  const { address } = params;
  const body = await request.json();
  const { username, bio, avatar, twitter, website } = body;

  const existing = await sql.query(
    "SELECT address FROM users WHERE LOWER(address) = LOWER($1)",
    [address]
  );

  if (existing.rows.length > 0) {
    await sql.query(
      `UPDATE users SET
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        avatar = COALESCE($3, avatar),
        twitter = COALESCE($4, twitter),
        website = COALESCE($5, website),
        updated_at = EXTRACT(EPOCH FROM NOW())::bigint
       WHERE LOWER(address) = LOWER($6)`,
      [username || null, bio || null, avatar || null, twitter || null, website || null, address]
    );
  } else {
    await sql.query(
      `INSERT INTO users (address, username, bio, avatar, twitter, website)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [address, username || null, bio || null, avatar || null, twitter || null, website || null]
    );
  }

  const result = await sql.query(
    "SELECT * FROM users WHERE LOWER(address) = LOWER($1)",
    [address]
  );

  return new Response(
    JSON.stringify(result.rows[0]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
