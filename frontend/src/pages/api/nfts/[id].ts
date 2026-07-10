import type { APIRoute } from "astro";
import { sql, ensureDb } from "../../../lib/db";

export const GET: APIRoute = async ({ params }) => {
  await ensureDb();
  const { id } = params;
  const result = await sql.query("SELECT * FROM nfts WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return new Response(
      JSON.stringify({ error: "NFT not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(result.rows[0]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
