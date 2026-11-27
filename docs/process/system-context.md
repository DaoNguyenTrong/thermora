# System Context

This file holds the context that `solution-architect` and `tech-lead` use to pick solutions of the right size. Every value starts as *Undetermined*; filling it in is the work of the first module.

A **[User]** value is confirmed by a human approver; a **[Proposed]** value is a stated assumption awaiting review. *Undetermined* is not an approved assumption: work independently with the data at hand, and send the questions that affect a decision through `solution-architect` per `AGENTS.md`. The main session fills this file and the PO and Tech lead approve it.

## Users

Product, user groups, roles and target devices: *Undetermined*. User groups and devices are fixed in `docs/prd/00-personas.md` (`lifecycle.md` § Personas) before any PRD; once that file is approved, this section only points to it. Supported languages: *Undetermined*.

## Scale

Number of tenants or organizations, accounts, concurrent users, traffic and data growth: *Undetermined*.

## Deployment and operations

Hosting, number of servers, cache and storage providers, availability target, backup, RPO and RTO: *Undetermined*.

## Performance

Response-time targets and storage budgets: *Undetermined*.

## Cost

Budget and approved paid services: *Undetermined*. Money, licences and paid services need a human decision per `.claude/agents/solution-architect.md`.

CI runner budget (minutes per month, runner type, paid or self-hosted): *Undetermined*.

## Data and privacy

Data classification, retention, and the personal-data law applicable to the product (e.g. GDPR, Vietnam Decree 13/2023): *Undetermined*.

## UI design

Design rules from `.claude/agents/ui-designer.md` apply. Canvas: static HTML in `docs/design/` (PO and Design lead, 2026-11-27). The design system (`docs/design/system/`) is not started; screen design waits until it is *Approved* (`lifecycle.md` § Design system). A PRD's *Design* row gets the link when that release's boards are approved.

## Multi-platform (only if the product ships native or desktop apps)

| Item | Value |
|---|---|
| Minimum OS versions per platform | *Undetermined* |
| Stores and distribution channels (e.g. App Store, Play Store, internal beta) | *Undetermined* |
| Forced-update policy | *Undetermined* |
| Support window for old clients (how long the API serves old versions) | *Undetermined* |

## History

| Date | Change | Source |
|---|---|---|
| 2026-11-27 | Design system is a gate before screen design. Canvas stays HTML in `docs/design/` | user decision (PO, Design lead and Tech lead: DaoNguyenTrong) |
| 2026-11-27 | UI canvas recorded at `docs/design/` | user decision (PO and Design lead: DaoNguyenTrong) |
| 2026-11-16 | Created the empty context skeleton from the AI-BASE template; no product requirements confirmed | Template |
