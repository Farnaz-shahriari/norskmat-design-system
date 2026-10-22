import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../src/components/dropdown-menu";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function DeviationActionsMenu({ open }: { open?: boolean }) {
  return (
    <DropdownMenu defaultOpen={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Flere valg for avvik 2026-114">
          <EllipsisVertical aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil aria-hidden="true" /> Rediger
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy aria-hidden="true" /> Dupliser
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* The destructive item goes last, after a separator. Use the item's
            variant, not a colour class. */}
        <DropdownMenuItem variant="destructive">
          <Trash2 aria-hidden="true" /> Slett
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: "Components/DropdownMenu",
  decorators: [withPlatform],
  component: DeviationActionsMenu,
} satisfies Meta<typeof DeviationActionsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// The open menu renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
