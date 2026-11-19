// Boot: loads the trophy data, wires the toolbar and the tabs, and
// routes between the checklist, roadmap and missables views by hash.
// Views: #/checklist, #/roadmap, #/missables, #/trophy/<id>.

import { loadProgress, saveProgress, toggleEarned, isEarned, downloadExport, importProgressFile, resetProgress } from './store.js';
import { applyFilters } from './filters.js';
import { renderProgress, renderChecklist, renderDetail, renderRoadmap, renderMissables } from './views.js';

const state = loadProgress();
let trophies = [];
let selectedId = null;
const filters = { query: '', kind: 'all', grade: 'all', status: 'all' };

const views = {
  checklist: document.getElementById('view-checklist'),
  roadmap: document.getElementById('view-roadmap'),
  missables: document.getElementById('view-missables'),
};
const toolbar = document.getElementById('toolbar');

function currentView() {
  const hash = location.hash || '#/checklist';
  if (hash.startsWith('#/roadmap')) return 'roadmap';
  if (hash.startsWith('#/missables')) return 'missables';
  return 'checklist';
}

function currentTrophyId() {
  const match = (location.hash || '').match(/^#\/trophy\/(\d+)/);
  return match ? Number(match[1]) : null;
}

function renderAll() {
  const view = currentView();
  for (const [name, section] of Object.entries(views)) {
    section.hidden = name !== view;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
  toolbar.style.display = view === 'checklist' ? '' : 'none';

  renderProgress(trophies, state);
  if (view === 'checklist') {
    selectedId = currentTrophyId();
    const shown = applyFilters(trophies, state, isEarned, filters);
    renderChecklist(shown, state, selectedId, selectTrophy, toggleAndRender);
    const selected = trophies.find((t) => t.id === selectedId) || null;
    renderDetail(selected, state, toggleAndRender);
  } else if (view === 'roadmap') {
    renderRoadmap(trophies, state, selectTrophy);
  } else {
    renderMissables(trophies, state, selectTrophy);
  }
}

function toggleAndRender(id) {
  toggleEarned(state, id);
  renderAll();
}

function selectTrophy(id) {
  location.hash = `#/trophy/${id}`;
  if (currentView() !== 'checklist') {
    location.hash = `#/trophy/${id}`;
  }
  renderAll();
  const pane = document.getElementById('detailPane');
  if (pane) pane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function wireToolbar() {
  const search = document.getElementById('searchBox');
  search.addEventListener('input', () => {
    filters.query = search.value.trim();
    renderAll();
  });
  document.getElementById('kindFilter').addEventListener('change', (event) => {
    filters.kind = event.target.value;
    renderAll();
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderAll();
  });
  document.getElementById('statusFilter').addEventListener('change', (event) => {
    filters.status = event.target.value;
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', () => downloadExport(state));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const validIds = new Set(trophies.map((t) => t.id));
    const result = await importProgressFile(file, validIds);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    state.earned = result.earned;
    if (typeof result.spoiler === 'boolean') state.spoiler = result.spoiler;
    saveProgress(state);
    syncSpoilerToggle();
    renderAll();
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Clear all earned trophies? This only affects this browser.')) {
      resetProgress(state);
      renderAll();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });
}

function syncSpoilerToggle() {
  const toggle = document.getElementById('spoilerToggle');
  toggle.checked = state.spoiler;
  toggle.addEventListener('change', () => {
    state.spoiler = toggle.checked;
    saveProgress(state);
    renderAll();
  });
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies;
  wireToolbar();
  syncSpoilerToggle();
  window.addEventListener('hashchange', renderAll);
  renderAll();
}

boot().catch((error) => {
  document.getElementById('trophyList').innerHTML =
    '<li class="trophy-row">Could not load the trophy data. ' + String(error.message || error) + '</li>';
});
