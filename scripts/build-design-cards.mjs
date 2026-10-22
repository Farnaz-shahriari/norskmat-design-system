/* ---------------------------------------------------------------------------
   Builds the non-component cards for the Claude Design project into
   design-cards/: Colours, Typography, Spacing and shape, and the Theme
   explorer.

   Each card is an HTML page whose first line is the @dsCard marker the
   Claude Design pane reads. design-cards/ mirrors the project root: the cards
   go to foundations/<file> and reach the synced bundle at ../, and the
   explorer's script goes to _preview/ThemeExplorer.js beside the component
   preview scripts. Not guidelines/: HTML or JS there stops the app's
   self-check (.design-sync/NOTES.md).

   Nothing here is typed by hand. The foundation cards come from tokens.css
   through extract-tokens.mjs and colour every swatch with var(--token), so a
   token change shows up on the next sync. The explorer is the same React
   screens the "Examples/ThemeExplorer" story renders, compiled against the
   synced bundle on window.NorskmatDesignSystem rather than a second copy of
   the library.

   design-cards/ is build output, gitignored.

   Usage: npm run build:cards
   --------------------------------------------------------------------------- */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { buildModel, SRC_DIR } from "./extract-tokens.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..");
const OUT = join(ROOT, "design-cards");
const CARDS = join(OUT, "foundations");
const PREVIEW = join(OUT, "_preview");
const COMPONENTS = join(SRC_DIR, "components");
// Cards sit at foundations/ in the project, one level below the bundle root.
const UP = "../";
// The Claude Design pane sorts groups alphabetically, so the leading number
// is what puts these two above the component groups (actions, forms, ...).
const FOUNDATIONS = "1. Foundations";
const EXPLORER = "2. Theme explorer";

rmSync(OUT, { recursive: true, force: true });
mkdirSync(CARDS, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });

const model = buildModel();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// WCAG 2.x contrast, the same formula as scripts/check-contrast.mjs.
function luminance(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(full.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(2);
};

// Layout only. Colour, type and radius all come from the design system.
const CARD_CSS = `
  body { margin: 0; padding: var(--space-lg); background: var(--background); color: var(--foreground); font-family: var(--font-family); }
  h1, h2, h3, p { margin: 0; }
  .stack { display: flex; flex-direction: column; gap: var(--space-md); }
  .section { display: flex; flex-direction: column; gap: var(--space-md); margin-top: var(--space-xl); }
  .cols { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-md); }
  .col { border: 1px solid var(--outline-variant); border-radius: var(--radius-card); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); font-family: var(--font-family); background: var(--background); color: var(--foreground); }
  .muted { color: var(--on-surface-variant); }
  .row { display: flex; align-items: center; gap: var(--space-sm); }
  .swatch { width: 40px; height: 40px; border-radius: var(--radius-sm); border: 1px solid var(--outline-variant); flex: none; }
  code { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
`;

function page({ title, group, viewport, body, head = "", scripts = "" }) {
  return `<!-- @dsCard group="${esc(group)}" viewport="${viewport}" name="${esc(title)}" -->
<!doctype html>
<html class="theme-ksl"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="${UP}styles.css">
  <style>${CARD_CSS}</style>${head}
</head><body>
${body}
${scripts}
</body></html>
`;
}

/* ------------------------------------------------------------------ colours */

function colours() {
  const columns = model.platforms
    .map((p) => {
      const groups = p.groups
        .map(
          (g) => `<div class="stack" style="gap: var(--space-xs)">
          <h3 class="label-medium muted">${esc(g.label)}</h3>
          ${g.tokens
            .map(
              (t) => `<div class="row">
            <div class="swatch" style="background: var(--${t.name})"></div>
            <div><div class="label-small"><code>--${esc(t.name)}</code></div><div class="label-xsmall muted"><code>${esc(t.value)}</code></div></div>
          </div>`,
            )
            .join("")}
        </div>`,
        )
        .join("");
      return `<section class="col ${p.cls}" aria-label="${esc(p.name)}">
        <h2 class="title-medium">${esc(p.name)}</h2>
        <p class="label-small muted">${esc(p.audience)}</p>
        ${groups}
      </section>`;
    })
    .join("");

  const severity = model.severity
    .map(
      (s) => `<div class="row" style="gap: var(--space-md)">
        <div class="row" style="background: var(${s.mainVar}); color: var(${s.mainVar}-foreground); border-radius: var(--radius-sm); padding: var(--space-sm) var(--space-md); min-width: 180px">
          <span class="label-large">${esc(s.tier)}</span>
        </div>
        <span class="label-small muted"><code>${s.mainVar}</code> ${esc(s.main)}, text ${ratio(s.fg, s.main)}:1</span>
        <div class="row" style="background: var(${s.containerVar}); color: var(${s.containerVar}-foreground); border-radius: var(--radius-sm); padding: var(--space-sm) var(--space-md); min-width: 180px">
          <span class="label-large">${esc(s.tier)}</span>
        </div>
        <span class="label-small muted"><code>${s.containerVar}</code> ${esc(s.container)}, text ${ratio(s.containerFg, s.container)}:1</span>
      </div>`,
    )
    .join("");

  return page({
    title: "Colours",
    group: FOUNDATIONS,
    viewport: "1280x2000",
    body: `<div class="stack">
      <h1 class="headline-small">Colours</h1>
      <p class="body-medium muted">Brand, surface and outline colours per platform. Apply one <code>.theme-&lt;platform&gt;</code> class on <code>&lt;html&gt;</code>; every swatch here is the live token. A control's border is <code>--outline</code>; <code>--outline-variant</code> is for dividers.</p>
    </div>
    <div class="section"><div class="cols">${columns}</div></div>
    <div class="section">
      <h2 class="title-large">Severity and error, the same on every platform</h2>
      <p class="body-medium muted">Kritisk, Vesentlig and Mindre alvorlig are the only deviation tiers. Never shown by colour alone: the tier name is always in the text. Vesentlig is the only orange. Contrast is for the paired foreground token.</p>
      <div class="stack">${severity}</div>
    </div>`,
  });
}

/* --------------------------------------------------------------- typography */

const SAMPLE = {
  headline: "Egenkontroll 2026",
  title: "Avvik 2026-114",
  body: "Journal for plantevernmidler mangler. Fristen er 15. november.",
  label: "Registrer avvik",
};

function typography() {
  const resolveSize = (v) => {
    const m = /var\(--(text-[a-z0-9]+)\)/.exec(v ?? "");
    const hit = m && model.typeScale.find((s) => s.name === m[1]);
    return hit ? `${hit.value}` : v;
  };
  const resolveWeight = (v) => {
    const m = /var\(--(font-weight-[a-z]+)\)/.exec(v ?? "");
    const hit = m && model.fontWeights.find((w) => w.name === m[1]);
    return hit ? `${hit.value}` : v;
  };
  const header = model.platforms
    .map((p) => {
      const first = p.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      const note = p.id === "lokalmat" ? `${first}, Georgia until licensed` : first;
      return `<div class="${p.cls}" style="font-family: var(--font-family)"><div class="label-medium">${esc(p.name)}</div><div class="label-small muted">${esc(note)}</div></div>`;
    })
    .join("");
  const rows = model.typeClasses
    .map((c) => {
      const kind = c.cls.split("-")[0];
      const samples = model.platforms
        .map((p) => `<div class="${p.cls}" style="min-width: 0"><div class="${c.cls}">${esc(SAMPLE[kind] ?? SAMPLE.body)}</div></div>`)
        .join("");
      return `<div style="display: grid; grid-template-columns: 200px repeat(4, minmax(0, 1fr)); gap: var(--space-md); align-items: baseline; padding: var(--space-md) 0; border-top: 1px solid var(--outline-variant)">
        <div><div class="label-large"><code>.${esc(c.cls)}</code></div><div class="label-small muted">${esc(resolveSize(c.size))}, ${esc(resolveWeight(c.weight))}, line ${esc(c.lineHeight)}</div></div>
        ${samples}
      </div>`;
    })
    .join("");
  return page({
    title: "Typography",
    group: FOUNDATIONS,
    viewport: "1280x900",
    body: `<div class="stack">
      <h1 class="headline-small">Typography</h1>
      <p class="body-medium muted">Ten named type classes, the same sizes on every platform; only the font family changes. Manrope for KSL, Nyt Norge and Spesialitet. LokalMat's Messina Serif and Sands are not licensed yet, so LokalMat renders in Georgia. Size text with these classes, never Tailwind's <code>text-sm</code> or <code>text-lg</code>.</p>
    </div>
    <div class="section">
      <div style="display: grid; grid-template-columns: 200px repeat(4, minmax(0, 1fr)); gap: var(--space-md)"><div></div>${header}</div>
      <div>${rows}</div>
    </div>`,
  });
}

/* --------------------------------------------------------- spacing and shape */

function spacingAndShape() {
  const bar = (t, unit) => `<div class="row" style="gap: var(--space-md)">
      <div class="label-medium" style="width: 160px"><code>--${esc(t.name)}</code></div>
      <div class="label-small muted" style="width: 60px">${esc(t.value)}</div>
      <div style="height: 16px; width: var(--${t.name}); background: var(--primary); border-radius: var(--radius-sm)"></div>
      ${unit ? `<span class="label-small muted">${esc(unit)}</span>` : ""}
    </div>`;
  const RADII = ["radius-sm", "radius-button", "radius-card", "radius-dialog"];
  const radius = model.radius
    .filter((r) => RADII.includes(r.name))
    .map(
      (r) => `<div class="stack" style="align-items: center; gap: var(--space-sm)">
        <div style="width: 120px; height: 80px; border: 1px solid var(--outline); border-radius: var(--${r.name}); background: var(--surface-container-low)"></div>
        <div class="label-medium"><code>--${esc(r.name)}</code></div>
        <div class="label-small muted">${esc(r.resolved ?? r.value)}</div>
      </div>`,
    )
    .join("");
  const heights = model.heights
    .map(
      (h) => `<div class="stack" style="align-items: center; gap: var(--space-xs)">
        <div style="height: var(--${h.name}); width: 120px; border: 1px solid var(--outline); border-radius: var(--radius-button); display: flex; align-items: center; justify-content: center" class="label-medium">${esc(h.value)}</div>
        <div class="label-small muted"><code>--${esc(h.name)}</code></div>
      </div>`,
    )
    .join("");
  return page({
    title: "Spacing and shape",
    group: FOUNDATIONS,
    viewport: "1280x800",
    body: `<div class="stack">
      <h1 class="headline-small">Spacing and shape</h1>
      <p class="body-medium muted">A 4px base unit, shared by every platform. As classes: <code>p-md</code>, <code>gap-lg</code>, <code>mt-sm</code>. Never a named size on width or height (<code>max-w-lg</code> is 24px here); write <code>max-w-(--container-lg)</code> for a container width.</p>
    </div>
    <div class="section"><h2 class="title-large">Spacing</h2><div class="stack">${model.spacing.map((t) => bar(t)).join("")}</div></div>
    <div class="section"><h2 class="title-large">Component heights</h2><div class="row" style="gap: var(--space-lg); align-items: flex-end">${heights}</div></div>
    <div class="section"><h2 class="title-large">Radius, the only four</h2><div class="row" style="gap: var(--space-xl)">${radius}</div></div>
    <div class="section">
      <h2 class="title-large">Borders, never shadows</h2>
      <p class="body-medium muted">Regions are separated by 1px borders in <code>--outline-variant</code>, a deliberate departure from Material 3's elevation.</p>
      <div style="display: grid; grid-template-columns: 200px 1fr; border: 1px solid var(--outline-variant); border-radius: var(--radius-card); overflow: hidden; height: 120px">
        <div style="border-right: 1px solid var(--outline-variant); background: var(--surface-container-low); padding: var(--space-md)" class="label-medium">Navigasjon</div>
        <div style="padding: var(--space-md)" class="body-medium">Innhold</div>
      </div>
    </div>`,
  });
}

/* ---------------------------------------------------------- theme explorer */

// React and the design system come from the page, exactly as the component
// cards load them: _vendor/react.js (React and ReactDOM) and _ds_bundle.js.
const pageGlobals = {
  name: "page-globals",
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?($|\/)/ }, (a) => ({
      path: a.path.startsWith("react-dom") ? "react-dom" : a.path === "react/jsx-runtime" ? "jsx" : "react",
      namespace: "global",
    }));
    // Every import of a library component resolves to the synced bundle.
    b.onResolve({ filter: /\/src\/components\// }, (a) => {
      const abs = resolve(a.resolveDir, a.path);
      return abs.startsWith(COMPONENTS) ? { path: "ds", namespace: "global" } : undefined;
    });
    b.onLoad({ filter: /.*/, namespace: "global" }, (a) => ({
      loader: "js",
      contents:
        a.path === "react"
          ? "module.exports = window.React;"
          : a.path === "react-dom"
            ? "module.exports = window.ReactDOM;"
            : a.path === "jsx"
              ? // jsxs marks children as a static list; spreading them as
                // createElement arguments keeps React from asking for keys.
                `var R = window.React;
                 function jsx(t, p, k) { return R.createElement(t, k === undefined ? p : Object.assign({ key: k }, p)); }
                 function jsxs(t, p, k) {
                   var q = Object.assign({}, p); var c = q.children; delete q.children;
                   if (k !== undefined) q.key = k;
                   return R.createElement.apply(null, [t, q].concat(c));
                 }
                 module.exports = { jsx: jsx, jsxs: jsxs, Fragment: R.Fragment };`
              : "module.exports = window.NorskmatDesignSystem;",
    }));
  },
};

