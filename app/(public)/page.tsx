import { api, HydrateClient } from "@/features/trpc/server";
import HomeClient from "./home-client";

export default async function Home() {
  const settings = await api.cms.getSettings();
  const contacts = await api.cms.getContacts();
  const projects = await api.projects.getAll();
  const articles = await api.articles.getAll();

  return (
    <HydrateClient>
      <HomeClient
        settings={settings}
        contacts={contacts}
        projects={projects}
        articles={articles}
      />
    </HydrateClient>
  );
}
