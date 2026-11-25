# AGENTS.md

This file provides guidance to Claude Code and Codex when working with this repository. It is the index of the process: it holds only the rules every session needs at once and points to the file that owns each detail.

AI-BASE is a stack-agnostic workflow template for teams. Every `TODO(stack)` marker is a part the project fills in once it picks its stack (`README.md` § Adopting the template).

## Repository Layout

<!-- TODO(stack): one row per layer. For a multi-platform app, one row each for api/, app/ (shared), ios/, android/, desktop/, web/, packages/, shared/contract/. Name the API contract's source of truth and how clients are generated from it. -->

| Path | Stack | Relevant rules |
| --- | --- | --- |
| `scripts/` | Bun + TypeScript check scripts, Bash guard, `test-gate.sh` | `commands.md`, `comments.md` |
| `docs/` | PRDs, release plans, technical designs, sprint plans, process | `docs/process/lifecycle.md` |
| `src/` _(placeholder)_ | TODO(stack) | `architecture.md`, `code-conventions.md`, `testing.md`, `authentication.md`, `localization.md`, `commands.md`, `comments.md` |
| `shared/contract/` _(placeholder)_ | TODO(stack): OpenAPI / GraphQL / proto | `api-contract.md` |

The **source directories** are the code rows above (everything except `scripts/` and `docs/`). Claude loads each rule from its `paths:` frontmatter; Codex does not, so before editing a path in the table read the named files under `.claude/rules/`. Each source directory has its own `AGENTS.md` listing the same rule files, so a session opened inside it gets them too.

## Team Roles

"The user" in agent files means the team member running the main session (the orchestrator). Approvals belong to these roles; the orchestrator relays to the right one.

| Gate | Approver | Notes |
| --- | --- | --- |
| Personas, PRD, priorities, scope | Product Owner (PO) | One person decides; others comment on the draft PR |
| Release plan, release order, sprint goal and committed stories, sprint review acceptance | PO | |
| UI design | PO + Design lead | |
| Technical design (each release), sprint plan file, push/PR authorization | Tech lead | A release or common part touching a security area: + Security owner (`docs/process/lifecycle.md` § Architecture runway) |
| Merge of a human-gated area (`docs/process/lifecycle.md` § Gates Between Stages) | Tech lead; auth areas: + Security owner | `pr-reviewer` returns `NEEDS_HUMAN`; the approver reads the PR and merges it |
| Release | Release manager | |
| Escalations from `solution-architect` | business → PO; technical → Tech lead; security → Security owner | |

A solo maintainer holds every role. Change logs record the role and name, e.g. `user decision (PO: <name>)`. Exactly one orchestrator owns a module or phase at a time (the *Owner* column of `docs/process/progress.md`); each member works in their own checkout. Only that Owner's session writes Plane and the module's `progress.md` rows, and subagents never call Plane; each sprint also names one Sprint owner, whose session handles velocity and the Cycle (`docs/process/lifecycle.md` § Plane, § Sprint loop).

<!-- TODO(team): the names behind each role. -->

## Software Lifecycle

Work runs from idea to release, not only from code. Full detail (work sizes S/M/L, risk tiers, gates, change management, traceability): `docs/process/lifecycle.md`; per-module progress: `docs/process/progress.md`.

| Stage | Output | Owner |
| --- | --- | --- |
| 0 Idea and vision | personas (`docs/prd/00-personas.md`, required before any PRD), module list, priorities | main session (`brainstorming`); personas: `product-manager`, reviewed by `business-analyst`; PO approves |
| 1 Requirements | PRD in `docs/prd/` | `product-manager`, reviewed by `business-analyst`; PO approves |
| 1b Release plan | `docs/backlog/` | `product-manager`, sizes by `tech-lead`, reviewed by `business-analyst`; PO approves |
| 1c-UI UI of `REL-1` | boards on the design canvas | `ui-designer`; PO + Design lead approve |
| 1c Architecture runway | `docs/tech/` v1.0: common part and `REL-1` | `tech-lead`; `appsec` first when a security area is touched; Tech lead approves |
| 2 UI design | boards of the next release | `ui-designer`; PO + Design lead approve |
| 3 Technical design | the next release added to `docs/tech/` | `tech-lead`; `appsec` first when a security area is touched; Tech lead approves |
| 4 Sprint planning | sprint plan in `docs/superpowers/plans/` | main session (`writing-plans`); PO approves goal and stories, Tech lead the plan file and may authorize push/PR |
| 5 Implementation | code, tests, feature-map entry | `implementer`, one plan task per call; review by risk tier (`docs/process/lifecycle.md` § Risk Tiers) |
| 6 Review and merge | PR merged into `dev` | `pr-reviewer` (docs-only PR: `/git-accept`); human-gated areas: their human approver |
| 6b Sprint review | demo of each story | main session prepares; PO accepts |
| 6c Sprint retro | sprint numbers, improvement ideas | main session |
| 7 Release | tag, changelog | `release-kit:git-release`; Release manager approves |

