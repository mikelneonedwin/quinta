"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/blog", label: "Blog" },
  { href: "/work", label: "Work" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      window.location.href = "/#contact";
      return;
    }
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-xl shadow-xs border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
        <div className="flex h-20 items-center justify-between gap-2">
          {/* Logo / Name - Prevent compression on 390px mobile screens */}
          <div className="shrink-0 min-w-max">
            <Link href="/" className="font-mono text-lg sm:text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
              Quinta Akpan
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-mono font-medium rounded-full transition-all duration-300 ${
                    isActive 
                      ? "bg-secondary text-secondary-foreground shadow-xs font-semibold" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right actions */}
          <div className="hidden md:flex shrink-0 justify-end items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToContact}
              className="text-sm font-mono font-medium text-foreground hover:text-primary cursor-pointer transition-colors duration-200"
            >
              Contact
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full relative w-8 h-8 cursor-pointer transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {/* Mobile Right actions */}
          <div className="flex items-center md:hidden gap-1.5 shrink-0 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full relative w-8 h-8 shrink-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute inset-x-0 top-full z-50 origin-top bg-background/95 backdrop-blur-xl border-b border-border shadow-lg md:hidden overflow-hidden"
          >
            <div className="w-[92%] sm:w-[85%] mx-auto py-6 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-lg font-medium text-muted-foreground">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-lg font-mono font-medium rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-secondary text-secondary-foreground font-semibold" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={scrollToContact}
                  className="text-left px-4 py-3 text-lg font-mono font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
                >
                  Contact
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
