import type { APIRoute } from "astro";
import { sql, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ url }) => {
  await ensureDb();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
  const offset = (page - 1) * limit;

  const countResult = await sql.query("SELECT COUNT(*)::int as total FROM collections");
  const total = countResult.rows[0].total;

  const dataResult = await sql.query(
    "SELECT * FROM collections ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );

  return new Response(
    JSON.stringify({
      items: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  await ensureDb();
  try {
    const body = await request.json();
    const { address, name, description, image, banner, owner } = body;

    const existing = await sql.query(
      "SELECT address FROM collections WHERE LOWER(address) = LOWER($1)",
      [address]
    );

    if (existing.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Collection already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql.query(
      `INSERT INTO collections (address, name, description, image, banner, owner)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [address, name, description || null, image || null, banner || null, owner]
    );

    const result = await sql.query("SELECT * FROM collections WHERE address = $1", [address]);

    return new Response(
      JSON.stringify(result.rows[0]),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
