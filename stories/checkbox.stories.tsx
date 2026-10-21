import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src/components/checkbox";
import { Label } from "../src/components/label";

function LabelledCheckbox({ label, ...props }: { label: string } & ComponentProps<typeof Checkbox>) {
  const id = useId();
  return (
    <div className="flex items-center gap-sm">
      <Checkbox id={id} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

const meta = {
  title: "Components/Checkbox",
  component: LabelledCheckbox,
  args: { label: "Jeg bekrefter at sjekklisten er fullført" },
} satisfies Meta<typeof LabelledCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      <LabelledCheckbox label="Ikke valgt" />
      <LabelledCheckbox label="Valgt" defaultChecked />
      <LabelledCheckbox label="Ugyldig" aria-invalid />
      <LabelledCheckbox label="Deaktivert" disabled />
      <LabelledCheckbox label="Deaktivert og valgt" disabled defaultChecked />
    </div>
  ),
};
