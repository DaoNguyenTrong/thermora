# Process Decisions

Log of AI-BASE process decisions, newest on top. The rules currently in force live in `lifecycle.md`; this file records why they changed.

### 2026-11-25 - Plan after the PRD in releases and sprints, with Plane optional

Ported from DAONT-BASE (user's order). The old flow was a waterfall inside each module: nothing was delivered by value before the whole module was designed. Now a PRD is followed by a release plan and an architecture runway, then design, technical design and code go release by release in half-month sprints with DoR/DoD, a PO review and a retro. Rules: `lifecycle.md`. Applied outside a retro because no module is running (`progress.md` is empty).

Team choices:
- The PO approves the release plan, release order, sprint goal, committed stories and the sprint review; the Design lead still approves UI with the PO; the Tech lead approves each release's tech doc and each sprint plan file and grants push/PR.
- The Security owner is called when a release or the common part touches a security area, judged per change rather than by labelling a module.
- Only the session of a module's Owner writes Plane and `progress.md`; subagents never call Plane. Each sprint names one Sprint owner, so a Cycle shared by several modules has one writer.
- Plane is optional. Without `.claude/plane.json` the points and story status live in `progress.md`.
- The language of Plane content and the layer labels belong to the adopting team.

Rejected: only adding release planning (UI and tech would still cover the whole module up front); full Scrum with no module gates (it would drop PRD approval, `check-prd-approval.ts` and traceability).

Not yet proven: no module has run through this flow, and `plane-sync` has not written to a real Plane.

### 2026-11-20 - Keep `main` as the GitHub default branch

The default branch is what a visitor, "Use this template" and a fresh clone see, so it holds the released state. Cost accepted: GitHub's compare button, a bare `gh pr create` and `isolation: "worktree"` all start from `main`, so PRs always pass `--base dev` and a worktree agent is handed its branch explicitly.

### 2026-11-16 - Reconcile `main` into `dev` through a PR (`devWrites: "pr"`)

DAONT-BASE pushes the post-release `main → dev` merge straight to `dev` because a single maintainer has no branch protection. A team protects `dev` (required PR, required checks), so a direct push is refused by GitHub and by the Bash guard. The reconcile and quick release's CHANGELOG become PRs that the Release manager merges. Cost accepted: one extra PR per release, sometimes with an empty diff.

### 2026-11-16 - Adopt the workflow from DAONT-BASE v1.6.5

Reuse a proven process (lifecycle, agents, rules, skills, command guard, risk tiers, document gates and release flow) instead of designing one from scratch. Scope changed from the source: AI-BASE is a stack-agnostic template with no product code, it adds team mode (human roles, CODEOWNERS, shared merge queue; `workflow-setup-guide.md` §15), everything is in English, `qa-frontend` becomes `qa-app`, and GitLab support is dropped. Only mechanisms and templates are carried over; no source history, approvals or metrics.

Rejected alternative: copy only `AGENTS.md` or `.claude/` (without the scripts and generators the process cannot be enforced).
