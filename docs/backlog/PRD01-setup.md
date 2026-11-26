# PRD01-REL — Setup and connection release plan

| Item | Value |
|---|---|
| Code | `PRD01-REL` |
| PRD | `PRD01` v0.2 |
| Status | Draft |
| Version | 0.1 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-26 |

## 1. Story map

The backbone is the primary persona's (P-01 Linh, data analyst) activities in the order they happen; P-02 follows the same path.

1. Open Thermora for the first time
   - PRD01-US-01 — Ask only for my display name
2. Find out whether my AI service is ready
   - PRD01-US-02 — See at a glance which service is ready and in use
   - PRD01-US-03 — Be told in plain Vietnamese what is missing and what to do
3. Sign in and choose the service
   - PRD01-US-04 — Sign in myself, on the AI service's own screen
   - PRD01-US-05 — Choose which service Thermora uses, and change my mind
4. Use AI within what the company accepts
   - PRD01-US-06 — One-time reminder about the training option and about financial and HR data
5. Get help when something seems wrong
   - PRD01-US-07 — Re-run a health check and copy the result for the person who supports me
6. Keep working when something stops
   - PRD01-US-08 — Be told clearly about a plan limit, an unreachable service or a lapsed sign-in
7. Look after my settings
   - PRD01-US-09 — Change my display name and see the Thermora version

## 2. Releases

- `REL-1` is the walking skeleton: the primary persona's main flow runs end to end, however thin.
- Every release can be demonstrated to a user; no release is backend work only.
- Every Must story is in one release, or is split across releases by AC sets that do not overlap.
- The order of the releases is the PO's decision.
- *Story* column: entries separated by `;`, each a whole story (`PRDXX-US-01`) or a part by AC set (`PRDXX-US-02 (AC-03, AC-04)`). *Size* column: `S`, `M`, `L` or `XL`.

| REL | Goal | Story | Persona | Depends on | Size |
|---|---|---|---|---|---|
| PRD01-REL-1 | A person on one machine opens Thermora, gives a name, sees that Claude Code or Codex is ready (or is told in plain Vietnamese what is missing and how to sign in) and is ready to work with the service in use shown | PRD01-US-01; PRD01-US-02; PRD01-US-03; PRD01-US-04 (AC-14, AC-15, AC-16); PRD01-US-05 (AC-17, AC-19) | P-01, P-02 | — | XL |
| PRD01-REL-2 | The person is reminded about data once, can choose and change the service, can re-run a health check and copy it for the supporter, can test the connection, understands a plan limit, an unreachable service or a lapsed sign-in, and can rename themselves | PRD01-US-04 (AC-33); PRD01-US-05 (AC-18, AC-20); PRD01-US-06; PRD01-US-07; PRD01-US-08; PRD01-US-09 | P-01, P-02 | PRD01-REL-1 | L |

## 3. Not yet planned

- None. Every story is in a release.

## 4. Change log

Reordering or moving a story raises this plan's version and the PO approves it again; the PRD does not return to *In review*. A new or changed behaviour is an edit of the PRD first.

Source labels: `user decision (PO: <name>)`, `SA (on behalf of user)`, `BA review`, `tech-lead` (sizes), `metadata`. An approval row's *Change* starts with `User approval`.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-26 | 0.1 | First draft | — |
| 2026-11-26 | 0.1 | Sizes: REL-1 XL, REL-2 L | tech-lead |
