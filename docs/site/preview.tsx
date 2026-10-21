/* ---------------------------------------------------------------------------
   The preview section: one screen, four brands.

   This is the part of the reference that answers "what does the system look
   like when it is actually a screen". Structure, spacing, components and
   layout are identical across every platform. Only the brand layer changes,
   which is the claim the design system makes, so it should be the thing you
   can see.

   Every colour, size, radius and font here comes from a token. There is no
   hex, no px and no font name in this file. If something looks wrong when you
   switch platform, the token is wrong, not the screen.
   --------------------------------------------------------------------------- */
import React, { useState } from "react";

import { Button } from "@ds/button";
import { Chip } from "@ds/chip";
import { Badge } from "@ds/badge";
import { Progress } from "@ds/progress";
import { Separator } from "@ds/separator";
import { ListItem } from "@ds/list-item";
import { ConnectedButtonGroup } from "@ds/connected-button-group";
import { DividerWithSubtitle } from "@ds/divider-with-subtitle";
import { Switch } from "@ds/switch";

declare const MODEL: any;
declare const LOGOS: Record<string, string>;

/* ------------------------------------------------------------------ content */

/* Example content only, none of this is real data. It is written per platform
   because each one speaks to a different person, a farmer, a shopper, a
   producer, a buyer. The point of varying the words is to show that the same
   structure carries all four without being bent to fit. */
type Screen = {
  app: string;
  nav: string[];
  overline: string;
  title: string;
  action: string;
  filters: string[];
  stats: [string, string][];
  section: string;
  rows: { overline?: string; title: string; sub: string; badge: string; tier?: 0 | 1 | 2 }[];
  asideTitle: string;
  asideLabel: string;
  progress: number;
  asideRows: [string, string][];
  toggle: string;
};

const SCREENS: Record<string, Screen> = {
  ksl: {
    app: "Egenkontroll",
    nav: ["Oversikt", "Avvik", "Sjekklister", "Vedlegg"],
    overline: "Gårdsnummer 118 / 4",
    title: "Egenkontroll 2026",
    action: "Registrer avvik",
    filters: ["Alle", "Åpne", "Lukket"],
    stats: [
      ["Åpne avvik", "3"],
      ["Fullførte punkter", "14 / 20"],
      ["Dager til frist", "12"],
    ],
    section: "Plantevern",
    rows: [
      { overline: "Avvik 2026-114", title: "Journal for plantevernmidler mangler", sub: "Registrert 12. august", badge: "Kritisk", tier: 0 },
      { overline: "Avvik 2026-091", title: "HMS-kartlegging ikke oppdatert", sub: "Registrert 4. august", badge: "Vesentlig", tier: 1 },
      { overline: "Avvik 2026-076", title: "Merking av kjemikalielager", sub: "Registrert 28. juli", badge: "Mindre alvorlig", tier: 2 },
      { title: "Gjødselplan 2026", sub: "Ingen merknader", badge: "Godkjent" },
    ],
    asideTitle: "Fremdrift",
    asideLabel: "Egenkontroll, 14 av 20 punkter",
    progress: 70,
    asideRows: [
      ["Plantevern", "4 / 4"],
      ["Dyrevelferd", "6 / 6"],
      ["HMS", "3 / 6"],
      ["Gjødsel", "1 / 4"],
    ],
    toggle: "Varsle meg ved nytt avvik",
  },
  "nyt-norge": {
    app: "Nyt Norge",
    nav: ["Forsiden", "Produkter", "Produsenter", "Om merket"],
    overline: "Norsk opprinnelse",
    title: "Merkede produkter",
    action: "Meld inn produkt",
    filters: ["Alle", "Meieri", "Kjøtt"],
    stats: [
      ["Merkede produkter", "2 418"],
      ["Produsenter", "312"],
      ["Nye denne måneden", "27"],
    ],
    section: "Meieri",
    rows: [
      { overline: "Rørosmeieriet", title: "Tjukkmjølk 0,5 l", sub: "Norsk melk, 100 prosent", badge: "Merket" },
      { overline: "Synnøve Finden", title: "Gulost 26 prosent", sub: "Norsk melk, 100 prosent", badge: "Merket" },
      { overline: "Q-Meieriene", title: "Skyr naturell", sub: "Under behandling", badge: "Til vurdering", tier: 1 },
      { title: "Rømme 35 prosent", sub: "Mangler dokumentasjon", badge: "Avvik", tier: 0 },
    ],
    asideTitle: "Andel norsk",
    asideLabel: "Norske råvarer i merkede produkter",
    progress: 86,
    asideRows: [
      ["Melk", "100 prosent"],
      ["Kjøtt", "98 prosent"],
      ["Korn", "74 prosent"],
      ["Frukt", "41 prosent"],
    ],
    toggle: "Vis kun produkter i min butikk",
  },
  spesialitet: {
    app: "Spesialitet",
    nav: ["Oversikt", "Søknader", "Bedømming", "Arkiv"],
    overline: "Søknadsrunde 2026",
    title: "Søknader til vurdering",
    action: "Ny søknad",
    filters: ["Alle", "Til bedømming", "Godkjent"],
    stats: [
      ["Til vurdering", "18"],
      ["Godkjent i år", "64"],
      ["Snitt poeng", "7,8"],
    ],
    section: "Bakervarer",
    rows: [
      { overline: "Søknad 2026-044", title: "Surdeigsbrød med byggmel", sub: "Til sensorisk bedømming", badge: "Til vurdering", tier: 1 },
      { overline: "Søknad 2026-039", title: "Flatbrød fra Valdres", sub: "Godkjent 2. september", badge: "Godkjent" },
      { overline: "Søknad 2026-031", title: "Lefse med kanel", sub: "Mangler produktbeskrivelse", badge: "Ufullstendig", tier: 0 },
      { title: "Knekkebrød med havre", sub: "Trukket av søker", badge: "Trukket", tier: 2 },
    ],
    asideTitle: "Bedømming",
    asideLabel: "Fullførte vurderinger i runden",
    progress: 46,
    asideRows: [
      ["Bakervarer", "8 / 12"],
      ["Kjøtt", "6 / 15"],
      ["Meieri", "3 / 9"],
      ["Drikke", "1 / 8"],
    ],
    toggle: "Varsle når en søknad er ferdig bedømt",
  },
  lokalmat: {
    app: "Lokalmat",
    nav: ["Utforsk", "Produsenter", "Mine lister", "Kontakt"],
    overline: "Innlandet",
    title: "Produsenter i nærheten",
    action: "Legg til produsent",
    filters: ["Alle", "Gårdsbutikk", "Nettsalg"],
    stats: [
      ["Produsenter", "1 840"],
      ["Nye i år", "156"],
      ["Fylker dekket", "15"],
    ],
    section: "Gårdsbutikk",
    rows: [
      { overline: "Ringsaker", title: "Stange Gårdsmeieri", sub: "Ost, rømme, smør", badge: "Åpen i dag" },
      { overline: "Gjøvik", title: "Solberg Frukt og Bær", sub: "Epler, plommer, saft", badge: "Åpen i dag" },
      { overline: "Lillehammer", title: "Nordre Ål Bakeri", sub: "Stengt til 15. september", badge: "Stengt", tier: 2 },
      { title: "Toten Kjøttsenter", sub: "Mangler kontaktinfo", badge: "Ufullstendig", tier: 1 },
    ],
    asideTitle: "Utvalg",
    asideLabel: "Produsenter med nettsalg",
    progress: 62,
    asideRows: [
      ["Meieri", "218"],
      ["Kjøtt", "196"],
      ["Bakeri", "141"],
      ["Drikke", "88"],
    ],
    toggle: "Vis kun produsenter med nettsalg",
  },
};

const TIER_TOKENS = [
  { bg: "var(--error-container)", fg: "var(--error-container-foreground)", dot: "var(--error)", tk: "--error-container" },
  { bg: "var(--vesentlig-container)", fg: "var(--vesentlig-container-foreground)", dot: "var(--vesentlig)", tk: "--vesentlig-container" },
  { bg: "var(--mindre-alvorlig-container)", fg: "var(--mindre-alvorlig-container-foreground)", dot: "var(--mindre-alvorlig)", tk: "--mindre-alvorlig-container" },
];

/* ------------------------------------------------------------ platform cards */

const STRIP = ["primary", "primary-container", "secondary", "tertiary", "surface-variant", "outline"];

export function PlatformPicker({
  platform,
  setPlatform,
}: {
  platform: string;
  setPlatform: (cls: string) => void;
}) {
  const flat = (p: any) => {
    const all: Record<string, string> = {};
    p.groups.forEach((g: any) => g.tokens.forEach((t: any) => (all[t.name] = t.value)));
    return all;
  };
  return (
    <div className="pickgrid" role="radiogroup" aria-label="Platform">
      {MODEL.platforms.map((p: any, i: number) => {
        const tokens = flat(p);
        const on = platform === p.cls;
        return (
          <button
            key={p.id}
            className="pickcard"
            role="radio"
            aria-checked={on}
            onClick={() => setPlatform(p.cls)}
          >
            <span className="pickkey">{i + 1}</span>
            <span className="picklogo">
              <img src={LOGOS[p.id]} alt="" />
            </span>
            <span className="pickname">{p.name}</span>
            <span className="pickaud">{p.audience}</span>
            <span className="pickstrip" aria-hidden="true">
              {STRIP.map((k) => (
                <i key={k} style={{ background: tokens[k] }} title={`--${k} ${tokens[k]}`} />
              ))}
            </span>
            <span className="pickfont">{p.fontFamily.split(",")[0].replace(/'/g, "")}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- screen */

function Tk({ children, tk, className, style }: any) {
  // The token badge only renders when inspect mode is on, driven by a class on
  // the frame, so there is no per element state to keep in sync.
  return (
    <div className={"tk " + (className ?? "")} data-tk={tk} style={style}>
      {children}
    </div>
  );
}

export function AppScreen({ platformId, compact }: { platformId: string; compact?: boolean }) {
  const s = SCREENS[platformId];
  const [filter, setFilter] = useState(s.filters[0]);
  const [on, setOn] = useState(true);

  return (
    <div className="screen" data-compact={compact ? "" : undefined}>
      {/* app bar */}
      <Tk tk="--surface-container" className="scr-bar">
        <img className="scr-logo" src={LOGOS[platformId]} alt="" />
        <span className="title-medium scr-app">{s.app}</span>
        <span className="scr-spacer" />
        {!compact && <Chip variant="assist">Søk</Chip>}
        <Tk tk="--primary-container" className="scr-avatar">
          <span className="label-medium">FS</span>
        </Tk>
      </Tk>

      <div className="scr-body">
        {/* side nav, desktop only */}
        {!compact && (
          <Tk tk="--surface-container-low" className="scr-nav">
            {s.nav.map((n, i) => (
              <span key={n} className={"scr-navitem label-large" + (i === 1 ? " on" : "")}>
                {n}
              </span>
            ))}
          </Tk>
        )}

        <div className="scr-main">
          {/* page header */}
          <div className="scr-head">
            <div>
              <div className="label-small scr-over">{s.overline}</div>
              <div className="headline-small">{s.title}</div>
            </div>
            <Button size={compact ? "sm" : "default"}>{s.action}</Button>
          </div>

          {/* filters */}
          <div className="scr-filters">
            <ConnectedButtonGroup
              size="sm"
              value={filter}
              onChange={setFilter}
              items={s.filters.map((f) => ({ value: f, label: f }))}
            />
            {!compact && (
              <>
                <Chip variant="filter" selected>
                  {s.section}
                </Chip>
                <Chip variant="filter">2026</Chip>
              </>
            )}
          </div>

          {/* stat tiles */}
          <div className="scr-stats">
            {s.stats.map(([label, value], i) => (
              <Tk
                key={label}
                tk={i === 0 ? "--surface-container-high" : undefined}
                className="scr-stat"
              >
                <div className="label-medium scr-statlabel">{label}</div>
                <div className="headline-small scr-statvalue">{value}</div>
              </Tk>
            ))}
          </div>

          <DividerWithSubtitle subtitle={s.section} />

          {/* the list */}
          <div className="scr-list">
            {s.rows.map((r, i) => (
              <div key={i} className="scr-row">
                <ListItem
                  density={compact ? "compact" : "default"}
                  overline={r.overline}
                  title={r.title}
                  supportingText={r.sub}
                />
                {r.tier === undefined ? (
                  <Badge variant="outline">{r.badge}</Badge>
                ) : (
                  <span
                    className="scr-tier label-medium"
                    data-tk={TIER_TOKENS[r.tier].tk}
                    style={{
                      background: TIER_TOKENS[r.tier].bg,
                      color: TIER_TOKENS[r.tier].fg,
                    }}
                  >
                    <i style={{ background: TIER_TOKENS[r.tier].dot }} />
                    {r.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* aside */}
          <Tk tk="--surface-container-low" className="scr-aside">
            <div className="title-medium">{s.asideTitle}</div>
            <div className="body-medium scr-asidelabel">{s.asideLabel}</div>
            <Progress value={s.progress} />
            <Separator />
            <div className="scr-asiderows">
              {s.asideRows.map(([k, v]) => (
                <div key={k} className="scr-asiderow">
                  <span className="body-medium">{k}</span>
                  <span className="label-medium">{v}</span>
                </div>
              ))}
            </div>
            <Separator />
            <label className="scr-toggle">
              <Switch checked={on} onCheckedChange={setOn} />
              <span className="label-large">{s.toggle}</span>
            </label>
          </Tk>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

export function Preview({
  platform,
  setPlatform,
}: {
  platform: string;
  setPlatform: (cls: string) => void;
}) {
  const [mode, setMode] = useState<"desktop" | "mobile" | "compare">("desktop");
  const [inspect, setInspect] = useState(false);
  const current = MODEL.platforms.find((p: any) => p.cls === platform) ?? MODEL.platforms[0];

  return (
    <section className="block" id="preview">
      <h2 className="heading">One screen, four brands</h2>
      <p className="body">
        The same screen, the same components, the same spacing, rendered in each platform's tokens.
        Pick a platform below, or press <kbd>1</kbd> to <kbd>4</kbd>. Nothing in this screen contains
        a hex value, a pixel value or a font name, so everything you see change is a token doing its
        job.
      </p>

      <PlatformPicker platform={platform} setPlatform={setPlatform} />

      <div className="prevbar">
        <div className="seg" role="group" aria-label="View">
          {(["desktop", "mobile", "compare"] as const).map((m) => (
            <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "compare" ? "Compare all four" : m === "desktop" ? "Desktop" : "Mobile"}
            </button>
          ))}
        </div>
        <label className="insptoggle">
          <input type="checkbox" checked={inspect} onChange={(e) => setInspect(e.target.checked)} />
          Label the tokens
        </label>
        <span className="prevnote">Example content, not real data</span>
      </div>

      {mode === "compare" ? (
        <div className={"comparegrid" + (inspect ? " insp" : "")}>
          {MODEL.platforms.map((p: any) => (
            <figure className="phone" key={p.id}>
              <div className={"phone-screen " + p.cls}>
                <AppScreen platformId={p.id} compact />
              </div>
              <figcaption>
                <b>{p.name}</b>
                <code>.{p.cls}</code>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : mode === "mobile" ? (
        <div className={"phonewrap" + (inspect ? " insp" : "")}>
          <figure className="phone phone-lg">
            <div className="phone-screen">
              <AppScreen platformId={current.id} compact />
            </div>
            <figcaption>
              <b>{current.name}</b>
              <code>.{current.cls}</code>
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className={"browser" + (inspect ? " insp" : "")}>
          <div className="browser-chrome">
            <span className="dots"><i /><i /><i /></span>
            <span className="urlbar">
              {current.id === "ksl" ? "ksl.no" : current.id === "nyt-norge" ? "nytnorge.no" : current.id === "lokalmat" ? "lokalmat.no" : "stiftelsennorskmat.no"}
              /{SCREENS[current.id].nav[1].toLowerCase()}
            </span>
          </div>
          <div className="browser-view">
            <AppScreen platformId={current.id} />
          </div>
        </div>
      )}

      <div className="note" style={{ marginTop: 20 }}>
        <p>
          <b>What is not changing is the point.</b> Layout, spacing, component choice and hierarchy
          are identical in all four. A platform is a brand layer over one shared structure, so a
          screen built for KSL becomes a Nyt Norge screen by changing a class, never by rebuilding
          it.
        </p>
      </div>
      <div className="note warn" style={{ marginTop: 12 }}>
        <p>
          <b>The logo in that app bar is smaller than the brand minimum.</b> The brand guidelines set
          a 250px minimum width, which no app bar can honour. Component level logo rules still need
          their own smaller minimum, agreed with whoever owns the brand. See{" "}
          <code className="tok">assets/ksl/README.md</code>.
        </p>
      </div>
    </section>
  );
}
