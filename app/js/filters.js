// Filters and the spoiler rule: which trophies a view shows, and what a
// spoiler-hidden trophy looks like until it is earned.

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side',
  collectible: 'Collectible',
  activity: 'Activity',
  exploration: 'Exploration',
  combat: 'Combat',
  money: 'Money',
  misc: 'Misc',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

// A trophy is spoiler-hidden when the spoiler setting is on, the trophy
// is one of the 28 hidden ones, and it has not been earned yet.
export function isSpoilerHidden(trophy, state, isEarnedFn) {
  return state.spoiler && trophy.hidden && !isEarnedFn(state, trophy.id);
}

export function matchesSearch(trophy, query, state, isEarnedFn) {
  if (!query) return true;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  // A spoiler-hidden trophy must never be betrayed by its own words: its
  // name, description and guide stay out of the haystack, so a story
  // keyword cannot surface it. Only the grade/kind badges the checklist
  // already shows for it may match, so searching "gold" or "story" still
  // works. A revealed trophy is searchable on its guide too, so a
  // guide-only keyword (e.g. a location or a method) finds it.
  const hidden = state && isEarnedFn ? isSpoilerHidden(trophy, state, isEarnedFn) : false;
  const hay = hidden
    ? `${trophy.kind} ${trophy.grade}`.toLowerCase()
    : `${trophy.name} ${trophy.description} ${trophy.guide || ''} ${trophy.kind} ${trophy.grade}`.toLowerCase();
  return words.every((word) => hay.includes(word));
}

export function applyFilters(trophies, state, isEarnedFn, filters) {
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    const earned = isEarnedFn(state, trophy.id);
    if (filters.status === 'earned' && !earned) return false;
    if (filters.status === 'missing' && earned) return false;
    if (!matchesSearch(trophy, filters.query, state, isEarnedFn)) return false;
    return true;
  });
}

export function gradeTotals(trophies, state, isEarnedFn) {
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const earned = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    totals[trophy.grade] += 1;
    if (isEarnedFn(state, trophy.id)) earned[trophy.grade] += 1;
  }
  return { totals, earned };
}
