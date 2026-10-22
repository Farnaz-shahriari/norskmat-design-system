import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../src/components/alert";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Alert",
  decorators: [withPlatform],
  component: Alert,
  args: { variant: "default" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "destructive"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// An svg as the first child becomes the icon column. AlertTitle is clamped to
// one line, keep it short and put the detail in AlertDescription.

export const Playground: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info aria-hidden="true" />
      <AlertTitle>Frist om 14 dager</AlertTitle>
      <AlertDescription>
        <p>Egenkontrollen for gårdsnummer 12/3 må leveres innen 1. desember 2026.</p>
      </AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      <Alert>
        <CircleCheck aria-hidden="true" />
        <AlertTitle>Egenkontroll levert</AlertTitle>
        <AlertDescription>
          <p>Levert 3. oktober 2026 for gårdsnummer 12/3.</p>
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Frist passert</AlertTitle>
        <AlertDescription>
          <p>Avvik 2026-114 skulle vært lukket 15. oktober 2026.</p>
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Endringene er lagret</AlertTitle>
      <AlertDescription>
        <p>Sjekklisten for dyrevelferd er oppdatert.</p>
      </AlertDescription>
    </Alert>
  ),
};

export const WithList: Story = {
  render: () => (
    <Alert variant="destructive">
      <CircleAlert aria-hidden="true" />
      <AlertTitle>3 avvik over frist</AlertTitle>
      <AlertDescription>
        <p>Lukk disse før du leverer egenkontrollen:</p>
        <ul className="list-disc pl-md">
          <li>Journal for plantevernmidler</li>
          <li>Gjødselplan for 2026</li>
          <li>Merking av kjemikalieskap</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};
