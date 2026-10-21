/* ---------------------------------------------------------------------------
   Compiles src/styles/index.css to dist/norskmat.css and puts the font files
   beside it.

   The copy is the point. Tailwind rewrites the @font-face urls relative to the
   output file, so a build without this step emits url(./manrope-...woff2) next
   to a dist/ that has no fonts in it, and every heading silently falls back to
   a system sans. That is the same failure the self hosted fonts exist to
   prevent, so the build checks it rather than trusting it.
   --------------------------------------------------------------------------- */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_FONTS = join(ROOT, "src", "styles", "fonts");
const DIST = join(ROOT, "dist");

mkdirSync(DIST, { recursive: true });

execFileSync(
  join(ROOT, "node_modules", ".bin", "tailwindcss"),
  ["-i", join(ROOT, "src", "styles", "index.css"), "-o", join(DIST, "norskmat.css"), "--minify"],
  { stdio: "inherit" },
);

// Fonts and their licence travel with the stylesheet.
for (const f of readdirSync(SRC_FONTS)) {
  if (/\.(woff2?|txt)$/.test(f)) copyFileSync(join(SRC_FONTS, f), join(DIST, f));
}

// Every url() the stylesheet emits must resolve from dist/.
const css = readFileSync(join(DIST, "norskmat.css"), "utf8");
const urls = [...css.matchAll(/url\(\s*["']?\.\/([^"')]+)["']?\s*\)/g)].map((m) => m[1]);
const broken = [...new Set(urls)].filter((u) => !existsSync(join(DIST, u)));
if (broken.length) {
  console.error(`\nBroken asset urls in dist/norskmat.css:\n  ${broken.join("\n  ")}`);
  process.exit(1);
}

console.log(
  `css: ${(css.length / 1024).toFixed(0)} kB, ${new Set(urls).size} asset url${urls.length === 1 ? "" : "s"} all resolve`,
);
