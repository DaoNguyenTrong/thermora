#!/usr/bin/env bash
# Applies branch protection to main and dev (CONTRIBUTING.md § Repository Setup). Run once per repo by an admin.
# Usage: scripts/setup-branch-protection.sh OWNER/REPO
set -euo pipefail

repo=${1:?usage: scripts/setup-branch-protection.sh OWNER/REPO}
# Check names must match .github/workflows (ci.yml calls test.yml as job "test").
checks='["changes", "test / scripts", "test / app"]'

for branch in main dev; do
  # Admins may push to dev directly (.claude/decisions.md); main binds them too.
  enforce_admins=true
  [ "$branch" = dev ] && enforce_admins=false
  echo "Protecting $repo:$branch"
  payload=$(printf '{
  "required_status_checks": { "strict": true, "contexts": %s },
  "enforce_admins": %s,
  "required_pull_request_reviews": { "require_code_owner_reviews": false, "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}' "$checks" "$enforce_admins")
  printf '%s' "$payload" | gh api -X PUT "repos/$repo/branches/$branch/protection" --input - >/dev/null
done
echo "Done. Verify: gh api repos/$repo/branches/main/protection"
