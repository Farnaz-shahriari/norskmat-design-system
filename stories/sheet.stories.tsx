import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../src/components/button";
import { Checkbox } from "../src/components/checkbox";
import { Label } from "../src/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../src/components/sheet";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

type Side = ComponentProps<typeof SheetContent>["side"];

function FilterGroup({ legend, options }: { legend: string; options: { label: string; checked?: boolean }[] }) {
  const id = useId();
  return (
    <fieldset>
      <legend className="label-large mb-sm">{legend}</legend>
      <div className="flex flex-col gap-sm">
        {options.map((option, i) => (
          <div key={option.label} className="flex items-center gap-sm">
            <Checkbox id={`${id}-${i}`} defaultChecked={option.checked} />
            <Label htmlFor={`${id}-${i}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function FilterDeviationsSheet({ open, side = "right" }: { open?: boolean; side?: Side }) {
  return (
    <Sheet defaultOpen={open}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <SlidersHorizontal aria-hidden="true" /> Filtrer avvik
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Filtrer avvik</SheetTitle>
          <SheetDescription>
            Vis bare avvikene fra egenrevisjonen du må følge opp.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-lg px-md">
          {/* The tier is always named in text, never shown by colour alone. */}
          <FilterGroup
            legend="Alvorlighetsgrad"
            options={[
              { label: "Kritisk", checked: true },
              { label: "Vesentlig", checked: true },
              { label: "Mindre alvorlig" },
            ]}
          />
          <FilterGroup
            legend="Sjekkliste"
            options={[
              { label: "Generelle krav til gården", checked: true },
              { label: "Miljø og kulturlandskap" },
              { label: "Storfe" },
            ]}
          />
        </div>
        <SheetFooter>
          <Button>Vis 12 avvik</Button>
          <SheetClose asChild>
            <Button variant="secondary">Avbryt</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Components/Overlays/Sheet",
  decorators: [withPlatform],
  component: FilterDeviationsSheet,
  argTypes: {
    side: { control: "inline-radio", options: ["right", "left", "top", "bottom"] },
  },
} satisfies Meta<typeof FilterDeviationsSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// The trigger only, side by side in every platform.
export const Trigger: Story = {};

// An open sheet renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
// Right is the default side and the one to use for filters and details.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };

// The side only changes where the sheet enters from, not its colours, so one
// platform is enough. Bottom suits a phone.
export const OpenBottomKSL: Story = {
  args: { open: true, side: "bottom" },
  name: "Open from bottom, KSL",
  ...pinPlatform("ksl"),
};
