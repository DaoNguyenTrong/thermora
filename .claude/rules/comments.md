---
# TODO(stack): add the source directories of the project.
paths:
  - "scripts/**"
  - "src/**"
---

# Code Comments

Enforced by `scripts/check-comments.ts` (Lefthook pre-commit, CI `test / scripts`, `scripts/test-gate.sh`). Applies to every tracked source file whose extension is in the script's `SOURCE` list, except generated code (the script's `GENERATED` list) and `docs/`.

## When to write one

Default to no comment. Write one only for a _why_ the code can't show:

- a constraint that isn't visible at the call site (`// Must match the token TTL in authentication.md`)
- a workaround for an external bug or tool behaviour — link the issue or doc
- a security or contract invariant (`// Never log the raw token`)

Doc comments (`///`, JSDoc, KDoc, docstrings) only on a public API whose contract the signature doesn't make clear — what it throws, what `null` means, what it guarantees. If doc comments are exported into the API contract, editing one is a contract change (`api-contract.md`).

## What never goes in a comment

| Content | Where it belongs |
| --- | --- |
| Change history — "was X, now Y", "originally", "promoted from" | commit message — delete it |
| What the next line does, or values visible in the code | nowhere — delete it |
| Task or conversation context — "per user request", "as discussed" | PR description |
| A system-design reason with a trade-off or rejected alternative | `docs/tech/` §12, or `.claude/decisions.md` if platform-wide |
| A long how-it-works explanation | `docs/`, linked from a one-line comment |

## Length: at most 3 lines of at most 120 characters

A comment block — consecutive comment-only lines, ended by a blank or code line — holds at most **3 lines of text**, and no counted comment line is wider than **120 characters** (indentation included), so three lines can't grow into a paragraph. Not counted: delimiter-only lines (`/**`, `*/`, `<!--`, `-->`), doc lines that are only tags, and tool directives (`eslint-disable`, `@ts-expect-error`, `prettier-ignore`, `#pragma`, `noqa`, …). Splitting one explanation into several 3-line blocks with blank lines between them breaks the rule's intent even though the checker passes.

The checker also warns (doesn't fail) on change-history wording — `originally`, `previously`, `no longer`, `per user`, … Rephrase as the current constraint, or delete.

## Editing code that has a comment

- Rewrite or delete the comment your change invalidates — never append a correction ("…but now it's X").
- Don't add comments to lines you didn't otherwise change.
- Match the surrounding file's comment density.
