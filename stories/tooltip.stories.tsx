import type { Meta, StoryObj } from "@storybook/react-vite";
import { Printer } from "lucide-react";
import { Button } from "../src/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../src/components/tooltip";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function PrintChecklistTooltip({ open }: { open?: boolean }) {
  return (
    // An app puts one TooltipProvider near its root.
    <TooltipProvider>
      {/* Controlled open, so the story stays open. Uncontrolled, it opens on
          hover and keyboard focus. */}
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          {/* The icon button's accessible name is its aria-label. The tooltip
              shows the same words to sighted users, it does not replace it. */}
          <Button variant="ghost" size="icon-sm" aria-label="Skriv ut sjekkliste">
            <Printer aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        {/* side="bottom" for a toolbar at the top of the screen, the default
            is top. */}
        <TooltipContent side="bottom">Skriv ut sjekkliste</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const meta = {
  title: "Components/Tooltip",
  decorators: [withPlatform],
  component: PrintChecklistTooltip,
} satisfies Meta<typeof PrintChecklistTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// An open tooltip renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
