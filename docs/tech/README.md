# Technical Design

One document per module, written from `_template.md` by the `tech-lead` agent, after the module's PRD and release plan are *Approved* and the UI design of the release being designed is approved. This document answers "which architecture"; breaking it into small tasks belongs to the implementation plan (`docs/superpowers/plans/`).

## Process

The document grows release by release (`docs/process/lifecycle.md` § Architecture runway): version 1.0 holds the common part for the whole module plus `REL-1`; each later release is a minor version (1.1, 1.2, ...). The steps below apply to both.

1. **Draft**: `tech-lead` writes from the PRD, the UI design and existing code; it returns open questions, questions for the PRD and decisions to record.
2. **Business questions** go back to `product-manager` to edit the PRD, not decided here.
3. **Security review**: the common part, or a release, that touches a security area (`docs/process/lifecycle.md` § Architecture runway) goes through `appsec` before approval.
4. **Approval**: when no open questions remain `tech-lead` sets the status to *In review*; the Tech lead approves each release (plus the Security owner when that release or the common part touches a security area); the decisions in §12 are approved with the document, no separate approval. The main session commits the approved version to the module's docs branch, on the branch that `docs/process/lifecycle.md` § 5. Committing Documents names for that release. Doc fixes caused by a major deviation during implementation (`docs/process/lifecycle.md` § 4. Design Deviations During Implementation) go in the same PR as the code.
5. **Sprint plan**: `writing-plans` breaks the committed stories into tasks, referring to the PRD's FR/AC codes and the sections of this document.

Order exception: a security-sensitive module may write its tech doc in parallel with UI design when the PO and Tech lead allow it and the scope of the exception is recorded in the module's document.

Status is tracked per release, in the *Status per release* table at the top of the document. Adding sections for a later release, or editing an approved section of one release, returns only that release's row to *In review*. Editing the common part is a major change: the major version goes up and every row returns to *In review*.

## Known constraints

`tech-lead` checks the code and `.claude/rules/` at the start of each module and records constraints and how they are resolved in the module's document.

<!-- TODO(stack): constraints inherited from the chosen stack or existing platform (e.g. framework limits, legacy auth, hosting restrictions) -->

| Item | Current constraint | Why it conflicts | Module |
|---|---|---|---|

## Catalogue

No module tech docs yet. *Status per release* reads, for example, `Common ✓, REL-1 ✓, REL-2 review`.

| Code | Module | PRD | Status per release | Version | appsec |
|---|---|---|---|---|---|
