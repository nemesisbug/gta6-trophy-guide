# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/nemesisbug/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/nemesisbug/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Vice City Neon** is an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. It is a plain static web app — no build step, no network requests at run time, no external fonts — so you can host it anywhere or open it from its own files.

## What it does

- **Checklist tracker** — every trophy with its official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze), ticked off as you earn them. Progress is saved in the browser (localStorage) and survives reloads.
- **Progress counters** — earned/total, a breakdown by grade, and a percentage to the platinum, always visible in the header.
- **Filters & search** — filter by kind (story, side, collectible, activity, exploration, combat, money, misc), by grade, and by earned/missing; search by name, description or kind.
- **Spoiler-free mode** — hides the names and descriptions of the 28 hidden trophies until you earn them.
- **Export & import** — save your progress to a JSON file and import it back on any device.
- **Roadmap to the platinum** — a seven-stage plan in play order: story first (while the one missable is still in reach), then side characters, activities, collectibles and exploration, robberies and money, and finally cleanup and 100%. Each stage shows live progress.
- **Missables** — the one trophy reported as possibly missable (Positive Mental Attitude: meditate on Lucia's balcony in Chapter 1, before the chapter ends) plus a watch list of single-moment trophies, each honestly marked where its trigger is not yet confirmed.
- **A guide for every trophy** — click any trophy to see its official description, its PSN progress target where PlayStation tracks one, a guide written for this page in our own words, and its sources as links. Where a location or step is not pinned down by a source we checked, the guide says so instead of inventing it.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. That is all — the app is static files under `app/`, and it works with the network off.

## Sources

Trophy names, descriptions, grades and hidden status come from the official list as published by Exophase and PSNProfiles on 18 November 2026; PSN progress targets (such as 42 Shooting Range challenges) come from PSNProfiles. Guide facts are drawn from those lists and from public guides (Planet GTA 6, EGamers, GTA Zone, U7BUY, Press Start), each cited beside the trophy it supports. Guide text is original to this project.

## Layout

- `app/index.html` — the page shell
- `app/css/neon.css` — the Vice City Neon theme
- `app/js/main.js` — boot, hash routing, toolbar wiring
- `app/js/store.js` — saved progress, export and import
- `app/js/filters.js` — kind/grade/search filters and the spoiler rule
- `app/js/views.js` — checklist, detail pane, roadmap and missables rendering
- `app/js/roadmap.js` — the roadmap stages and the missables watch list
- `app/data/trophies.json` — all 55 trophies with guides and sources
- `main.ts` — hands the guide in (copies `app/` and `screenshots/` to the output directory and writes `dossier.json`)
- `screenshots/` — renders of the guide in a browser

## License

MIT — see `LICENSE`.

---

Built by an AI agent for [make.fun](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) — Build the best GTA 6 trophy guide.
