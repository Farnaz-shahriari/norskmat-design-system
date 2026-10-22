// The theme explorer: one desktop screen and one mobile screen, built only
// from the library's own components, rendered in each platform theme. The
// screens never change between brands, only the .theme-<platform> class
// around them does, which is the point: what you see change is the theme.
//
// Used twice: as the "Examples/ThemeExplorer" story, and compiled by
// scripts/build-design-cards.mjs into a card for the Claude Design project.
import { useState, type ReactNode } from "react";
import { ArrowLeft, Camera, ChevronRight, Plus } from "lucide-react";
import { PLATFORMS, type PlatformId } from "../../.storybook/platforms";
import { Alert, AlertDescription, AlertTitle } from "../../src/components/alert";
import { Badge } from "../../src/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/breadcrumb";
import { Button } from "../../src/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/card";
import { Chip } from "../../src/components/chip";
import { ConnectedButtonGroup } from "../../src/components/connected-button-group";
import { Fab } from "../../src/components/fab";
import { Label } from "../../src/components/label";
import { ListItem } from "../../src/components/list-item";
import { Progress } from "../../src/components/progress";
import { StatusChip } from "../../src/components/status-chip";
import { Switch } from "../../src/components/switch";
import { Tab, TabGroup } from "../../src/components/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/table";
import { TextInputField } from "../../src/components/text-input-field";

type Tier = "Kritisk" | "Vesentlig" | "Mindre alvorlig";

// Severity is token colour plus the tier name in text, never colour alone.
const TIER_CLASS: Record<Tier, string> = {
  Kritisk: "bg-[var(--error)] text-[var(--error-foreground)]",
  Vesentlig: "bg-[var(--vesentlig)] text-[var(--vesentlig-foreground)]",
  "Mindre alvorlig": "bg-[var(--mindre-alvorlig)] text-[var(--mindre-alvorlig-foreground)]",
};

function TierBadge({ tier }: { tier: Tier }) {
  return <Badge className={TIER_CLASS[tier]}>{tier}</Badge>;
}

const DEVIATIONS: { id: string; point: string; tier: Tier; due: string; done: boolean }[] = [
  { id: "2026-114", point: "Journal for plantevernmidler mangler", tier: "Kritisk", due: "15.11.2026", done: false },
  { id: "2026-109", point: "Gjødselplanen er ikke oppdatert", tier: "Vesentlig", due: "01.12.2026", done: false },
  { id: "2026-097", point: "Kjemikalieskapet er ikke merket", tier: "Mindre alvorlig", due: "01.12.2026", done: false },
  { id: "2026-088", point: "Vannprøve mangler for 2026", tier: "Vesentlig", due: "20.10.2026", done: true },
];

// One platform's theme, applied the way an app applies it, plus the page
// font: the stylesheet does not set one yet (see .design-sync/NOTES.md).
function Themed({ id, className = "", children }: { id: PlatformId; className?: string; children: ReactNode }) {
  return (
    <div className={`theme-${id} bg-background text-foreground ${className}`} style={{ fontFamily: "var(--font-family)" }}>
      {children}
    </div>
  );
}

function platformName(id: PlatformId) {
  return PLATFORMS.find((p) => p.id === id)?.name ?? id;
}

export function DesktopDashboard({ id }: { id: PlatformId }) {
  const [tab, setTab] = useState("oversikt");
  const [status, setStatus] = useState("alle");
  return (
    <Themed id={id} className="w-[900px]">
      <div className="flex items-center justify-between gap-md px-lg py-md border-b border-[var(--outline-variant)] bg-surface">
        <div className="flex items-center gap-lg">
          <span className="title-large text-primary">{platformName(id)}</span>
          <Breadcrumb aria-label="Brødsmulesti">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#hjem">Hjem</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Egenkontroll 2026</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button size="sm">
          <Plus aria-hidden="true" /> Registrer avvik
        </Button>
      </div>

      <TabGroup className="px-md border-b border-[var(--outline-variant)]">
        {[
          ["oversikt", "Oversikt"],
          ["avvik", "Avvik"],
          ["sjekklister", "Sjekklister"],
          ["vedlegg", "Vedlegg"],
        ].map(([key, label]) => (
          <Tab key={key} active={tab === key} onClick={() => setTab(key)}>
            {label}
          </Tab>
        ))}
      </TabGroup>

      <div className="flex flex-col gap-lg p-lg">
        <div className="flex flex-col gap-xs">
          <h1 className="headline-small m-0">Egenkontroll 2026</h1>
          <p className="body-medium text-muted-foreground m-0">Nordre Gård, gårdsnummer 12/3</p>
        </div>

        <Alert>
          <AlertTitle>Frist om 14 dager</AlertTitle>
          <AlertDescription>Egenkontrollen må leveres innen 1. desember 2026.</AlertDescription>
        </Alert>

        <div className="grid grid-cols-3 gap-md">
          <Card>
            <CardHeader>
              <CardDescription>Åpne avvik</CardDescription>
              <CardTitle className="headline-medium">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Fullførte sjekkpunkter</CardDescription>
              <CardTitle className="headline-medium">14 av 20</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={70} aria-label="14 av 20 sjekkpunkter fullført" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Dager til frist</CardDescription>
              <CardTitle className="headline-medium">14</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-md">
          <ConnectedButtonGroup
            size="sm"
            items={[
              { value: "alle", label: "Alle" },
              { value: "apne", label: "Åpne" },
              { value: "lukket", label: "Lukket" },
            ]}
            value={status}
            onChange={setStatus}
          />
          <div className="flex flex-wrap items-center gap-sm">
            <Chip variant="filter" selected aria-pressed>
              Plantevern
            </Chip>
            <Chip variant="filter" aria-pressed={false}>
              Gjødsel
            </Chip>
            <Chip variant="filter" aria-pressed={false}>
              Dyrevelferd
            </Chip>
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableCaption>Avvik fra egenkontrollen 2026</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Sjekkpunkt</TableHead>
                  <TableHead scope="col">Alvorlighet</TableHead>
                  <TableHead scope="col">Frist</TableHead>
                  <TableHead scope="col">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEVIATIONS.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.point}</TableCell>
                    <TableCell>
                      <TierBadge tier={d.tier} />
                    </TableCell>
                    <TableCell>{d.due}</TableCell>
                    <TableCell>
                      <StatusChip isComplete={d.done} label={d.done ? "Lukket" : "Åpent"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Themed>
  );
}

