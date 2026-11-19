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

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const hay = `${trophy.name} ${trophy.description} ${trophy.kind} ${trophy.grade}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
}

export function applyFilters(trophies, state, isEarnedFn, filters) {
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    const earned = isEarnedFn(state, trophy.id);
    if (filters.status === 'earned' && !earned) return false;
    if (filters.status === 'missing' && earned) return false;
    if (!matchesSearch(trophy, filters.query)) return false;
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
