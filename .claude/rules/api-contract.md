---
# TODO(stack): the API, contract and generated-client paths.
paths:
  - "shared/contract/**"
---

# API Contract

Where the API contract lives, how clients are generated from it, and what to do when an endpoint changes.

## Source of truth

<!-- TODO(stack): the committed spec (OpenAPI, GraphQL schema, proto) and the command that exports it from the code. -->

## Generated clients

<!-- TODO(stack): the generator per client (TypeScript, Dart, Kotlin, Swift) and the generated paths (gitignored or committed). -->

## Changing an endpoint

- Re-export the spec in the same PR. CI fails when the committed spec differs from the code (drift check in `scripts/test-gate.sh` and `.github/workflows/test.yml`).
- A breaking change needs a new version or a compatibility window for clients that have not updated yet, recorded in §4 and §10 of the module's technical design.
