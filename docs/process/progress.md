# Module Progress

Status of each stage per module (see `lifecycle.md`). Values: `-` not started, `Draft`, `In review`, `Approved`, `In progress`, `Done`. The *Merged* column uses `-`, `In progress`, `Done`; *UI/Tech by REL* and *REL done* are written as `lifecycle.md` § Module Progress says. The *Owner* column names the orchestrator of the module or phase (`lifecycle.md` § Push and PR Permissions, team rule).

Detailed PRD status lives in `docs/prd/README.md` and tech doc status in `docs/tech/README.md`; this table only summarizes. The Owner's session updates its module (`lifecycle.md` § Module Progress).

| Module | Owner | PRD | Release plan | Runway | UI/Tech by REL | appsec | REL done | Merged |
|---|---|---|---|---|---|---|---|---|
| PRD01 Setup | DaoNguyenTrong | Approved | Approved | Approved | REL-1/2 | Approved | 0/2 | - |

## Story

The source of truth for points and story status; how to write it: `lifecycle.md` § Module Progress.

| Story (or part by AC set) | REL | Points | Status | Sprint |
|---|---|---|---|---|
| PRD01-US-01 | PRD01-REL-1 | 3 | Todo | - |
| PRD01-US-02 | PRD01-REL-1 | 5 | Todo | - |
| PRD01-US-03 | PRD01-REL-1 | 5 | Todo | - |
| PRD01-US-04 (AC-14, AC-15, AC-16) | PRD01-REL-1 | 8 | Todo | - |
| PRD01-US-05 (AC-17, AC-19, AC-37) | PRD01-REL-1 | 3 | Todo | - |
| PRD01-US-06 (AC-23, AC-25) | PRD01-REL-1 | 3 | Todo | - |
| PRD01-US-07 (AC-27, AC-43) | PRD01-REL-1 | 2 | Todo | - |

## Sprint

One row per sprint, written at the sprint retro by the Sprint owner's session (`lifecycle.md` § Sprint loop, § Module Progress).

| Sprint | Sprint owner | Goal | Committed points | Done points | Stories moved | Stories rejected |
|---|---|---|---|---|---|---|

## Metrics

Recorded at the end-of-module retro (`lifecycle.md` § Recurring Errors and End-of-Module Retro). Days run from the first PRD draft to the merge of the module's last PR; the `fix` ratio is `fix` commits over all commits of the module branches; the by-tier column comes from `bun scripts/risk-tier.ts --fix-ratio`.

| Module | Days | PRs | `fix` commit ratio | `fix` by tier (0/1/2) | Questions to humans | Agent tokens (k) | Sprints | Mean velocity | Notes |
|---|---|---|---|---|---|---|---|---|---|
