# AI Tooling Setup

A guide for team members who work on this repo with Claude Code (or Codex). It lists the AI tools, MCP servers and plugins the agent workflow relies on, and how to install and verify each one.

The workflow itself (agents, lifecycle, rules) is described in [`AGENTS.md`](AGENTS.md) and `docs/process/lifecycle.md`. This file only covers getting the tools onto your machine.

## 1. Prerequisites

| Tool | Why | Check |
| --- | --- | --- |
| Git + [GitHub CLI](https://cli.github.com) (`gh`) | commits, PRs, `release-kit` skills | `gh auth status` |
| [Bun](https://bun.sh) | Lefthook, the check scripts, the Bash guard hook | `bun --version` |
| [uv](https://docs.astral.sh/uv/) | installs Serena | `uv --version` |
| [Claude Code](https://docs.claude.com/en/docs/claude-code) | the main agent CLI | `claude --version` |
| The stack's SDKs | build and test | TODO(stack) |

```bash
curl -fsSL https://bun.sh/install | bash             # Bun
curl -LsSf https://astral.sh/uv/install.sh | sh      # uv
curl -fsSL https://claude.ai/install.sh | bash       # Claude Code
# TODO(stack): SDK install commands
```

GitHub CLI: follow <https://github.com/cli/cli#installation>, then `gh auth login`. Windows users run the same tools in WSL2.

Then, once, at the repo root:

```bash
bun install        # installs the Lefthook git hooks (branch guard, secretlint, formatter, commitlint)
```

## 2. Required: code-intelligence MCP servers

`AGENTS.md` § Tool Selection tells agents to orient with CodeGraph first, then drill in with Serena or the stack's LSP.

### CodeGraph

```bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
#   Windows (PowerShell): irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
#   Or, with Node:        npm i -g @colbymchenry/codegraph
claude mcp add --scope user codegraph -- codegraph serve --mcp
codegraph init            # at the repo root; creates .codegraph/ (gitignored)
codegraph status          # shows which languages were indexed
```

Restart Claude Code after registering the server. A language that `codegraph status` does not list is recorded in `AGENTS.md` § Tool Selection as "grep + Read".

### Serena

Language-server-backed symbol navigation and editing. Config goes in `.serena/project.yml`, which is gitignored like the rest of `.serena/`, so each member creates it (TODO(stack): the project's languages, plus `ignore_all_files_in_gitignore: true`).

```bash
uv tool install -p 3.13 serena-agent
serena init
claude mcp add --scope user serena -- serena start-mcp-server --context=claude-code --project-from-cwd
```

Verify its scope on this stack before trusting caller search or rename: `.claude/rules/serena.md`.

## 3. Required: Claude Code plugins

| Plugin | Marketplace | Provides |
| --- | --- | --- |
| `superpowers` | `claude-plugins-official` | `brainstorming`, `writing-plans`, `subagent-driven-development`, TDD, debugging, verification and review skills |
| `release-kit` | `daont-claude-plugins` | `git-commit`, `git-mr`, `git-sync`, `git-release`; bound to this repo by `.claude/release-kit.json` |

```text
/plugin marketplace add DaoNguyenTrong/daont-claude-plugins
/plugin install superpowers@claude-plugins-official
/plugin install release-kit@daont-claude-plugins
```

Both are declared in `.claude/settings.json`, so Claude Code prompts you to trust and install them the first time you open the repo.

## 4. Recommended

| Tool | Used for | Install |
| --- | --- | --- |
| `context7` | up-to-date library docs | `/plugin install context7@claude-plugins-official` |
| `playwright` | driving a real browser (web) | `/plugin install playwright@claude-plugins-official` |
| Device e2e tool | Maestro, Detox, Patrol, XCUITest/Espresso | TODO(stack) |
| Claude Design | the `ui-designer` agent's design canvas (Artifact tool) | built in when enabled on your account |

**Codex** (optional): `bun add -g @openai/codex`; after the first run, trust the repo hook with `/hooks` (`AGENTS.md` § Codex). Add CodeGraph and Serena to your own Codex MCP config.

## 5. Recommended personal configuration

These live in your own `~/.claude/CLAUDE.md`, not in the repo, so the team agrees on them here:

- **Subagent model selection:** pass `model` explicitly on every Agent call. `sonnet` for implementers, reviewers, QA and exploration; `opus` for `appsec`, tier-2 reviews and the final review of a phase. (Agent frontmatter already pins `sonnet` where it applies.)
- **Pacing:** batch 2–3 small adjacent tasks of the same layer per implementer (never a security-critical one), pipeline review of task N with implementation of N+1, and never let two implementers share one checkout.
- **Main-session model:** Opus for brainstorming and planning; switch to `/model sonnet` to run an approved plan (`docs/process/lifecycle.md` § Risk Tiers).

## 6. Verify

```bash
claude mcp list        # codegraph and serena show "Connected"
codegraph status       # index exists for this repo
bun test scripts/      # check scripts and guard are green
```

Inside a Claude Code session at the repo root:

1. `/plugin` — `superpowers` and `release-kit` enabled.
2. `/mcp` — `codegraph` and `serena` connected.
3. Ask: *"Use codegraph_explore to show how scripts/risk-tier.ts computes a tier."* — you should get symbol source back, not a grep loop.
4. Ask Claude to run `git add -A` — the Bash guard must deny it.

## 7. Things to know

- **Never commit secrets or local state:** `.codegraph/`, `.serena/cache`, `.serena/memories`, `.serena/project.local.yml`, `.claude/settings.local.json`, `.superpowers/`, `.env*`, signing material, and every secret-bearing config file (TODO(stack)).
- **The Bash guard hook** (`scripts/claude-bash-guard.ts`) needs `bun` on your `PATH`; without it every Bash call fails.
- **Worktrees** lack gitignored files; read `.claude/reference/worktrees.md` first.
- **Troubleshooting:** if an MCP server shows "Failed to connect", run its command by hand (e.g. `codegraph serve --mcp`) and make sure its directory (`~/.local/bin`, `~/.bun/bin`) is on your `PATH`.
