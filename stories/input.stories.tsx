import { useId, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../src/components/input";
import { Label } from "../src/components/label";
import { withPlatform } from "../.storybook/with-platform";

function Field({ label, ...props }: { label: string } & ComponentProps<typeof Input>) {
  const id = useId();
  return (
    <div className="flex flex-col gap-xs w-full max-w-[320px]">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

const meta = {
  title: "Components/Forms/Input",
  decorators: [withPlatform],
  component: Field,
  args: { label: "Gårdsnummer", placeholder: "For eksempel 12/3" },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Field label="Tom" placeholder="Skriv her" />
      <Field label="Utfylt" defaultValue="Nordre Gård" />
      <Field label="Ugyldig" defaultValue="abc" aria-invalid />
      <Field label="Deaktivert" defaultValue="Låst" disabled />
    </div>
  ),
};
