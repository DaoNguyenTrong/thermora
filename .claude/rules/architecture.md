---
# TODO(stack): the source paths this rule applies to. Claude loads the file only when a session touches them.
paths:
  - "src/**"
---

# Architecture

Which layers exist, which direction dependencies point, and the architecture tests that enforce it. A rule here that no test enforces is a candidate for automation (`docs/process/lifecycle.md` § Recurring Errors and End-of-Module Retro).

## Layers

<!-- TODO(stack): one row per layer or module boundary. Examples: Domain → Application → Infrastructure → API; or app/ (shared) → platform modules → native code. -->

| Layer | May depend on | Must never depend on |
|---|---|---|

## Enforcement

<!-- TODO(stack): the architecture-test tool and where its tests live (ArchUnit, NetArchTest, dependency-cruiser, eslint-plugin-boundaries, import_lint, Konsist, ...). -->

## Critical invariants

The one to three rules that must never break are listed in `AGENTS.md` § Critical Invariants. Each one names the test that enforces it here.
