# CI and Git Hooks

Reference, not a rule: no `paths:` frontmatter, so it is not auto-loaded. Read it when changing CI workflows, Lefthook config, or git hooks. All of these are tier 2 and human-gated.

## Git hooks

Managed by [Lefthook](https://lefthook.dev): config in root `lefthook.yml`. `bun install` at the repo root installs the hooks (`prepare: lefthook install`).

- **pre-commit** (`piped: true`, stops at the first failure):
  1. `branch-guard` blocks direct commits to `main`.
  2. `conflict-markers` blocks staged merge-conflict markers.
  3. `signing-material` refuses staged `.jks`, `.keystore`, `.p12`, `.mobileprovision` files (secretlint does not read binaries).
  4. `secretlint` on all staged files (known secret formats only — private keys, GitHub/Slack/npm tokens; it does not catch arbitrary custom secrets).
  5. `prettier` on staged `scripts/**/*.ts`, re-staged. TODO(stack): one command per formatter of the stack.
  6. `comments` runs `scripts/check-comments.ts --staged` last, so it reads the blobs after formatters re-staged them.
- **commit-msg**: commitlint, Conventional Commits (`@commitlint/config-conventional`).

`release/*` and `dev` are not blocked by the Lefthook branch guard: `release-kit:git-release` commits the CHANGELOG on `release/vX.Y.Z`. Nothing reaches `dev` without a PR, though: the Bash guard denies pushes to `dev`, and branch protection requires a PR on `main` and `dev`, so the post-release `main → dev` reconcile and quick release's CHANGELOG are PRs too (`devWrites: "pr"`; `CONTRIBUTING.md` § Repository Setup).

Glob gotcha: Lefthook's glob matcher (`gobwas/glob`) treats `dir/**/*` as requiring **at least one** intermediate directory, so it silently skips files directly in `dir/`. Match both depths with two patterns (see `prettier` in `lefthook.yml`), or use a bare `**` when there is no path prefix (see `secretlint`).

## Claude and Codex Bash guard

`.claude/settings.json` and `.codex/hooks.json` run `scripts/claude-bash-guard.ts` before every Bash command. It parses the command (including `$()`, `&&`, `;`) and denies force pushes, pushes to `main`/`dev`, pushes outside `feature|fix|chore|hotfix|release/*` and `v*` tags, `--no-verify`, `git add -A`/`.`, `git commit -a`, `git branch -D`, `gh pr merge --admin/--auto/--delete-branch`, repo deletion, and commands it cannot parse. It always exits 0 and prints the decision. Tests: `scripts/claude-bash-guard.test.ts`.

## CI

The test gate lives in one reusable workflow, `.github/workflows/test.yml`, run by two callers:

- **`ci.yml`** — every PR into `dev`, `main` or `release/**`, and every push to `dev`. Job `changes` filters paths so only the touched parts run; a skipped job counts as passing.
- **`release.yml`** — the `v*` tag: test, build, then the GitHub release.

`ci.yml` calls `test.yml` under a job named `test`, so the checks are `changes`, `test / scripts` and `test / app`. Three places quote these names and change together with the jobs: `.claude/agents/pr-reviewer.md` (Gates), `.claude/commands/git-accept.md` (step 3), and `ciTriggerNote` in `.claude/release-kit.json` — plus the branch-protection contexts in `scripts/setup-branch-protection.sh`.

`scripts/test-gate.sh` runs the same steps locally (minus coverage) and is the gate `git-release` runs. Change it together with `test.yml`. A step the local machine cannot run (e.g. iOS on Linux) is printed as SKIPPED, never skipped silently, and must be green in CI before a release.

For client apps: run macOS runners only when `changes` reports iOS/macOS or shared code changed (they cost several times a Linux runner; budget in `docs/process/system-context.md`). Device e2e runs nightly or on `release/*`, not on every PR. Signing material lives in GitHub Actions secrets (base64) or `fastlane match`, never in git.
