import { useId } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "../src/components/button";
import { Label } from "../src/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/popover";
import { Textarea } from "../src/components/textarea";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function AddCommentPopover({ open }: { open?: boolean }) {
  const id = useId();
  return (
    <Popover defaultOpen={open}>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <MessageSquarePlus aria-hidden="true" /> Legg til kommentar
        </Button>
      </PopoverTrigger>
      {/* The content is a dialog, name it after its heading. */}
      <PopoverContent align="start" aria-labelledby={`${id}-title`}>
        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <h2 id={`${id}-title`} className="title-medium">
              Avvik 2026-114
            </h2>
            <p className="body-medium text-muted-foreground">
              Kommentaren vises i egenkontrollen sammen med avviket.
            </p>
          </div>
          <div className="flex flex-col gap-xs">
            <Label htmlFor={`${id}-comment`}>Kommentar</Label>
            <Textarea
              id={`${id}-comment`}
              placeholder="For eksempel: Ny rutine for vask av melketanken er innført"
            />
          </div>
          <Button size="sm">Lagre kommentar</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const meta = {
  title: "Components/Overlays/Popover",
  decorators: [withPlatform],
  component: AddCommentPopover,
} satisfies Meta<typeof AddCommentPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// An open popover renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
