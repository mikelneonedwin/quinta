import { api, HydrateClient } from "@/features/trpc/server";
import ProjectsClient from "./projects-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Investigative projects, reporting series, interviews, and special field dispatches.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects",
    description:
      "Investigative projects, reporting series, interviews, and special field dispatches.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    title: "Projects",
    description:
      "Investigative projects, reporting series, interviews, and special field dispatches.",
    card: "summary_large_image",
  },
};

export default async function ProjectsPage() {
  const projects = await api.projects.getAll();

  return (
    <HydrateClient>
      <ProjectsClient projects={projects} />
    </HydrateClient>
  );
}
