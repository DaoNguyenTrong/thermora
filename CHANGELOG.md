# Changelog

All notable changes to this project are documented here. This file is compiled by `release-kit:git-release` from the `## Changelog` section of each merged PR; do not edit it by hand.

## [Unreleased]

## [v1.0.0] - 2026-11-25

### Added

- A stack-agnostic workflow template for teams: lifecycle, role agents, approval gates, git guards, check scripts, CI and release configuration.
- Release plans cut a module into demonstrable releases, built in half-month sprints with ready and done definitions. (#3)
- A release plan check runs in the test gate and CI. (#3)
- Projects can optionally track stories in Plane, kept in step with their pull requests. (#3)

### Changed

- Technical designs were changed to be approved release by release instead of as one document. (#3)

### Removed

- Code-owner review was dropped; human-gated areas are merged by their human approver. (#1)