export function MobileDeviation({ id }: { id: PlatformId }) {
  const [tiltak, setTiltak] = useState("");
  const [notify, setNotify] = useState(true);
  return (
    <Themed id={id} className="relative flex flex-col w-[390px] h-[780px] overflow-hidden">
      <div className="flex items-center gap-sm px-sm py-sm border-b border-[var(--outline-variant)] bg-surface">
        <Button variant="ghost" size="icon-xs" aria-label="Tilbake">
          <ArrowLeft aria-hidden="true" />
        </Button>
        <span className="title-medium">Avvik 2026-114</span>
      </div>

      <div className="flex flex-col gap-md p-md overflow-y-auto grow">
        <div className="flex items-center gap-sm">
          <TierBadge tier="Kritisk" />
          <StatusChip isComplete={false} label="Åpent" />
        </div>
        <div className="flex flex-col gap-xs">
          <h1 className="title-large m-0">Journal for plantevernmidler mangler</h1>
          <p className="body-medium text-muted-foreground m-0">Registrert 12. august, frist 15. november 2026</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="title-medium">Sjekkpunkter</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <ListItem
              density="compact"
              overline="Plantevern"
              title="Journal for sprøyting"
              supportingText="Mangler for 2026"
              trailingIcon={<ChevronRight aria-hidden="true" />}
            />
            <ListItem
              density="compact"
              overline="Plantevern"
              title="Lagring av plantevernmidler"
              supportingText="I orden"
              trailingIcon={<ChevronRight aria-hidden="true" />}
            />
          </CardContent>
        </Card>

        <TextInputField label="Tiltak" value={tiltak} onChange={setTiltak} showTrengerUtfylling />

        <div className="flex items-center justify-between gap-md">
          <Label htmlFor={`varsle-${id}`}>Varsle meg ved endringer</Label>
          <Switch id={`varsle-${id}`} checked={notify} onCheckedChange={setNotify} />
        </div>
      </div>

      {/* Above the footer: its button height plus its padding. */}
      <div className="absolute right-[var(--space-md)] bottom-[calc(var(--height-lg)+var(--space-xl))]">
        <Fab variant="tonal" icon={<Camera aria-hidden="true" />} aria-label="Legg til bilde" />
      </div>

      <div className="p-md border-t border-[var(--outline-variant)] bg-surface">
        <Button className="w-full">Lukk avvik</Button>
      </div>
    </Themed>
  );
}

// Neutral chrome around the screens, so the frames themselves never take a
// brand's colours.
function DesktopFrame({ id }: { id: PlatformId }) {
  return (
    <figure className="m-0 flex flex-col gap-sm">
      <figcaption className="label-medium text-muted-foreground">{platformName(id)}, desktop</figcaption>
      <div className="rounded-[var(--radius-card)] border border-[var(--outline)] overflow-hidden w-fit">
        <DesktopDashboard id={id} />
      </div>
    </figure>
  );
}

function PhoneFrame({ id }: { id: PlatformId }) {
  return (
    <figure className="m-0 flex flex-col gap-sm">
      <figcaption className="label-medium text-muted-foreground">{platformName(id)}, mobile</figcaption>
      <div className="rounded-[var(--radius-dialog)] border-[6px] border-[var(--on-surface)] overflow-hidden w-fit">
        <MobileDeviation id={id} />
      </div>
    </figure>
  );
}

const CHOICES = [...PLATFORMS.map((p) => ({ value: p.id as string, label: p.name })), { value: "all", label: "Alle fire" }];

export function ThemeExplorer({ initial = "all" }: { initial?: PlatformId | "all" }) {
  const [choice, setChoice] = useState<string>(initial);
  return (
    <div className="flex flex-col gap-lg p-lg">
      <div className="flex flex-col gap-sm">
        <h1 className="headline-small m-0">Theme explorer</h1>
        <p className="body-medium text-muted-foreground m-0">
          The same screens, built from the same components, in each brand. Only the theme class changes: colours,
          surfaces and the font.
        </p>
        <ConnectedButtonGroup items={CHOICES} value={choice} onChange={setChoice} />
      </div>

      {choice === "all" ? (
        <div className="flex flex-col gap-lg">
          <div className="flex flex-wrap gap-lg" style={{ zoom: 0.75 }}>
            {PLATFORMS.map((p) => (
              <PhoneFrame key={p.id} id={p.id} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-lg w-fit" style={{ zoom: 0.5 }}>
            {PLATFORMS.map((p) => (
              <DesktopFrame key={p.id} id={p.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-lg">
          <DesktopFrame id={choice as PlatformId} />
          <PhoneFrame id={choice as PlatformId} />
        </div>
      )}
    </div>
  );
}
