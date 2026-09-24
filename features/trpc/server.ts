import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createCaller, type AppRouter } from "./root";
import { createTRPCContext } from "./index";
import { createQueryClient } from "./query-client";
import { env } from "@/env";

const createContext = cache(async () => {
  let heads = new Headers();
  try {
    heads = new Headers(await headers());
  } catch {
    // Safe fallback during static prerendering
  }
  heads.set("x-trpc-source", "rsc");

  // Create a mock request object for Better Auth to use in RSC
  const req = new Request(env.BASE_URL, { headers: heads });

  return createTRPCContext({ req });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
