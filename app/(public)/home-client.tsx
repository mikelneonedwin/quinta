"use client";

import { formatDate } from "@/lib/format-date";
import { getImageUrl } from "@/lib/image-url";
import { SocialIcon } from "@/components/social-icon";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { ArticleCard } from "@/components/article-card";
import { WorkCard } from "@/components/work-card";
import { NewsletterForm } from "@/components/newsletter-form";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/features/trpc/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;

interface HomeClientProps {
  settings: RouterOutputs["cms"]["getSettings"];
  contacts: RouterOutputs["cms"]["getContacts"];
  projects: RouterOutputs["projects"]["getAll"];
  articles: RouterOutputs["articles"]["getAll"];
}

const STAGGER_CHILD = 0.15;

export default function HomeClient({
  settings,
  contacts,
  projects,
  articles,
}: HomeClientProps) {
  const publications = Array.from(
    new Set(
      articles
        .map((a) => a.publication?.trim())
        .filter((pub): pub is string => Boolean(pub)),
    ),
  );

  return (
    <>
      {/* HERO SECTION */}
      <section className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-14">
          <motion.div
            className="w-full lg:w-[55%] flex flex-col justify-center"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: STAGGER_CHILD },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-4">
                {settings.heroTag}
              </span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="font-mono text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6"
            >
              {settings.name}
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg font-sans"
            >
              {settings.heroText}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap gap-4"
            >
              {projects && projects.length > 0 ? (
                <Link
                  href="/projects"
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-full px-6 font-mono",
                  })}
                >
                  View My Projects
                </Link>
              ) : articles && articles.length > 0 ? (
                <Link
                  href="/articles"
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-full px-6 font-mono",
                  })}
                >
                  Read My Articles
                </Link>
              ) : null}
              {contacts && contacts.length > 0 && (
                <Link
                  href="#contact"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "rounded-full px-6 font-mono",
                  })}
                >
                  Get in Touch
                </Link>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:w-[45%] h-[340px] sm:h-[420px] lg:h-[480px] relative max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="w-full h-full rounded-2xl overflow-hidden p-0 border-border shadow-md">
              {settings.portraitId ? (
                <img
                  src={getImageUrl(settings.portraitId)}
                  alt={`${settings.name || "Quinta Akpan"} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground font-mono">
                  <span className="text-5xl font-bold">QA</span>
                  <span className="text-xs uppercase tracking-widest mt-2">
                    {settings.name || "Quinta Akpan"}
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SHORT BIO SECTION */}
      <section className="bg-muted/30 py-20 border-y border-border">
        <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            {/* Bio text left */}
            <div className="w-full md:w-[65%]">
              <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-3">
                About
              </span>
              <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 text-foreground">
                {settings.aboutText}
              </h2>
              <div className="text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4 font-sans">
                {/* Normally we'd split this if we wanted paragraphs, but for now we'll just render it */}
                <p>{settings.aboutText}</p>
              </div>
            </div>

            {/* Vertically centered, unboxed location with right padding, equal sizing for Uyo & Nigeria, and notable vertical line spacing */}
            <div className="w-full md:w-[35%] flex md:justify-end items-center md:pr-6 lg:pr-10">
              <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-3.5 py-2">
                <MapPin className="w-8 h-8 text-primary stroke-[1.75] mb-1" />
                {settings.location
                  ?.split(",")
                  .map((part: string, i: number) => (
                    <span
                      key={i}
                      className="font-mono text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-none"
                    >
                      {part.trim()}
                      {i === 0 ? "," : ""}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      {articles && articles.length > 0 && (
        <section className="py-20 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
          <div className="mb-10 flex justify-between items-end">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
              Articles
            </h2>
            <Link
              href="/articles"
              className="font-mono text-sm text-primary hover:underline"
            >
              View all articles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article, index) => {
              const isExt = article.type === "external";
              return (
                <ArticleCard
                  key={article.id}
                  title={article.title || ""}
                  excerpt={
                    article.excerpt ||
                    (article.content
                      ? article.content
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 160)
                      : "") ||
                    ""
                  }
                  date={formatDate(article.publishedAt || article.createdAt)}
                  source={isExt ? article.publication || "External" : "Journal"}
                  thumbnail={article.coverImageId || article.imageId || ""}
                  href={
                    isExt ? article.link || "#" : `/articles/${article.slug}`
                  }
                  delay={index * 0.1}
                  isExternal={isExt}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* WORK / PROJECTS SECTION */}
      {projects && projects.length > 0 && (
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
            <div className="mb-12 flex justify-between items-end">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
                Projects
              </h2>
              <Link
                href="/projects"
                className="font-mono text-sm text-primary hover:underline"
              >
                View all projects &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((work, index) => (
                <WorkCard
                  key={work.id}
                  item={{
                    id: work.id,
                    title: work.title || "",
                    description: work.description || "",
                    role: "Project",
                    location: "",
                    visual: work.imageId || undefined,
                    date: formatDate(work.createdAt),
                    url: work.link || "#",
                  }}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "rounded-full px-8 font-mono",
                })}
              >
                View all projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PUBLICATIONS & AFFILIATIONS */}
      {publications.length > 0 && (
        <section className="py-20 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto text-center">
          <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-10">
            Affiliations
          </span>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 text-muted-foreground font-mono">
            {publications.map((pub) => (
              <span
                key={pub}
                className="text-xl font-bold hover:text-foreground transition-colors cursor-default"
              >
                {pub}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER SIGNUP */}
      <section className="py-16 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
        <NewsletterForm
          title="Direct to your inbox."
          subtitle="Subscribe to receive personal blog posts, reporting reflections, and commentary."
        />
      </section>

      {/* CONTACT SECTION */}
      {contacts && contacts.length > 0 && (
        <section
          id="contact"
          className="py-24 bg-primary text-primary-foreground"
        >
          <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
            <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
              <div className="w-full md:w-1/2">
                <h2 className="font-mono text-4xl sm:text-5xl font-bold mb-5">
                  Let&apos;s Talk.
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 max-w-md leading-relaxed font-sans">
                  Available for journalism commissions, editorial writing,
                  commentary, and speaking engagements.
                </p>
                {(() => {
                  const emailItem = contacts.find(
                    (c) => c.platform === "Email" || c.value.includes("@"),
                  );
                  if (!emailItem) return null;
                  const emailAddress = emailItem.value.replace(/^mailto:/, "");
                  const emailLink = `mailto:${emailAddress}`;

                  return (
                    <a
                      href={emailLink}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "lg",
                        className: "rounded-full px-8 font-mono font-semibold",
                      })}
                    >
                      Email me
                    </a>
                  );
                })()}
              </div>

              <div className="w-full md:w-1/2 md:mt-4">
                <div className="flex flex-col gap-4 text-base font-mono">
                  {contacts.map((contact, i) => {
                    const normalizeNigerianPhone = (num: string) => {
                      const digits = num.replace(/[\s\-\(\)\.]/g, "");
                      if (digits.startsWith("+234"))
                        return `+234${digits.substring(4)}`;
                      if (digits.startsWith("234")) return `+${digits}`;
                      if (digits.startsWith("0"))
                        return `+234${digits.substring(1)}`;
                      return digits.startsWith("+") ? digits : `+${digits}`;
                    };

                    const getContactHref = (platform: string, val: string) => {
                      const clean = val.trim();
                      if (platform === "Email")
                        return clean.startsWith("mailto:")
                          ? clean
                          : `mailto:${clean}`;
                      if (platform === "Phone") {
                        const cleanPhone = clean.replace(/^tel:/i, "");
                        return `tel:${normalizeNigerianPhone(cleanPhone)}`;
                      }
                      if (platform === "WhatsApp") {
                        const cleanPhone = clean.replace(
                          /^https?:\/\/wa\.me\//i,
                          "",
                        );
                        const normalized = normalizeNigerianPhone(cleanPhone);
                        const waDigits = normalized.replace(/^\+/, "");
                        return `https://wa.me/${waDigits}`;
                      }
                      const username = clean
                        .replace(
                          /^https?:\/\/(www\.)?(x\.com|twitter\.com|linkedin\.com\/in|instagram\.com|facebook\.com|substack\.com\/@|github\.com|youtube\.com\/@|tiktok\.com\/@)\//i,
                          "",
                        )
                        .replace(/^@+/, "")
                        .replace(/\/+$/, "");

                      if (platform === "X") return `https://x.com/${username}`;
                      if (platform === "LinkedIn")
                        return `https://linkedin.com/in/${username}`;
                      if (platform === "Instagram")
                        return `https://instagram.com/${username}`;
                      if (platform === "Facebook")
                        return `https://facebook.com/${username}`;
                      if (platform === "GitHub")
                        return `https://github.com/${username}`;
                      if (platform === "Substack")
                        return clean.includes("substack.com")
                          ? clean
                          : `https://${username}.substack.com`;
                      if (platform === "YouTube")
                        return `https://youtube.com/@${username}`;
                      if (platform === "TikTok")
                        return `https://tiktok.com/@${username}`;
                      return clean.startsWith("http")
                        ? clean
                        : `https://${clean}`;
                    };

                    const getContactDisplay = (
                      platform: string,
                      val: string,
                    ) => {
                      const clean = val
                        .replace(/^mailto:/i, "")
                        .replace(/^tel:/i, "")
                        .replace(/^https?:\/\/wa\.me\//i, "")
                        .trim();
                      if (platform === "Phone" || platform === "WhatsApp") {
                        return normalizeNigerianPhone(clean);
                      }
                      if (
                        platform === "X" ||
                        platform === "Instagram" ||
                        platform === "TikTok" ||
                        platform === "YouTube"
                      ) {
                        const username = clean
                          .replace(
                            /^https?:\/\/(www\.)?(x\.com|twitter\.com|instagram\.com|tiktok\.com\/@|youtube\.com\/@)\//i,
                            "",
                          )
                          .replace(/^@+/, "")
                          .replace(/\/+$/, "");
                        return `${username}`;
                      }
                      if (
                        platform === "LinkedIn" ||
                        platform === "Facebook" ||
                        platform === "GitHub" ||
                        platform === "Substack"
                      ) {
                        const username = clean
                          .replace(
                            /^https?:\/\/(www\.)?(linkedin\.com\/in|facebook\.com|github\.com|substack\.com\/@)\//i,
                            "",
                          )
                          .replace(/^@+/, "")
                          .replace(/\/+$/, "");
                        return username;
                      }
                      return clean;
                    };

                    const isDirect =
                      contact.platform === "Email" ||
                      contact.platform === "Phone";

                    return (
                      <a
                        key={i}
                        href={getContactHref(contact.platform, contact.value)}
                        target={isDirect ? undefined : "_blank"}
                        rel={isDirect ? undefined : "noopener noreferrer"}
                        className="flex items-center gap-4 py-3.5 border-b border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors group"
                      >
                        <SocialIcon
                          platform={contact.platform}
                          className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors shrink-0"
                        />
                        <span className="truncate">
                          {getContactDisplay(contact.platform, contact.value)}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
