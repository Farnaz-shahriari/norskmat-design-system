/* ---------------------------------------------------------------------------
   Checks the component library against the rules in SKILL.md and spacing.md.

   This exists because those rules were documentation only. Nothing failed when
   someone typed a hex value, and nothing noticed when a component referenced a
   variable that was never defined, which is how --outline, --radius,
   --input-background and the whole sidebar colour family each went missing for
   months while every component that used them silently rendered wrong.

   Two severities:
     ERROR   the component is broken or will drift between platforms
     WARN    a real inconsistency, but a judgement call, and often a migration

   Exits 1 on any error, 0 otherwise, so it can go straight into CI.

   Usage: npm run lint:tokens
   --------------------------------------------------------------------------- */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SKILL = join(here, "..", "skills", "norsk-mat-design-system");
const COMPONENTS = join(SKILL, "assets", "components");
const TOKENS_PATH = join(SKILL, "assets", "tokens.css");

const tokensCss = readFileSync(TOKENS_PATH, "utf8");
const files = readdirSync(COMPONENTS)
  .filter((f) => /\.(tsx|ts)$/.test(f))
  .map((f) => ({ name: f, src: readFileSync(join(COMPONENTS, f), "utf8") }));

const errors = [];
const warns = [];
const err = (file, msg) => errors.push({ file, msg });
const warn = (file, msg) => warns.push({ file, msg });

/* ------------------------------------------------------ 1. undefined variables */

