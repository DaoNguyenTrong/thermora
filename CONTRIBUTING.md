# Contributing to Thermora

The full process (stages, gates, risk tiers, roles) is in [`AGENTS.md`](AGENTS.md) and `docs/process/lifecycle.md`. This file covers branches, commits, PRs, releases and the one-time repository setup.

## Git workflow

```
main ◄── release/vX.Y.Z ◄── dev ◄── feature/<module>-phase-<n>
  ▲            ▲                ◄── fix/*  chore/*  chore/<module>-docs
  │            └── fix/* (stabilization)
  └── hotfix/* (from main)          after each release: chore/reconcile-main-* PR merges main → dev
```

| Branch | Purpose |
| --- | --- |
| `main` | Production; receives merges only via PR from `release/*` or `hotfix/*` |
| `release/vX.Y.Z` | QA stabilization, cut from `dev`, merged into `main` |
| `dev` | Integration; receives merges only via PR, one at a time |
| `feature/<module>-phase-<n>` | One plan phase, cut from `dev` |
| `fix/*` | Bug fixes, from `dev`, or from `release/vX.Y.Z` for QA findings |
| `chore/*` | Tooling and process; `chore/<module>-docs` carries a module's PRD and technical design |
| `hotfix/*` | Emergency production fix, from `main` |

## Develop and commit

```bash
git switch dev && git pull --ff-only
git switch -c feature/<module>-phase-1
git add <paths>                       # by explicit path, never -A or .
git commit -m "feat: add <thing>"
```

Git hooks (installed by `bun install`) block commits to `main`, conflict markers, signing material and known secret formats, format staged files, check comment length, and enforce [Conventional Commits](https://www.conventionalcommits.org): `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Pull requests

- One purpose per PR, at most about 1,500 lines of source excluding tests and generated files (`docs/process/lifecycle.md` § Push and PR Permissions).
- Rebase onto the latest `origin/dev` and `git push --force-with-lease` before review.
- CI (`.github/workflows/ci.yml`) runs `changes`, `test / scripts` and `test / app`. A skipped job counts as passing. `scripts/test-gate.sh` runs the same checks locally.
- The description carries the sections in `.claude/release-kit.json` `prExtraSections` (`Requirements`, `Minor design deviations`, `Verification`, `Risk tier`; with Plane, `Requirements` holds the `Plane:` line of `docs/process/lifecycle.md` § Plane) and a `## Changelog` section, which must be followed by another `## ` section:

```markdown
## Changelog
- Added: Users can <reader-facing sentence>.

## Verification
<checks run>
```

Write just `none` for a change no user would notice. Never edit `CHANGELOG.md` by hand.

- Merge gates: `/git-accept` for docs-only PRs, `pr-reviewer` for the rest. Human-gated areas and tier-2 PRs get `NEEDS_HUMAN` from `pr-reviewer` and are merged by the human approver of the area (`AGENTS.md` § Team Roles).

## Release Process

Handled by `release-kit:git-release` (`/git-release`; config in `.claude/release-kit.json`), driven by the Release manager. It detects the phase from the current branch.

1. **Cut (on `dev`)** — runs the gate, cuts and pushes `release/vX.Y.Z`, and compiles the `## [vX.Y.Z]` CHANGELOG section on the release branch from the merged PRs' `## Changelog` sections.
2. **Stabilize** — QA bugs are fixed on `fix/*` from `release/vX.Y.Z`, PR'd back into it; `pr-reviewer` reviews, the Release manager merges.
3. **Ship (on `release/vX.Y.Z`)** — runs the mandatory gate, opens and merges the `release/vX.Y.Z → main` PR after confirmation, then tags `origin/main`. The tag triggers `.github/workflows/release.yml`.
4. **Reconcile** — `git-release` opens a `chore/reconcile-main-<version>` PR merging `main` into `dev` (`devWrites: "pr"`); the Release manager merges it with a merge commit.

`/git-release quick` releases `dev → main` in one pass with no stabilization window; use it only when no separate QA sign-off is needed. Hotfix: `hotfix/<name>` from `main`, reviewed by `code-reviewer`, then `/git-release` on the hotfix branch.

Versioning is SemVer; the git tag `vX.Y.Z` is the version.

## Repository Setup

Once, by a repo admin:

1. Create `main` and `dev` on `origin`; keep `main` the default branch (`gh repo edit OWNER/REPO --default-branch main`). GitHub's compare button and a bare `gh pr create` then target `main`, so every PR names its base: `gh pr create --base dev`.
2. Run `scripts/setup-branch-protection.sh OWNER/REPO`: on `main` and `dev` it requires a PR, the checks `changes`, `test / scripts` and `test / app`, applies to admins too, and forbids force pushes and deletion. It requires no approving review (`required_approving_review_count` 0, no code-owner review), because a solo maintainer cannot approve their own PR; human-gated areas are kept to a human by `pr-reviewer` § 4. Branch protection on a private repo needs GitHub Pro, Team or Enterprise.
3. Protect `v*` tags so only the Release manager can push one.
4. When `dev` gets three or more PRs a day, enable the merge queue and record it in `docs/process/decisions.md` (`pr-reviewer.md` explains the `--auto` exception).
