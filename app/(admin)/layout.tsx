import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heads = await headers();
  const session = await auth.api.getSession({
    headers: heads,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
