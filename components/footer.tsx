"use client";

import Link from "next/link";
import { authClient } from "@/features/auth/client";

export function Footer() {
  const { data: session } = authClient.useSession();

  return (
    <footer className="py-8 bg-muted/60 border-t border-border text-muted-foreground mt-auto">
      <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
        <p>
          &copy; {new Date().getFullYear()} Quinta Akpan. All rights reserved.
        </p>
        <nav className="flex gap-6 items-center flex-wrap justify-center">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/articles"
            className="hover:text-foreground transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/projects"
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-foreground hover:text-primary font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
