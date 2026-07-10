import type { APIRoute } from "astro";
import { getDb, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ url }) => {
  await ensureDb();
  const db = getDb();

  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
  const offset = (page - 1) * limit;

  const countResult = await db.execute("SELECT COUNT(*) as total FROM collections");
  const total = Number(countResult.rows[0].total);

  const dataResult = await db.execute({
    sql: "SELECT * FROM collections ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [limit, offset],
  });

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
  const db = getDb();

  try {
    const body = await request.json();
    const { address, name, description, image, banner, owner } = body;

    const existing = await db.execute({
      sql: "SELECT address FROM collections WHERE LOWER(address) = LOWER(?)",
      args: [address],
    });

    if (existing.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Collection already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.execute({
      sql: `INSERT INTO collections (address, name, description, image, banner, owner)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [address, name, description || null, image || null, banner || null, owner],
    });

    const result = await db.execute({
      sql: "SELECT * FROM collections WHERE address = ?",
      args: [address],
    });

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
