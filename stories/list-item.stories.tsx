import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, FileText } from "lucide-react";
import { ListItem } from "../src/components/list-item";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Layout/ListItem",
  decorators: [withPlatform],
  component: ListItem,
  args: { title: "Journal for plantevernmidler", density: "default" },
  argTypes: { density: { control: "inline-radio", options: ["default", "compact"] } },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Densities: Story = {
  render: () => (
    <div className="flex flex-col gap-xs">
      <ListItem
        title="Gjødselplan 2026"
        leadingIcon={<FileText aria-hidden="true" />}
        trailingIcon={<ChevronRight aria-hidden="true" />}
      />
      <ListItem
        density="compact"
        overline="Avvik 2026-114"
        title="Journal for plantevernmidler mangler"
        supportingText="Registrert 12. august"
        trailingText="Kritisk"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-xs">
      <ListItem title="Standard" />
      <ListItem title="Valgt" selected />
      <ListItem title="Deaktivert" disabled />
    </div>
  ),
};
