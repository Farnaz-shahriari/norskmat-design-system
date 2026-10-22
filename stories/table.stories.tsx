import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src/components/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/table";
import { withPlatform } from "../.storybook/with-platform";

type Tier = "kritisk" | "vesentlig" | "mindre";

// The three deviation tiers, the only three, identical on every platform.
// The colour is a marker beside the tier's name, never the name's
// replacement, severity is never shown by colour alone (WCAG 1.4.1).
const TIERS: Record<Tier, { label: string; marker: string }> = {
  kritisk: { label: "Kritisk", marker: "bg-[var(--error)]" },
  vesentlig: { label: "Vesentlig", marker: "bg-[var(--vesentlig)]" },
  mindre: { label: "Mindre alvorlig", marker: "bg-[var(--mindre-alvorlig)]" },
};

function Severity({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center gap-xs">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${TIERS[tier].marker}`} />
      {TIERS[tier].label}
    </span>
  );
}

const AVVIK: { id: string; sjekkpunkt: string; tier: Tier; frist: string; status: string }[] = [
  { id: "2026-114", sjekkpunkt: "Journal for plantevernmidler mangler", tier: "kritisk", frist: "15.11.2026", status: "Åpen" },
  { id: "2026-109", sjekkpunkt: "Gjødslingsplan er ikke oppdatert", tier: "vesentlig", frist: "01.12.2026", status: "Åpen" },
  { id: "2026-097", sjekkpunkt: "Brannslukker ikke kontrollert siste år", tier: "vesentlig", frist: "20.11.2026", status: "Under arbeid" },
  { id: "2026-088", sjekkpunkt: "Førstehjelpsutstyr mangler i verkstedet", tier: "mindre", frist: "31.10.2026", status: "Lukket" },
];

// The ID opens the deviation. It also gives the table's scroll container
// focusable content, so a keyboard user can reach a table wider than its
// column.
function AvvikLink({ id }: { id: string }) {
  return (
    <a href={`#avvik-${id}`} className="text-primary underline">
      {id}
    </a>
  );
}

function AvvikHeader() {
  return (
    <TableRow>
      <TableHead scope="col">ID</TableHead>
      <TableHead scope="col">Sjekkpunkt</TableHead>
      <TableHead scope="col">Alvorlighet</TableHead>
      <TableHead scope="col">Frist</TableHead>
      <TableHead scope="col">Status</TableHead>
    </TableRow>
  );
}

const meta = {
  title: "Components/Table",
  decorators: [withPlatform],
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Deviation list",
  render: () => (
    <Table>
      <TableCaption>Avvik fra egenkontrollen 2026</TableCaption>
      <TableHeader>
        <AvvikHeader />
      </TableHeader>
      <TableBody>
        {AVVIK.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <AvvikLink id={a.id} />
            </TableCell>
            <TableCell>{a.sjekkpunkt}</TableCell>
            <TableCell>
              <Severity tier={a.tier} />
            </TableCell>
            <TableCell>{a.frist}</TableCell>
            <TableCell>{a.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  name: "With a summary footer",
  render: () => (
    <Table>
      <TableCaption>Avvik fra egenkontrollen 2026</TableCaption>
      <TableHeader>
        <AvvikHeader />
      </TableHeader>
      <TableBody>
        {AVVIK.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <AvvikLink id={a.id} />
            </TableCell>
            <TableCell>{a.sjekkpunkt}</TableCell>
            <TableCell>
              <Severity tier={a.tier} />
            </TableCell>
            <TableCell>{a.frist}</TableCell>
            <TableCell>{a.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>4 avvik, 3 åpne</TableCell>
          <TableCell colSpan={3}>1 Kritisk, 2 Vesentlig, 1 Mindre alvorlig</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// A selected row is TableRow with data-state="selected", which gives it the
// muted background. The checkbox carries the state for assistive tech.
function SelectableAvvik() {
  const [selected, setSelected] = useState<string[]>(["2026-109"]);
  const allSelected = selected.length === AVVIK.length;
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Table>
      <TableCaption>Velg avvik for å lukke flere samtidig</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">
            <label className="inline-flex items-center gap-sm">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(c) => setSelected(c === true ? AVVIK.map((a) => a.id) : [])}
              />
              Alle
            </label>
          </TableHead>
          <TableHead scope="col">ID</TableHead>
          <TableHead scope="col">Sjekkpunkt</TableHead>
          <TableHead scope="col">Alvorlighet</TableHead>
          <TableHead scope="col">Frist</TableHead>
          <TableHead scope="col">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {AVVIK.map((a) => {
          const isSelected = selected.includes(a.id);
          return (
            <TableRow key={a.id} data-state={isSelected ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Velg avvik ${a.id}`}
                  checked={isSelected}
                  onCheckedChange={() => toggle(a.id)}
                />
              </TableCell>
              <TableCell>
                <AvvikLink id={a.id} />
              </TableCell>
              <TableCell>{a.sjekkpunkt}</TableCell>
              <TableCell>
                <Severity tier={a.tier} />
              </TableCell>
              <TableCell>{a.frist}</TableCell>
              <TableCell>{a.status}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const SelectableRows: Story = {
  name: "Selectable rows",
  render: () => <SelectableAvvik />,
};
