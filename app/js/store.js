// Progress store: keeps earned trophies and the spoiler setting in
// localStorage, and exports / imports them as a JSON file. Nothing here
// touches the network; the file the user exports is theirs alone.

export const STORAGE_KEY = 'vice-city-neon-progress-v1';
export const EXPORT_APP = 'vice-city-neon';

function blankState() {
  return { earned: {}, spoiler: true };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankState();
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      spoiler: parsed.spoiler !== false,
    };
  } catch {
    return blankState();
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: progress just lives for this session.
  }
}

export function isEarned(state, trophyId) {
  return state.earned[String(trophyId)] === true;
}

export function toggleEarned(state, trophyId) {
  const key = String(trophyId);
  if (state.earned[key]) delete state.earned[key];
  else state.earned[key] = true;
  saveProgress(state);
  return state;
}

export function earnedCount(state) {
  return Object.keys(state.earned).length;
}

export function earnedIds(state) {
  return Object.keys(state.earned).map(Number).sort((a, b) => a - b);
}

export function resetProgress(state) {
  state.earned = {};
  saveProgress(state);
  return state;
}

export function buildExportFile(state) {
  return {
    app: EXPORT_APP,
    version: 1,
    exportedAt: new Date().toISOString(),
    spoiler: state.spoiler,
    earned: earnedIds(state),
  };
}

export function downloadExport(state) {
  const payload = JSON.stringify(buildExportFile(state), null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vice-city-neon-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Reads an exported progress file and applies it. Returns { ok, earned }
// on success or { ok: false, error } when the file is not ours.
export async function importProgressFile(file, validIds) {
  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!parsed || parsed.app !== EXPORT_APP || !Array.isArray(parsed.earned)) {
    return { ok: false, error: 'That file is not a Vice City Neon progress export.' };
  }
  const earned = {};
  for (const id of parsed.earned) {
    if (validIds.has(Number(id))) earned[String(Number(id))] = true;
  }
  return { ok: true, earned, spoiler: parsed.spoiler === true };
}
