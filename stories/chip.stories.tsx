import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Plus, X } from "lucide-react";
import { Chip } from "../src/components/chip";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Chip",
  decorators: [withPlatform],
  component: Chip,
  args: { children: "Plantevern", variant: "assist", size: "default", selected: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["assist", "filter", "suggestion", "input"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Chip variant="assist" leadingIcon={<Plus className="size-4" aria-hidden="true" />}>
        Legg til vedlegg
      </Chip>
      <Chip variant="filter">Plantevern</Chip>
      <Chip variant="suggestion">Gjødsel</Chip>
      <Chip variant="input" trailingIcon={<X className="size-4" aria-hidden="true" />}>
        2026
      </Chip>
    </div>
  ),
};

function FilterRow() {
  const [on, setOn] = useState<string[]>(["Plantevern"]);
  const toggle = (c: string) => setOn((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));
  return (
    <div className="flex flex-wrap items-center gap-sm">
      {["Plantevern", "Gjødsel", "Dyrevelferd"].map((c) => {
        const selected = on.includes(c);
        return (
          <Chip
            key={c}
            variant="filter"
            selected={selected}
            aria-pressed={selected}
            onClick={() => toggle(c)}
            leadingIcon={selected ? <Check className="size-4" aria-hidden="true" /> : undefined}
          >
            {c}
          </Chip>
        );
      })}
    </div>
  );
}

export const FilterSelection: Story = {
  name: "Filter, selected and not",
  render: () => <FilterRow />,
};

export const Small: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Chip size="sm">Liten</Chip>
      <Chip size="sm" selected>
        Liten, valgt
      </Chip>
    </div>
  ),
};
