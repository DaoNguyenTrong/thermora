# PRD-XX — <Module name>

| Item | Value |
|---|---|
| Code | `PRDXX` (prefix for every code in this document) |
| Status | Draft / In review / Approved |
| Version | 0.1 |
| Approver | PO: <name> |
| Updated | YYYY-MM-DD |
| Depends on | PRD-00, ... |
| Design | <canvas link and board names, once designed> |
| Plan | <path of the implementation plan, once it exists> |

## 1. Context and problem

Where it hurts today, for whom, and what the evidence is. One or two short paragraphs.

## 2. Goals, non-goals, anti-goals

- **Goals**: outcomes the module must deliver.
- **Non-goals**: what is deliberately not done in this version (and where it will be done).
- **Anti-goals**: outcomes counted as failure even if every requirement is met.
- **Measuring success**: how we know it worked; shared metrics refer to PRD-00 §2; the definition and calculation live in the PRD of the module that owns the metric in the catalogue.

## 3. Users and roles

Which personas from `00-personas.md` use this module (give the `P-nn` codes, mark the module's primary persona), which roles from PRD-00 § Roles they hold, and what is specific to this module. Do not redefine personas or roles.

## 4. User stories

The *Persona* column is required and holds one or more `P-nn` codes defined in `00-personas.md` (`scripts/check-personas.ts` checks it).

| Code | Persona | As a... | I want... | So that... | Priority |
|---|---|---|---|---|---|
| PRDXX-US-01 | P-01 | | | | Must / Should / Could |

## 5. Functional requirements

| Code | Requirement | Story | Priority |
|---|---|---|---|
| PRDXX-FR-01 | The system shall ... | US-01 | Must / Should / Could |

## 6. Business rules

| Code | Rule | Applies to |
|---|---|---|
| PRDXX-BR-01 | | FR-01 |

## 7. Acceptance criteria

Each criterion is an observable behaviour. Cover the standard case, empty, error, limits and no permission. Every FR has at least one criterion.

| Code | Requirement | Given | When | Then |
|---|---|---|---|---|
| PRDXX-AC-01 | FR-01 | | | |

## 8. States and edge cases

Empty states, limits and large volumes (for example 20 items, very long content), concurrent edits, access that expires or is revoked, related records deleted or deactivated.

## 9. Data (business level)

Fields the user sees or enters: name, meaning, required, limits, who may edit. Do not describe storage.

| Field | Meaning | Required | Limits | Who may edit |
|---|---|---|---|---|

## 10. Notifications and events

| Event | Who receives it | Channel | Notes |
|---|---|---|---|

## 11. Non-functional requirements

Security and privacy, performance expectations, accessibility, languages, traceability - stated from the product's point of view.

## 12. Dependencies

Other PRDs, existing platform features, external services.

### Handed to other PRDs

Rules or edge cases belonging to another module, found while writing this PRD. The target PRD specifies the detail; here they are only noted so they are not forgotten.

| Target PRD | What must be specified | Arises from |
|---|---|---|
| PRDXX | | |

## 13. Open questions

Only what a human must decide: it changes what is built, touches security, data isolation, permissions, or costs significant effort.

| # | Question | Proposed answer | Why it matters | Status |
|---|---|---|---|---|
| 1 | | | | Open / Answered (date) |

### Proposed defaults

Points `product-manager` wrote into the PRD as proposals, including priorities. The PO reviews the whole table once at approval; a rejected item becomes an open question.

| # | Default | Codes affected | Reason |
|---|---|---|---|
| D1 | | | |

## 14. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`. See `docs/prd/README.md` § Parsed by scripts.

| Date | Version | Change | Source |
|---|---|---|---|
| YYYY-MM-DD | 0.1 | First draft | — |
