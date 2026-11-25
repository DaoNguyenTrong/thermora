# Worktrees

Reference, not a rule: read it before creating or working in a git worktree.

A git worktree (including an agent's `isolation: "worktree"`) has only tracked files: no `.env*`, no secret-bearing config, no `node_modules`, no generated client or typings. <!-- TODO(stack): list the gitignored files a build needs and the command that regenerates each one. --> Copy the gitignored config in before building or testing, and remove the worktree (`git worktree remove <path>`) when done.

`isolation: "worktree"` branches from `origin`'s default branch (`main`), not `dev` or the local `HEAD` — an agent there does not see `dev`'s unreleased work or unpushed local commits, so hand it the branch or the diff explicitly.

Skill runs (`subagent-driven-development`, `executing-plans`) do not create worktrees: they work on one `feature/*` branch in the current checkout (`AGENTS.md` § Superpowers Integration). In a team, each member works in their own checkout; two implementers never share one.
