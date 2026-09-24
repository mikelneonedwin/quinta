"use client";

import * as React from "react";

const PROJECT_TYPES = [
  "reporting on breaking and developing news",
  "conducting in-depth interviews and conversations",
  "writing detailed feature stories",
  "producing investigative and accountability reports",
  "covering government and public affairs",
];

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function WorkTypewriter() {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const currentPhrase = PROJECT_TYPES[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase (calm, slower typing)
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 80); // Calm typing speed
      } else {
        // Pause at full word before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      // Deleting phase (calm deletion)
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 45); // Calm deletion speed
      } else {
        // Pause before typing next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % PROJECT_TYPES.length);
        }, 300);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base text-muted-foreground mb-8">
        <span className="text-muted-foreground font-medium">
          My work includes
        </span>
        <span className="text-muted-foreground font-medium">
          {PROJECT_TYPES.join(" • ")}
        </span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm sm:text-base text-muted-foreground mb-8 min-h-[2rem]">
      <span className="text-muted-foreground font-medium mr-2 inline">
        My work includes
      </span>
      <span className="text-muted-foreground font-medium inline break-words">
        {displayedText}
      </span>
      <span
        className="inline-block w-[2px] h-4 sm:h-5 bg-primary ml-1 align-middle animate-[pulse_1s_ease-in-out_infinite]"
        aria-hidden="true"
      />
    </div>
  );
}
