import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import { OutlinedTextField } from "../src/components/outlined-text-field";
import { withPlatform } from "../.storybook/with-platform";

type Props = ComponentProps<typeof OutlinedTextField>;

// OutlinedTextField is controlled, value and onChange. This holds the value,
// seeded from the value arg. The floating label is built in, the component
// ties it to its input with its own useId, so no Label is needed.
function StatefulOutlinedTextField({
  value: initial,
  ...props
}: Omit<Props, "onChange"> & { onChange?: Props["onChange"] }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="w-full max-w-[320px]">
      <OutlinedTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

const meta = {
  title: "Components/OutlinedTextField",
  decorators: [withPlatform],
  component: OutlinedTextField,
  args: {
    label: "Gårdsnummer",
    value: "",
    placeholder: "For eksempel 12/3",
    type: "text",
    required: false,
    disabled: false,
    onChange: () => {},
  },
  argTypes: {
    onChange: { control: false },
    onKeyDown: { control: false },
    icon: { control: false },
  },
  // Keyed on the value arg so editing it in Controls reseeds the field.
  render: (args) => <StatefulOutlinedTextField key={args.value} {...args} />,
} satisfies Meta<typeof OutlinedTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty, the label rests inside the field. It floats onto the border on
// focus or once there is a value. The placeholder only shows while floating.
export const Playground: Story = {};

export const Filled: Story = {
  args: { label: "Gårdsnavn", value: "Nordre Øverby" },
};

export const WithIcon: Story = {
  name: "With a leading icon",
  args: {
    label: "Søk i avvik",
    placeholder: "Avviksnummer eller tittel",
    icon: <Search aria-hidden="true" />,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <StatefulOutlinedTextField label="Merknad" value="" />
      <StatefulOutlinedTextField label="Gårdsnummer" value="12/3" />
      <StatefulOutlinedTextField label="Organisasjonsnummer" value="" required />
      <StatefulOutlinedTextField label="Produsentnummer" value="3401 123456" disabled />
    </div>
  ),
};
