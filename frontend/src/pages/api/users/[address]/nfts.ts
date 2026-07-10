import type { APIRoute } from "astro";
import { sql, ensureDb } from "../../../../lib/db";

export const GET: APIRoute = async ({ params, url }) => {
  await ensureDb();
  const { address } = params;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
  const offset = (page - 1) * limit;

  const countResult = await sql.query(
    "SELECT COUNT(*)::int as total FROM nfts WHERE LOWER(owner) = LOWER($1)",
    [address]
  );
  const total = countResult.rows[0].total;

  const dataResult = await sql.query(
    "SELECT * FROM nfts WHERE LOWER(owner) = LOWER($1) ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    [address, limit, offset]
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
