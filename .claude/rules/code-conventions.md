---
# TODO(stack): the source paths this rule applies to.
paths:
  - "src/**"
---

# Code Conventions

Patterns every change follows that lint cannot enforce: construction, naming, errors, async. Anything a linter, formatter or compiler setting can enforce belongs in its config, not here.

## Construction

<!-- TODO(stack): how entities/models are created and validated (e.g. only through a static factory; validation in one place). -->

## Naming

<!-- TODO(stack): file, type, function and test naming. -->

## Errors

<!-- TODO(stack): error types, what is thrown vs returned, how errors reach the API and the UI. -->

## Async and concurrency

<!-- TODO(stack): cancellation, transactions, locking. Locks and concurrency on shared data are tier 2 (`docs/process/lifecycle.md` § Risk Tiers). -->
