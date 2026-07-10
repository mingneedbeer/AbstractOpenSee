import type { APIRoute } from "astro";
import { getDb, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ params }) => {
  await ensureDb();
  const db = getDb();

  const result = await db.execute({
    sql: "SELECT * FROM collections WHERE LOWER(address) = LOWER(?)",
    args: [params.address],
  });

  if (result.rows.length === 0) {
    return new Response(
      JSON.stringify({ error: "Collection not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(result.rows[0]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
