import type { APIRoute } from "astro";
import { getDb, ensureDb } from "../../../../lib/db";

export const GET: APIRoute = async ({ params, url }) => {
  await ensureDb();
  const db = getDb();
  const { address } = params;

  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
  const offset = (page - 1) * limit;

  const countResult = await db.execute({
    sql: "SELECT COUNT(*) as total FROM nfts WHERE LOWER(owner) = LOWER(?)",
    args: [address],
  });
  const total = Number(countResult.rows[0].total);

  const dataResult = await db.execute({
    sql: "SELECT * FROM nfts WHERE LOWER(owner) = LOWER(?) ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [address, limit, offset],
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
