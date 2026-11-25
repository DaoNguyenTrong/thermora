# Release Plans

One release plan per module, `PRDXX-<name>.md`, written from `_template.md` once the module's PRD is *Approved*. It cuts the PRD's stories into demonstrable releases (`PRDXX-REL-n`), in build order, with dependencies and a T-shirt size. The slicing and estimation rules are in `docs/process/lifecycle.md` § Release plan.

## Process

1. **Draft**: `product-manager` writes the story map and cuts the releases.
2. **Size**: `tech-lead` fills the *Size* column and adds one change-log row with source `tech-lead`; it changes neither status nor version. Every other edit of a release plan is `product-manager`'s, including that row when `tech-lead` only returned the sizes.
3. **Review**: `business-analyst` reviews.
4. **Approval**: the PO approves, including the order of the releases. The review and approval rows of the change log follow the same order rule as a PRD (`docs/prd/README.md` § Process, step 4).

Editing a release plan (reordering, moving a story) raises its own version and the PO approves it again; the PRD does **not** return to *In review*. Adding or changing behaviour still means editing the PRD.

## Automated check

`scripts/check-release-plan.ts` runs in `scripts/test-gate.sh` and CI. It compares each release plan with its PRD (story and AC codes, overlapping AC sets, sizes, and, once both are *Approved*, Must stories left out), and blocks a sprint plan whose release plan or PRD is not approved. It parses the metadata rows `PRD`, `Status` and `Version`, the column order of the release table and the change-log table, so do not rename or reorder them.

## Catalogue

No release plans yet.

| Code | PRD | Status | Version | REL done |
|---|---|---|---|---|
