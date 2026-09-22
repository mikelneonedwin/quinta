import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 bg-muted/60 border-t border-border text-muted-foreground mt-auto">
      <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
        <div className="text-base text-foreground font-bold">
          Quinta Akpan
        </div>
        <p>
          &copy; {new Date().getFullYear()} Quinta Akpan. All rights reserved.
        </p>
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link href="/work" className="hover:text-foreground transition-colors">Work</Link>
        </nav>
      </div>
    </footer>
  );
}
