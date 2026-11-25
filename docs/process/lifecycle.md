# Software Development Lifecycle

This document describes the path from idea to release: who does each stage, who approves it, and when it is done. `AGENTS.md` holds the general rules (commits, push and PR, tools, where decisions are recorded); the detail of each stage lives here. The approver roles named below are defined in `AGENTS.md` § Team Roles.

## 1. Stages

| # | Stage | Output | Who does it | Approval gate | Done when |
|---|---|---|---|---|---|
| 0 | Idea and vision | Personas (`docs/prd/00-personas.md`), vision, module list, priority order | Main session (`superpowers:brainstorming`) with the orchestrator; personas written by `product-manager`, reviewed by `business-analyst` (§ Personas) | PO | Personas are *Approved*, the module catalogue in `docs/prd/README.md` is fixed |
| 1 | Requirements | PRD in `docs/prd/` | `product-manager`, reviewed by `business-analyst` | PO | PRD is *Approved* |
| 1b | Backlog and release plan | `docs/backlog/PRDxx-<name>.md`: releases `REL-n`, T-shirt sizes, dependencies; work items on Plane | `product-manager` cuts the releases, `tech-lead` sizes them, `business-analyst` reviews | PO | Release plan is *Approved* (§ Release plan) |
| 1c-UI | UI design of `REL-1` | Design boards of the stories in `REL-1`, tagged with requirement codes | `ui-designer` | PO + Design lead | Every FR of those stories with a new screen or new interaction pattern has a board; screens that follow an existing pattern only name the pattern; dark boards only for new patterns (`ui-designer.md` rule 1); approved |
| 1c | Architecture runway | Technical design v1.0 in `docs/tech/`: common part and `REL-1`; points of the `REL-1` stories | `tech-lead` (`appsec` first when a security area is touched) | Tech lead (+ Security owner for a security area) | Common part and `REL-1` are *Approved* (§ Architecture runway) |
| 2 | Refinement: UI design of the next release | Design boards of the stories in `REL-n` | `ui-designer` | PO + Design lead | As 1c-UI, for `REL-n` |
| 3 | Refinement: technical design of the next release | A minor version of the tech doc with the sections of `REL-n` | `tech-lead` (`appsec` first when a security area is touched) | Tech lead (+ Security owner for a security area) | `REL-n` is *Approved*, each of its FR/AC has a design section, its stories have points |
| 4 | Sprint planning | Sprint goal, committed stories, sprint plan in `docs/superpowers/plans/` | Main session (`superpowers:writing-plans`) | PO (goal and stories), Tech lead (plan file) | The sprint is committed; the Tech lead also decides whether to grant push and PR permission |
| 5 | Implementation | Code, tests, `docs/feature-map.md` entry | `implementer`, one task at a time | By tier (§2 Risk Tiers) | All tasks of the phase done, `scripts/test-gate.sh` passes |
| 6 | Review and merge | PR merged into `dev` | `pr-reviewer` (docs-only PRs: `/git-accept`) | Automatic, except human-gated areas | PR is in `dev`; after the module's last PR the main session runs the retro (§8) |
| 6b | Sprint review | Demo of each story against its AC | Main session prepares | PO accepts | Each story of the sprint is accepted, or the reason it is not is recorded |
| 6c | Sprint retro | Sprint numbers, improvement ideas | Main session | — | The *Sprint* table in `progress.md` has the sprint's row |
| 7 | Release | Release, changelog; usually after one or a few releases of the release plan | Skill `release-kit:git-release` | Release manager | Tagged and merged into `main` |
| 8 | Operation and feedback | Feedback from the product built on AI-BASE | PO | — | Feedback enters the backlog by work size (§2) |

A module starts in the order 1 → 1b → 1c-UI → 1c → first sprint. Stages 2 to 6c then repeat every sprint (§ Sprint loop).

The main session is the orchestrator: it sends every question to `solution-architect` to answer on behalf of the user, asks the human approvers only the questions that agent escalates (business → PO, technical → Tech lead, security → Security owner), passes answers to agents, calls agents in order, and does not do an agent's work itself. Subagents cannot ask a human and cannot call other agents.

To cut calls, the main session batches the questions of one stage into a single `solution-architect` call. A purely technical question with a reasonable default is decided by the main session and recorded in the plan, not sent.

## Personas

A persona is a portrait of a real group of users, built from goals and behaviour, not from age or job title. A persona differs from a role: a persona says who uses the product and why, a role (PRD-00 § Roles) says who may do what. A new product starts no PRD until `docs/prd/00-personas.md` is *Approved*; `scripts/check-personas.ts` enforces this in `scripts/test-gate.sh` and CI.

