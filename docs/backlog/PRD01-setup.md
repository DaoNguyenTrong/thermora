# PRD01-REL — Setup and connection release plan

| Item | Value |
|---|---|
| Code | `PRD01-REL` |
| PRD | `PRD01` v0.3 |
| Status | Approved |
| Version | 0.3 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-27 |

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
| PRD01-REL-1 | On Windows, macOS and Ubuntu, a person opens Thermora, gives a name, sees that Claude Code or Codex is ready (or is told in plain Vietnamese what is missing and how to sign in, with text to hand to the person who supports them), reads the one-time data reminder, and sees the service in use. The skeleton of this module ends at "ready"; running procedures is PRD02 | PRD01-US-01; PRD01-US-02; PRD01-US-03; PRD01-US-04 (AC-14, AC-15, AC-16); PRD01-US-05 (AC-17, AC-19, AC-37); PRD01-US-06 (AC-23, AC-25); PRD01-US-07 (AC-27, AC-43) | P-01, P-02 | — | XL |
| PRD01-REL-2 | The person can choose and change the service, can re-run a health check, can test the connection, can re-read the data reminder from the health check, understands a plan limit, an unreachable service or a lapsed sign-in, and can rename themselves | PRD01-US-04 (AC-33); PRD01-US-05 (AC-18, AC-20); PRD01-US-06 (AC-24); PRD01-US-07 (AC-26, AC-28, AC-40, AC-41); PRD01-US-08; PRD01-US-09 | P-01, P-02 | PRD01-REL-1 | L |

### Notes on the releases

- **Order:** `REL-1` then `REL-2`; `REL-2` is not split (PO decision, 2026-11-26).
- **Platforms:** `REL-1` runs on Windows, macOS and Ubuntu.
- **Copyable text in REL-1:** `PRD01-US-07 (AC-27)` is delivered in `REL-1` as the text offered by the setup help (AC-13, AC-14 case b) from the start-up check result: states, versions and service names only, no sign-in detail. The re-run health check screen (AC-26), the connection test (AC-40, AC-41) and the health-check half of AC-28 arrive in `REL-2`.
- **Straddling ACs:** AC-28 — the start-up half (no request to the AI, no plan used) is demonstrated in `REL-1`, the health-check half in `REL-2`; it is listed under `REL-2`. AC-43 (no accounts, roles or permissions) is listed under `REL-1` (US-07) and holds again in `REL-2`. AC-37 (settings kept per machine; asked again on a second machine, FR-15) is listed under `REL-1` (US-05) because FR-15 is delivered with `REL-1`.
- **Reminder:** the reminder itself (AC-23, AC-25) is in `REL-1`; re-reading it from the health check (AC-24) needs the health check screen and is in `REL-2`.
- **AC-21 (no service Ready, AI action unavailable):** stays in `REL-1` and is demonstrated with a placeholder AI action standing for the work PRD02 builds; it is not moved to `REL-2`.
- **Failure messages (AC-29 to AC-32, AC-42):** demonstrated in `REL-2` through the connection test and simulated service failures. Integration with real runs is PRD02's.
- **Distribution constraint (input to the architecture runway, not a story):** pilot installers are distributed unsigned — no Apple Developer Program membership, no Windows code-signing certificate. The PO installs by hand, following Vietnamese install steps. Revisit when anyone other than the PO installs, or on wider rollout (PO decision, 2026-11-26).
- **Placeholder AI action also serves AC-17 (N8):** the same `REL-1` placeholder AI action is where AC-17 is demonstrated: when both services are Ready, the person is asked to choose once at the moment they first use the placeholder action. The choice prompt is not shown merely because both services became Ready.
- **Placeholder lifetime (N9):** the placeholder is removed or replaced when PRD02 delivers real actions and never ships as a product control. FR-09's "re-readable" holds only from `REL-2` (AC-24); in `REL-1` the reminder is read once only.
- **REL-1 demo (input for tech-lead):** the `REL-1` demo needs both services installed, or simulated machine states, so that AC-17 (both Ready) and AC-21 (none Ready) can be shown.
- **Sizes:** the tech-lead sizes (`REL-1` XL, `REL-2` L) are kept. Moving US-06 (AC-23, AC-25) and US-07 (AC-27) into `REL-1` adds a little to `REL-1`; the tech lead may re-size.

## 3. Not yet planned

- None. Every story is in a release.

## 4. Change log

Reordering or moving a story raises this plan's version and the PO approves it again; the PRD does not return to *In review*. A new or changed behaviour is an edit of the PRD first.

Source labels: `user decision (PO: <name>)`, `SA (on behalf of user)`, `BA review`, `tech-lead` (sizes), `metadata`. An approval row's *Change* starts with `User approval`.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-26 | 0.1 | First draft | — |
| 2026-11-26 | 0.1 | Sizes: REL-1 XL, REL-2 L | tech-lead |
| 2026-11-26 | 0.2 | Order REL-1 then REL-2, REL-2 not split; US-06 split (AC-23, AC-25 to REL-1; AC-24 stays in REL-2); unsigned pilot installers recorded as a constraint | user decision (PO: DaoNguyenTrong) |
| 2026-11-26 | 0.2 | AC-27 moved to REL-1 so it does not depend on REL-2 (US-07 split); platforms, "ready" boundary, straddling ACs, AC-21 stub and failure-message demonstration stated | BA review |
| 2026-11-26 | 0.2 | §2 Notes extended: placeholder AI action also serves AC-17; placeholder lifetime and FR-09 re-readable only from REL-2; REL-1 demo needs both services or simulated states | BA review |
| 2026-11-27 | 0.2 | User approval of PRD01-REL v0.2, including the order REL-1 then REL-2 and REL-2 not split | user decision (PO: DaoNguyenTrong) |
| 2026-11-27 | 0.3 | AC-37 and AC-43 placed in REL-1 (traceability fix found by check-release-plan) | SA (on behalf of user) |
| 2026-11-27 | 0.3 | AC-37 under REL-1 US-05 and AC-43 under REL-1 US-07 confirmed against the PRD; no scope change | BA review |
| 2026-11-27 | 0.3 | User approval of the release plan v0.3 | user decision (PO: DaoNguyenTrong) |
