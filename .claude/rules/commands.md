---
# TODO(stack): add the source paths whose commands are listed here.
paths:
  - "scripts/**"
  - "src/**"
---

# Build, Run and Test Commands

Every build, run, test, codegen and migration command. Agents never guess a command: if it is not here, ask.

## Root tooling

```bash
bun install                                   # installs Lefthook git hooks (prepare: lefthook install)
bun test scripts/                             # tests of the check scripts and the Bash guard
scripts/test-gate.sh                          # full local gate: the same steps as CI, minus coverage
bun scripts/risk-tier.ts --base origin/dev    # risk tier of the current change
bun scripts/check-comments.ts                 # comment-length check over the tracked tree
bun scripts/check-personas.ts                 # personas Approved before any module PRD
bun scripts/check-prd-approval.ts             # review-before-approval order in PRD change logs
bun scripts/check-release-plan.ts             # release plans match their PRD; sprint plans have an approved one
```

## Build

<!-- TODO(stack): build commands per layer and platform. -->

## Run

<!-- TODO(stack): how to start the app and its dependencies locally. -->

## Tests

<!-- TODO(stack): unit, integration and e2e commands per layer and platform. -->

## Codegen and migrations

<!-- TODO(stack): API contract export, client generation, database migrations. -->

## Parallel builds

<!-- TODO(stack): whether two subagents may build at once. Some toolchains share an output directory and must build one at a time. -->
