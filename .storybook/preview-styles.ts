// The stylesheet, loaded as its own preview entry from main.ts rather than
// imported by preview.tsx. /design-sync bundles preview.tsx with esbuild to
// reuse the platform decorator in its previews, and the fonts this CSS pulls
// in would fail that bundle. The previews get their CSS from the package
// build instead, so they need nothing from here.
import "./preview.css";