A module starts with 0 → 1 → 1b → 1c-UI → 1c; stages 2 to 6c then repeat every sprint (`docs/process/lifecycle.md` § Sprint loop). A story enters a sprint and is finished only by `docs/process/lifecycle.md` § Definition of Ready and Done.

The main session orchestrates: it sends every question first to `solution-architect`, which answers on the approvers' behalf, asks a human only what that agent escalates, relays answers, and calls agents in order. Subagents cannot ask a human or call each other. A business question found at any later stage goes back to the PRD; nothing downstream proceeds on an unapproved upstream document.

## Common Commands

```bash
bun install                                   # once: installs the Lefthook git hooks
bun test scripts/                             # check-script and guard tests
bun scripts/risk-tier.ts --base origin/dev    # risk tier of the current change
scripts/test-gate.sh                          # full local gate before push (CI minus coverage)
# TODO(stack): per-layer test, type-check and build commands
```

Full list: `.claude/rules/commands.md`. CI workflows and git hooks: `.claude/reference/ci-and-git-hooks.md`.

## Agent Workflow

### Pre-Task Protocol

The step-by-step implementation protocol (memory → live state → CodeGraph/Serena orientation → impact check → feature map → reproduce-first → execute → verify gates → decision log) lives in `.claude/agents/implementer.md` § Pre-Task Protocol, the single source. Code tasks — plan tasks and S-size fixes alike — go to the `implementer` agent; the main session does not edit the source directories itself. Its orientation steps 1–4 also apply to any agent exploring code.

**Recurring feedback:** if the same correction comes up twice (from a reviewer or from your own earlier work), turn it into a lint rule, architecture test, script or generator instead of another prose rule. The end-of-module retro does this, and process changes wait for it (`docs/process/lifecycle.md` § Recurring Errors and End-of-Module Retro).

**Worktrees** lack every gitignored file; read `.claude/reference/worktrees.md` before creating or working in one.

### Commits

- A question is not an order to commit — "is this ready?" or "what changed?" gets an answer, not a commit.
- Run `git branch --show-current` before every commit; never commit on `main` (the Lefthook branch guard blocks it) or on a branch you didn't expect.
- Stage only the files the task changed, by explicit path — never `git add -A`/`git add .`/`git commit -a`; leave changes that predate the task unstaged.
- A commit rejected by Lefthook (commitlint, formatter, secretlint, comments) means fix the message or re-stage — never `--no-verify`.
- Push or open a PR only on an explicit order. The Tech lead may give that order once for a whole plan when approving it (recorded in the plan and in the brief to `implementer`): each time a phase is done and `scripts/test-gate.sh` passes, one PR for that phase into `dev` (`docs/process/lifecycle.md` § Push and PR Permissions). Never for `main`. Asking for a PRD or technical design (the module's first, or a later release's) is also that order, for one draft docs-only PR (`docs/process/lifecycle.md` § Committing Documents).
- Every PR description has a `## Changelog` section in the `release-kit:git-mr` format (`- Added|Changed|Deprecated|Removed|Fixed|Security: <one reader-facing sentence>`, or just `none`), followed by another `## ` section — `git-release` reads it up to the next `## ` heading, so trailing free text would make it invalid. Required sections: `.claude/release-kit.json` `prExtraSections`.
- One PR into `dev` at a time: rebase onto the latest `origin/dev`, `git push --force-with-lease` (`release-kit:git-sync` does both), merge with `--merge`, delete the merged branch on the remote and locally (`git branch -d`, never `-D`).
- Merge into `dev` only through a gate: `/git-accept` for a docs-only PR (`.claude/commands/git-accept.md`), or `pr-reviewer` for any other PR. `pr-reviewer` allows at most 3 revision rounds, then escalates; the areas it never merges are listed once, in `pr-reviewer.md` § 4 — those are merged by their human approver (§ Team Roles).

### Tool Selection

Orient with CodeGraph (`codegraph_explore`): how modules connect, what calls what across layers, and what breaks if you change something. Then drill in with Serena or the stack's LSP, then `Read`. Serena is called through `serena_repl` (`.claude/rules/serena.md` § Calling Serena). Never grep first; never open a file to orient.