**How to build them.** The main session orchestrates; the document is written from `docs/prd/_template-persona.md`, lives on the docs branch and goes through `/git-accept` like a PRD (§5).
1. **Gather evidence.** The main session interviews the PO following `superpowers:brainstorming`, asking about real people and the last time they hit the problem. Sources in order of preference: interviews with end users, metrics or tickets, domain experts, the PO's own knowledge.
2. **Cluster** by goals and behaviour: two people with the same job title but different goals are two personas. Keep 2-5 personas, choose exactly one primary persona, and at least one anti-persona (`AP-nn`).
3. **Write.** `product-manager` writes from the template; every claim is labelled `[User]`, `[Data]` or `[Assumption]`. Without research a proto-persona is allowed, but every `[Assumption]` has a way to verify it in §6 of the document.
4. **Settle conflicts** between personas: this is a business decision, so `solution-architect` escalates it to the PO, never decides it, and never invents a persona.
5. **Review.** `business-analyst` reviews against the checklist below, then the PO approves; `scripts/check-prd-approval.ts` checks this order as it does for PRDs.

**Approval checklist:** each persona has at least 2 goals, 2 pains and 2 situations; no two personas share the same main goal; exactly one primary persona and at least one anti-persona; no more than half the rows of a persona are `[Assumption]`; no features or solutions described; devices and language are clear enough for `ui-designer` to choose a layout.

**Downstream use.** Persona codes enter the traceability chain (§7):
- **Module PRD:** §3 lists the personas using the module and its primary persona; each user story in §4 carries a `P-nn` code.
- **Design:** each board names its primary persona, used to choose device and information density.
- **E2E tests:** name scenarios by persona.
- **`solution-architect`:** uses personas as the basis for answering on behalf of the user.

**Changes.** Editing an approved persona raises the version and returns the document to *In review* (§3); PRDs that have stories for the edited persona are re-examined. Stage 8 feedback is the main source for updating personas. The end-of-module retro (§8) checks whether any persona no longer has a story serving it.

## Release plan

Once a PRD is *Approved*, the module has one file `docs/backlog/PRDxx-<name>.md`, written from `docs/backlog/_template.md`: story map, release table (`PRDxx-REL-n`), *Not yet planned* and change log. `product-manager` writes the story map and cuts the releases, `tech-lead` writes the T-shirt sizes, `business-analyst` reviews, the PO approves. The review and approval order in the change log follows the same rule as a PRD (`docs/prd/README.md` § Process, step 4).

**Slicing rules:**
- `REL-1` is the walking skeleton: the primary persona's main flow runs end to end, however thin.
- Every release can be demonstrated to a user; no release is backend work only.
- Every Must story is in a release. A story in several releases lists, each time, the AC set that release delivers, and the sets do not overlap.
- **Partial delivery:** a story may be split over several releases or sprints by its AC sets, written `PRDxx-US-03 (AC-07, AC-08)`. The PRD does not change. The story is *Done* only when all its AC are.
- Editing the release plan (reordering, moving a story) raises its own version and the PO approves it again; the PRD does **not** return to *In review*. Adding or changing behaviour still means editing the PRD (size M).
- The order of releases is a business decision: `solution-architect` may recommend one but must escalate it to the PO.
- Once a release plan is *Approved*, a `REL` code is never renumbered or reused: old sprint plans still refer to it, and the checker fails on an unknown `REL`.

**Two levels of estimate**, each kept in one place and never copied to the other:
- **T-shirt size (S/M/L/XL) per release**, in the release plan. `tech-lead` writes it at stage 1b, before any architecture exists, as a rough forecast only: it fills the *Size* column and adds one change-log row with source `tech-lead`, without changing status or version. `product-manager` owns every other edit of the plan, and writes that row itself only when the sizes were returned to it instead of written. A size changes only when the plan is revised for another reason; no docs PR exists just to change a size.
- **Story points per story or story part** (Fibonacci 1, 2, 3, 5, 8, 13). `tech-lead` sets them at refinement, once the tech section exists (for `REL-1`, at stage 1c); the PO confirms them at sprint planning.
  - The source of truth is Plane; without Plane it is the *Story* table of `progress.md` (§10).
  - A sprint plan records the points at commitment time for velocity; that snapshot is never updated.
  - Changing points before a story enters a sprint needs no approval.
  - A story above 8 points is split by AC set before it enters a sprint.

**Automated check.** `scripts/check-release-plan.ts` runs in `scripts/test-gate.sh` and CI. It compares each release plan with its PRD, and blocks a sprint plan whose release plan or PRD is not *Approved*, or that names a `REL` that does not exist. Coverage of Must stories is checked only once both the release plan and the PRD are *Approved*. An approved PRD without a release plan is not an error: the gate is where code starts.

## Architecture runway

Version 1.0 of a module's technical design holds:
- **The common part for the whole module:** §2 Architecture, §3 Data model, §5 Authorization, §7 Security, §12 Decisions, so a later release does not have to tear up the data model or the permissions.
- **The part of `REL-1`:** every other section (§4 API, §6 Flows, §8 UI, §9 Performance, §10 Rollout, §11 Tests), only for the stories of `REL-1`.

(Section numbers follow `docs/tech/_template.md`.) The UI design of `REL-1` comes first, because `tech-lead` takes it as input. The `REL` column of the document's traceability table says which part serves which release. A short-form tech doc (§5b) is split the same way.

