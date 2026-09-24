import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/features/db";
import { CMSForm } from "./cms-form";
import { SocialsForm } from "./socials-form";
import { count } from "drizzle-orm";
import { articles } from "@/features/db/schemas/blog";
import { projects } from "@/features/db/schemas/cms";

export default async function DashboardOverview() {
  const [articlesCountResult, projectsCountResult] = await Promise.all([
    db.select({ count: count() }).from(articles),
    db.select({ count: count() }).from(projects),
  ]);

  const articlesCount = articlesCountResult[0].count;
  const projectsCount = projectsCountResult[0].count;

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-mono font-bold tracking-tight">
          Overview
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground shadow hover:bg-secondary/80 h-9 px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
          <Link
            href="/dashboard/articles/new"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/articles"
          className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono">
                Articles
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articlesCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Manage both your internal essays and external publications.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/dashboard/projects"
          className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        >
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono">
                Projects
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Manage investigative projects, assignments, and field reports.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="pt-6 border-t border-border grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-mono font-bold tracking-tight mb-6">
            Site Settings
          </h2>
          <CMSForm />
        </div>
        <div>
          <h2 className="text-2xl font-mono font-bold tracking-tight mb-6">
            Socials
          </h2>
          <SocialsForm />
        </div>
      </div>
    </div>
  );
}
