import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusChip } from "../src/components/status-chip";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/StatusChip",
  decorators: [withPlatform],
  component: StatusChip,
  args: { isComplete: false },
  argTypes: {
    isComplete: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof StatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// The default labels, "Trenger utfylling" and "Utfylt". The icon is
// decorative, the label carries the state.
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <StatusChip isComplete={false} />
      <StatusChip isComplete />
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <StatusChip isComplete={false} label="Mangler signatur" />
      <StatusChip isComplete label="Signert" />
    </div>
  ),
};