**Status is tracked per release, not per document.** The *Status per release* table at the top of the document has one row for *Common* and one per release (status, version it was approved at):
- Each later release adds its sections and raises the minor version (1.1, 1.2, ...). Only that release's row returns to *In review*; approved parts keep their status, so refining `REL-n+1` does not block the stories of `REL-n`.
- Editing an approved section of one release returns that release's row to *In review*.
- Editing the common part is a major change: the major version goes up, **every** row returns to *In review*, and stories in progress stop (§4).
- DoR and `pr-reviewer` compare a story with the approved version of the common part and of the release that holds the story.
- `docs/tech/README.md` records status per release (for example `Common ✓, REL-1 ✓, REL-2 review`).

**Security review is judged per change, not per module.** A security area is identity, tokens, cookies, sessions or permissions (all tier 2), and with them tenant/data isolation, private links, public keys and anything exposed anonymously. When the common part, or a release, touches a security area, `appsec` reviews it before approval and the Security owner approves it together with the Tech lead. The common part gets this review before the first sprint.

## Sprint loop

A sprint is half a month: `SPR-YYYY-MM-S1` from day 1 to 15, `SPR-YYYY-MM-S2` from day 16 to the end of the month; on Plane it is a Cycle of that name. A sprint may hold stories of several modules, each module with its own sprint plan file. **Every sprint has one Sprint owner**, recorded in each of its sprint plans: that person's session computes velocity and creates, completes and transfers the Cycle, also when the sprint holds several modules. For `REL-1`, refinement is stages 1c-UI and 1c; from `REL-2`, refinement for sprint N+1 runs during sprint N, so work is prepared exactly one sprint ahead.

1. **Refinement.** For the stories meant for the next sprint, the main session calls `ui-designer` and then `tech-lead`, for those stories only. A story that meets the DoR (§ Definition of Ready and Done) moves to *Todo*.
2. **Sprint planning**, on the first day.
   - The Sprint owner's session computes velocity, the mean *Done* points of the last 3 sprints, and proposes the *Todo* stories in backlog order until their points reach it. With fewer than 3 sprints, the PO sets the capacity.
   - The PO decides the sprint goal (one sentence) and the list of committed stories. The Sprint owner's session puts them in the Cycle and writes the goal in the Cycle description; each module's Owner writes its sprint plan with `superpowers:writing-plans` (§6).
   - The Tech lead approves each sprint plan file. The sprint is then committed.
3. **Implementation and merge** as stages 5-6. Plane states follow the milestones in § Plane.
4. **Sprint review**, on the last day.
   - The main session writes a demo script per story from its AC, with evidence: e2e tests by `qa-app`, screenshots taken on `dev` with the `run` skill.
   - The PO accepts story by story: accepted becomes *Done*; not accepted stays open with the reason in a comment; a new requirement goes back to the PRD (size M) and is not built within the sprint.
   - Each Owner's session, and the Sprint owner's, asks the Tech lead for permission to push and open its own PR recording the sprint's results (§10).
5. **Sprint retro**, right after the review (§8). On Plane the Sprint owner's session completes the Cycle and moves unfinished stories to the next one (`transfer_workitems`), under the write rights in § Plane.

## Definition of Ready and Done

The brief given to `implementer` and the review of `pr-reviewer` point to this section instead of copying it.

**Definition of Ready**, for a story or a part of a story by AC set:
- it belongs to an *Approved* PRD and is in a release of an *Approved* release plan;
- it has a persona and AC;
- it has an approved design board, or says which existing pattern it uses;
- it has a section in the approved technical design (§ Architecture runway);
- it has story points, at most 8;
- no dependency blocks it;
- no business question about it is open.

**Definition of Done:**
- the code is merged into `dev` through the gate of its tier;
- `scripts/test-gate.sh` passes;
- each AC has a test;
- `docs/feature-map.md` has the entry;
- no major design deviation is left unhandled;
- the PO accepted it at the sprint review.

## Plane

The repository is the source of truth for content; Plane is where the team follows progress. Plane is optional.

**Configuration.** A project that uses Plane copies `.claude/plane.example.json` to `.claude/plane.json` and fills in `baseUrl` (the `https` address of Plane), `workspaceSlug`, the project id and identifier, the id of each state, and the ids of the `bug` label and of its own layer labels under `labels.layers` <!-- TODO(stack): the layer labels, e.g. one per source directory -->. The template ignores the file in git; a project that turns Plane on removes that `.gitignore` line and commits the file, which holds no secret, because CI reads it from the base commit. Release labels `PRDxx-REL-n` are created as needed and are not listed. **Without `.claude/plane.json`, skip every Plane step**; points and story status then live in the *Story* table of `progress.md` (§10).

