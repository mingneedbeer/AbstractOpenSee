import type { APIRoute } from "astro";
import { sql, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ url }) => {
  await ensureDb();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search");
  const sort = url.searchParams.get("sort");
  const collection = url.searchParams.get("collection");
  const owner = url.searchParams.get("owner");

  const conditions: string[] = [];
  const params: any[] = [];

  if (search) {
    conditions.push(`(name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`);
    params.push(`%${search}%`, `%${search}%`);
  }
  if (collection) {
    conditions.push(`collection_address = $${params.length + 1}`);
    params.push(collection);
  }
  if (owner) {
    conditions.push(`owner = $${params.length + 1}`);
    params.push(owner);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let orderBy = "ORDER BY created_at DESC";
  if (sort === "oldest") orderBy = "ORDER BY created_at ASC";
  if (sort === "name") orderBy = "ORDER BY name ASC";

  const countResult = await sql.query(
    `SELECT COUNT(*)::int as total FROM nfts ${where}`,
    params
  );
  const total = countResult.rows[0].total;

  const dataResult = await sql.query(
    `SELECT * FROM nfts ${where} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
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
    const { token_id, contract_address, name, description, image, owner, collection_address, metadata_uri } = body;
    const id = `${contract_address}:${token_id}`;

    const existing = await sql.query("SELECT id FROM nfts WHERE id = $1", [id]);
    if (existing.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "NFT already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    await sql.query(
      `INSERT INTO nfts (id, token_id, contract_address, name, description, image, owner, collection_address, metadata_uri)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, token_id, contract_address, name, description || null, image || null, owner, collection_address || null, metadata_uri || null]
    );

    return new Response(
      JSON.stringify({ id, ...body }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
