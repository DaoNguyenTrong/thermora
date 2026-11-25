# TECH-XX — <Module name>

| Item | Value |
|---|---|
| Code | `TECHXX` |
| PRD | `PRDXX` (approved version) |
| UI design | <canvas link and board names> |
| Status per release | The table below |
| Version | 0.1 |
| Needs appsec review | Yes / No, per release (`docs/process/lifecycle.md` § Architecture runway) |
| Approver | Tech lead: <name> (+ Security owner when a security area is touched) |
| Updated | YYYY-MM-DD |
| Depends on | TECH-00, ... |
| Implementation plan | <paths of the sprint plans, once they exist> |

Status is tracked per release (`docs/process/lifecycle.md` § Architecture runway):

| Part | Status | Approved at version |
|---|---|---|
| Common | Draft / In review / Approved | 1.0 |
| REL-1 | Draft / In review / Approved | 1.0 |

## 1. Scope and traceability

The FR/AC codes this document covers, and what is deliberately not done yet. The traceability table is in section 13.

Sections 2, 3, 5, 7 and 12 are the common part for the whole module; sections 4, 6, 8, 9, 10 and 11 are extended release by release (`REL-n`).

## 2. Architecture

New or changed components, their place in the layers (<!-- TODO(stack): layer names, e.g. domain / application / infrastructure / API / client -->), main data flow. Include a diagram when it helps.

📱 For multi-platform apps: which parts are shared and which are per platform; offline behaviour and sync.

## 3. Data model

Entities and fields (name, type, required, limits), relations, constraints and indexes, which tenant owns the data, delete or deactivate rules, data that needs history.

## 4. API contract

| Code | Method and route | Description | Request | Response | Errors | Access policy |
|---|---|---|---|---|---|---|
| | | | | | | |

Include pagination, rate limits, the error convention, and contract changes that require regenerating the API spec or clients.

## 5. Authorization

Each endpoint and each list query: who may call it, which permission, where it is checked, how tenant and product scope is enforced on the server. Which code a denial returns.

## 6. Main flows

Sequence diagrams or steps for hard or sensitive flows. Include error and expiry branches.

## 7. Security and privacy

Assets to protect, a short threat model (attacker, attack, mitigation), sensitive data and how it is masked or deleted, what must never be logged.

## 8. UI: fitting the design

Which screens and states use which API, client-side state, use of design-system tokens and components, i18n, handling of loading, empty, error and permission states.

📱 For multi-platform apps: per-platform differences in navigation, OS permissions (camera, location, notifications) and their denial states.

## 9. Performance and scale

Expected volumes (for example 20 items, number of records), heavy queries and indexes, background jobs, limits, file sizes.

## 10. Data migration and rollout

Migrations, rollout order of the parts, feature flags, backward compatibility, how to roll back.

📱 For multi-platform apps: the minimum client version the API must serve, store release timing and review wait, and the feature flags that cover users who have not updated.

## 11. Test strategy

For each AC: which layer tests it (<!-- TODO(stack): test layers, e.g. unit / integration / API / UI / e2e -->), the data and tools needed. Follow `.claude/rules/testing.md`.

## 12. Decisions, risks, rejected alternatives

| Decision | Why | Rejected alternative and reason | Scope (Module / Platform) |
|---|---|---|---|

This is the only place a module's decisions are recorded, approved with the document. *Platform* decisions (cross-cutting, not owned by one module) are added to `.claude/decisions.md` by `implementer` in the PR that implements them.

## 13. Traceability

| PRD code | REL | Design part that satisfies it | Test |
|---|---|---|---|
| PRDXX-FR-01 | REL-1 | sections 3, 4 | AC-01 |

## 14. Open questions

| # | Question | Proposed answer | Impact | Status |
|---|---|---|---|---|

## 15. Change log

| Date | Version | Change | Source |
|---|---|---|---|
| YYYY-MM-DD | 0.1 | First draft | — |
