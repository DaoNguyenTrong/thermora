# Module Progress

Status of each stage per module (see `lifecycle.md`). Values: `-` not started, `Draft`, `In review`, `Approved`, `In progress`, `Done`. The *Merged* column uses `-`, `In progress`, `Done`; *UI/Tech by REL* and *REL done* are written as `lifecycle.md` § Module Progress says. The *Owner* column names the orchestrator of the module or phase (`lifecycle.md` § Push and PR Permissions, team rule).

Detailed PRD status lives in `docs/prd/README.md` and tech doc status in `docs/tech/README.md`; this table only summarizes. The Owner's session updates its module (`lifecycle.md` § Module Progress).

| Module | Owner | PRD | Release plan | Runway | UI/Tech by REL | appsec | REL done | Merged |
|---|---|---|---|---|---|---|---|---|

## Story

Used only when the project has no `.claude/plane.json`; how to write it: `lifecycle.md` § Module Progress.

| Story (or part by AC set) | REL | Points | Status | Cycle |
|---|---|---|---|---|

## Sprint

One row per sprint, written at the sprint retro by the Sprint owner's session (`lifecycle.md` § Sprint loop, § Module Progress).

| Cycle | Sprint owner | Goal | Committed points | Done points | Stories moved | Stories rejected | Time in Pending |
|---|---|---|---|---|---|---|---|

## Metrics

Recorded at the end-of-module retro (`lifecycle.md` § Recurring Errors and End-of-Module Retro). Days run from the first PRD draft to the merge of the module's last PR; the `fix` ratio is `fix` commits over all commits of the module branches; the by-tier column comes from `bun scripts/risk-tier.ts --fix-ratio`.

| Module | Days | PRs | `fix` commit ratio | `fix` by tier (0/1/2) | Questions to humans | Agent tokens (k) | Sprints | Mean velocity | Notes |
|---|---|---|---|---|---|---|---|---|---|