async function themeExplorer() {
  await esbuild.build({
    stdin: {
      contents: `import { ThemeExplorer } from "./stories/examples/theme-explorer";
        window.ReactDOM.createRoot(document.getElementById("root")).render(window.React.createElement(ThemeExplorer));`,
      resolveDir: ROOT,
      loader: "tsx",
    },
    outfile: join(PREVIEW, "ThemeExplorer.js"),
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    jsx: "automatic",
    minify: true,
    plugins: [pageGlobals],
    logLevel: "warning",
  });
  return page({
    title: "Theme explorer",
    group: EXPLORER,
    viewport: "1440x1850",
    body: `<div id="root"></div>`,
    scripts: `<script src="${UP}_vendor/react.js"></script>
<script src="${UP}_vendor/react-dom.js"></script>
<script src="${UP}_ds_bundle.js"></script>
<script src="${UP}_preview/ThemeExplorer.js"></script>`,
  });
}

writeFileSync(join(CARDS, "colours.html"), colours());
writeFileSync(join(CARDS, "typography.html"), typography());
writeFileSync(join(CARDS, "spacing-and-shape.html"), spacingAndShape());
writeFileSync(join(CARDS, "theme-explorer.html"), await themeExplorer());
console.error("wrote design-cards/: foundations/{colours,typography,spacing-and-shape,theme-explorer}.html, _preview/ThemeExplorer.js");
