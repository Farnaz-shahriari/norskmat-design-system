import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConnectedButtonGroup } from "../src/components/connected-button-group";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Actions/ConnectedButtonGroup",
  decorators: [withPlatform],
  component: ConnectedButtonGroup,
} satisfies Meta<typeof ConnectedButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATUS = [
  { value: "alle", label: "Alle" },
  { value: "apne", label: "Åpne" },
  { value: "lukket", label: "Lukket" },
];

const SEVERITY = [
  { value: "kritisk", label: "Kritisk" },
  { value: "vesentlig", label: "Vesentlig" },
  { value: "mindre", label: "Mindre alvorlig" },
];

function SingleSelect({ size }: { size?: "default" | "sm" }) {
  const [value, setValue] = useState("alle");
  return <ConnectedButtonGroup items={STATUS} value={value} onChange={setValue} size={size} />;
}

function MultiSelect() {
  const [value, setValue] = useState<string[]>(["kritisk", "vesentlig"]);
  return <ConnectedButtonGroup multiSelect items={SEVERITY} value={value} onChange={setValue} />;
}

// Story args are bypassed, each render owns its state. The type still wants
// the required props, so the stories pass a placeholder set.
const args = { items: STATUS, value: "alle", onChange: () => {} };

export const SingleSelectStory: Story = {
  name: "Single select",
  args,
  render: () => <SingleSelect />,
};

export const Small: Story = {
  args,
  render: () => <SingleSelect size="sm" />,
};

export const MultiSelectStory: Story = {
  name: "Multi select",
  args,
  render: () => <MultiSelect />,
};

export const WithDisabledItem: Story = {
  name: "With a disabled item",
  args,
  render: () => (
    <ConnectedButtonGroup
      items={[...STATUS.slice(0, 2), { ...STATUS[2], disabled: true }]}
      value="alle"
      onChange={() => {}}
    />
  ),
};
