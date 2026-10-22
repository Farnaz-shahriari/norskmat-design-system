import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../src/components/button";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Actions/Button",
  decorators: [withPlatform],
  component: Button,
  args: { children: "Lagre", variant: "primary", size: "default" },
  argTypes: {
    // There is no "outline" variant. The outlined button is "secondary".
    // An unknown variant makes cva fall back to primary, filled, silently.
    variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary", "destructive", "ghost"] },
    size: { control: "inline-radio", options: ["default", "sm", "icon", "icon-sm", "icon-xs"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Button variant="primary">Registrer avvik</Button>
      <Button variant="secondary">Avbryt</Button>
      <Button variant="tertiary">Se alle</Button>
      <Button variant="destructive">
        <Trash2 aria-hidden="true" /> Slett
      </Button>
      <Button variant="ghost">Hopp over</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Button>Standard, 56px</Button>
      <Button size="sm">Liten, 40px</Button>
      <Button size="icon" aria-label="Legg til">
        <Plus aria-hidden="true" />
      </Button>
      <Button size="icon-sm" variant="secondary" aria-label="Legg til">
        <Plus aria-hidden="true" />
      </Button>
      <Button size="icon-xs" variant="ghost" aria-label="Legg til">
        <Plus aria-hidden="true" />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Button disabled>Lagre</Button>
      <Button variant="secondary" disabled>
        Avbryt
      </Button>
    </div>
  ),
};
