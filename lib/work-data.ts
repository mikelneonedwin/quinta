export interface WorkItem {
  id: string;
  title: string;
  role: string;
  location: string;
  date: string;
  description: string;
  visual?: string;
  url: string;
}

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "election-coverage-2023",
    title: "Akwa Ibom Gubernatorial & State Assembly Elections",
    role: "Lead Field Reporter • The Pioneer",
    location: "Uyo, Nigeria",
    date: "Feb – Mar 2023",
    description: "Multi-week on-the-ground election monitoring across 15 local government areas, tracking polling logistics, voter turnout, and electoral integrity.",
    visual: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop",
    url: "https://thepioneer.example.com/elections-2023-special",
  },
  {
    id: "coastal-highway-investigation",
    title: "The Coastal Highway Project Investigation",
    role: "Investigative Lead • Premium Times",
    location: "Eket & Ibeno, Nigeria",
    date: "Nov 2022",
    description: "A three-part investigative series probing municipal contractor delays, budget allocations, and compensation bottlenecks for displaced littoral communities.",
    visual: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
    url: "https://premiumtimes.example.com/coastal-highway-investigation",
  },
  {
    id: "artisanal-refining-delta",
    title: "Crude Realities: Artisanal Refining in the Creeks",
    role: "Special Correspondent • Independent",
    location: "Eastern Obolo, Nigeria",
    date: "Sep 2023",
    description: "Extensive fieldwork in coastal estuaries assessing the environmental fallout, health crises, and economic survival networks around local artisanal refining.",
    visual: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=2070&auto=format&fit=crop",
    url: "https://independent.example.com/crude-realities-fieldwork",
  },
  {
    id: "palm-oil-smallholders",
    title: "The Politics of Palm Oil: Smallholders vs Agribusiness",
    role: "Feature Reporter • Vanguard",
    location: "Abak & Ikot Ekpene, Nigeria",
    date: "May 2023",
    description: "Documenting customary land tenure disputes, smallholder cooperatives, and industrial agricultural concessions in rural Akwa Ibom.",
    visual: "https://images.unsplash.com/photo-1517427677506-ade074eb1432?q=80&w=2070&auto=format&fit=crop",
    url: "https://vanguard.example.com/palm-oil-smallholders",
  },
  {
    id: "urban-heritage-preservation",
    title: "Urban Renewal & Heritage Loss in Colonial Uyo",
    role: "Cultural Analyst • The Pioneer",
    location: "Uyo Metropolis, Nigeria",
    date: "Aug 2023",
    description: "An architectural and historical critique of rapid municipal redevelopment projects and the demolition of pre-independence civic landmarks.",
    visual: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop",
    url: "https://thepioneer.example.com/heritage-loss-uyo",
  },
  {
    id: "estuary-fisheries-climate",
    title: "Cross River Estuary Fisheries & Climate Vulnerability",
    role: "Environmental Reporter • Premium Times",
    location: "Oron, Nigeria",
    date: "Jun 2023",
    description: "Profiling women-led artisanal fisheries coping with saltwater intrusion, industrial trawler incursions, and shifting seasonal tides.",
    visual: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=2071&auto=format&fit=crop",
    url: "https://premiumtimes.example.com/estuary-fisheries-climate",
  },
];
