import {
  createTRPCRouter,
  publicProcedure,
  createCallerFactory,
} from "./index";
import { cmsRouter } from "./routers/cms";
import { projectsRouter } from "./routers/projects";
import { articlesRouter } from "./routers/articles";

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "OK"),
  cms: cmsRouter,
  projects: projectsRouter,
  articles: articlesRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
