# Product Requirements Documents (PRD)

One PRD per module, written from `_template.md` by the `product-manager` agent. Terms, roles, the permission matrix and the status lifecycle are defined only in PRD-00; other PRDs refer back to it.

## Process

0. **Personas first**: a new product starts with `00-personas.md`, written from `_template-persona.md` and approved through steps 1-4 below with the checklist in `docs/process/lifecycle.md` § Personas. Until it is *Approved*, no other PRD is drafted; `scripts/check-personas.ts` blocks this in CI. Each user story of a module PRD carries a persona code `P-nn`.
1. **Draft**: `product-manager` writes the first draft from existing decisions. Each PRD decides only its own module; anything belonging to another module goes in §12 *Handed to other PRDs*. Any gap a human must decide becomes an open question (at most about 8 per round); the rest the agent writes as a proposal and lists in the *Proposed defaults* table (`.claude/agents/product-manager.md` rules 5, 7, 8).
2. **Early review**: `business-analyst` reviews the first draft right away, before the PO receives the first round of questions, so the PO gets one consolidated list instead of many small rounds. The main session posts each review report as a comment on the module's draft docs PR (`docs/process/lifecycle.md` § 5. Committing Documents) and hands it back to the BA at the next review.
3. **Answer questions**: the main session always turns the questions the BA marks as defaults into *Proposed defaults* (not asked), then sends the rest from `product-manager` and the BA to `solution-architect` to answer on behalf of the user. That agent's answers are sourced "SA (on behalf of user)". Only questions it escalates become a round of questions to a human (business → PO), at most about 8; beyond that keep the most important and leave the rest for the next round. Any answer touching security, tenant/data isolation, or large scope growth: the main session presents the consequences and alternatives **before** passing it to the writing agent. Repeat until no open questions remain.
4. **Final review and approval**: when no open questions remain `product-manager` sets the status to *In review*; `business-analyst` reviews again; the PO approves the PRD together with the *Proposed defaults* table (including priorities). The status becomes *Approved*; the main session commits the approved version to the module's docs branch; the module's draft PR merges as `docs/process/lifecycle.md` § 5. Committing Documents says. After the approval row, the change log of that version may only gain link or metadata fix rows, with the *Source* column exactly `metadata`; `scripts/check-prd-approval.ts` checks this order at merge.
5. **Design, release by release**: `ui-designer` designs the stories of one release of the approved release plan (step 7), starting with `REL-1`, tagging requirement codes on each board. Business questions that arise during design go back to the PRD.
6. **Technical design, release by release**: `tech-lead` writes the document in `docs/tech/` from the approved PRD and design; it grows with each release (`docs/process/lifecycle.md` § Architecture runway). Business questions that arise go back to the PRD.
7. **Release plan and sprint loop**: as soon as the PRD is approved, before steps 5 and 6, the release plan is written in `docs/backlog/` (`docs/process/lifecycle.md` § Release plan). Design, technical design and implementation then go release by release in sprints (`docs/process/lifecycle.md` § Sprint loop): a sprint plan refers to the PRD's FR/AC codes and tech doc sections; the feature-map is updated in the same PR; `pr-reviewer` checks the PR.

Any change to an approved PRD returns it to *In review*.

## Parsed by scripts

`scripts/check-prd-approval.ts`, `scripts/check-personas.ts` and `scripts/check-release-plan.ts` parse these templates, so do not rename them:
- the metadata table rows `Status` (value starts with Draft / In review / Approved) and `Version` (`N.N`);
- the change-log table at the end of each document, rows `| YYYY-MM-DD | N.N | Change | Source |` (column order: date, version, change, source);
- an approval row has a *Change* starting `User approval` and a *Source* containing `user decision`; a BA review row has a *Source* starting `BA review`; rows after the approval row must have *Source* exactly `metadata`;
- persona headings `### P-nn — <name>` in `00-personas.md`;
- for the release plan check: the metadata row `Code`, and the column order of the tables: *Priority* last in §4 User stories, *Story* third in §5 Functional requirements, *Requirement* second in §7 Acceptance criteria. A moved column silently weakens the check. A removed item keeps its row, its code struck through or the row marked `~~Removed~~`.

## Catalogue

Proposed catalogue, drafted 2026-11-25 from the stage 0 interview and revised the same day; the PO fixed the list and the order on 2026-11-25, when approving Personas v0.3.

**Naming:** "PRD00" (also written PRD-00 in older text) is the common part: glossary, roles, permission matrix, status lifecycle (file `00-common.md`, not yet written). The personas file `00-personas.md` is called "Personas", code `P`. Never call the personas file PRD-00.

**Order** (proposed by SA on behalf of user; fixed by the PO on 2026-11-25): Personas → PRD00 → PRD01 Setup → PRD02 Workspace → PRD03 Authoring → PRD04 Sharing. The REL-1 walking skeleton spans PRD02 and PRD03: the head authors one procedure, an analyst uses it to produce one report. PRD02 owns running a procedure; PRD03 test-runs a draft through the Workspace engine, so PRD03 depends on PRD02, not the reverse.

**First-release delivery (SA on behalf of user):** no server. A procedure and a report are ordinary files in a project folder, the project's persistent home. The folder may sit on a shared or synced location when the team has one; otherwise the head hands over an exported package by the channel used today (Zalo or email). Single-writer rule: only the head edits a procedure; each report has one analyst owner; corrections come back as a new version. The head's approval stays a human act in REL-1, with a simple report status (draft / submitted / approved); in-app submit, review and return belongs to Sharing (PRD04).

**Handed to PRD00 from the personas:** may a head approve a report they produced themselves; whether the person who installs or supports machines needs a named role; the report status values and who may set them.

| Code | PRD | Status | Version | Depends on | Design |
|---|---|---|---|---|---|
| P | Personas (`00-personas.md`) | Approved | 0.3 | none | - |
| PRD00 | Common part: glossary, roles, permission matrix, status lifecycle | - | - | P | - |
| PRD01 | Setup and connection: find Claude Code / Codex on the machine, check sign-in, training-option reminder | - | - | PRD00 | - |
| PRD02 | Workspace: each report is a project folder with lasting context; pick a procedure, load raw files, orchestrator and role agents run it (check and fix loop, at most 3 rounds), reopen unfinished work and continue, report status, head's approval before Excel and PDF export | - | - | PRD00, PRD01 | - |
| PRD03 | Standard authoring: the head describes a procedure in plain language, AI turns it into rules, skills and agents for Claude Code and Codex, test run through the Workspace engine, publish | - | - | PRD00, PRD01, PRD02 | - |
| PRD04 | Sharing within a department: the team gets the latest published version of the standards; in-app submit, review and return of reports | - | - | PRD02, PRD03 | - |

When an approved design exists, record its link in the *Design* column and in the matching PRD.
