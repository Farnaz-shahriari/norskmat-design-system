import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/dialog";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function CloseDeviationDialog({ open }: { open?: boolean }) {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">Lukk avvik</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lukk avvik 2026-114?</DialogTitle>
          <DialogDescription>
            Avviket flyttes til lukkede avvik. Du kan åpne det igjen senere.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Avbryt</Button>
          </DialogClose>
          <Button>Lukk avvik</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Components/Dialog",
  decorators: [withPlatform],
  component: CloseDeviationDialog,
} satisfies Meta<typeof CloseDeviationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// An open dialog renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
