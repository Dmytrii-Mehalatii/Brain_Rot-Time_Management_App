import {
  BookOpen,
  Calendar,
  ChefHat,
  Clapperboard,
  Dribbble,
  EyeClosed,
  Footprints,
  GraduationCap,
  Music,
  Smartphone,
  SquareActivity,
  Wind,
  type LucideIcon,
} from "lucide-react-native";

export type WhatIfCard = {
  icon: LucideIcon;
  title: string;
  /** Builds the card copy from today's total screen time. */
  describe: (minutes: number) => string;
};

export type WhatIfGroup = {
  key: "knowledge" | "health" | "creativity" | "universal";
  title: string;
  /** Two half-width cards followed by one full-width card. */
  cards: [WhatIfCard, WhatIfCard, WhatIfCard];
};

const perMinutes = (minutes: number, span: number) =>
  Math.floor(minutes / span);

export const WHAT_IF_GROUPS: WhatIfGroup[] = [
  {
    key: "knowledge",
    title: "Knowledge and Development:",
    cards: [
      {
        icon: GraduationCap,
        title: "Words learning",
        describe: (m) => `You could: master ${perMinutes(m, 5)} foreign words`,
      },
      {
        icon: BookOpen,
        title: "Book reading",
        describe: (m) => `You could: read ${perMinutes(m, 2)} pages of a book`,
      },
      {
        icon: Calendar,
        title: "Weekly activity planning",
        describe: (m) =>
          `You could: plan the next ${perMinutes(m, 30)} weeks of your life`,
      },
    ],
  },
  {
    key: "health",
    title: "Health and Body:",
    cards: [
      {
        icon: SquareActivity,
        title: "Stretching",
        describe: (m) =>
          `You could: have ${perMinutes(m, 20)} stretching sessions`,
      },
      {
        icon: Dribbble,
        title: "Match played",
        describe: (m) =>
          `You could: play ${perMinutes(m, 48)} basketball matches`,
      },
      {
        icon: Footprints,
        title: "An outside walk",
        describe: (m) =>
          `You could: walk ${(m * 0.08).toFixed(1)} km and burn ~${Math.floor(m * 4.5)} kcal`,
      },
    ],
  },
  {
    key: "creativity",
    title: "Creativity:",
    cards: [
      {
        icon: Music,
        title: "Playlist creation",
        describe: (m) => `You could: curate ${perMinutes(m, 15)} new playlists`,
      },
      {
        icon: ChefHat,
        title: "Cooking",
        describe: (m) => `You could: cook ${perMinutes(m, 45)} homemade pizzas`,
      },
      {
        icon: Clapperboard,
        title: "Series watching",
        describe: (m) =>
          `You could: watch ${(m / 42).toFixed(1)} episodes of "The Walking Dead"`,
      },
    ],
  },
  {
    key: "universal",
    title: "Universal:",
    cards: [
      {
        icon: Smartphone,
        title: "Scrolling",
        describe: (m) => `You have scrolled ${(m * 0.01).toFixed(2)} meters`,
      },
      {
        icon: EyeClosed,
        title: "Eye Blinks",
        describe: (m) => `Your eyes blinked ${m * 17} times`,
      },
      {
        icon: Wind,
        title: "Breath Taken",
        describe: (m) =>
          `Your lungs processed oxygen through ${m * 14} steady breaths`,
      },
    ],
  },
];
