import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../src/components/alert-dialog";
import { Button, buttonVariants } from "../src/components/button";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function DeleteDeviationDialog({ open }: { open?: boolean }) {
  return (
    <AlertDialog defaultOpen={open}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          <Trash2 aria-hidden="true" /> Slett avvik
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Slette avvik 2026-114?</AlertDialogTitle>
          <AlertDialogDescription>
            Avviket, bildene og kommentarene slettes for godt. Det kan ikke
            angres.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* AlertDialogCancel is already the secondary button. */}
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          {/* AlertDialogAction is primary by default. For a destructive
              confirmation pass the destructive classes, cn() merges them over
              primary. Not asChild around <Button variant="destructive">, the
              primary classes are appended after Button's own and win. */}
          <AlertDialogAction className={buttonVariants({ variant: "destructive" })}>
            Slett
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Components/Overlays/AlertDialog",
  decorators: [withPlatform],
  component: DeleteDeviationDialog,
} satisfies Meta<typeof DeleteDeviationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// An open alert dialog renders in a portal on <body>, so it takes its theme
// from <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
