// Views: the checklist rows, the trophy detail pane, the roadmap page
// and the missables page. Everything is built with the DOM API so the
// trophy data is never pasted into HTML as text.

import { KIND_LABELS, GRADE_LABELS, isSpoilerHidden, gradeTotals } from './filters.js';
import { isEarned, earnedCount } from './store.js';
import { ROADMAP_STAGES, SINGLE_MOMENT_TROPHIES } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeBadge(grade) {
  return el('span', `badge grade-${grade}`, GRADE_LABELS[grade]);
}

function formatCount(count) {
  if (count === null || count === undefined) return null;
  return `PSN target: ${count.toLocaleString('en-US')}`;
}

// ---- header progress ----
export function renderProgress(trophies, state) {
  const earned = earnedCount(state);
  const total = trophies.length;
  const pct = total ? Math.round((earned / total) * 100) : 0;
  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  const { totals, earned: byGrade } = gradeTotals(trophies, state, isEarned);
  const chips = document.getElementById('gradeChips');
  chips.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const chip = el('span', 'chip');
    chip.append(el('span', null, `${GRADE_LABELS[grade]} `), el('b', null, `${byGrade[grade]}/${totals[grade]}`));
    chips.appendChild(chip);
  }
}

// ---- checklist ----
export function renderChecklist(trophies, state, selectedId, onSelect, onToggle) {
  const list = document.getElementById('trophyList');
  const emptyNote = document.getElementById('emptyNote');
  const countLine = document.getElementById('resultCount');
  list.replaceChildren();
  emptyNote.hidden = trophies.length !== 0;
  countLine.textContent = trophies.length === 0
    ? ''
    : `Showing ${trophies.length} of 55 trophies — ${earnedCount(state)} earned.`;

  for (const trophy of trophies) {
    const earned = isEarned(state, trophy.id);
    const hidden = isSpoilerHidden(trophy, state, isEarned);
    const row = el('li', `trophy-row${earned ? ' earned' : ''}${trophy.id === selectedId ? ' selected' : ''}`);
    row.dataset.id = String(trophy.id);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = earned;
    check.setAttribute('aria-label', `Mark ${hidden ? 'hidden trophy' : trophy.name} as earned`);
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });
    row.appendChild(check);

    const body = el('div');
    body.appendChild(el('p', 'trophy-name', hidden ? 'Hidden trophy' : trophy.name));
    body.appendChild(el('p', 'trophy-desc', hidden ? 'Spoiler-free mode is on. Earn this trophy to reveal its name and description.' : trophy.description));
    const meta = el('div', 'trophy-meta');
    meta.appendChild(gradeBadge(trophy.grade));
    meta.appendChild(el('span', 'badge kind', KIND_LABELS[trophy.kind] || trophy.kind));
    if (trophy.missable) meta.appendChild(el('span', 'badge missable', 'Missable'));
    if (trophy.hidden) meta.appendChild(el('span', 'badge hidden-badge', 'Hidden'));
    const target = formatCount(trophy.psn_count);
    if (target) meta.appendChild(el('span', 'badge count', target));
    body.appendChild(meta);
    row.appendChild(body);

    const arrow = el('span', 'badge kind', earned ? 'Earned ✓' : 'Guide →');
    row.appendChild(arrow);
    row.addEventListener('click', () => onSelect(trophy.id));
    list.appendChild(row);
  }
}

// ---- detail pane ----
export function renderDetail(trophy, state, onToggle) {
  const pane = document.getElementById('detailPane');
  pane.replaceChildren();
  if (!trophy) {
    pane.appendChild(el('h2', null, 'Pick a trophy'));
    pane.appendChild(el('p', 'detail-empty', 'Click any trophy in the list to see its official description, its guide, and its sources. Tick the box to mark it earned — your progress is saved in this browser.'));
    return;
  }
  const earned = isEarned(state, trophy.id);
  const hidden = isSpoilerHidden(trophy, state, isEarned);

  pane.appendChild(el('h2', null, hidden ? 'Hidden trophy' : trophy.name));
  const meta = el('div', 'trophy-meta');
  meta.appendChild(gradeBadge(trophy.grade));
  meta.appendChild(el('span', 'badge kind', KIND_LABELS[trophy.kind] || trophy.kind));
  if (trophy.missable) meta.appendChild(el('span', 'badge missable', 'Missable'));
  if (trophy.hidden) meta.appendChild(el('span', 'badge hidden-badge', 'Hidden on PSN until earned'));
  pane.appendChild(meta);

  pane.appendChild(el('h3', null, 'Official description'));
  pane.appendChild(el('p', 'official', hidden
    ? 'Spoiler-free mode is on. Earn this trophy to reveal its official description.'
    : `“${trophy.description}”`));
  const target = formatCount(trophy.psn_count);
  if (target) pane.appendChild(el('p', 'psn-target', target));

  if (trophy.missable && trophy.missable_note) {
    const callout = el('div', 'missable-callout');
    callout.append(el('strong', null, 'Missable — read this first. '), document.createTextNode(trophy.missable_note));
    pane.appendChild(callout);
  }

  pane.appendChild(el('h3', null, 'Guide'));
  pane.appendChild(el('p', 'guide-text', hidden
    ? 'Spoiler-free mode is on. Earn this trophy to reveal its guide.'
    : trophy.guide));

  pane.appendChild(el('h3', null, 'Sources'));
  if (hidden) {
    // Source names name the guide (and so the trophy) — mask them like the
    // description and guide above, or picking a hidden trophy would leak
    // its identity through the detail pane.
    pane.appendChild(el('p', 'official', 'Spoiler-free mode is on. Earn this trophy to reveal its sources.'));
  } else {
    const list = el('ul', 'source-list');
    for (const source of trophy.sources || []) {
      const item = el('li');
      const link = el('a', null, source.name);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      item.appendChild(link);
      list.appendChild(item);
    }
    pane.appendChild(list);
  }

  const actions = el('div', 'detail-actions');
  const toggle = el('button', null, earned ? 'Mark as missing' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => onToggle(trophy.id));
  actions.appendChild(toggle);
  pane.appendChild(actions);
}