| When you already know which symbol to inspect… | Use | Scope |
| --- | --- | --- |
| Read a class or function body | Serena `s.lsp.find_symbol` with `include_body=True` | TODO(stack): verified languages |
| Confirm what a usage resolves to | Serena `s.lsp.find_declaration` | TODO(stack) |
| Scan a file's public surface | Serena `s.lsp.get_symbols_overview` | TODO(stack) |
| Find every caller / usage of a symbol | Serena `s.lsp.find_referencing_symbols` | only languages verified in `serena.md`; otherwise CodeGraph blast radius |
| Rename a symbol across the codebase | Serena `s.lsp.rename_symbol` | only languages verified in `serena.md` |
| Broad keyword / file search | `grep` (quick), Explore agent (broad) | — |

A language CodeGraph does not index (`codegraph status`) uses grep + `Read`. Verification method and results: `.claude/rules/serena.md`.

### Superpowers Integration

If the superpowers plugin is installed, its skills yield to this file. Where a skill's default disagrees, these win:

- **Where it fits** — brainstorming / systematic-debugging / writing-plans run after the protocol's orientation steps 1–4.
- **Documents** — requirements go in `docs/prd/` (`product-manager`), release plans in `docs/backlog/` (`product-manager`) and technical design in `docs/tech/` (`tech-lead`) instead of `docs/superpowers/specs/`; brainstorming feeds those. Sprint plans go in `docs/superpowers/plans/`. Commit timing follows `docs/process/lifecycle.md` § Committing Documents, whatever the skill's own commit step says.
- **Per-module flow** — the stages above, sized S/M/L. The main session uses `subagent-driven-development` to hand `implementer` one task at a time and reviews by risk tier; `implementer` itself uses `executing-plans`, TDD, debugging, verification and `receiving-code-review`.
- **Requirement gaps stop the run** — "rulings, not stalls" covers technical ambiguity only. A missing or conflicting business rule or acceptance criterion means stop and ask; never invent business behavior.
- **Branch & worktree** — work in your own checkout on one `feature/*` branch cut from `dev`; no worktree for a skill run.
- **Finishing** — base is `dev` (`main` only for a hotfix); never merge locally, and don't use `superpowers:finishing-a-development-branch` (merging is `pr-reviewer`'s gate). Without an explicit order to push or open a PR, leave the branch as it is.

## Codex

`.claude/` stays the instruction source. Codex reaches it through a thin layer, because it does not load Claude's `paths:` rules, agent files, slash commands or `settings.json`.

- Spawn a role by the `name` in `.codex/agents/<name>.toml`; that agent reads `.claude/agents/<name>.md` and follows it. Do not copy the prompt into the toml.
- `.codex/hooks.json` runs `scripts/claude-bash-guard.ts` on `PreToolUse` for `Bash`. A new or changed hook does nothing until it is trusted with `/hooks`.
- Repo skills live in `.agents/skills/`: `git-accept` (procedure in `.claude/commands/git-accept.md`).

| Claude name | Codex |
| --- | --- |
| Read, Grep, Glob, Bash, Edit, Write | the built-in file, search, shell and patch tools |
| Skill | a skill, using the names below |
| WebSearch, WebFetch | web search |
| `mcp__codegraph__codegraph_explore` | `codegraph` MCP tool `codegraph_explore` |
| `mcp__serena__<tool>` | `serena` MCP tool `<tool>` |
| Artifact | none — stop and say the design canvas cannot be read |

| Written as | Codex |
| --- | --- |
| `superpowers:<name>` | skill `<name>` when installed; otherwise the copy under `~/.claude/plugins/cache/claude-plugins-official/superpowers/*/skills/<name>/`. Say so when neither exists. |
| `release-kit:git-commit`, `git-sync`, `git-mr`, `git-release` | skills `git-commit`, `git-sync`, `git-mr`, `git-release`; they read `.claude/release-kit.json` |
| `/git-accept` | skill `git-accept` |

## Critical Invariants

<!-- TODO(stack): one to three architecture rules that must never break, each with the test that enforces it (`.claude/rules/architecture.md`). Example: "entities are built only through their static factory; enforced by ArchitectureTests". -->

## Decision Log

Decisions live where their scope lives:

- **Module** (its API, data model, authorization) — §12 of that module's `docs/tech/` document, approved with it. A major deviation updates the document in the same PR; a minor one is declared in the PR (`docs/process/lifecycle.md` § Design Deviations During Implementation).
- **Platform / cross-cutting** (infrastructure, deployment, shared auth mechanics, build/test tooling, codegen) — `.claude/decisions.md`, written by whoever makes the change, in the same PR. Append-only.
- **Working process** (agents, gates, review) — rules in `docs/process/lifecycle.md`, decisions in `docs/process/decisions.md`.