**CI configuration.** Set the repository secret `PLANE_API_KEY`. **Anyone who can push a branch can read it:** any workflow on any pushed branch (for example a new file that runs `on: push`) gets the repository's secrets. Switching to `pull_request_target` alone would not close the gap; pairing it with an environment secret limited to `dev` was not adopted (nor checked against GitHub's documentation). Checking out the base commit only fixes which script runs while the workflow is unedited. Required:
- the token belongs to a low-privilege bot account that is a member of that one project, and has an expiry date if Plane allows one;
- rotate it when a person loses push access;
- pull requests from forks get no secret only while the repository setting that sends secrets to fork workflows is off (the setting exists for private repositories);
- `plane-sync` is never a required check.

**Mapping:**

| Repository | Plane |
|---|---|
| Module (PRD) | Module `[PRDxx] <feature name>` (split by feature, not by layer) |
| Story `PRDxx-US-nn`, or a part by AC set | Work item (title and description: below), `external_source` = the identifier of the repository that adopted the template (for example `<owner>/<repo>`), `external_id` = `PRDxx-US-nn` (a part adds `#AC-07,AC-08`) |
| Release `REL-n` | Label `PRDxx-REL-n` |
| Technical layer | The project's layer labels |
| Sprint | Cycle `SPR-YYYY-MM-Sn` |
| Points | Estimate point |
| Bug (size S) | Work item with the `bug` label |

When the Plane instance cannot write estimate points, record points as the labels `pt-1`, `pt-2`, `pt-3`, `pt-5`, `pt-8`, `pt-13`.

**Work item content.** Everything written on Plane (title, description, comment, Cycle goal) is in the team's language <!-- TODO(team): the language of Plane content -->, short, and in the end user's words; codes and proper names stay as they are. A description is at most about 8 lines.

*Story.* Title `PRDxx-US-nn — <verb + object>`: at most about 60 characters after the dash, no technical terms (API, DTO, endpoint); a partial delivery adds `(part 1)`, `(part 2)`. Example: `PRD03-US-02 — Filter records by status`. Description:

```
As <persona>, I want <action> so that <benefit>.

Scope this time: <one sentence; only for a partial delivery>

PRD: <link> · Design: <link> · Tech: <link>
```

*Bug.* Title `[Bug] <what is wrong> when <when>`, for example `[Bug] Filters are lost when the records page reloads`. Description:

```
Current: <what happens>
Expected: <what should happen>
Steps to reproduce: <at most 3 steps>
```

AC are not copied to Plane: the detail stays in the PRD. The PR link is attached to the work item as a work item link.

**`Plane:` line and trailer** (only with `.claude/plane.json`). The `## Requirements` section of a PR description has a line `Plane: PRJ-12, PRJ-15` listing the work items the PR serves. A PR serving none (a process PR from a retro, tooling, docs) says `Plane: none (<reason>)`; a PR that implements a story or a `bug` item must list ids. A commit that serves a story or a `bug` ends with the trailer `Plane: PRJ-12`; other commits need none. Every id on the description's line is carried by the trailer of at least one commit of the PR. Branch names do not change.

**State milestones:**

| Milestone in the repository | Plane state |
|---|---|
| PRD and release plan *Approved* | Create work items in *Backlog*, with Module and labels (points come later, at refinement) |
| A bug is reported (size S) | Create a work item with the `bug` label in *Backlog* |
| A story meets the DoR | *Todo* |
| `implementer` starts a task of the story | *In Progress* |
| The story's PR is opened | *Ready For Testing* |
| The PR merges into `dev` | *Testing* |
| The PO accepts at the sprint review and the story meets the DoD | *Done* |
| Blocked by a business question or a major deviation | *Pending*, with a comment pointing to the question |
| The story is dropped from the release plan | *Cancelled* |

**CI sync.** `scripts/plane-sync.ts` (`.github/workflows/plane-sync.yml`) takes ids from the `Plane:` lines of the description and commit messages of a PR into `dev`:
- opened or updated, not a draft: link the PR and set *Ready For Testing*; an item already in *Testing* stays there;
- merged: set *Testing*;
- closed without merging, or converted to draft: an item in *Ready For Testing* goes back to *In Progress*, any other state stays.

CI never changes an item that is *Done*, *Cancelled* or *Pending*, and a Plane error never fails a PR. It skips PRs from forks and the post-release reconcile PR (`chore/reconcile-main-*`), and does not run for PRs into `release/*`. The main session does the other milestones, and does these by hand when CI skips a PR or prints a warning.

**Write rights.** Besides the CI job, only the session of the module's Owner (the *Owner* column of `progress.md`) writes to Plane, and for the Cycle the Sprint owner's session. Subagents never call Plane.
- Without asking, at the milestones above: create work items, change state, label or points, attach links, comment.
- The PO confirms each time: create, `complete` or edit a Cycle; add a story to a Cycle or remove it (that is the sprint commitment); delete anything; create or edit a Module.

## 2. Work Size

The main session sets the size at the start of each task and says so; the orchestrator may change it.

