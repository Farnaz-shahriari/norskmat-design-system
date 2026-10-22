import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClipboardCheck, Plus } from "lucide-react";
import { Fab } from "../src/components/fab";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Fab",
  decorators: [withPlatform],
  component: Fab,
  args: {
    icon: <Plus aria-hidden="true" />,
    label: "Registrer avvik",
    extended: true,
    variant: "primary",
    size: "standard",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "tonal", "secondary", "tertiary", "surface"] },
    size: { control: "inline-radio", options: ["small", "standard", "large"] },
    icon: { control: false },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

// extended shows `label` beside the icon. Without extended the label is not
// rendered at all, so an icon-only Fab needs its own aria-label.
export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Fab variant="primary" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab variant="tonal" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab variant="secondary" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab variant="tertiary" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab variant="surface" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
    </div>
  ),
};

// small 40px, standard 56px, large 96px. The large one takes a 36px icon.
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Fab size="small" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab size="standard" icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
      <Fab size="large" icon={<Plus className="size-9" aria-hidden="true" />} aria-label="Registrer avvik" />
    </div>
  ),
};

export const Extended: Story = {
  name: "Extended, all sizes",
  render: () => (
    <div className="flex flex-col items-start gap-md">
      <Fab extended size="small" icon={<Plus aria-hidden="true" />} label="Registrer avvik" />
      <Fab extended size="standard" icon={<Plus aria-hidden="true" />} label="Registrer avvik" />
      <Fab extended size="large" icon={<Plus className="size-9" aria-hidden="true" />} label="Registrer avvik" />
    </div>
  ),
};

// With href the Fab renders an <a>, for an action that navigates.
export const AsLink: Story = {
  name: "As a link",
  render: () => (
    <Fab
      href="#ny-egenkontroll"
      extended
      variant="tonal"
      icon={<ClipboardCheck aria-hidden="true" />}
      label="Start egenkontroll"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Fab disabled extended icon={<Plus aria-hidden="true" />} label="Registrer avvik" />
      <Fab disabled icon={<Plus aria-hidden="true" />} aria-label="Registrer avvik" />
    </div>
  ),
};
