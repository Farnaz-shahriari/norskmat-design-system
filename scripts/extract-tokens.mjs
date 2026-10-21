// Reads the canonical tokens.css and emits a JSON model the docs site renders
// from. Nothing in the docs is typed by hand, so the site cannot drift from
// the design system. Run via scripts/build-docs.mjs.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const SKILL_DIR = join(here, "..", "skills", "norsk-mat-design-system");
export const SRC_DIR = join(here, "..", "src");
const cssPath = join(SRC_DIR, "styles", "tokens.css");

const css = readFileSync(cssPath, "utf8");

// Strip comments so a commented-out token never shows up as a real one.
const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");

function blockFor(selector) {
  // Matches ".theme-ksl { ... }" and ":root, .theme-ksl { ... }"
  const re = new RegExp(
    `(?:^|\\})[^{}]*?${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(?:,[^{}]*?)?\\{([^}]*)\\}`,
    "m",
  );
  const m = bare.match(re);
  return m ? m[1] : "";
}

function varsIn(text) {
  const out = {};
  for (const m of text.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

// The last bare :root block holds everything shared across platforms.
function sharedRoot() {
  const blocks = [...bare.matchAll(/:root\s*\{([^}]*)\}/g)].map((m) => m[1]);
  return varsIn(blocks[blocks.length - 1] || "");
}

export const PLATFORMS = [
  { id: "ksl", cls: "theme-ksl", name: "KSL", audience: "Farmer facing, a work tool" },
  { id: "nyt-norge", cls: "theme-nyt-norge", name: "Nyt Norge", audience: "Consumer facing, origin label" },
  { id: "spesialitet", cls: "theme-spesialitet", name: "Spesialitet", audience: "Producer facing, certification" },
  { id: "lokalmat", cls: "theme-lokalmat", name: "LokalMat", audience: "Marketplace, producers and buyers" },
];

const COLOR_GROUPS = [
  { label: "Primary", keys: ["primary", "primary-foreground", "primary-container", "primary-container-foreground"] },
  { label: "Secondary", keys: ["secondary", "secondary-foreground", "secondary-container", "secondary-container-foreground"] },
  { label: "Tertiary", keys: ["tertiary", "tertiary-foreground", "tertiary-container", "tertiary-container-foreground"] },
  { label: "Surfaces", keys: ["background", "foreground", "surface", "on-surface", "surface-variant", "on-surface-variant", "surface-bright", "surface-dim"] },
  { label: "Surface containers", keys: ["surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"] },
  { label: "Outline", keys: ["outline", "outline-variant"] },
];

const SEVERITY = [
  { tier: "Kritisk", main: "error", fg: "error-foreground", container: "error-container", containerFg: "error-container-foreground" },
  { tier: "Vesentlig", main: "vesentlig", fg: "vesentlig-foreground", container: "vesentlig-container", containerFg: "vesentlig-container-foreground" },
  { tier: "Mindre alvorlig", main: "mindre-alvorlig", fg: "mindre-alvorlig-foreground", container: "mindre-alvorlig-container", containerFg: "mindre-alvorlig-container-foreground" },
];

export function buildModel() {
  const shared = sharedRoot();

  const platforms = PLATFORMS.map((p) => {
    const vars = varsIn(blockFor("." + p.cls));
    return {
      ...p,
      fontFamily: vars["font-family"] || "",
      groups: COLOR_GROUPS.map((g) => ({
        label: g.label,
        tokens: g.keys.filter((k) => vars[k]).map((k) => ({ name: k, value: vars[k] })),
      })).filter((g) => g.tokens.length),
    };
  });

  const severity = SEVERITY.map((s) => ({
    tier: s.tier,
    main: shared[s.main],
    fg: shared[s.fg],
    container: shared[s.container],
    containerFg: shared[s.containerFg],
    mainVar: `--${s.main}`,
    containerVar: `--${s.container}`,
  }));

  const pick = (prefix, exclude = []) =>
    Object.entries(shared)
      .filter(([k]) => k.startsWith(prefix) && !exclude.includes(k))
      .map(([name, value]) => ({ name, value }));

  // Named type classes, read straight out of the stylesheet's own rules.
  const typeClasses = [];
  for (const m of bare.matchAll(/\.((?:headline|title|body|label)-[a-z]+)\s*\{([^}]*)\}/g)) {
    const d = varsIn(m[2].replace(/([a-z-]+)\s*:/g, "--$1:"));
    typeClasses.push({
      cls: m[1],
      size: d["font-size"],
      weight: d["font-weight"],
      lineHeight: d["line-height"],
    });
  }

  const resolve = (v) => {
    let out = v, guard = 0;
    while (out && out.startsWith("var(--") && guard++ < 5) {
      out = shared[out.slice(6, -1)] ?? out;
      if (!out.startsWith("var(--")) break;
    }
    return out;
  };

  return {
    platforms,
    severity,
    typeScale: pick("text-"),
    fontWeights: pick("font-weight-"),
    typeClasses,
    spacing: pick("space-"),
    heights: pick("height-"),
    radius: pick("radius").map((r) => ({ ...r, resolved: resolve(r.value) })),
    counts: {
      components: 0, // filled in by the build script
      tokensPerPlatform: platforms[0]?.groups.reduce((n, g) => n + g.tokens.length, 0) ?? 0,
    },
  };
}
