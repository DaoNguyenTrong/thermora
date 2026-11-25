# Thermora

Product requirements and the technology stack are not defined yet: the work starts with personas and the first PRD. The repository holds the delivery process: a lifecycle from idea to release, eleven role-based agents, approval gates, git guards, check scripts, CI for those scripts, and release configuration.

## What is inside

| Layer | Files |
| --- | --- |
| Process index and lifecycle | `AGENTS.md`, `docs/process/lifecycle.md`, `docs/process/{decisions,progress,system-context}.md` |
| Product documents | `docs/prd/` (personas, PRD templates), `docs/backlog/` (release plan template), `docs/tech/` (technical design template), `docs/superpowers/plans/` (sprint plans), `docs/feature-map.md`, `docs/agent-error-log.md` |
| Role agents | `.claude/agents/*.md` — product-manager, business-analyst, solution-architect, ui-designer, tech-lead, implementer, qa-app, sdet, code-reviewer, pr-reviewer, appsec |
| Path rules | `.claude/rules/*.md` (stack parts are `TODO(stack)`) |
| Commands and skills | `.claude/commands/git-accept.md`; plugins `superpowers` and `release-kit` |
| Guards | `.claude/settings.json` + `scripts/claude-bash-guard.ts`, `lefthook.yml`, commitlint, secretlint, branch protection |
| Check scripts | `scripts/risk-tier.ts`, `check-comments.ts`, `check-personas.ts`, `check-prd-approval.ts`, `check-release-plan.ts`, `test-gate.sh` (+ tests) |
| CI and release | `.github/workflows/{ci,test,release}.yml`, `.claude/release-kit.json`, `scripts/setup-branch-protection.sh` |
| Codex layer | `.codex/agents/*.toml`, `.codex/hooks.json`, `.agents/skills/` |

## How work flows

Personas → PRD → release plan → UI and architecture of the first release, then half-month sprints (refinement, planning, implementation, review and merge, sprint review, retro) and releases. Stages and approvers: `AGENTS.md` § Software Lifecycle; rules: `docs/process/lifecycle.md`.

## Quick start

```bash
bun install            # installs git hooks
bun test scripts/      # check scripts and guard
scripts/test-gate.sh   # local gate (same as CI)
```

Tool setup for each team member: [`AI_TOOLS_SETUP.md`](AI_TOOLS_SETUP.md). Branches, PRs and releases: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Project setup

Still to do:

1. Run the repository setup in `CONTRIBUTING.md` § Repository Setup.
2. Build the personas (stage 0, `docs/process/lifecycle.md`), then the first PRD.
3. Once the stack is chosen, fill every `TODO(stack)` and `TODO(team)` marker: `grep -rn "TODO(stack)\|TODO(team)" .`. The order that works: `AGENTS.md` § Repository Layout → `.claude/rules/commands.md`, `testing.md`, `architecture.md` (with an architecture test) → `scripts/test-gate.sh` and `.github/workflows/test.yml` together → `scripts/risk-tier.ts` lists → `scripts/check-comments.ts` `GENERATED` → agent files.
4. Add an `AGENTS.md` inside each source directory listing the rule files that apply to it.
5. Verify the symbol tools on that stack (`.claude/rules/serena.md`).

Story points and status live in `docs/process/progress.md`; the project uses no external tracker.
