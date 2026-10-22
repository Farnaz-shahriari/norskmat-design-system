import type { Meta, StoryObj } from "@storybook/react-vite";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "../src/components/badge";
import { Button } from "../src/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../src/components/card";
import { withPlatform } from "../.storybook/with-platform";

const meta = {
  title: "Components/Layout/Card",
  decorators: [withPlatform],
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Card has no padding of its own, its parts carry it. CardHeader pads the
// top, CardContent and CardFooter pad the bottom, so start a card with
// CardHeader. CardTitle is an <h4> with no type style of its own, give it
// title-medium.

export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-[360px]">
      <CardHeader>
        <CardTitle className="title-medium">Egenkontroll 2026</CardTitle>
        <CardDescription>Nordre Gård, gårdsnummer 12/3</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Flere valg for egenkontroll 2026">
            <EllipsisVertical aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="body-medium">
          7 av 12 sjekklister er fullført. Fristen for å levere er 1. desember 2026.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Fortsett</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  name: "Header and content",
  render: () => (
    <Card className="w-full max-w-[360px]">
      <CardHeader>
        <CardTitle className="title-medium">Neste revisjon</CardTitle>
        <CardDescription>Gårdsnummer 12/3</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="body-medium">
          Revisor kommer 4. mars 2027. Ha journal for plantevernmidler og gjødselplan klare.
        </p>
      </CardContent>
    </Card>
  ),
};

// The tier name is the badge's text, never the colour alone.
const openDeviations = [
  {
    id: "2026-114",
    title: "Journal for plantevernmidler mangler",
    tier: "Kritisk",
    tone: "bg-[var(--error)] text-[var(--error-foreground)]",
  },
  {
    id: "2026-097",
    title: "Gjødselplanen er ikke oppdatert",
    tier: "Vesentlig",
    tone: "bg-[var(--vesentlig)] text-[var(--vesentlig-foreground)]",
  },
  {
    id: "2026-082",
    title: "Kjemikalieskapet er ikke merket",
    tier: "Mindre alvorlig",
    tone: "bg-[var(--mindre-alvorlig)] text-[var(--mindre-alvorlig-foreground)]",
  },
];

// A border-b on CardHeader and a border-t on CardFooter add the matching
// padding on their own.
export const WithDividers: Story = {
  render: () => (
    <Card className="w-full max-w-[360px]">
      <CardHeader className="border-b">
        <CardTitle className="title-medium">Åpne avvik</CardTitle>
        <CardDescription>3 avvik venter på lukking</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-sm">
          {openDeviations.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-sm">
              <span className="body-medium">{d.title}</span>
              <Badge className={d.tone}>{d.tier}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="tertiary" size="sm">
          Se alle avvik
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Deviation: Story = {
  name: "Deviation, with CardAction",
  render: () => (
    <Card className="w-full max-w-[360px]">
      <CardHeader>
        <CardTitle className="title-medium">Avvik 2026-114</CardTitle>
        <CardDescription>Journal for plantevernmidler mangler</CardDescription>
        <CardAction>
          <Badge className="bg-[var(--error)] text-[var(--error-foreground)]">Kritisk</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="body-medium">Frist 15. november 2026. Last opp journalen for sesongen 2026.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Lukk avvik</Button>
      </CardFooter>
    </Card>
  ),
};
