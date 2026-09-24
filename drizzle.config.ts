import { env } from "./env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./features/db/schema.ts",
  out: "./features/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
