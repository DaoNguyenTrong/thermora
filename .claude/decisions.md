# Decision Log

Record only **platform / cross-cutting** decisions that no single module owns — infrastructure, deployment, shared auth mechanics, build and test tooling, codegen, layer boundaries — and that affect system design: architecture, module/layer boundaries, API or data contracts, security posture, or other cross-cutting structural choices with a real trade-off, external constraint, or rejected alternative that would be costly to re-derive later. Out of scope: decisions owned by one module (they live in §12 of its `docs/tech/` document), working-process decisions (`docs/process/decisions.md`), visual/branding/UI styling, copy/content wording, and one-off bug fixes — even ones that took real investigation — unless the fix itself changed a structural/contract/security decision.
Newest entry at top — prepend new entries directly below this line, do not append at the bottom.
Title format: `### YYYY-MM-DD — <decision>` (date the decision was made, not a due date).
Write only the **why** — the reasoning and rejected alternative. Never "what was done" or "how" (git log/diff already has that; do not restate file names, method names, or a narrative of the change). Keep each entry under ~80 words (excluding heading).
**Language:** write every entry in English, even when the conversation that produced it is in another language.
**Who writes:** whoever makes the change, in the same PR as the change; `pr-reviewer` checks the entry. No separate approval.
**Append-only:** never edit or delete an existing entry. To reverse one, add a new entry with a `Supersedes: <old title>` line — such an entry needs the Tech lead's explicit approval.

---

### 2026-11-25 — Serena runs its REPL interface

Follows Serena's current default, chosen by the user over the per-tool interface. Accepted exposure: `serena_repl` runs unsandboxed Python that bypasses the Bash guard and permission rules; hiding the shell API and a written rule only steer agents. The design-only agent loses Serena, because granting the REPL would let it edit code. Rejected: per-tool interface; running Serena in a container.

### 2026-11-25 — CI syncs work item state to Plane

State kept by hand from a session drifts when PRs move elsewhere. Accepted exposure: anyone who can push a branch can read the Plane token, so it belongs to a low-privilege bot. `pull_request_target` alone would not close that; adding an environment limited to `dev` was not adopted. Failing or requiring the check is rejected: a Plane outage would block merges. The template ignores its config; an adopting project commits it, because CI reads it from the base commit. Cost: fork PRs are not synced.

### 2026-11-25 — Release plan checker in the test gate

Release plans and sprint plans cite PRD codes across files, so a stale story, a dropped Must story or an unapproved plan would go unnoticed unless a tool fails the build. It is its own script in the same gate and CI job as the persona check. Rejected: extending the PRD approval checker, which checks one document's approval order per path; cross-document coverage would mix two contracts in one script.

### 2026-11-20 — Human-gated areas are kept by `pr-reviewer`, not by CODEOWNERS

Supersedes: Gates are enforced by GitHub branch protection and CODEOWNERS, not only by agents

The repo has one maintainer, and GitHub never counts a PR author's own approval, so required code-owner review would block every PR touching `.claude/`, `.github/` or `scripts/`. Branch protection keeps the required PR, checks, no force push and no deletion; `pr-reviewer` § 4 keeps the human gate. Rejected: disabling `enforce_admins` (it would let the maintainer skip CI too). A second reviewer brings CODEOWNERS back.

### 2026-11-16 — Gates are enforced by GitHub branch protection and CODEOWNERS, not only by agents

AI-BASE targets teams, so a client-side gate (`pr-reviewer`, `/git-accept`) is not enough: any member can bypass their own session. Branch protection on `main` and `dev` (required PR, required checks, no force push, no deletion) plus CODEOWNERS on human-gated areas makes the server refuse what the agents refuse. Rejected: agent-only gates as in DAONT-BASE, which assume a single maintainer.
