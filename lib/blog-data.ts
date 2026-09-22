export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  thumbnail: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "on-the-loneliness-of-the-regional-reporter",
    title: "On the Loneliness of the Regional Reporter",
    excerpt: "Why the retreat of local newsrooms leaves communities vulnerable, and what it really feels like to be the only correspondent in a room where decisions get made.",
    date: "Oct 20, 2023",
    readTime: "6 min read",
    category: "Essays",
    thumbnail: "https://images.unsplash.com/photo-1455894127589-22f75500213a?q=80&w=2079&auto=format&fit=crop",
    content: `When a local newspaper office in a provincial capital closes its physical doors, nobody holds a funeral. A brass plate is unscrewed from a weather-beaten cedar doorframe, two desktop towers from 2011 are packed into the back of a station wagon, and five reporters are quietly told that their freelance retainers will henceforth be paid on acceptance rather than on submission.

In Uyo, that transition did not happen all at once. It happened in increments so gradual that most readers only noticed when obituary announcements shifted from the Saturday broadsheet to sponsored posts on Facebook.

For the journalist who chooses to remain outside the national capital, this retreat changes the texture of the work entirely. You are no longer one voice in a chorus of competing beat reporters jostling outside the state high court. Often, you are the only person sitting on the wooden bench with a reporter's notebook.

That solitude brings with it an acute responsibility. When there is no other reporter in the room, there is no second draft of the day's events. What you choose to record becomes the only surviving public account; what you overlook quietly dissolves into the background noise of administrative routine.

Over the past decade, I have watched the relationship between public officials and the press transform from adversarial respect to casual indifference. An official who knows that only one journalist is paying attention to a multi-million-naira procurement hearing does not feel compelled to prepare detailed explanations. They know the news cycle is brief, and that social media moves on within hours.

Yet there is also a quiet dignity in regional reporting. In a smaller city, you cannot hide behind an anonymous byline. You meet the subjects of your investigative reports at the baker's shop on Abak Road; you run into the magistrate whose rulings you critiqued while waiting for the morning papers at the newsstand. That proximity forces an honesty and a rigor that detached metropolitan journalism rarely demands.`,
  },
  {
    slug: "the-notebook-and-the-voice-memo",
    title: "The Notebook and the Voice Memo: An Argument for Slower Craft",
    excerpt: "Reflections on why transcription apps cannot capture silence, hesitation, or the nervous twitch of an interviewee's hands.",
    date: "Sep 28, 2023",
    readTime: "4 min read",
    category: "Craft",
    thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop",
    content: `Every young journalist entering the field today is handed a suite of automated transcription tools, AI-assisted summary widgets, and cloud recorders. They are told that efficiency is the primary metric of modern news production.

I disagree.

A digital recorder captures audio waveform with immaculate fidelity. What it cannot capture is the three-second hesitation before a retired civil servant admits why he resigned from the water board in 2018. It cannot record the way his eyes darted toward the hallway before lowering his voice.

The physical reporter's notebook forces a different kind of listening. Because you cannot write down every syllable verbatim, you are forced to synthesize in real time. You listen for inflection, for contradictions, for the sudden shift from rehearsed talking points to genuine vulnerability.

When I look back at notebooks from five years ago, the most valuable markings are rarely the quotes. They are the marginalia: "hands trembling," "pointed to blue ledger under desk," "refused tea when topic changed to land allocation."

In an era where synthetic text can be generated in seconds, the only competitive moat remaining for human journalism is presence: being in the room, watching the micro-expressions, and caring enough to listen between the sentences.`,
  },
  {
    slug: "reading-list-harmattan-approaching",
    title: "Reading List: When the Harmattan Approaches",
    excerpt: "Five books on environmental politics, West African history, and the craft of non-fiction that shaped my reporting this season.",
    date: "Aug 15, 2023",
    readTime: "5 min read",
    category: "Reading",
    thumbnail: "https://images.unsplash.com/photo-1456953180671-730de08edaa7?q=80&w=2071&auto=format&fit=crop",
    content: `As the rains begin to abate and the first dry gusts of the northern winds reach Akwa Ibom, our rhythms shift. For reporters who spend months in the wetlands and coastal estuaries, the dry season offers easier road access, but also clearer visibility into the seasonal ecological degradation that rain previously concealed.

Here are five books that have kept me grounded over the past quarter:

1. **The Niger Delta: Wetlands, Oil, and Politics** — A masterclass in archival research combined with granular local interviews. Essential for anyone seeking to understand why oil infrastructure politics cannot be separated from pre-colonial trade routes.

2. **The Elements of Journalism by Kovach & Rosenstiel** — A text I return to every year. Its central thesis—that journalism's first loyalty is to citizens—remains the cleanest antidote to institutional cynicism.

3. **In the Shadow of the Sun by Ryszard Kapuściński** — Though not without its historical controversies, Kapuściński's attentiveness to sensory detail and atmosphere remains instructive for any feature writer.

4. **Water and Land: Customary Tenure in Southern Nigeria** — Dense, legalistic, and utterly fascinating. It untangles the complex overlaps between statutory state ownership and traditional family landholdings.

5. **A Month in the Country by J.L. Carr** — A short, luminous novel about restoration, memory, and quiet survival. Sometimes the best preparation for long-form reporting is reading prose that knows how to breathe.`,
  },
  {
    slug: "notes-from-the-creeks",
    title: "Field Notes: What the Mangroves Remember",
    excerpt: "Unpublished vignettes and personal impressions from three weeks spent reporting in Eastern Obolo and Ibeno.",
    date: "Jul 02, 2023",
    readTime: "7 min read",
    category: "Field Notes",
    thumbnail: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2173&auto=format&fit=crop",
    content: `There is a particular sulfurous scent that settles over the mangrove swamps at low tide—a blend of decaying organic vegetation, brackish water, and the faintest metallic tang of hydrocarbon sheen.

When you spend weeks in a motorized wooden boat navigating the tidal channels of Eastern Obolo, time stops being measured by the clock on your phone and starts adhering to the tides. At high tide, you can reach the interior stilt villages where fishermen mend nylon monofilament nets under palm thatch roofs. At low tide, the mudflats expand for hundreds of meters, trapping boats in slick, grey silt.

In the formal newspaper articles I publish for external mastheads, there is no space for these sensory impressions. Editorial constraints demand cold statistics: barrels spilled per square kilometer, compensation amounts in litigation, quotes from government spokesmen.

This blog exists because those statistics are incomplete without the human backdrop: the sound of children singing hymns across the water at dawn, the taste of smoked bonga fish cooked over mangrove hardwood, and the quiet dignity of women who refuse to abandon waterways their grandmothers navigated.`,
  }
];
