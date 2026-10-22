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

// Pins a story to one platform. The global locks Storybook's toolbar, the
// parameter is what withPlatform reads, and the only one /design-sync's
// previews can see.
export function pinPlatform(id: PlatformId) {
  return { globals: { platform: id }, parameters: { platform: id } };
}
