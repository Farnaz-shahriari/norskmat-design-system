// The four themed platforms, one .theme-<id> class each in tokens.css.
// Beskyttede Betegnelser and Stiftelsen Norsk Mat have logos but no palette
// and no theme class, so they are deliberately absent.
export const PLATFORMS = [
  { id: "ksl", name: "KSL" },
  { id: "nyt-norge", name: "Nyt Norge" },
  { id: "spesialitet", name: "Spesialitet" },
  { id: "lokalmat", name: "LokalMat" },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];
