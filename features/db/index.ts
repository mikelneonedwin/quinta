import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../../env";
import * as schema from "./schema";

neonConfig.fetchFunction = async (
  url: string | URL | Request,
  init?: RequestInit,
) => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      lastError = err;
      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 300 * Math.pow(2, attempt)),
        );
      }
    }
  }
  throw lastError;
};

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });
