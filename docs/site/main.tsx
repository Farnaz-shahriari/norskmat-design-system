/* ---------------------------------------------------------------------------
   Norsk Mat design system, interactive reference.

   Every value on this page is read out of skills/norsk-mat-design-system at
   build time. MODEL comes from scripts/extract-tokens.mjs parsing tokens.css.
   The components below are imported from assets/components, the same files an
   app installs, so a demo cannot show something the component does not do.

   Run `npm run docs` after changing the design system.
   --------------------------------------------------------------------------- */
import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";

// Real components, imported, never recreated.
import { Button } from "@ds/button";
import { Chip } from "@ds/chip";
import { Badge } from "@ds/badge";
import { Switch } from "@ds/switch";
import { Checkbox } from "@ds/checkbox";
import { Progress } from "@ds/progress";
import { Separator } from "@ds/separator";
import { Alert, AlertTitle, AlertDescription } from "@ds/alert";
import { ListItem } from "@ds/list-item";
import { ConnectedButtonGroup } from "@ds/connected-button-group";
import { RadioButton } from "@ds/radio-button";
import { DividerWithSubtitle } from "@ds/divider-with-subtitle";
import { Fab } from "@ds/fab";
import { InlineEditableListItem } from "@ds/inline-editable-list-item";
import { Tab, TabGroup } from "@ds/tabs";

import { Preview } from "./preview";

declare const MODEL: any;
declare const META: { componentCount: number; builtAt: string; repo: string };

/* ------------------------------------------------------------------ helpers */

const SECTIONS = [
  { id: "start", label: "Get started", group: "Begin" },
  { id: "preview", label: "One screen, four brands", group: "Begin" },
  { id: "check", label: "Check a live app", group: "Begin" },
  { id: "platforms", label: "Platforms", group: "Foundations" },
  { id: "color", label: "Colour", group: "Foundations" },
  { id: "severity", label: "Deviation tiers", group: "Foundations" },
  { id: "type", label: "Typography", group: "Foundations" },
  { id: "space", label: "Spacing & radius", group: "Foundations" },
  { id: "components", label: "Components", group: "Library" },
  { id: "rules", label: "Rules", group: "Library" },
  { id: "gaps", label: "Known gaps", group: "Library" },
];

const GROUPS = ["Begin", "Foundations", "Library"];

function useHashSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-70px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

const isDark = (hex: string) => {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) < 0.45;
};

/* --------------------------------------------------------------------- chrome */