// Every custom property tokens.css defines, comments stripped so a commented
// out token does not count as defined.
const defined = new Set(
  [...tokensCss.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map(
    (m) => m[1],
  ),
);

// Set at runtime by the library or the browser, not ours to define.
const EXTERNAL = /^(radix-|spacing$|tw-|sidebar-width)/;

for (const { name, src } of files) {
  const used = new Set([...src.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
  for (const v of used) {
    if (defined.has(v) || EXTERNAL.test(v.slice(2))) continue;
    // Some components set their own custom properties inline before reading
    // them back, which is legitimate.
    if (new RegExp(`["'\`]${v}["'\`]\\s*:`).test(src) || src.includes(`${v}:`)) continue;
    err(name, `references ${v}, which tokens.css does not define`);
  }
}

/* ------------------------------------------------- 1b. imports that resolve */

// Added after four components were found importing files that do not exist in
// this repo, two Figma Make svg path modules, a StatusChip and a date
// formatter. They had been broken since the library was first copied in, and
// nothing noticed, because the docs site only imports about fifteen of the
// sixty nine components and the token checks above never look at imports.
const pkg = JSON.parse(readFileSync(join(SKILL, "..", "..", "package.json"), "utf8"));
const declared = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);
const fileNames = new Set(readdirSync(COMPONENTS));

for (const { name, src } of files) {
  const specs = [...src.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((m) => m[1]);
  for (const spec of specs) {
    if (spec.startsWith(".")) {
      // Relative, so it must be a sibling file. Nothing in this folder should
      // ever reach outside it, the folder is what the package ships.
      if (spec.startsWith("../")) {
        err(name, `imports ${spec}, which reaches outside assets/components`);
        continue;
      }
      const base = spec.replace(/^\.\//, "");
      const hit = [base, base + ".tsx", base + ".ts"].some((c) => fileNames.has(c));
      if (!hit) err(name, `imports ${spec}, and no such file is in assets/components`);
      continue;
    }
    // Bare specifier, so package.json has to declare it or an install will
    // not bring it in.
    const root = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (root === "react" || root === "react-dom") continue; // peer, always present
    if (!declared.has(root)) {
      err(name, `imports ${root}, which package.json does not declare`);
    }
  }
}

/* ------------------------------------------------------------ 2. raw hex values */

for (const { name, src } of files) {
  for (const m of src.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
    const around = src.slice(Math.max(0, m.index - 40), m.index + 10);
    // Recharts is targeted by attribute selectors on its own default colours,
    // stroke='#ccc' and stroke='#fff'. Those name someone else's value, they
    // do not set ours.
    if (/stroke=|fill=/.test(around)) continue;
    err(name, `raw hex ${m[0]}, use a token instead`);
  }
}

/* --------------------------------------------- 3. radius name collisions in CSS */

// Tailwind owns these names. Redefining one in :root silently rewrites every
// rounded-<name> in the library, which is exactly how card.tsx went from 12px
// to 28px without anyone touching card.tsx.
const TW_RADIUS = ["--radius-xs", "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-2xl", "--radius-3xl"];
const TW_RADIUS_OK = new Set(["--radius-sm"]); // same value as Tailwind's, kept deliberately
for (const n of TW_RADIUS) {
  if (defined.has(n) && !TW_RADIUS_OK.has(n)) {
    err(
      "tokens.css",
      `defines ${n}, which is one of Tailwind's own radius names, so it silently changes every rounded-${n.replace("--radius-", "")} in the library`,
    );
  }
}

/* ------------------------------------------------- 4. radius not on a token (warn) */

// Anything the four documented tokens can legitimately produce, plus the two
// shape keywords and rounded-[inherit], which name a shape rather than a value.
const TOKEN_RADIUS =
  /^rounded(?:-[trbl]{1,2})?-(?:\[var\(--radius(?:-button|-card|-dialog|-sm)?\)\]|button|card|dialog|sm|full|none|\[inherit\])$/;
// Match the whole utility including a bracket group, so var() forms stay intact.
const ANY_RADIUS = /\brounded(?:-(?:\[[^\]]*\]|[a-z0-9]+))*/g;
const offenders = new Map();
for (const { name, src } of files) {
  for (const m of src.matchAll(ANY_RADIUS)) {
    if (TOKEN_RADIUS.test(m[0])) continue;
    if (m[0] === "rounded") continue;
    const key = m[0];
    if (!offenders.has(key)) offenders.set(key, new Set());
    offenders.get(key).add(name);
  }
}
for (const [cls, inFiles] of [...offenders].sort((a, b) => b[1].size - a[1].size)) {
  warn(
    "components",
    `${cls} used in ${inFiles.size} file${inFiles.size > 1 ? "s" : ""}, not one of the four radius tokens`,
  );
}

/* ------------------------------------------- 5. type scale bypassed (warn) */

const NAMED_TYPE = /(headline|title|body|label)-(medium|large|small|xsmall)/;
for (const { name, src } of files) {
  const tw = [...src.matchAll(/\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g)].map((m) => m[0]);
  if (!tw.length) continue;
  warn(
    name,
    `sizes text with ${[...new Set(tw)].join(", ")} instead of a named type class${
      NAMED_TYPE.test(src) ? ", and uses named classes elsewhere in the same file" : ""
    }`,
  );
}

/* ------------------------------------------------------- 6. raw pixels (warn) */

// max-[400px] is a breakpoint, not a size, and w-[18px] is an icon box. Both
// are outside the spacing scale by nature, so only flag lengths that plausibly
// should have been a spacing token.
const SPACING_PROPS = /\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|w|h|min-w|min-h|max-w|max-h|top|right|bottom|left|inset)-\[(\d+)px\]/g;
const pxHits = new Map();
for (const { name, src } of files) {
  for (const m of src.matchAll(SPACING_PROPS)) {
    const n = Number(m[2]);
    if (n <= 4) continue; // hairlines and 2px nudges, below the scale on purpose
    if (m[1] === "w" || m[1] === "h") continue; // icon and control boxes
    if (!pxHits.has(m[0])) pxHits.set(m[0], new Set());
    pxHits.get(m[0]).add(name);
  }
}
for (const [cls, inFiles] of pxHits) {
  warn("components", `${cls} in ${[...inFiles].join(", ")}, not on the spacing scale`);
}

/* --------------------------------------------------------------------- report */

const line = (s) => console.log(s);
line(`\nlint:tokens, ${files.length} components against tokens.css\n`);

if (errors.length) {
  line(`ERRORS (${errors.length})`);
  for (const e of errors) line(`  ${e.file.padEnd(30)} ${e.msg}`);
  line("");
}
if (warns.length) {
  line(`WARNINGS (${warns.length})`);
  for (const w of warns) line(`  ${w.file.padEnd(30)} ${w.msg}`);
  line("");
}
if (!errors.length && !warns.length) line("clean\n");
else line(`${errors.length} error${errors.length === 1 ? "" : "s"}, ${warns.length} warning${warns.length === 1 ? "" : "s"}\n`);

process.exit(errors.length ? 1 : 0);