| Size | When | Path |
|---|---|---|
| **S** | Bug fix, chore, small change that alters no behaviour or contract | A bug gets a `bug` work item in *Backlog* (§ Plane); it enters the current sprint if the PO agrees, otherwise the next one. Technical path: skip stages 0-4, a failing test first for a bug, `implementer`, then review by tier |
| **M** | Change or add behaviour in an existing module | Edit the PRD (raise the version, back to *In review*, then re-approve), update the release plan, refine (design and tech doc only for the affected parts), then it enters the backlog like a new story |
| **L** | New module, or a change touching permissions, sessions or identity | Stages 0 to 1c, then the sprint loop; `appsec` when a security area is touched |

Size S must not add user-visible behaviour or change an API. If an S task turns out to need a behaviour change, stop and raise it to M.

A bug found at the sprint review on a story of that sprint is not a new work item: the story is not *Done* yet.

### Risk Tiers

Size decides which documents are needed; the tier decides how closely to check. The tier of a change is the highest tier among its files, computed by `bun scripts/risk-tier.ts --base origin/dev`, not self-assessed. The author may raise the tier, never lower it.

| Tier | Which changes | Checks |
|---|---|---|
| **0** | Docs, process text, locale files, generated code and API clients, test-only changes | CI only. The main session reads the diff itself, no review agent |
| **1** | Everything else: ordinary behaviour in non-sensitive areas (CRUD, screens, lists, filters) | `implementer` on Sonnet, tasks batched by screen. No review after each task; one Sonnet review pass for the whole phase PR (`pr-reviewer`). No mutation checks, no Opus |
| **2** | Authentication, tokens, cookies, sessions, permissions, tenant/data isolation, API keys, locks and concurrency on shared data, DB migrations, CI and hook config, dependency manifests and lockfiles, container files, `.env*`, app config, `.claude/settings*.json`, the tier script itself | Full process: `appsec` reviews the tech doc before the sprint plan when a security area is touched (§ Architecture runway), an Opus reviewer after each task, about 5 mutation checks on tests. The final phase review is `pr-reviewer`, called by the main session with `model: opus`; there is no separate final review. The area's human approver merges it (§3 Human-gated areas) |

The path and marker lists for each tier live only in `scripts/risk-tier.ts`. The tech doc of a new module names the tier-2 paths the module adds, and the module's first PR adds them to the script.

**Main session while running a plan.** Every tool call of the main session re-reads the whole context, so its model and session length are the largest cost.
- Once the plan is approved, the main session asks the orchestrator to switch to `/model sonnet` for the run. Opus is kept for brainstorming, planning and tier-2 review.
- Each phase runs in a fresh session, continuing from the plan's ledger (`.superpowers/sdd/<plan>/progress.md`).
- The orchestrator decides; the main session does not change its own model.

## 3. Gates Between Stages

- **Do not enter a later stage until the earlier one is approved, story by story:** a story enters a sprint only when it meets the DoR (§ Definition of Ready and Done). The PRD, the release plan and the architecture runway are still gates for the whole module. Exception: a security-sensitive module may write its tech doc in parallel with UI design when the PO and Tech lead allow it and the scope of the exception is recorded in the module's document.
- **Business questions that arise in a later stage go back to the PRD**, edited by `product-manager`, not decided where found. Technical questions belong to `tech-lead`.
- **Changes after approval:** editing a PRD returns it to *In review* and requires re-examining the affected design, tech doc and plan. Affected documents also return to *In review* and raise their version; a tech doc does so per release (§ Architecture runway). Exception: filling or fixing the link and metadata rows (*Design*, *Plan*, *Updated*) is not a change.
- **After 3 fix rounds on a PR that still does not pass:** `pr-reviewer` returns `ESCALATE`, naming the document to rethink (PRD, design or plan). There is no 4th fix round.
- **Human-gated areas:** authentication, tokens, cookies, sessions, permissions, tenant/data isolation, API keys, `.claude/`, `.github/`, `AGENTS.md`, CI and Lefthook config, `scripts/risk-tier.ts`, `scripts/plane-sync.ts`, DB migrations, deployment config, signing and release config, edits or deletions of existing `.claude/decisions.md` entries or a `Supersedes:` line, plus <!-- TODO(stack): product-specific sensitive areas (e.g. payment flows, encryption keys, webhook secrets) -->. `pr-reviewer` does not merge these PRs; they are merged by the human approver of the area (`AGENTS.md` § Team Roles).

## 4. Design Deviations During Implementation

When the code cannot do what the approved tech doc says:

| Level | When | Handling |
|---|---|---|
| **Minor** | Does not change the API contract, permissions, stored data model or user-visible behaviour (for example an internal class name, adding an index, splitting a service) | `implementer` continues, records it in the *Minor design deviations* section of its report and in the PR description with the reason. `pr-reviewer` blocks if the deviation is not truly minor or not recorded. The tech doc is not edited |
| **Major** | Changes any of the above | `implementer` stops the task and returns the deviation with evidence and a proposal. The main session calls `tech-lead` to edit the doc on the working branch (raise the version, back to *In review* as § Architecture runway says); business questions go through `product-manager` first. The Tech lead re-approves, then `implementer` continues. The fix ships in the same PR as the code |

A change to the common part of a tech doc stops every story of the module in progress until the Tech lead re-approves it.

