---
# TODO(stack): the auth, session and token-storage paths.
paths:
  - "src/**/auth/**"
---

# Authentication and Session

Every path that issues, reads, refreshes or revokes a token, cookie or session, and the fail-closed rules. `appsec` reads this file on every security review. Changes here are tier 2 and a human-gated area (`docs/process/lifecycle.md` § Gates Between Stages).

## Identities

<!-- TODO(stack): what actually identifies a user and a session. Never treat a cookie alone as the session identity. -->

## Token-issuing paths

<!-- TODO(stack): every function or endpoint that issues or refreshes a credential, with its file path. appsec checks each one. -->

## Storage on clients

<!-- TODO(stack): where each client keeps credentials: Keychain / Keystore / secure storage on mobile, httpOnly cookie on web. Plain storage is never allowed. -->

## Fail-closed rules

- A missing or unreadable permission, tenant or token denies. It never falls back to allow.
- Secrets never appear in logs, URLs, error messages or build artifacts.
