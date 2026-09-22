"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/article-card";
import { motion } from "framer-motion";

// Articles are journalism published through external media & newspapers
const MOCK_ARTICLES = [
  {
    title: "The Changing Landscape of Local Journalism in Uyo",
    excerpt: "An in-depth investigation into how digital disruption and economic pressures are reshaping print newsrooms across Akwa Ibom State.",
    date: "Oct 12, 2023",
    source: "The Pioneer",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
    href: "https://thepioneer.example.com/changing-landscape",
  },
  {
    title: "Crude Realities: Ecological Fallout in the Niger Delta Creeks",
    excerpt: "Field report examining artisanal refining, spill response, and community health in coastal fishing settlements.",
    date: "Sep 18, 2023",
    source: "Premium Times",
    thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2070&auto=format&fit=crop",
    href: "https://premiumtimes.example.com/crude-realities",
  },
  {
    title: "Urban Renewal & Heritage Preservation in Uyo Metropolis",
    excerpt: "An architectural and social critique of rapid municipal infrastructure expansion.",
    date: "Aug 05, 2023",
    source: "Independent",
    thumbnail: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
    href: "https://independent.example.com/urban-renewal",
  },
  {
    title: "Fiscal Transparency in State Municipal Allocations",
    excerpt: "Tracing public spending on health centers and primary education infrastructure across rural local governments.",
    date: "Jul 14, 2023",
    source: "Vanguard",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop",
    href: "https://vanguard.example.com/fiscal-transparency",
  },
  {
    title: "Women in the Artisanal Fisheries of the Cross River Basin",
    excerpt: "A documentary profile on economic survival, cooperative unions, and climate risks along the estuaries.",
    date: "May 22, 2023",
    source: "The Pioneer",
    thumbnail: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=2071&auto=format&fit=crop",
    href: "https://thepioneer.example.com/women-artisanal-fisheries",
  },
  {
    title: "The Politics of Palm Oil: Smallholders vs Industrial Plantations",
    excerpt: "Investigating land concessions and agricultural policy shifts affecting indigenous farming families.",
    date: "Mar 30, 2023",
    source: "Premium Times",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    href: "https://premiumtimes.example.com/politics-palm-oil",
  }
];

export default function ArticlesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[92%] sm:w-[85%] lg:w-[80%] mx-auto py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-14"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Articles
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans">
          Archive of investigative reports, feature stories, and commentary across news publications.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6).fill(0).map((_, i) => (
              <ArticleCard key={i} isLoading={true} title="" excerpt="" date="" href="" />
            ))
          : MOCK_ARTICLES.map((article, i) => (
              <ArticleCard 
                key={i} 
                {...article} 
                delay={i * 0.08}
                isExternal={true}
              />
            ))}
      </div>
    </div>
  );
}
