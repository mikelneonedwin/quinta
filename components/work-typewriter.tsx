"use client";

import * as React from "react";

const WORK_TYPES = [
  "Reporting on Breaking and Developing News",
  "Conducting In-Depth Interviews and Conversations",
  "Writing Detailed Feature Stories",
  "Producing Investigative and Accountability Reports",
  "Covering Government and Public Affairs",
];

export function WorkTypewriter() {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"typing" | "paused" | "deleting">("typing");
  const [charIndex, setCharIndex] = React.useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    let timeout: NodeJS.Timeout;
    const currentPhrase = WORK_TYPES[phraseIndex];

    if (phase === "typing") {
      if (charIndex < currentPhrase.length) {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, 35); // Typing speed
      } else {
        timeout = setTimeout(() => {
          setPhase("paused");
        }, 35);
      }
    } else if (phase === "paused") {
      timeout = setTimeout(() => {
        setPhase("deleting");
      }, 1000); // Wait 1s before disappearing
    } else if (phase === "deleting") {
      timeout = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % WORK_TYPES.length);
        setCharIndex(0);
        setPhase("typing");
      }, 350); // 350ms for the CSS wipe to complete
    }

    return () => clearTimeout(timeout);
  }, [phase, charIndex, phraseIndex, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="flex items-center gap-2 font-mono text-sm sm:text-base text-muted-foreground mb-8">
        <span className="text-muted-foreground font-medium">My work includes</span>
        <span className="text-foreground font-semibold">{WORK_TYPES.join(" • ")}</span>
      </div>
    );
  }

  const fullText = WORK_TYPES[phraseIndex];
  // Keep the text fully rendered during deletion so we can wipe it via CSS
  const displayedText = phase === "deleting" ? fullText : fullText.slice(0, charIndex);

  return (
    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 font-mono text-sm sm:text-base text-muted-foreground mb-8 min-h-[1.75rem]">
      {/* Static leading text */}
      <span className="text-muted-foreground font-medium whitespace-nowrap">
        My work includes
      </span>

      <div className="flex items-center min-w-0">
        {/* Animated changing text with CSS wipe */}
        <span 
          className="text-foreground font-semibold tracking-wide whitespace-nowrap transition-all ease-out"
          style={{
            clipPath: phase === "deleting" ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)",
            transitionDuration: phase === "deleting" ? "350ms" : "0ms",
          }}
        >
          {displayedText}
        </span>

        {/* Blinking editorial cursor */}
        <span 
          className={`inline-block w-[2px] h-4 sm:h-5 bg-primary ml-[1px] ${
            phase === "paused" ? "animate-[pulse_1s_ease-in-out_infinite]" : ""
          } ${phase === "deleting" ? "opacity-0 transition-opacity duration-150" : "opacity-100"}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
