/* ---------------------------------------------------------------------------
   Builds docs/index.html from the design system itself.

   Three steps, in order:
     1. read tokens.css into a JSON model (scripts/extract-tokens.mjs)
     2. compile Tailwind over the real component sources plus tokens.css, so
        the classes those components use actually exist on the page
     3. bundle docs/site/main.tsx with the real components and inline
        everything into one self contained index.html

   The output is a single file with no external assets except the Google Fonts
   stylesheet, so it works from the filesystem, from GitHub Pages, or copied
   anywhere else.

   Usage: npm run docs
   --------------------------------------------------------------------------- */
import { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import * as esbuild from "esbuild";
import { buildModel, SKILL_DIR } from "./extract-tokens.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..");
const SITE = join(ROOT, "docs", "site");
const OUT = join(ROOT, "docs");
const COMPONENTS = join(SKILL_DIR, "assets", "components");
const TOKENS = join(SKILL_DIR, "assets", "tokens.css");
// Intermediates live outside the repo, so a build leaves nothing behind.
const TMP = mkdtempSync(join(tmpdir(), "norskmat-docs-"));

const REPO = "Farnaz-shahriari/norskmat-design-system";

/* ------------------------------------------------- 1. the model, from source */

const model = buildModel();
const componentCount = readdirSync(COMPONENTS).filter((f) => /\.(tsx|ts)$/.test(f)).length;
const builtAt = new Date().toISOString().slice(0, 10);
const meta = { componentCount, builtAt, repo: REPO };

// The real platform logos, inlined as data URIs. Base64 rather than inline
// <svg> on purpose, four logos in one document would otherwise collide on
// their internal ids and gradient names.
const LOGO_FILES = {
  ksl: ["ksl", "ksl_logo_enkel_rgb.svg"],
  "nyt-norge": ["nytnorge", "nytnorge_utenomriss_rgb.svg"],
  spesialitet: ["spesialitet", "spesialitet_hovedlogo_rgb.svg"],
  lokalmat: ["lokalmat", "lokalmat_logo.svg"],
};
const logos = Object.fromEntries(
  Object.entries(LOGO_FILES).map(([id, [dir, file]]) => [
    id,
    "data:image/svg+xml;base64," +
      readFileSync(join(SKILL_DIR, "assets", dir, file)).toString("base64"),
  ]),
);
console.log(`logos: ${Object.keys(logos).length} inlined, ${(Object.values(logos).join("").length / 1024).toFixed(0)} kB`);

console.log(
  `model: ${model.platforms.length} platforms, ` +
    `${model.platforms[0].groups.reduce((n, g) => n + g.tokens.length, 0)} colour tokens each, ` +
    `${model.typeClasses.length} type classes, ${model.radius.length} radius tokens, ` +
    `${componentCount} components`,
);

/* ------------------------------------ 2. Tailwind, over the real components */

// The Tailwind entry is a committed source file, docs/site/tailwind.css, not
// generated here. It has to live inside the repo so that `@import "tailwindcss"`
// resolves against node_modules, and keeping it readable beats hiding it in a
// temp dir.
const twInput = join(SITE, "tailwind.css");

const twOut = join(TMP, "tailwind.out.css");
const twBin = join(ROOT, "node_modules", ".bin", "tailwindcss");
execFileSync(twBin, ["-i", twInput, "-o", twOut, "--minify"], { stdio: "inherit" });
const tailwindCss = readFileSync(twOut, "utf8");
console.log(`tailwind: ${(tailwindCss.length / 1024).toFixed(0)} kB`);

/* ------------------------------------------- 3. bundle the app, inline it all */

// Every component is imported as @ds/<name>, resolved to the real file. One
// place to change if the skill folder ever moves.
const alias = Object.fromEntries(
  readdirSync(COMPONENTS)
    .filter((f) => /\.(tsx|ts)$/.test(f))
    .map((f) => ["@ds/" + f.replace(/\.(tsx|ts)$/, ""), join(COMPONENTS, f)]),
);

const bundle = await esbuild.build({
  entryPoints: [join(SITE, "main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  alias,
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: {
    MODEL: JSON.stringify(model),
    META: JSON.stringify(meta),
    LOGOS: JSON.stringify(logos),
    "process.env.NODE_ENV": '"production"',
  },
  logLevel: "warning",
});

const js = bundle.outputFiles[0].text;
const siteCss = readFileSync(join(SITE, "site.css"), "utf8");
console.log(`bundle: ${(js.length / 1024).toFixed(0)} kB`);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Norsk Mat Design System</title>
<meta name="description" content="Colour, type, spacing and ${componentCount} working components for KSL, Nyt Norge, Spesialitet, LokalMat, Beskyttede Betegnelser and Stiftelsen Norsk Mat.">
<!-- Generated by npm run docs on ${builtAt}. Do not edit by hand, edit docs/site/ and rebuild. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap">
<style>${tailwindCss}</style>
<style>${siteCss}
[hidden]{display:none!important}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`;

writeFileSync(join(OUT, "index.html"), html);

// The token model, served beside the site. The drift checker fetches this
// rather than carrying a copy, so a check run inside someone else's app is
// always comparing against the current design system, not a snapshot.
// GitHub Pages sends Access-Control-Allow-Origin: *, so the fetch works from
// any origin.
writeFileSync(join(OUT, "tokens.json"), JSON.stringify({ ...model, meta }, null, 2));

// The checker itself, copied rather than bundled, it is dependency free on
// purpose so it can be pasted into a console or a <script> tag anywhere.
writeFileSync(join(OUT, "audit.js"), readFileSync(join(SITE, "audit.js"), "utf8"));

// The same page in the shape a Claude Artifact expects, no doctype, html, head
// or body tags of its own, those are added at publish time. Everything else is
// identical, same styles, same bundle, so publishing this is publishing the
// current build rather than a hand maintained second copy.
writeFileSync(
  join(OUT, "artifact.html"),
  [
    `<title>Norsk Mat Design System</title>`,
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap">`,
    `<style>${tailwindCss}</style>`,
    `<style>${siteCss}\n[hidden]{display:none!important}</style>`,
    `<div id="root"></div>`,
    `<script>${js}</script>`,
    "",
  ].join("\n"),
);
// GitHub Pages would otherwise run the output through Jekyll and drop
// anything it does not recognise.
writeFileSync(join(OUT, ".nojekyll"), "");
// Cleanup is not worth failing a good build over, some sandboxed filesystems
// refuse the unlink.
try {
  rmSync(TMP, { recursive: true, force: true });
} catch {
  /* a temp dir left behind is not worth failing a good build over */
}

console.log(
  `\nwrote docs/index.html ${(html.length / 1024).toFixed(0)} kB, plus tokens.json, audit.js and artifact.html`,
);
