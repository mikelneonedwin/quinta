"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "@/components/article-card";
import { WorkCard } from "@/components/work-card";
import { WORK_ITEMS } from "@/lib/work-data";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const STAGGER_CHILD = 0.15;

// Selected Journalism Articles published in external media
const FEATURED_ARTICLE = {
  title: "The Changing Landscape of Local Journalism in Uyo",
  excerpt: "An in-depth investigation into how digital disruption and economic pressures are reshaping print newsrooms across Akwa Ibom State.",
  date: "Oct 12, 2023",
  source: "The Pioneer",
  thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
  href: "https://thepioneer.example.com/uyo-local-journalism-landscape",
};

const SUPPORTING_ARTICLES = [
  {
    title: "Crude Realities: Ecological Fallout in the Niger Delta Creeks",
    excerpt: "Field report examining artisanal refining, spill response, and community health in coastal fishing settlements.",
    date: "Sep 18, 2023",
    source: "Premium Times",
    thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2070&auto=format&fit=crop",
    href: "https://premiumtimes.example.com/crude-realities-niger-delta",
  },
  {
    title: "Urban Renewal & Heritage Preservation in Uyo Metropolis",
    excerpt: "An architectural and social critique of rapid municipal infrastructure expansion.",
    date: "Aug 05, 2023",
    source: "Independent",
    thumbnail: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
    href: "https://independent.example.com/urban-renewal-uyo",
  }
];

export default function Home() {
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
              show: { opacity: 1, transition: { staggerChildren: STAGGER_CHILD } }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-4">
                Journalist & Writer
              </span>
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="font-mono text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6"
            >
              Quinta Akpan
            </motion.h1>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg font-sans"
            >
              Uncovering stories that shape our world. I report on culture, politics, and the intersection of traditional print media with the digital age.
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-wrap gap-4"
            >
              <Button render={<Link href="/work" />} size="lg" className="rounded-full px-6 font-mono">
                View My Work
              </Button>
              <Button render={<Link href="#contact" />} variant="outline" size="lg" className="rounded-full px-6 font-mono">
                Get in Touch
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-[45%] h-[340px] sm:h-[420px] lg:h-[480px] relative max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="w-full h-full rounded-2xl overflow-hidden p-0 border-border shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop" 
                alt="Quinta Akpan portrait" 
                className="w-full h-full object-cover"
              />
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
                Dedicated to rigorous, on-the-ground reporting in Southern Nigeria.
              </h2>
              <div className="text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4 font-sans">
                <p>
                  I have spent over a decade working closely with newspaper publishers to bring contextual investigative reporting to readers. My reporting centers on governance, environmental justice, and community resilience across Akwa Ibom and the Niger Delta.
                </p>
              </div>
            </div>

            {/* Vertically centered, unboxed location with right padding, equal sizing for Uyo & Nigeria, and notable vertical line spacing */}
            <div className="w-full md:w-[35%] flex md:justify-end items-center md:pr-6 lg:pr-10">
              <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-3.5 py-2">
                <MapPin className="w-8 h-8 text-primary stroke-[1.75] mb-1" />
                <span className="font-mono text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-none">
                  Uyo,
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-none">
                  Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="py-20 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
        <div className="mb-10">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">Articles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard 
            title={FEATURED_ARTICLE.title}
            excerpt={FEATURED_ARTICLE.excerpt}
            date={FEATURED_ARTICLE.date}
            source={FEATURED_ARTICLE.source}
            thumbnail={FEATURED_ARTICLE.thumbnail}
            href={FEATURED_ARTICLE.href}
            isExternal={true}
          />
          {SUPPORTING_ARTICLES.map((article, index) => (
            <ArticleCard 
              key={index}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              source={article.source}
              thumbnail={article.thumbnail}
              href={article.href}
              delay={(index + 1) * 0.1}
              isExternal={true}
            />
          ))}
        </div>
      </section>

      {/* WORK SECTION */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
          <div className="mb-12">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORK_ITEMS.slice(0, 3).map((work, index) => (
              <WorkCard key={work.id} item={work} delay={index * 0.1} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button  variant="outline" size="lg" className="rounded-full px-8 font-mono">
              <Link href="/work">View all projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS & AFFILIATIONS */}
      <section className="py-20 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto text-center">
        <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-10">
          Publications & Affiliations
        </span>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 text-muted-foreground font-mono">
          <span className="text-xl font-bold hover:text-foreground transition-colors cursor-default">The Pioneer</span>
          <span className="text-xl font-bold hover:text-foreground transition-colors cursor-default">Independent</span>
          <span className="text-xl font-bold uppercase tracking-wider hover:text-foreground transition-colors cursor-default">Premium Times</span>
          <span className="text-xl font-bold hover:text-foreground transition-colors cursor-default">Vanguard</span>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="py-16 w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
        <Card className="bg-card/90 backdrop-blur-xl border-border rounded-3xl shadow-lg relative overflow-hidden">
          <CardContent className="p-8 sm:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2">
              <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase block mb-2">
                Newsletter
              </span>
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-3 text-card-foreground">Direct to your inbox.</h2>
              <p className="text-base text-muted-foreground leading-relaxed font-sans">
                Subscribe to receive personal blog posts, reporting reflections, and commentary.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  required
                  className="flex-1 bg-background font-sans"
                />
                <Button 
                  type="submit"
                  className="whitespace-nowrap font-mono cursor-pointer"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left">No spam. Unsubscribe at any time.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-primary text-primary-foreground">
        <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto">
          <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
            <div className="w-full md:w-1/2">
              <h2 className="font-mono text-4xl sm:text-5xl font-bold mb-5">Let's Talk.</h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-md leading-relaxed font-sans">
                Available for journalism commissions, editorial writing, commentary, and speaking engagements.
              </p>
              <Button  variant="secondary" size="lg" className="rounded-full px-8 font-mono font-semibold">
                <a href="mailto:hello@quintaakpan.com">Email me</a>
              </Button>
            </div>
            
            <div className="w-full md:w-1/2 md:mt-4">
              <div className="flex flex-col gap-4 text-base font-mono">
                <a href="mailto:hello@quintaakpan.com" className="flex items-center gap-4 py-3.5 border-b border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors group">
                  <Mail className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors shrink-0" />
                  <span>hello@quintaakpan.com</span>
                </a>
                <a href="tel:+2348030000000" className="flex items-center gap-4 py-3.5 border-b border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors group">
                  <Phone className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors shrink-0" />
                  <span>+234 803 000 0000</span>
                </a>
                <a href="https://twitter.com/quinta" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-3.5 border-b border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors group">
                  <svg className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>@quinta_reports</span>
                </a>
                <a href="https://linkedin.com/in/quinta" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-3.5 border-b border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors group">
                  <svg className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Quinta Akpan</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
