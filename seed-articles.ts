import { db } from "./features/db";
import { articles } from "./features/db/schemas/blog";
import { v4 as uuidv4 } from "uuid";

const MOCK_ARTICLES = [
  {
    title: "The Changing Landscape of Local Journalism in Uyo",
    excerpt:
      "An in-depth investigation into how digital disruption and economic pressures are reshaping print newsrooms across Akwa Ibom State.",
    date: new Date("2023-10-12"),
    source: "The Pioneer",
    thumbnail:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
    href: "https://thepioneer.example.com/changing-landscape",
  },
  {
    title: "Crude Realities: Ecological Fallout in the Niger Delta Creeks",
    excerpt:
      "Field report examining artisanal refining, spill response, and community health in coastal fishing settlements.",
    date: new Date("2023-09-18"),
    source: "Premium Times",
    thumbnail:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2070&auto=format&fit=crop",
    href: "https://premiumtimes.example.com/crude-realities",
  },
  {
    title: "Urban Renewal & Heritage Preservation in Uyo Metropolis",
    excerpt:
      "An architectural and social critique of rapid municipal infrastructure expansion.",
    date: new Date("2023-08-05"),
    source: "Independent",
    thumbnail:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
    href: "https://independent.example.com/urban-renewal",
  },
  {
    title: "Fiscal Transparency in State Municipal Allocations",
    excerpt:
      "Tracing public spending on health centers and primary education infrastructure across rural local governments.",
    date: new Date("2023-07-14"),
    source: "Vanguard",
    thumbnail:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop",
    href: "https://vanguard.example.com/fiscal-transparency",
  },
  {
    title: "Women in the Artisanal Fisheries of the Cross River Basin",
    excerpt:
      "A documentary profile on economic survival, cooperative unions, and climate risks along the estuaries.",
    date: new Date("2023-05-22"),
    source: "The Pioneer",
    thumbnail:
      "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=2071&auto=format&fit=crop",
    href: "https://thepioneer.example.com/women-artisanal-fisheries",
  },
  {
    title: "The Politics of Palm Oil: Smallholders vs Industrial Plantations",
    excerpt:
      "Investigating land concessions and agricultural policy shifts affecting indigenous farming families.",
    date: new Date("2023-03-30"),
    source: "Premium Times",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    href: "https://premiumtimes.example.com/politics-palm-oil",
  },
];

async function seed() {
  console.log("Seeding articles...");
  for (const article of MOCK_ARTICLES) {
    await db.insert(articles).values({
      id: uuidv4(),
      title: article.title,
      excerpt: article.excerpt,
      publication: article.source,
      link: article.href,
      imageId: article.thumbnail,
      publishedAt: article.date,
    });
  }
  console.log("Done seeding articles!");
}

seed().catch(console.error);