// ---- roadmap ----
export function renderRoadmap(trophies, state, onSelectTrophy) {
  const list = document.getElementById('stageList');
  const progress = document.getElementById('roadmapProgress');
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const earned = earnedCount(state);
  progress.textContent = `${earned} of 55 trophies earned — ${Math.round((earned / 55) * 100)}% of the way to the platinum.`;
  list.replaceChildren();

  ROADMAP_STAGES.forEach((stage, index) => {
    const stageIds = [...new Set(stage.steps.flatMap((s) => s.trophyIds))];
    const stageEarned = stageIds.filter((id) => isEarned(state, id)).length;
    const item = el('li', `stage${stageIds.length > 0 && stageEarned === stageIds.length ? ' done' : ''}`);
    const heading = el('h3');
    heading.append(el('span', 'stage-num', `Stage ${index + 1}`), document.createTextNode(stage.title));
    item.appendChild(heading);
    item.appendChild(el('p', 'goal', stage.goal));
    if (stageIds.length > 0) {
      item.appendChild(el('p', 'stage-progress', `Progress: ${stageEarned} of ${stageIds.length} trophies in this stage`));
    }
    const steps = el('ol');
    for (const step of stage.steps) {
      const stepItem = el('li', null, step.text);
      if (step.trophyIds.length > 0) {
        const chips = el('div', 'step-trophies');
        for (const id of step.trophyIds) {
          const trophy = byId.get(id);
          if (!trophy) continue;
          const chip = el('button', `step-trophy${isEarned(state, id) ? ' earned' : ''}`, `${trophy.name} · ${GRADE_LABELS[trophy.grade]}`);
          chip.type = 'button';
          chip.addEventListener('click', () => onSelectTrophy(id));
          chips.appendChild(chip);
        }
        stepItem.appendChild(chips);
      }
      steps.appendChild(stepItem);
    }
    item.appendChild(steps);
    list.appendChild(item);
  });
}

// ---- missables ----
export function renderMissables(trophies, state, onSelectTrophy) {
  const wrap = document.getElementById('missableList');
  const byId = new Map(trophies.map((t) => [t.id, t]));
  wrap.replaceChildren();

  const confirmed = trophies.filter((t) => t.missable);
  for (const trophy of confirmed) {
    const card = el('div', 'missable-card');
    const heading = el('h3');
    heading.append(el('span', 'badge missable', 'Missable'), document.createTextNode(` ${trophy.name}`));
    card.appendChild(heading);
    card.appendChild(el('p', 'when', 'When it can be missed: Chapter 1 — before the chapter ends.'));
    card.appendChild(el('p', null, trophy.guide));
    const open = el('button', null, 'Open the full guide');
    open.type = 'button';
    open.addEventListener('click', () => onSelectTrophy(trophy.id));
    card.appendChild(open);
    wrap.appendChild(card);
  }

  const watchTitle = el('h3', null, 'Watch list — single-moment trophies (not confirmed missable)');
  wrap.appendChild(watchTitle);
  wrap.appendChild(el('p', null, 'These hidden trophies are each tied to a single moment. No published guide has confirmed whether any of them can be missed, so treat them as “keep a manual save”, not as confirmed missables.'));
  const grid = el('div', 'watch-list');
  for (const entry of SINGLE_MOMENT_TROPHIES) {
    const trophy = byId.get(entry.id);
    if (!trophy) continue;
    const card = el('div', 'watch-card');
    const heading = el('h4');
    heading.append(document.createTextNode(`${trophy.name} `), gradeBadge(trophy.grade));
    card.appendChild(heading);
    card.appendChild(el('p', null, entry.note));
    grid.appendChild(card);
  }
  wrap.appendChild(grid);
}
