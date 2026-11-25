#!/usr/bin/env bash
# Same checks as .github/workflows/test.yml, minus coverage. Change both together.
# This is the gate /git-release runs before it merges and tags, and the one to run before pushing.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

skipped=()
# run_if <name> <required-tool> <command...>: runs the command when the tool exists, otherwise
# records the step so the SKIPPED list below shows it (CI must cover what a machine can't run).
run_if() {
  local name=$1 tool=$2
  shift 2
  if command -v "$tool" >/dev/null; then
    echo "> $name"
    "$@"
  else
    skipped+=("$name (no $tool)")
  fi
}

# Always-run part: the process scripts.
bun test scripts/
bun scripts/check-comments.ts
bun scripts/check-personas.ts
bun scripts/check-release-plan.ts
prds=(docs/prd/[0-9]*.md)
[[ -e "${prds[0]}" ]] && bun scripts/check-prd-approval.ts "${prds[@]}"

# TODO(stack): add this project's checks, one run_if per part, for example:
# run_if api      dotnet   api/scripts/test.sh                 # or go test ./..., pytest ...
# run_if contract bun      scripts/check-contract-drift.sh     # export the spec and compare with the committed one
# run_if app      flutter  bash -c 'cd app && flutter analyze && flutter test'
# run_if android  java     bash -c 'cd app && flutter build apk --debug'
# if [[ "$(uname)" == Darwin ]]; then
#   run_if ios xcodebuild bash -c 'cd app && flutter build ios --no-codesign'
# else
#   skipped+=("ios (not macOS)")
# fi

if ((${#skipped[@]})); then
  printf 'test-gate: SKIPPED — CI must cover these:\n'
  printf '  - %s\n' "${skipped[@]}"
fi
