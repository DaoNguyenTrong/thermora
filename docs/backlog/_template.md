# PRDXX-REL — <Module name> release plan

| Item | Value |
|---|---|
| Code | `PRDXX-REL` |
| PRD | `PRDXX` v<approved version> |
| Status | Draft / In review / Approved |
| Version | 0.1 |
| Approver | PO: <name> |
| Updated | YYYY-MM-DD |

## 1. Story map

The backbone is the primary persona's activities in the order they happen; under each activity are the PRD's stories.

1. <Activity 1>
   - PRDXX-US-01 — <short name>
2. <Activity 2>
   - PRDXX-US-02 — <short name>

## 2. Releases

- `REL-1` is the walking skeleton: the primary persona's main flow runs end to end, however thin.
- Every release can be demonstrated to a user; no release is backend work only.
- Every Must story is in one release, or is split across releases by AC sets that do not overlap.
- The order of the releases is the PO's decision.
- *Story* column: entries separated by `;`, each a whole story (`PRDXX-US-01`) or a part by AC set (`PRDXX-US-02 (AC-nn, AC-mm)`). *Size* column: `S`, `M`, `L` or `XL`.

| REL | Goal | Story | Persona | Depends on | Size |
|---|---|---|---|---|---|
| PRDXX-REL-1 | <demonstrable outcome, in the user's words> | PRDXX-US-01; PRDXX-US-02 (AC-03, AC-04) | P-01 | — | M |

## 3. Not yet planned

Could stories that are in no release yet.

- <PRDXX-US-nn — short name, or "None">

## 4. Change log

Reordering or moving a story raises this plan's version and the PO approves it again; the PRD does not return to *In review*. A new or changed behaviour is an edit of the PRD first.

Source labels: `user decision (PO: <name>)`, `SA (on behalf of user)`, `BA review`, `tech-lead` (sizes), `metadata`. An approval row's *Change* starts with `User approval`.

| Date | Version | Change | Source |
|---|---|---|---|
| YYYY-MM-DD | 0.1 | First draft | — |
