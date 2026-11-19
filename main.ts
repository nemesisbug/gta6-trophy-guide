// Vice City Neon — the entry program for gta6-trophy-guide-01.
// Node 22, standard library only. It hands the guide in: the static app/
// and the screenshots/ beside this file are copied to the output directory
// (MAKEFUN_OUTPUT_DIR, or /output inside the grader), and dossier.json is
// written there with the vendored make.fun library, so the judge reads
// exactly what this program produced. Run it locally like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The dossier library refuses anything past the scorer's own caps, so
// these numbers mirror the gate: at most 4 screenshots of 256 KiB, app/
// at most 993 files and 48 MiB, and the dossier text at most 160 KiB.
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function copyEntryTree() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  }
}

copyEntryTree();
writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, DOSSIER_OPTIONS));
console.log(`Vice City Neon handed in to ${outputDir}`);
