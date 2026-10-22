import { useId } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../src/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/select";
import { withPlatform } from "../.storybook/with-platform";
import { pinPlatform } from "../.storybook/platforms";

function DeadlineSelect({ open }: { open?: boolean }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-xs w-full max-w-[320px]">
      <Label htmlFor={id}>Frist</Label>
      <Select defaultValue="14" defaultOpen={open}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Velg frist" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">7 dager</SelectItem>
          <SelectItem value="14">14 dager</SelectItem>
          <SelectItem value="30">30 dager</SelectItem>
          <SelectItem value="90" disabled>
            90 dager
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const meta = {
  title: "Components/Forms/Select",
  decorators: [withPlatform],
  component: DeadlineSelect,
} satisfies Meta<typeof DeadlineSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

// The open list renders in a portal on <body>, so it takes its theme from
// <html>, not from a side by side column. One story per platform instead.
const open = { args: { open: true } };

export const OpenKSL: Story = { ...open, name: "Open, KSL", ...pinPlatform("ksl") };
export const OpenNytNorge: Story = { ...open, name: "Open, Nyt Norge", ...pinPlatform("nyt-norge") };
export const OpenSpesialitet: Story = { ...open, name: "Open, Spesialitet", ...pinPlatform("spesialitet") };
export const OpenLokalMat: Story = { ...open, name: "Open, LokalMat", ...pinPlatform("lokalmat") };
