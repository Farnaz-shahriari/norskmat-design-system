import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarClock, Check } from "lucide-react";
import { Badge } from "../src/components/badge";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Info/Badge",
  decorators: [withPlatform],
  component: Badge,
  args: { children: "Levert", variant: "default" },
  argTypes: {
    // These four are all there is. An unknown variant makes cva fall back to
    // default, filled, silently.
    variant: { control: "inline-radio", options: ["default", "secondary", "destructive", "outline"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Badge variant="default">Levert</Badge>
      <Badge variant="secondary">Under behandling</Badge>
      <Badge variant="destructive">Frist passert</Badge>
      <Badge variant="outline">Utkast</Badge>
    </div>
  ),
};

// Badge has no severity variant. Each tier sets its own shared token pair
// through className, identical on every platform, and the tier's name is
// always the visible text, never the colour alone.
export const Severity: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Badge className="bg-[var(--error)] text-[var(--error-foreground)]">Kritisk</Badge>
      <Badge className="bg-[var(--vesentlig)] text-[var(--vesentlig-foreground)]">Vesentlig</Badge>
      <Badge className="bg-[var(--mindre-alvorlig)] text-[var(--mindre-alvorlig-foreground)]">
        Mindre alvorlig
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-sm">
      <Badge variant="secondary">
        <CalendarClock aria-hidden="true" /> Frist 1. desember
      </Badge>
      <Badge>
        <Check aria-hidden="true" /> Signert
      </Badge>
    </div>
  ),
};

export const AsLink: Story = {
  name: "As a link, asChild",
  render: () => (
    <Badge asChild variant="outline">
      <a href="#apne-avvik">3 åpne avvik</a>
    </Badge>
  ),
};
