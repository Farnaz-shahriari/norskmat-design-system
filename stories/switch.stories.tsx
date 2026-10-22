import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../src/components/label";
import { Switch } from "../src/components/switch";
import { withPlatform } from "../.storybook/with-platform";

function LabelledSwitch({ label, ...props }: { label: string } & ComponentProps<typeof Switch>) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-md w-full max-w-[320px]">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} {...props} />
    </div>
  );
}

const meta = {
  title: "Components/Forms/Switch",
  decorators: [withPlatform],
  component: LabelledSwitch,
  args: { label: "Varsle meg om nye avvik" },
} satisfies Meta<typeof LabelledSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      <LabelledSwitch label="Av" />
      <LabelledSwitch label="På" defaultChecked />
      <LabelledSwitch label="Deaktivert" disabled />
      <LabelledSwitch label="Deaktivert, på" disabled defaultChecked />
    </div>
  ),
};
