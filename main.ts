// gta6-trophy-guide-01 entry program (Node 22, standard library only).
//
// The guide itself is the static web app in app/ — app/index.html plus its
// scripts, styles and trophy data — and the screenshots in screenshots/.
// This program hands both in: it copies them into the output directory and
// writes dossier.json, the summary the judge reads, using the vendored
// make.fun library in vendor/makefun-frontend.ts.
//
// Run locally to check the output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the app itself with:
//   node serve.ts   (then open http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// Directory holding this file; app/ and screenshots/ sit beside it.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyInto(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) return;
  cpSync(from, join(outDir, name), { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyInto("app");
mkdirSync(join(outDir, "screenshots"), { recursive: true });
copyInto("screenshots");

// The scorer's own caps (from the kit's reference/gate.json): only
// text_max_bytes shapes the dossier's bytes; the other caps refuse an entry
// the scorer would refuse — more than 4 screenshots or one over 256 KiB,
// more than 993 files and directories in app/ or 48 MiB of app files in all.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
