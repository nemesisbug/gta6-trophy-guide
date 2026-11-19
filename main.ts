// Vice City Neon — the entry program for gta6-trophy-guide-01.
// Node 22, standard library only. It hands the guide in: the static app/
// and the screenshots/ beside this file are copied to the output directory
// (MAKEFUN_OUTPUT_DIR, or /output inside the grader), and dossier.json is
// written there with the vendored make.fun library, so the judge reads
// exactly what this program produced. Run it locally like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
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
validateOutput(outputDir, DOSSIER_OPTIONS);
console.log(`Vice City Neon handed in to ${outputDir}`);

// The dossier library enforces its caps when it builds, but a silent
// short write or a missing screenshots/ folder would still hand in a
// broken entry. Verify what actually landed on disk and fail loudly
// (non-zero exit, clear message) instead of handing in garbage.
function validateOutput(dir, options) {
  const failures = [];
  const dossierPath = join(dir, 'dossier.json');
  if (!existsSync(dossierPath)) {
    failures.push('dossier.json is missing from the output directory');
  } else {
    // text_max_bytes caps the dossier's `text` field, not the whole file:
    // the file also embeds the screenshots as base64 under `images`, so
    // it is legitimately larger than the text cap (see the vendored
    // library's buildDossier docs). Parse and check the text itself.
    let dossier;
    try {
      dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
    } catch (error) {
      failures.push(`dossier.json is not valid JSON: ${error.message}`);
    }
    if (dossier) {
      const textBytes = Buffer.byteLength(dossier.text || '', 'utf8');
      if (textBytes > options.text_max_bytes) {
        failures.push(`dossier text is ${textBytes} bytes, over the ${options.text_max_bytes} byte cap`);
      }
      if (!Array.isArray(dossier.images) || dossier.images.length === 0) {
        failures.push('dossier.json embeds no screenshot images');
      }
    }
  }
  const appDir = join(dir, 'app');
  if (!existsSync(join(appDir, 'index.html'))) {
    failures.push('app/index.html is missing from the output directory');
  } else {
    // Count the copied tree: a silent partial copy must not hand in.
    let appFiles = 0;
    let appBytes = 0;
    const walk = (d) => {
      for (const name of readdirSync(d)) {
        const p = join(d, name);
        if (statSync(p).isDirectory()) walk(p);
        else { appFiles += 1; appBytes += statSync(p).size; }
      }
    };
    walk(appDir);
    if (appFiles > options.app_max_files) {
      failures.push(`app/ holds ${appFiles} files, over the ${options.app_max_files} cap`);
    }
    if (appBytes > options.app_max_bytes) {
      failures.push(`app/ files total ${appBytes} bytes, over the ${options.app_max_bytes} byte cap`);
    }
  }
  const shotsDir = join(dir, 'screenshots');
  if (!existsSync(shotsDir)) {
    failures.push('screenshots/ is missing from the output directory');
  } else {
    const shots = readdirSync(shotsDir).filter((name) => statSync(join(shotsDir, name)).isFile());
    if (shots.length < 3 || shots.length > options.screenshots.max) {
      failures.push(`screenshots/ holds ${shots.length} files, expected 3-${options.screenshots.max}`);
    }
    for (const name of shots) {
      const size = statSync(join(shotsDir, name)).size;
      if (size > options.screenshots.max_bytes) {
        failures.push(`screenshots/${name} is ${size} bytes, over the ${options.screenshots.max_bytes} byte cap`);
      }
    }
  }
  if (failures.length > 0) {
    console.error(`Vice City Neon hand-in FAILED validation in ${dir}:`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}