When unsure, treat it as major. To surface major deviations early, the plan makes the highest technical-risk part the first spike task.

## 5. Committing Documents

- **A module's kick-off documents** (PRD, release plan, tech doc v1.0 and the design link of `REL-1`) share one branch `chore/<module>-docs` cut from `dev` at the first draft, with **one draft PR** for the whole module. The main session commits each version to that branch, so version history and review reports (PR comments) are not lost between work sessions. Starting the module's PRD is the push and the opening of that draft PR.
  - Each time an approver approves a document, the main session commits the approved version to the branch. The design board link goes in the PRD's *Design* row.
  - Agents in later stages (`ui-designer`, `tech-lead`, `writing-plans`) read the documents from this branch.
  - The PR is merged **once** through `/git-accept`, when all four are *Approved*. If design or the tech doc is blocked for long, the PO may allow the approved PRD to merge alone.
- **Each release after `REL-1`** has a branch `chore/<module>-rel-<n>-docs`: a docs-only PR (the tech doc's minor version, design links), merged through `/git-accept`. Asking for that release's technical design is the order to push it and open its draft PR.
- **Editing the release plan mid-module** goes through a small docs-only PR.
- **The sprint plan** is committed by the main session on its `feature/*` branch, in the same PR as the code.
- **Every PR**, including docs-only PRs, has a `## Changelog` section in the format of `release-kit:git-mr` (`- Added: ...`, `- Fixed: ...`, or just `none` for internal changes), and is always followed by another `## ` section: `git-release` reads this section up to the next `## ` heading, so a free-text trailing line (such as a source line) would break it. `git-release` builds the release CHANGELOG from these sections; do not edit `CHANGELOG.md` by hand.
- **Doc fixes caused by a major deviation** are committed by the main session on the working branch, in the same PR as the code; this way `pr-reviewer` always compares the code with the right document version.
- `implementer` does not edit or commit PRDs, release plans, tech docs or plans.

## 5b. Document Length

- **Plans** describe each task by: interface (public signatures, DTOs, endpoints), file list, test cases and acceptance criteria. Copy short code only when a signature or algorithm is hard to say in words. Do not write full code in advance: `implementer` rewrites it, and the version in the plan drifts from the real code.
- **A module PRD** usually aims at about 500 lines. This is a soft limit: a large module may exceed it if the reason is stated at the top of the PRD. Do not cut scope to keep the line count; cutting scope is a decision for the PO.
- **Short-form tech docs** are for modules marked `not needed` in the *appsec* column of `progress.md`. Required: §1, §3, §4, §5, §11, §12 and §13 of the template. The other sections may be one line, "Not applicable: <reason>". Aim at about 200 lines. For these modules `business-analyst` reviews the PRD once; a second pass only if the first has a `blocking` finding.

## 6. Push and PR Permissions

By default push or open a PR only when a human orders it. At stage 4, when approving the sprint plan, the Tech lead may grant **one permission for the whole plan**: each time a phase is done and `scripts/test-gate.sh` passes, `implementer` may push that phase's branch and open one PR into `dev`. The permission is recorded at the top of the plan and in the brief given to `implementer`; it does not apply to `main`, and does not replace the `pr-reviewer` gate.

**Sprint plan.** The plan of stage 4 is a sprint plan, one file per module, `docs/superpowers/plans/YYYY-MM-DD-<module>-<SPR-…>.md`; the file name contains the sprint code `SPR-YYYY-MM-S1` or `-S2`. Its header records:
- the sprint goal and Cycle name;
- the **Sprint owner** (§ Sprint loop);
- the committed stories and AC, with their points;
- the releases involved, with full codes `PRDxx-REL-n`;
- a line starting at the left margin with `` **Release plan:** `docs/backlog/<file>.md` ``, pointing to the module's release plan (`scripts/check-release-plan.ts` reads it).

**One PR per phase.** Each phase of the plan is a branch `feature/<module>-phase-<n>` and one PR into `dev`. A PR aims at no more than about 1,500 lines of source, excluding tests and generated files (<!-- TODO(stack): generated paths, e.g. OpenAPI export, generated API client, lockfiles -->); a phase touching human-gated areas (§3) should be smaller. When planning, a phase estimated above this is split in two. If it grows past it during work, split at a task boundary, not inside a task. The 1,500 figure is reviewed at the retro of the first module run through this process.

**One level of stacking.** So implementation need not wait for review, the branch of phase N+1 is cut from the branch of phase N once phase N's PR has passed `pr-reviewer` (passed, or in its first fix round). Do not stack more than one level, and do not stack when phase N has had more than one fix round. When phase N merges, the N+1 branch is rebased onto `origin/dev` before its PR is opened or reviewed, so the one-PR-at-a-time rule below still holds.

**One purpose per PR.** Do not mix kinds of work in one PR, especially docs awaiting approval with tooling or config changes: a mixed PR can merge only when its slowest part is done, and must pass the strictest gate of its parts. When asked to mix, the main session states that cost first.

**Merge order: near-linear history.** At any moment only one PR into `dev` is reviewed and merged. Before review the branch must be rebased onto the latest `origin/dev` (`git rebase origin/dev`, then `git push --force-with-lease`); merge with `gh pr merge --merge` so each PR still has a merge commit marking its boundary. Rebase the next branch only after this PR is merged. A branch that is not rebased gets *not ready* from `pr-reviewer` and `/git-accept` (`NOT_READY`), which does not count as a round. The main session orders the queue and requests rebases.

**Team rule.**
- One orchestrator per module or phase at a time, recorded in the *Owner* column of `progress.md`. Only that session writes the module's `progress.md` rows and Plane items (§ Plane).
- Each member works in their own checkout; two implementers never share one.
- One PR into `dev` at a time through a shared queue: the GitHub merge queue once there are 3 or more PRs per day into `dev` (`CONTRIBUTING.md` § Repository Setup), otherwise an agreed convention of who rebases and merges first. An unrebased branch makes `pr-reviewer` return `NOT_READY`.
- `progress.md`, `docs/prd/README.md` and `docs/tech/README.md` often conflict when several people edit them: edit only your module's row, and rebase right before merging.

**Branch cleanup after merge.** Right after merging, the merger (`pr-reviewer`, `/git-accept`, or the main session when a human lets it merge) deletes the remote branch, only after confirming the branch is in `origin/dev`: `git fetch --prune origin && git merge-base --is-ancestor origin/<branch> origin/dev && git push origin --delete <branch>`. The main session returns the checkout to `dev` (`git switch dev && git pull --ff-only`) and deletes the local branch with `git branch -d <branch>` - `-d`, never `-D`, so git refuses if the branch still has unmerged commits. Do not delete the branch of an unmerged PR, a closed PR, or one waiting on `ESCALATE`.

## Release, Stabilization and Hotfix

Use the skill `release-kit:git-release` (configured in `.claude/release-kit.json`; `CONTRIBUTING.md` § Release Process). The Release manager owns each step that needs a human.

- **Cut (Phase 1, on `dev`):** the skill cuts `release/vX.Y.Z` and writes the CHANGELOG entry on that branch, committing nothing to `dev`.
- **Stabilization:** bugs found in QA are fixed on a `fix/*` branch cut from `release/vX.Y.Z` (`implementer`), PR into that release branch, rebased onto `origin/release/vX.Y.Z` before review. `pr-reviewer` reviews like a PR into `dev` but **does not merge**: the PASS is recorded and the Release manager lets it merge.
- **Release (Phase 2):** the skill runs the mandatory gate, asks the Release manager to confirm, then opens and merges the PR `release/vX.Y.Z -> main` itself and tags. That is the only gate on a PR into `main`.
- **Cleanup of `release/*` and `hotfix/*` branches after merging into `main`:** do not use `gh pr merge --delete-branch`; the merger deletes the remote branch only after confirming it is in `origin/main`: `git fetch --prune origin && git merge-base --is-ancestor origin/<branch> origin/main && git push origin --delete <branch>`, then deletes the local branch with `git branch -d <branch>` - `-d`, never `-D`.
- **Hotfix:** `implementer` fixes on `hotfix/<name>` cut from `main`; the main session runs `code-reviewer` on the diff `origin/main...hotfix/<name>`; then `git-release` handles the CHANGELOG, the mandatory gate, the PR into `main` (Release manager confirms) and the tag.
- **Reconcile `main` into `dev` after each release or hotfix:** branch protection forbids direct pushes to `dev`, so `git-release` opens a `chore/reconcile-main-<version>` PR that merges `main` into `dev` (`devWrites: "pr"`). The Release manager merges it with `--merge` once CI is green; `pr-reviewer` never merges it. It is an exception to the rebase rule: the PR is itself a merge of `main`, and must not be squashed or rebased.
- **Quick release (`quick`, `dev -> main`, no stabilization stage):** the CHANGELOG goes into `dev` through a PR (`devWrites: "pr"`), then the skill opens the PR into `main`. Use only when the Release manager explicitly asks for `quick` and no separate QA is needed.
- **Related config** in `.claude/release-kit.json`: `devWrites: "pr"`, `devMergeCommand: "/git-accept"`, `pushAfterRebase: "force-with-lease"` (`release-kit:git-sync` and `git-mr` push after rebase themselves, overwriting only the branch's exact old head), `prExtraSections` (the PR description sections this process requires; `release-kit:git-mr` pre-creates them).

## 7. Traceability

Requirement codes run through the whole chain: persona (`P-nn`) -> user story (`PRDxx-US-nn`) -> requirement (`PRDxx-FR-nn`) -> release (`PRDxx-REL-n`) -> design board title -> tech doc section -> sprint plan -> task -> test -> the `PRD:` line of the feature-map -> PR description (with its `Plane:` line, § Plane). A code with no downstream, or a component with no upstream code, is a finding in any review. So are a Must story in no release and, when the project has `.claude/plane.json`, a PR whose `Plane:` line is missing or breaks § Plane.

## 8. Recurring Errors and End-of-Module Retro

When the same review comment appears twice, do not add another text rule: turn it into a lint, an architecture test or a generator (`AGENTS.md`).

**Sprint retro.** After each sprint review (§ Sprint loop):
- The main session records: committed against *Done* points, stories moved to the next sprint, stories rejected at the review, the sprint's `fix` commits and, with Plane, the time stories sat in *Pending*, taken from Plane; when Plane cannot give it, write `not measured`. Without Plane this measure is dropped. §10 says what goes into `progress.md` and which PR carries it.
- Adjust at once: capacity and how the next sprint is arranged.
- Process improvements that are not applied at once go in the *Pending retro* section of `docs/agent-error-log.md` (process freeze below).

**End-of-module retro.** The whole team attends. When a module's last PR has merged into `dev`, and before marking *Merged* in `progress.md`, the main session runs the retro:
1. Classify the module's `fix` commits by root cause (a Sonnet agent reads `git log` and `git show` of the module branches).
2. Record each cause group in `docs/agent-error-log.md`, and handle the items in that file's *Pending retro* section. Each member may have met different agent errors; record them all and merge them at the retro.
3. A group seen two or more times becomes an automated check (an S-size task for `implementer`), or the reason it cannot be done is recorded in that section. An automated item is marked "Automated as: ...".
4. Record the module's metrics in `progress.md` § Metrics, with the table from `bun scripts/risk-tier.ts --fix-ratio <module commit range>` and the total agent tokens summed from the `## Verification` sections of the phase PRs.
5. Bundle the module's process changes into one process PR, with the list of personas no story serves any more (§ Personas), if any.
6. If the tier-1 `fix` ratio is higher than tier-2's, add the paths of the tier-1 `fix` commits to the tier-2 list of `scripts/risk-tier.ts`, in the process PR of step 5.

**Process freeze mid-module.** Process changes (this file, `AGENTS.md`, `.claude/agents/`, `.claude/rules/`) apply only at the retro. They need Tech lead approval. Mid-module, fix only process bugs that block work, with the reason in an entry of `docs/process/decisions.md`. Improvement ideas that arise mid-module go in the *Pending retro* section of `docs/agent-error-log.md`.

**`sa-calibration.md`.** `.claude/sa-calibration.md` records who overrode `solution-architect`. Two members with conflicting taste is a question for the PO, not two contradicting lessons.

**One place per rule.** Each rule has one owning file; elsewhere only point to it as `file § heading`, do not copy the content. `AGENTS.md` is the index and keeps only the rules every session needs right away. If a broken `§` reference appears twice, add a check script to `scripts/test-gate.sh`.

## 9. Process Decisions

The process decision log is `docs/process/decisions.md`, newest on top.

## 10. Module Progress

The progress table is `docs/process/progress.md`. A module's rows are updated only by the session of its Owner (the *Owner* column); a *Sprint* row is written by the Sprint owner's session.
- **Module table**, one row per module: Owner, PRD, Release plan, Runway, UI/Tech by REL (latest release approved in both, over the total, for example `REL-2/4`), appsec (`not needed` while no part touches a security area, § Architecture runway), REL done (for example `1/4`), Merged. Update it in the docs PR when a document is approved, write *REL done* in the PR after the sprint (below), and mark *Merged* in the module's next docs PR, only after the end-of-module retro (§8) is done.
- **Story table**, used only without `.claude/plane.json`, where it is the source of truth for points and story status. One row per story or story part: Story, REL, Points, Status, Cycle. Written only where a commit exists to carry it:
  - refinement: add the row with its points and *Todo*, in the docs PR of that release (§5);
  - sprint planning: the Cycle, committed with the sprint plan;
  - sprint retro: *Done* if the story meets the DoD, otherwise it stays *Todo* (PR after the sprint).

  States in between are not written: the PRs show them.
- **Sprint table**, one row per sprint: Cycle, Sprint owner, goal, committed points, *Done* points, stories moved, stories rejected, time in *Pending* (§8; `-` without Plane). With Plane the numbers come from the Cycle.
- **Metrics table**, eight numbers per module: calendar days (from the first PRD draft to the merge of the last PR), PR count, the `fix` commit ratio (`git log`), the `fix` ratio by tier (`bun scripts/risk-tier.ts --fix-ratio`), questions asked to humans, agent tokens, number of sprints and mean velocity.

**PR after the sprint.** A story is *Done* only after the PO accepts it, when its feature PRs are already merged. So after the sprint review and retro, small docs-only PRs record the results, each merged through `/git-accept`: every Owner's session opens one with its module's *REL done* and *Story* rows (when used), and the Sprint owner's session puts the *Sprint* row in its own. The permission to push and open them is asked of the Tech lead at the sprint review.

**Agent tokens.** Each agent's completion report carries that agent's token count. At the end of each phase, the main session records the total by agent type and tier in the `## Verification` section of the phase PR, for example `implementer t1: 210k; pr-reviewer t1: 45k`. The main session's own tokens cannot be measured, so they are not recorded.