function Rail({ active }: { active: string }) {
  return (
    <nav className="rail" aria-label="Sections">
      <div className="brandmark">
        <b>Norsk Mat design system</b>
        <span>{MODEL.platforms.length} platforms &middot; {META.componentCount} components</span>
      </div>
      {GROUPS.map((g) => (
        <div className="navgroup" key={g}>
          <h4>{g}</h4>
          {SECTIONS.filter((s) => s.group === g).map((s) => (
            <button
              key={s.id}
              className="navlink"
              aria-current={active === s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {s.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

function TopBar({
  platform,
  setPlatform,
}: {
  platform: string;
  setPlatform: (id: string) => void;
}) {
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const cycle = () => {
    const next = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
    setTheme(next);
    if (next === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
  };
  return (
    <div className="topbar">
      <span className="lbl">Viewing as</span>
      <div className="switcher" role="group" aria-label="Platform">
        {MODEL.platforms.map((p: any) => {
          const primary = p.groups[0]?.tokens[0]?.value ?? "#000";
          return (
            <button
              key={p.id}
              aria-pressed={platform === p.cls}
              onClick={() => setPlatform(p.cls)}
              title={p.audience}
            >
              <span className="dot" style={{ background: primary }} />
              {p.name}
            </button>
          );
        })}
      </div>
      <button className="themetoggle" onClick={cycle}>
        Page theme: {theme}
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- sections */

function GetStarted() {
  return (
    <section className="block" id="start">
      <p className="eyebrow">Reference &middot; built {META.builtAt}</p>
      <h1 className="title">One source for six Norwegian food platforms.</h1>
      <p className="lede">
        Colour, type, spacing and {META.componentCount} working components for KSL, Nyt Norge,
        Spesialitet, LokalMat, Beskyttede Betegnelser and Stiftelsen Norsk Mat. Install it, do not
        copy it. Every value below is read straight out of{" "}
        <code className="tok">assets/tokens.css</code> when this page is built, so it cannot fall
        behind the system it documents. Jump to <a href="#preview">one screen, four brands</a> if
        you would rather see it than read it.
      </p>

      <h3 className="sub">Install</h3>
      <ol className="steps">
        <li>
          <div>
            <h4>Add the package</h4>
            <p>Pulls the tokens, all {META.componentCount} components and the logos, with every dependency version already pinned.</p>
            <pre className="sh">npm install github:{META.repo}</pre>
          </div>
        </li>
        <li>
          <div>
            <h4>Import the tokens once</h4>
            <p>At your CSS entry point. This is the whole colour, type, spacing and radius system.</p>
            <pre className="sh">@import "@norskmat/design-system/tokens.css";</pre>
          </div>
        </li>
        <li>
          <div>
            <h4>Pick a platform with one class</h4>
            <p>On the root element. Every token below retints. Swapping platform is a one line change, never a rebuild.</p>
            <pre className="sh">{`<html class="theme-lokalmat">`}</pre>
          </div>
        </li>
        <li>
          <div>
            <h4>Let your bundler see the package</h4>
            <p>
              The package ships real <code className="tok">.tsx</code>, not compiled output, so
              Tailwind can read the class names. Most bundlers skip{" "}
              <code className="tok">node_modules</code>, so opt this one in.
            </p>
            <pre className="sh">
              <span className="cm">{"// vite.config.ts"}</span>{"\n"}
              {`optimizeDeps: { exclude: ["@norskmat/design-system"] }`}{"\n\n"}
              <span className="cm">{"// or next.config.js"}</span>{"\n"}
              {`transpilePackages: ["@norskmat/design-system"]`}{"\n\n"}
              <span className="cm">{"// and in your CSS, so Tailwind generates the classes"}</span>{"\n"}
              {`@source "../node_modules/@norskmat/design-system/skills/norsk-mat-design-system/assets/components";`}
            </pre>
          </div>
        </li>
        <li>
          <div>
            <h4>Use a component</h4>
            <p>Import by name. No barrel file, so nothing you do not use ends up in your bundle.</p>
            <pre className="sh">
              {`import { Button } from "@norskmat/design-system/components/button";`}{"\n"}
              {`import { cn } from "@norskmat/design-system/utils";`}
            </pre>
          </div>
        </li>
      </ol>

      <h3 className="sub">Give Claude the same rules</h3>
      <p className="body">
        The repo is also a Claude Code plugin, so Claude follows this system instead of guessing at
        it. Two commands, then one more whenever the design system moves.
      </p>
      <pre className="sh">
        /plugin marketplace add {META.repo}{"\n"}
        /plugin install norsk-mat-design-system@norskmat{"\n\n"}
        <span className="cm">{"# later, to pull new commits"}</span>{"\n"}
        /plugin marketplace update norskmat
      </pre>
      <div className="note">
        <p>
          <b>Updating is the point.</b> Change a colour here, commit, and every app picks it up with{" "}
          <code className="tok">npm update</code> and every Claude session with{" "}
          <code className="tok">/plugin marketplace update</code>. Copy a file into an app instead
          and it silently stops receiving changes, with nothing to warn you.
        </p>
      </div>
    </section>
  );
}

function CheckApp() {
  const url = "https://farnaz-shahriari.github.io/norskmat-design-system";
  const snippet = `import("${url}/audit.js")`;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section className="block" id="check">
      <h2 className="heading">Check a live app</h2>
      <p className="body">
        Everything above describes the system. This checks an <strong>app</strong> against it. Open
        any app that uses the design system, paste one line into the browser console, and it reports
        every token that app gets wrong.
      </p>
      <p className="body">
        It carries no values of its own. It fetches the current ones from this deployment, so it is
        always comparing against the design system as it stands right now, never a snapshot.
      </p>

      <div className="snip">
        <pre className="sh">{snippet}</pre>
        <button onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>

      <h3 className="sub">What it tells you</h3>
      <ul className="rules">
        <li className="do"><span><b>Missing entirely.</b> The app never defines the token, so every component reaching for it falls back to nothing. This is the serious one, it is how <code className="tok">--outline</code> was absent from every platform for months while components hardcoded hex around it.</span></li>
        <li className="do"><span><b>Drifted.</b> Defined, but a different value. This is how the KSL app ended up serving <code className="tok">#ffddcc</code> as Vesentlig's container instead of <code className="tok">#FDD19F</code>, mislabelling how serious a finding is.</span></li>
        <li className="do"><span><b>Which platform it checked as,</b> from the theme class, or by matching the app's own <code className="tok">--primary</code> if no theme class is set.</span></li>
      </ul>

      <div className="note">
        <p>
          Colours are compared as colours, so <code className="tok">#FFFFFF</code>,{" "}
          <code className="tok">#ffffff</code> and <code className="tok">rgb(255 255 255)</code> all
          count as the same value. Lengths are compared in pixels, so{" "}
          <code className="tok">1rem</code> and <code className="tok">16px</code> match. It reports
          real differences, not formatting.
        </p>
      </div>
      <div className="note warn" style={{ marginTop: 12 }}>
        <p>
          <b>It reads, it never writes.</b> The panel renders in a shadow root so the app's CSS
          cannot restyle it and it cannot restyle the app. Close it and nothing remains. Safe to run
          on production.
        </p>
      </div>
    </section>
  );
}

function Platforms() {
  return (
    <section className="block" id="platforms">
      <h2 className="heading">Platforms</h2>
      <p className="body">
        One institution, one structure, {MODEL.platforms.length} themed palettes. Everything except
        brand colour and LokalMat's font family is shared, which is why a platform swap is a class
        name rather than a fork.
      </p>
      <div className="tblscroll">
        <table className="reg">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Theme class</th>
              <th>Audience</th>
              <th>Primary</th>
              <th>Font family</th>
            </tr>
          </thead>
          <tbody>
            {MODEL.platforms.map((p: any) => {
              const primary = p.groups[0]?.tokens[0]?.value ?? "";
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td className="mono">.{p.cls}</td>
                  <td style={{ color: "var(--c-ink-soft)", fontSize: 13 }}>{p.audience}</td>
                  <td className="mono">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                      <span
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: 3,
                          background: primary,
                          border: "1px solid rgb(0 0 0 / 0.2)",
                        }}
                      />
                      {primary}
                    </span>
                  </td>
                  <td className="mono" style={{ whiteSpace: "normal", fontSize: 11.5 }}>
                    {p.fontFamily.split(",")[0].replace(/'/g, "")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="note warn" style={{ marginTop: 18 }}>
        <p>
          <b>Beskyttede Betegnelser and Stiftelsen Norsk Mat have logos but no palette yet.</b> They
          are part of the system and their assets ship in the package, but no theme class exists for
          them, so do not build a themed screen for either one until their tokens are decided.
        </p>
      </div>
    </section>
  );
}

function Colour({ platform }: { platform: string }) {
  const p = MODEL.platforms.find((x: any) => x.cls === platform) ?? MODEL.platforms[0];
  return (
    <section className="block" id="color">
      <h2 className="heading">Colour</h2>
      <p className="body">
        Switch platform in the bar above and every swatch below changes with it. Each group is read
        from that platform's <code className="tok">.theme-*</code> block, so what you see is what an
        app gets. Showing <strong>{p.name}</strong>.
      </p>
      {p.groups.map((g: any) => (
        <div key={g.label}>
          <h3 className="sub">{g.label}</h3>
          <div className="swatchgrid">
            {g.tokens.map((t: any) => (
              <div className="swatch" key={t.name}>
                <div className="chip" style={{ background: t.value }} />
                <div className="meta">
                  <b>--{t.name}</b>
                  <span>{t.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Severity() {
  return (
    <section className="block" id="severity">
      <h2 className="heading">Deviation tiers</h2>
      <p className="body">
        Three tiers, identical on every platform, and they never retint. Each travels as a solid and
        a container pair. <strong>Vesentlig is the only orange in the system</strong>, and neither it
        nor Mindre alvorlig may fall back to <code className="tok">--error</code>, that would
        silently mislabel how serious a finding is.
      </p>
      <div className="tiers">
        {MODEL.severity.map((s: any) => (
          <div className="tier" key={s.tier}>
            <div className="solid" style={{ background: s.main, color: s.fg }}>
              {s.tier}
              <em>{s.main}</em>
            </div>
            <div className="cont" style={{ background: s.container, color: s.containerFg }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5 }}>{s.containerVar}</span>
              <em>{s.container}</em>
            </div>
          </div>
        ))}
      </div>
      <h3 className="sub">In practice</h3>
      <p className="stage-label">Live ListItem and chip, real components</p>
      <div className="stage stage-tight themed">
        <div className="col">
          <ListItem
            overline="Avvik 2026-114"
            title="Journal for plantevernmidler mangler"
            supportingText="Frist 14 dager"
            trailingText="Kritisk"
          />
          <Separator />
          <InlineEditableListItem
            label="Sprøytejournal"
            value="Ikke utfylt"
            chipText="Vesentlig"
            chipVariant="warning"
          />
        </div>
      </div>
      <div className="note" style={{ marginTop: 16 }}>
        <p>
          That warning chip used to hardcode <code className="tok">#FF9800</code>, an orange that
          matched nothing in the system. It now reads{" "}
          <code className="tok">--vesentlig-container</code>. The fix is in the component you are
          looking at, not in a note about the component.
        </p>
      </div>
    </section>
  );
}

function Typography() {
  return (
    <section className="block" id="type">
      <h2 className="heading">Typography</h2>
      <p className="body">
        {MODEL.typeClasses.length} named classes, ordered by how often they actually appear in the
        KSL codebase. Body and label sizes carry nearly all of it, headlines barely register. These
        are working tools, dense and data heavy, not marketing pages. Every specimen below is set in
        the selected platform's own font.
      </p>
      <div className="stage themed">
        {MODEL.typeClasses.map((t: any) => (
          <div className="typerow" key={t.cls}>
            <div className={"tspec " + t.cls}>Kvalitetssystem i landbruket</div>
            <div className="facts">
              <b>.{t.cls}</b>
              <span>{t.size?.startsWith("var(") ? MODEL.typeScale.find((s: any) => "--" + s.name === t.size?.slice(4, -1))?.value ?? t.size : t.size}</span>
              <span>{t.weight?.startsWith("var(") ? MODEL.fontWeights.find((w: any) => "--" + w.name === t.weight?.slice(4, -1))?.value ?? t.weight : t.weight}</span>
              <span>{t.lineHeight}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="sub">Scale</h3>
      <div className="tblscroll">
        <table className="reg">
          <thead>
            <tr>
              <th>Token</th>
              <th>Size</th>
              <th>Where it shows up</th>
            </tr>
          </thead>
          <tbody>
            {MODEL.typeScale.map((t: any) => (
              <tr key={t.name}>
                <td className="mono">--{t.name}</td>
                <td className="num">{t.value}</td>
                <td style={{ color: "var(--c-ink-soft)", fontSize: 13 }}>
                  {MODEL.typeClasses.filter((c: any) => c.size === `var(--${t.name})`).map((c: any) => "." + c.cls).join(", ") || "not bound to a named class"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note warn" style={{ marginTop: 18 }}>
        <p>
          <b>LokalMat's fonts are not licensed yet.</b> Messina Serif and Sands are the target,{" "}
          <code className="tok">tokens.css</code> falls back to Georgia until real files exist.
          Select LokalMat above and the specimens go serif, that is the fallback showing, not the
          finished thing. Never let it drop to a generic system sans, and never reintroduce Quatro.
        </p>
      </div>
    </section>
  );
}

function SpacingRadius() {
  return (
    <section className="block" id="space">
      <h2 className="heading">Spacing &amp; radius</h2>
      <p className="body">
        A 4px base unit with the half steps removed, three component heights, and exactly four radius
        values. Structural separation is a 1px border, never a shadow, a deliberate break from
        Material 3's elevation model.
      </p>

      <h3 className="sub">Spacing scale</h3>
      <div className="tblscroll">
        <table className="reg">
          <thead><tr><th>Token</th><th>Value</th><th style={{ width: "55%" }}>Measure</th></tr></thead>
          <tbody>
            {MODEL.spacing.map((s: any) => (
              <tr key={s.name}>
                <td className="mono">--{s.name}</td>
                <td className="num">{s.value}</td>
                <td><span className="bar" style={{ width: s.value }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="sub">Component heights</h3>
      <div className="tblscroll">
        <table className="reg">
          <thead><tr><th>Token</th><th>Value</th><th style={{ width: "55%" }}>Measure</th></tr></thead>
          <tbody>
            {MODEL.heights.map((s: any) => (
              <tr key={s.name}>
                <td className="mono">--{s.name}</td>
                <td className="num">{s.value}</td>
                <td><span className="hbar" style={{ height: s.value }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="sub">Radius</h3>
      <div className="tblscroll">
        <table className="reg">
          <thead><tr><th>Token</th><th>Value</th><th>Shape</th><th>Use</th></tr></thead>
          <tbody>
            {MODEL.radius.map((s: any) => {
              const alias = s.value !== s.resolved;
              return (
                <tr key={s.name}>
                  <td className="mono">--{s.name}</td>
                  <td className="num">{alias ? `${s.value} = ${s.resolved}` : s.value}</td>
                  <td><span className="radiusdemo" style={{ borderRadius: s.resolved }} /></td>
                  <td style={{ color: "var(--c-ink-soft)", fontSize: 13 }}>
                    {alias ? "alias, not a fifth value" : USE_BY_RADIUS[s.name] ?? ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="note" style={{ marginTop: 18 }}>
        <p>
          Four real values, two aliases. <code className="tok">--radius</code> and{" "}
          <code className="tok">--radius-xl</code> exist because the component library reaches for
          those names, and they resolve into the four above. They are not permission to add a fifth.
        </p>
      </div>
    </section>
  );
}

const USE_BY_RADIUS: Record<string, string> = {
  "radius-sm": "inputs, small surfaces",
  "radius-button": "pill shaped buttons",
  "radius-card": "cards",
  "radius-dialog": "dialogs, modals, bottom sheets",
};

/* ------------------------------------------------------- component gallery */

function Spec({
  name,
  file,
  note,
  tag,
  children,
}: {
  name: string;
  file: string;
  note?: string;
  tag?: "new" | "fixed";
  children: React.ReactNode;
}) {
  return (
    <div className="spec">
      <header>
        <h4>{name}</h4>
        <code>{file}</code>
        {tag === "new" && <span className="tag new">built here</span>}
        {tag === "fixed" && <span className="tag fixed">token fix applied</span>}
        {note && <p>{note}</p>}
      </header>
      <div className="demo themed">{children}</div>
    </div>
  );
}

function Components() {
  const [filter, setFilter] = useState("alle");
  const [multi, setMulti] = useState<string[]>(["kritisk"]);
  const [radio, setRadio] = useState("ja");
  const [on, setOn] = useState(true);
  const [tab, setTab] = useState("avvik");

  return (
    <section className="block" id="components">
      <h2 className="heading">Components</h2>
      <p className="body">
        Everything below is the real component imported from{" "}
        <code className="tok">assets/components</code> and running on this page, not a recreation.
        Change platform in the bar above and they retint, because they read the tokens rather than
        carrying colours of their own. {META.componentCount} components ship in total, these are the
        ones worth seeing move.
      </p>

      <div className="gallery">
        <Spec name="Button" file="button.tsx" note="Six variants. Pill radius comes from --radius-button, and the icon size is a variant, never a hand rolled IconButton.">
          <div className="col">
            <div className="row">
              <Button variant="primary">Send inn</Button>
              <Button variant="secondary">Avbryt</Button>
              <Button variant="tertiary">Les mer</Button>
              <Button variant="destructive">Slett avvik</Button>
            </div>
            <div className="row">
              <Button size="sm">Liten</Button>
              <Button size="sm" variant="secondary">Liten sekundær</Button>
              <Button size="icon" aria-label="Legg til">+</Button>
              <Button disabled>Deaktivert</Button>
            </div>
          </div>
        </Spec>

        <Spec
          name="ConnectedButtonGroup"
          file="connected-button-group.tsx"
          tag="new"
          note="Built for this system rather than taken from Material 3, whose segmented button is unmaintained upstream. Single select and multi select, both live."
        >
          <div className="col col-start">
            <ConnectedButtonGroup
              value={filter}
              onChange={setFilter}
              items={[
                { value: "alle", label: "Alle" },
                { value: "apne", label: "Åpne" },
                { value: "lukket", label: "Lukket" },
              ]}
            />
            <ConnectedButtonGroup
              multiSelect
              size="sm"
              value={multi}
              onChange={setMulti}
              items={[
                { value: "kritisk", label: "Kritisk" },
                { value: "vesentlig", label: "Vesentlig" },
                { value: "mindre", label: "Mindre alvorlig" },
              ]}
            />
          </div>
        </Spec>

        <Spec
          name="ListItem"
          file="list-item.tsx"
          tag="new"
          note="Default and compact density, with overline, supporting text and trailing content. Use this instead of copying row markup out of an existing page."
        >
          <div className="col">
            <ListItem
              overline="Avvik 2026-091"
              title="Manglende HMS-kartlegging"
              supportingText="Registrert 12. august, frist 26. august"
              trailingText="Åpen"
            />
            <ListItem density="compact" title="Gjødselplan 2026" trailingText="Levert" />
            <ListItem density="compact" title="Beitebruk" supportingText="Ingen merknader" selected />
          </div>
        </Spec>

        <Spec name="Chip and Badge" file="chip.tsx, badge.tsx" note="Chips are the follow and filter control. A Button is never used where a Chip belongs.">
          <div className="col">
            <div className="row">
              <Chip variant="assist">Legg til vedlegg</Chip>
              <Chip variant="filter" selected>Åpne avvik</Chip>
              <Chip variant="filter">Lukket</Chip>
              <Chip variant="suggestion">Plantevern</Chip>
            </div>
            <div className="row">
              <Badge>Godkjent</Badge>
              <Badge variant="secondary">Til behandling</Badge>
              <Badge variant="destructive">Avvist</Badge>
              <Badge variant="outline">Utkast</Badge>
            </div>
          </div>
        </Spec>

        <Spec
          name="Switch, Checkbox, RadioButton"
          file="switch.tsx, checkbox.tsx, radio-button.tsx"
          tag="fixed"
          note="Switch used to hardcode three KSL colours, so a Nyt Norge switch rendered KSL green. It now reads --input, --outline and --primary. Swap platform and watch it follow."
        >
          <div className="col">
            <div className="row" style={{ gap: 22 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Switch checked={on} onCheckedChange={setOn} />
                <span className="label-large">Varsle ved nytt avvik</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Checkbox defaultChecked />
                <span className="label-large">Bekreft egenkontroll</span>
              </label>
            </div>
            <div className="row" style={{ gap: 22 }}>
              <RadioButton checked={radio === "ja"} onClick={() => setRadio("ja")} label="Ja" />
              <RadioButton checked={radio === "nei"} onClick={() => setRadio("nei")} label="Nei" />
              <RadioButton checked={false} disabled label="Ikke relevant" />
            </div>
          </div>
        </Spec>

        <Spec name="Tabs" file="tabs.tsx" note="TabGroup with Tab children. Structure is shared across platforms, only the indicator colour changes.">
          <TabGroup>
            <Tab active={tab === "avvik"} onClick={() => setTab("avvik")}>Avvik</Tab>
            <Tab active={tab === "sjekkliste"} onClick={() => setTab("sjekkliste")}>Sjekkliste</Tab>
            <Tab active={tab === "vedlegg"} onClick={() => setTab("vedlegg")}>Vedlegg</Tab>
          </TabGroup>
        </Spec>

        <Spec name="Alert" file="alert.tsx" note="Alert with title and description. The default variant is informational, destructive carries --error.">
          <div className="col">
            <Alert>
              <AlertTitle>Egenkontroll forfaller om 5 dager</AlertTitle>
              <AlertDescription>Fullfør sjekklisten før 14. september for å unngå avvik.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Kritisk avvik registrert</AlertTitle>
              <AlertDescription>Journal for plantevernmidler mangler for hele sesongen.</AlertDescription>
            </Alert>
          </div>
        </Spec>

        <Spec name="Progress, Separator, DividerWithSubtitle" file="progress.tsx, separator.tsx, divider-with-subtitle.tsx" note="Structural pieces. The divider carries a label, which is how sections are separated without a shadow.">
          <div className="col">
            <div>
              <div className="label-medium" style={{ marginBottom: 8 }}>Egenkontroll, 14 av 20 punkter</div>
              <Progress value={70} />
            </div>
            <Separator />
            <DividerWithSubtitle subtitle="Plantevern" />
            <div className="body-medium">Seksjonsinnhold følger her.</div>
          </div>
        </Spec>

        <Spec name="Fab" file="fab.tsx" note="Five variants, three sizes, circle or extended. Uses the primary container tokens for the tonal variant.">
          <div className="row">
            <Fab aria-label="Nytt avvik">+</Fab>
            <Fab variant="tonal" aria-label="Nytt avvik">+</Fab>
            <Fab variant="secondary" size="small" aria-label="Nytt avvik">+</Fab>
            <Fab variant="tertiary" size="small" aria-label="Nytt avvik">+</Fab>
          </div>
        </Spec>
      </div>

      <div className="note" style={{ marginTop: 26 }}>
        <p>
          <b>The rest of the library is in the package.</b> {META.componentCount} files in total,
          including the full set of Radix based primitives, dialogs, menus, tables, date and time
          pickers. Import any of them by name, they are audited against this system and use these
          tokens.
        </p>
      </div>
    </section>
  );
}

function Rules() {
  return (
    <section className="block" id="rules">
      <h2 className="heading">Rules</h2>
      <p className="body">
        The short list that keeps six platforms looking like one institution. Each of these exists
        because breaking it caused a real bug.
      </p>
      <ul className="rules">
        <li className="do"><span><b>Install the package, never copy a file into an app's src.</b> A copy stops receiving changes and nothing warns anyone. This is how a design system quietly becomes six design systems.</span></li>
        <li><span><b>No raw hex, pixel or radius values in new code.</b> Everything references a token. If the token you need does not exist, add it here first.</span></li>
        <li><span><b>No orange other than Vesentlig.</b> Two separate components invented their own orange before this rule existed. Use <code className="tok">--vesentlig</code>, and never fall back to <code className="tok">--error</code> for Vesentlig or Mindre alvorlig.</span></li>
        <li><span><b>No shadows for structural separation.</b> A 1px border, from <code className="tok">--outline-variant</code>. This is a deliberate deviation from Material 3.</span></li>
        <li className="do"><span><b>IconButton is <code className="tok">button.tsx</code> with <code className="tok">size="icon"</code>.</b> The primitive exists and is simply under used, do not hand roll another one.</span></li>
        <li className="do"><span><b>ConnectedButtonGroup and ListItem are components.</b> Use them rather than rebuilding the markup from a page you found.</span></li>
        <li><span><b>Never reintroduce Quatro.</b> It was never actually loaded, so roughly 130 headings silently fell back to a system sans for months. Manrope only, except LokalMat.</span></li>
        <li><span><b>Do not treat the live app as ground truth.</b> Where the app and this system disagree, this system is right and the app has a bug, listed below.</span></li>
      </ul>
    </section>
  );
}

function Gaps() {
  const fixed = [
    <><b>--outline did not exist anywhere,</b> for any platform. That is why several components hardcoded a raw hex, there was nothing to reach for.</>,
    <><b>--outline-variant was missing for Nyt Norge, Spesialitet and LokalMat.</b> KSL was the only platform that had it.</>,
    <><b>The Tailwind theme mapping was incomplete.</b> Outline, outline variant and the whole surface family were never exposed as utility classes, so <code className="tok">bg-surface-variant</code> silently did nothing.</>,
    <><b>Typography and spacing were documentation only.</b> The scales existed as tables and nothing implemented them. <code className="tok">--radius-button</code> was already referenced by every button and input and resolved to nothing.</>,
    <><b>The sidebar colour family did not exist.</b> Six token names, undefined, so a sidebar rendered untinted on every platform. Now aliased onto the surface family and mapped, so <code className="tok">bg-sidebar</code> works. Change those six lines if a sidebar should be its own surface.</>,
    <><b>A shadow wrapped a hex value in <code className="tok">hsl()</code>,</b> which is invalid CSS, so the sidebar rail handle had no outline at all. Every colour in this system is hex.</>,
    <><b>--radius-xl collided with Tailwind's own radius scale.</b> Defining it in <code className="tok">:root</code> silently changed every <code className="tok">rounded-xl</code> in the library, which took <code className="tok">card.tsx</code> from its correct 12px to 28px without anyone editing card.tsx. Removed, and card and list item now name <code className="tok">--radius-card</code> directly.</>,
    <><b>Nothing enforced any of these rules.</b> <code className="tok">npm run lint:tokens</code> now checks all {META.componentCount} components for undefined variables, raw hex, radius name collisions, off scale radius and spacing, and text sized outside the named scale. It fails a build on the first three.</>,
  ];

  const open = [
    <><b>LokalMat's fonts are not licensed.</b> Messina Serif and Sands exist in no repo. Georgia is the stand in. This cannot be fixed from here, it needs the real files.</>,
    <><b>Around 40 radius usages are not on the four tokens.</b> <code className="tok">rounded-md</code> in 18 files, <code className="tok">rounded-lg</code> in 10, plus <code className="tok">rounded-2xl</code>, <code className="tok">rounded-xs</code> and a few raw brackets. spacing.md says four values only, so this is a real violation, but which of the four each becomes is a per component decision. Run the linter for the current list.</>,
    <><b>25 components size text with Tailwind's text-* scale</b> rather than the named type classes, not six as this list previously claimed. They are the Radix primitives, so it may be the right call to leave them, but it should be a decision rather than an accident.</>,
    <><b>Four spacing values sit off the scale.</b> <code className="tok">max-h-[300px]</code>, <code className="tok">max-w-[400px]</code>, <code className="tok">max-h-[320px]</code> and <code className="tok">py-[14px]</code>. The first three are dropdown and picker maximums, arguably fine, the last is not.</>,
    <><b>Severity colours are still wrong in the live KSL app.</b> Vesentlig's container is <code className="tok">#ffddcc</code> there and one component collapses two tiers into the same yellow. That is a different repo, this system cannot fix it.</>,
    <><b>Beskyttede Betegnelser and Stiftelsen Norsk Mat have no palette.</b> Logos ship, no theme class exists, so do not build a themed screen for either yet.</>,
  ];

  return (
    <section className="block" id="gaps">
      <h2 className="heading">Known gaps</h2>
      <p className="body">
        Kept in the open on purpose. A design system that only lists what works is not describing
        the thing anyone actually builds against. The list is audited, not assumed, and two entries
        turned out to understate the problem by a wide margin.
      </p>

      <h3 className="sub">Fixed</h3>
      <div className="gaps">
        {fixed.map((t, i) => (
          <div className="gap" key={i}>
            <span className="state">fixed</span>
            <p>{t}</p>
          </div>
        ))}
      </div>

      <h3 className="sub">Still open</h3>
      <div className="gaps">
        {open.map((t, i) => (
          <div className="gap" key={i}>
            <span className="state open">open</span>
            <p>{t}</p>
          </div>
        ))}
      </div>

      <div className="note" style={{ marginTop: 20 }}>
        <p>
          <b>Check the current state yourself</b> rather than trusting this page, it is only as
          fresh as the last build. <code className="tok">npm run lint:tokens</code> reports every
          open item it can detect, with file names and counts.
        </p>
      </div>

      <footer className="foot">
        <span>Generated from <code>skills/norsk-mat-design-system</code> by <code>npm run docs</code></span>
        <span>{META.builtAt}</span>
        <span><code>{META.repo}</code></span>
      </footer>
    </section>
  );
}

/* --------------------------------------------------------------------- app */

function App() {
  const [platform, setPlatform] = useState(() => {
    // Remembering the platform is a per viewer convenience only. It can throw
    // in a private window or with site data blocked, so it never matters.
    try {
      const saved = localStorage.getItem("norskmat-platform");
      if (saved && MODEL.platforms.some((p: any) => p.cls === saved)) return saved;
    } catch {}
    return MODEL.platforms[0].cls;
  });
  const active = useHashSection();

  const choose = useCallback((cls: string) => {
    setPlatform(cls);
    try {
      localStorage.setItem("norskmat-platform", cls);
    } catch {}
  }, []);

  // 1 to 4 switches platform, so you can flick through all four and watch what
  // holds still. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const i = "1234".indexOf(e.key);
      if (i >= 0 && MODEL.platforms[i]) choose(MODEL.platforms[i].cls);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  // One class on one wrapper themes everything inside it, because the theme
  // classes only set CSS variables and variables inherit. That is also exactly
  // how an app does it, one class on <html>. Nothing per component, and a stage
  // that mounts later is themed for free.
  return (
    <div className="wrap">
      <Rail active={active} />
      <div className="main">
        <TopBar platform={platform} setPlatform={choose} />
        <div className={"page themescope " + platform}>
          <GetStarted />
          <Preview platform={platform} setPlatform={choose} />
          <CheckApp />
          <Platforms />
          <Colour platform={platform} />
          <Severity />
          <Typography />
          <SpacingRadius />
          <Components />
          <Rules />
          <Gaps />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
