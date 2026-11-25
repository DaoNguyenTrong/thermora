---
# TODO(stack): the source and test paths this rule applies to.
paths:
  - "src/**"
  - "tests/**"
---

# Testing Standards

What to test, at which layer, how to write it, and the test infrastructure that keeps the suite fast and isolated. Commands to run the tests: `commands.md` § Tests.

## When a change needs a test

A change is not done until its tests are in the same PR. Pick the layer by what changed:

| Change | Test it in | Must cover |
|---|---|---|
| <!-- TODO(stack) --> | | |

<!-- TODO(stack): one row per kind of change and per platform. Examples:
- domain rule → unit test: every validation branch, valid and invalid
- service → unit test: the return value and the side effects, every error path
- query, repository, migration → integration test against the real database, never an in-memory fake
- endpoint → HTTP test: happy path, validation error, 401 unauthenticated, 403 forbidden
- component / widget → component test with HTTP mocked
- native module → platform test
- user flow → e2e in a browser or on a device -->

**Bug fix:** write the regression test first and watch it fail for the reported reason, then fix. A fix without a test that would have caught the bug states why in the PR.

**Not required on their own:** generated code, re-export files, plain configuration objects.

## How to write a test

<!-- TODO(stack): framework, arrange/act/assert style, fixtures and builders, mocking policy. -->

## Test infrastructure

<!-- TODO(stack): test containers, seeded accounts, HTTP mocks, pinned emulator/simulator versions. -->

## End-to-end

Scenarios are named `P-nn PRDxx-US-nn <what the user does>` (`docs/process/lifecycle.md` § Traceability). Selectors use test IDs, never visible text or layout structure. `qa-app` writes them from the real routes, screens and locale files; `sdet` proves a flaky-test fix by repeated runs with retries off.

<!-- TODO(stack): the e2e tool (Playwright, Maestro, Detox, Patrol, XCUITest/Espresso) and where it runs (every PR, nightly, or release/* only; results in verify-output/). -->

## Coverage

Reported in CI, not gated. <!-- TODO(stack): the coverage tool and where the report goes. -->

## Flaky tests

Never fix a flaky test with a fixed sleep or by raising retries. Find the race, fix it, and have `sdet` confirm about 10 consecutive green runs with retries off.
