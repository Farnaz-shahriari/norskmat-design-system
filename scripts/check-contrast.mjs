/* ---------------------------------------------------------------------------
   Checks the contrast of every text and border pair the components use, in
   all four platform themes, against WCAG 2.2 AA.

   This exists because --input, at 1.29:1 against white, was the border of
   every Input, Select, Textarea and RadioGroup, and nothing could notice.
   lint:tokens checks that a token exists, a contrast ratio needs the resolved
   colour per platform, and --border or --input resolve differently on each.

   Three kinds of pair:
     text        text colour on a surface, needs 4.5:1 (SC 1.4.3)
     ui          a border, focus ring or fill that identifies a control or
                 its state, needs 3:1 (SC 1.4.11)
     decorative  dividers and tracks that identify nothing, reported so the
                 numbers are visible, never fails. If one of these ends up
                 bounding a control, that control needs --outline instead.

   Not covered: colours with Tailwind opacity modifiers (text-x/60), and
   disabled controls, which WCAG exempts.

   Exits 1 if any text or ui pair fails, 0 otherwise, so it can go into CI.

   Usage: npm run lint:contrast            failures and the per platform summary
          npm run lint:contrast -- --all   every pair with its ratio
   --------------------------------------------------------------------------- */
import { PLATFORMS, resolvedTokens } from "./extract-tokens.mjs";

const AA = { text: 4.5, ui: 3 };

// The surfaces components put text and controls on. bg-muted and bg-popover
// are surface-container, bg-sidebar is surface-container-low, bg-card is
// surface.
const SURFACES = ["background", "surface", "surface-container-low", "surface-container"];

// Colours components use as text on those surfaces, text-primary and friends.
const TEXT_ON_SURFACE = [
  "on-surface",
  "on-surface-variant",
  "primary",
  "secondary",
  "tertiary",
  "error",
  "vesentlig",
  "mindre-alvorlig",
];

// Foreground on its own fill, every role and container pair.
const ROLES = ["primary", "secondary", "tertiary", "error", "vesentlig", "mindre-alvorlig"];

const PAIRS = [
  ...TEXT_ON_SURFACE.flatMap((fg) => SURFACES.map((bg) => ({ kind: "text", fg, bg }))),
  ...ROLES.flatMap((r) => [
    { kind: "text", fg: `${r}-foreground`, bg: r },
    { kind: "text", fg: `${r}-container-foreground`, bg: `${r}-container` },
  ]),
  // Control borders and the focus ring.
  ...SURFACES.map((bg) => ({ kind: "ui", fg: "outline", bg })),
  ...SURFACES.map((bg) => ({ kind: "ui", fg: "ring", bg })),
  // Separators and tracks, reported only.
  ...["background", "surface"].flatMap((bg) => [
    { kind: "decorative", fg: "border", bg },
    { kind: "decorative", fg: "input", bg },
  ]),
];

function luminance(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const showAll = process.argv.includes("--all");
const line = (s) => console.log(s);
const failures = [];
const missing = [];
const summary = [];

line(`\nlint:contrast, ${PAIRS.length} pairs x ${PLATFORMS.length} platforms, WCAG 2.2 AA\n`);

for (const p of PLATFORMS) {
  const t = resolvedTokens(p.cls);
  let checked = 0;
  let failed = 0;
  if (showAll) line(p.name);

  for (const pair of PAIRS) {
    const fg = t[pair.fg];
    const bg = t[pair.bg];
    if (!/^#[0-9a-f]{3,6}$/i.test(fg ?? "") || !/^#[0-9a-f]{3,6}$/i.test(bg ?? "")) {
      missing.push(`${p.name}: --${pair.fg} on --${pair.bg} does not resolve to a hex colour`);
      continue;
    }
    const r = ratio(fg, bg);
    const min = AA[pair.kind];
    const ok = min === undefined || r >= min;
    checked++;
    if (!ok) {
      failed++;
      failures.push({ platform: p.name, ...pair, r, min, fgHex: fg, bgHex: bg });
    }
    if (showAll) {
      const verdict = min === undefined ? "info" : ok ? "ok" : "FAIL";
      line(`  ${verdict.padEnd(5)} ${pair.kind.padEnd(11)} ${r.toFixed(2).padStart(5)}:1  --${pair.fg} on --${pair.bg}`);
    }
  }
  summary.push({ name: p.name, checked, failed });
  if (showAll) line("");
}

if (failures.length) {
  line(`FAILURES (${failures.length})`);
  for (const f of failures) {
    line(
      `  ${f.platform.padEnd(12)} ${f.kind.padEnd(5)} ${f.r.toFixed(2).padStart(5)}:1 < ${f.min}:1  ` +
        `--${f.fg} ${f.fgHex} on --${f.bg} ${f.bgHex}`,
    );
  }
  line("");
}
if (missing.length) {
  line(`UNRESOLVED (${missing.length})`);
  for (const m of missing) line(`  ${m}`);
  line("");
}

for (const s of summary) line(`  ${s.name.padEnd(12)} ${s.checked} checked, ${s.failed} failing`);
line(`\n${failures.length} failure${failures.length === 1 ? "" : "s"}\n`);

process.exit(failures.length || missing.length ? 1 : 0);
