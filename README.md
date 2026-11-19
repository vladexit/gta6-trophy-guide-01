# GTA VI Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vladexit/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vladexit/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI — as a single offline web app in `app/`. Serve it and open it in a desktop browser; it works with the network off: no external files, no accounts.

## What it does

- **All 55 trophies** — every official name, description and grade (1 Platinum, 2 Gold, 6 Silver, 46 Bronze), with a guide in our own words for each: what to do, where, how, and when it can be missed.
- **Checklist that saves itself** — tick a trophy off and your progress is stored in the browser (localStorage). A progress bar shows X/55 and the percentage.
- **Export and import** — download your progress as JSON, or import a saved file to restore it on another machine.
- **Filters by tier and kind** — Platinum / Gold / Silver / Bronze, and Story / Strangers / Crime / Activities / Hidden / Milestone — plus a search box to find a trophy by name.
- **Spoiler setting** — hide story trophies until they are earned, so the guide never spoils the story.
- **Roadmap to the Platinum** — the recommended order (story first, then strangers, activities, crime, cleanup) and the missable warnings, built from the official descriptions: about 200 hours, difficulty 4/10, all single-player, no online trophies.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. That is the whole install — there is nothing to build and nothing to download. `main.ts` is the entry program: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` (try it with `MAKEFUN_OUTPUT_DIR=out node main.ts`).

## Sources

Trophy names, descriptions and grades come from the official GTA VI trophy list as reported by TrueAchievements and GTABase (launch day, 19 November 2026); the Platinum time/difficulty estimate comes via PowerPyx. The guides on this page are written in our own words — they draw on other guides and cite them, never copying their text. This is an original fan-made tracker, not affiliated with Rockstar Games; no Rockstar logo or official artwork is used.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nxe4y3cz&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
