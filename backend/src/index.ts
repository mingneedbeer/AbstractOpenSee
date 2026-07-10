import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { mkdirSync, existsSync } from "fs";
import { nftsRoutes } from "./routes/nfts";
import { usersRoutes } from "./routes/users";
import { collectionsRoutes } from "./routes/collections";
import { getDb } from "./db";

const dataDir = "./data";
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

getDb();

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4321",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }))
  .get("/api/health", () => ({
    status: "ok",
    timestamp: Date.now(),
    chain: "Abstract Testnet",
  }))
  .use(nftsRoutes)
  .use(usersRoutes)
  .use(collectionsRoutes)
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Not found" };
    }
    console.error(error);
    set.status = 500;
    return { error: "Internal server error" };
  })
  .listen(parseInt(process.env.PORT || "3001"));

console.log(`🦊 OpenSee API running at http://localhost:${app.server?.port}`);
console.log(`   Chain: Abstract Testnet (11124)`);

export type App = typeof app;
