import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeExplorer } from "./examples/theme-explorer";

// No withPlatform decorator: the explorer switches brands itself. The sync
// leaves this story out (cfg.titleMap ThemeExplorer: null); the same screens
// reach Claude Design as a card built by scripts/build-design-cards.mjs.
const meta = {
  title: "Examples/ThemeExplorer",
  component: ThemeExplorer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ThemeExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFour: Story = { name: "All four brands", args: { initial: "all" } };
export const KSL: Story = { args: { initial: "ksl" } };
export const NytNorge: Story = { name: "Nyt Norge", args: { initial: "nyt-norge" } };
export const Spesialitet: Story = { args: { initial: "spesialitet" } };
export const LokalMat: Story = { args: { initial: "lokalmat" } };
