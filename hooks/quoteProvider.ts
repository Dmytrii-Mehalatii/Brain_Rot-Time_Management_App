type BrainPartType =
  | "Health and Productivity"
  | "Social & News"
  | "Video & Audio"
  | "Games";

const QUOTES: Record<
  BrainPartType,
  { low: string; mid: string; high: string }
> = {
  "Health and Productivity": {
    low: "Your productivity is so low, even your 'to-do' list is on vacation",
    mid: "Moderate focus. You're basically a professional procrastinator who accidentally got something done",
    high: "Giga-Brain alert! Save some IQ for the rest of us, Socrates",
  },
  "Social & News": {
    low: "Actually talking to real people? What a vintage concept",
    mid: "You're keeping up with the world. Or just spying on your ex. We won't judge",
    high: "Chronically online. Your thumb must have a six-pack from all that scrolling",
  },
  "Video & Audio": {
    low: "Silence is golden, but your screen is surprisingly dark",
    mid: "Balanced consumption. A little bit of Netflix, a little bit of reality",
    high: "Brain mush confirmed. Are you watching the videos, or are they watching you now?",
  },
  Games: {
    low: "Wow you haven't touched a game? Good job keep up!",
    mid: "Casual gamer. You play just enough to justify the phone battery drain",
    high: "Absolute Rot. You've spent more time in a digital world than the real one today",
  },
};

export const getFunnyQuote = (type: BrainPartType, timeMinutes: number) => {
  if (timeMinutes < 60) return QUOTES[type].low;
  if (timeMinutes < 180) return QUOTES[type].mid;
  return QUOTES[type].high;
};
