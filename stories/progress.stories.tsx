import { useId } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "../src/components/progress";
import { withPlatform } from "../.storybook/with-platform";

// A progress bar needs an accessible name, tie the visible label to it with
// aria-labelledby. value is a percentage, 0 to 100, the bar does not scale by
// max, so convert a count like 7 of 12 to a percentage and show the count as
// text beside it.
function LabelledProgress({ label, value, valueText }: { label: string; value: number; valueText: string }) {
  const labelId = useId();
  const valueId = useId();
  return (
    <div className="flex flex-col gap-xs w-full max-w-[320px]">
      <div className="flex items-center justify-between gap-sm">
        <span id={labelId} className="label-medium">
          {label}
        </span>
        <span id={valueId} className="label-medium text-muted-foreground">
          {valueText}
        </span>
      </div>
      <Progress value={value} aria-labelledby={labelId} aria-describedby={valueId} />
    </div>
  );
}

const meta = {
  title: "Components/Progress",
  decorators: [withPlatform],
  component: LabelledProgress,
  args: { label: "Sjekklister fullført", value: 58, valueText: "7 av 12" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof LabelledProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Values: Story = {
  name: "Not started, in progress, complete",
  render: () => (
    <div className="flex flex-col gap-md">
      <LabelledProgress label="Dyrevelferd" value={0} valueText="0 av 8" />
      <LabelledProgress label="Plantevern" value={50} valueText="3 av 6" />
      <LabelledProgress label="Gjødsling" value={100} valueText="5 av 5" />
    </div>
  ),
};
