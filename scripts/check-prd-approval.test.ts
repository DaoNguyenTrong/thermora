import { expect, test } from 'bun:test'
import { checkPrdApproval } from './check-prd-approval'

const prd = (status: string, version: string, rows: string[]) =>
  [
    '# PRD-99 — Trial',
    '',
    '| Field | Value |',
    '|---|---|',
    `| Status | ${status} |`,
    `| Version | ${version} |`,
    '',
    '## 14. Change log',
    '',
    '| Date | Version | Change | Source |',
    '|---|---|---|---|',
    ...rows,
    '',
  ].join('\n')

const draft = '| 2026-10-20 | 1.0 | Draft | — |'
const ba = (v: string) => `| 2026-10-21 | ${v} | Fixes from review | BA review |`
const approve = (v: string) => `| 2026-10-22 | ${v} | User approval of the PRD | user decision (PO: Jane) |`

test('approvedWithBaReviewThenApproval_passes', () =>
  expect(checkPrdApproval(prd('Approved', '1.0', [draft, ba('1.0'), approve('1.0')]))).toEqual([]))

test('approvedWithoutBaReview_fails', () =>
  expect(checkPrdApproval(prd('Approved', '1.0', [draft, approve('1.0')]))).toEqual([
    'no BA review before the approval of v1.0',
  ]))

test('contentAfterApproval_fails', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        draft,
        ba('1.0'),
        approve('1.0'),
        '| 2026-10-23 | 1.0 | Added AC-9 | SA (on behalf of user) |',
      ]),
    ),
  ).toEqual(['content change after the approval of v1.0: Added AC-9']))

test('metadataAfterApproval_passes', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        draft,
        ba('1.0'),
        approve('1.0'),
        '| 2026-10-23 | 1.0 | Filled the Plan row | metadata |',
      ]),
    ),
  ).toEqual([]))

test('notApproved_isSkipped', () => expect(checkPrdApproval(prd('In review', '1.0', [draft]))).toEqual([]))

test('approvedWithoutApprovalRow_fails', () =>
  expect(checkPrdApproval(prd('Approved', '1.0', [draft, ba('1.0')]))).toEqual(['no user-approval row for v1.0']))

test('onlyRowsOfTheCurrentVersionCount', () =>
  expect(checkPrdApproval(prd('Approved', '1.1', [draft, ba('1.0'), approve('1.0'), approve('1.1')]))).toEqual([
    'no BA review before the approval of v1.1',
  ]))

test('lastApprovalRowIsTheOneChecked', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.1', [
        approve('1.1'),
        ba('1.1'),
        '| 2026-10-23 | 1.1 | User approval (re-approved) | user decision (PO: Jane) |',
      ]),
    ),
  ).toEqual([]))

// Final review: inputs that must not pass silently.
const withHeader = (statusCell: string, rows: string[]) =>
  prd('Approved', '1.0', rows).replace('| Status | Approved |', statusCell)

test.each([
  '| Status | **Approved** |',
  '| Status | *Approved* |',
  '| Status | Approved (2026-10-22) |',
  '| Status | Approved | note |',
])('decoratedApprovedStatus(%s)_isStillChecked', (cell) =>
  expect(checkPrdApproval(withHeader(cell, [draft, approve('1.0')]))).toEqual([
    'no BA review before the approval of v1.0',
  ]),
)

test('missingStatus_fails', () =>
  expect(checkPrdApproval(withHeader('| Code | PRD99 |', [draft]))).toEqual([
    'no recognised Status (Draft, In review, Approved)',
  ]))

test('unknownStatus_fails', () =>
  expect(checkPrdApproval(withHeader('| Status | Done |', [draft]))).toEqual([
    'no recognised Status (Draft, In review, Approved)',
  ]))

test('rowNewerThanHeaderVersion_fails', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        draft,
        ba('1.0'),
        approve('1.0'),
        '| 2026-10-23 | 1.1 | Added new FR | user decision (PO: Jane) |',
      ]),
    ),
  ).toEqual(['row for v1.1 is newer than the header version v1.0']))

test('negatedBaReview_doesNotCount', () =>
  expect(
    checkPrdApproval(prd('Approved', '1.0', [draft, '| 2026-10-21 | 1.0 | x | No BA review |', approve('1.0')])),
  ).toEqual(['no BA review before the approval of v1.0']))

test('escapedPipeCannotForgeMetadata', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        draft,
        ba('1.0'),
        approve('1.0'),
        '| 2026-10-23 | 1.0 | Added BR-99 \\| metadata | user decision (PO: Jane) |',
      ]),
    ),
  ).toEqual(['content change after the approval of v1.0: Added BR-99 \\| metadata']))

test('escapedPipeInChangeText_keepsSourceColumn', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [draft, ba('1.0'), approve('1.0'), '| 2026-10-23 | 1.0 | fix `a \\| b` | metadata |']),
    ),
  ).toEqual([]))

test('rowWithWrongCellCount_fails', () =>
  expect(
    checkPrdApproval(prd('Approved', '1.0', [draft, ba('1.0'), approve('1.0'), '| 2026-10-23 | 1.0 | x |'])),
  ).toEqual(['change-log row is not | date | version | change | source |: | 2026-10-23 | 1.0 | x |']))

test('versionCellWithExtraText_fails', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [draft, ba('1.0'), approve('1.0'), '| 2026-10-23 | 1.0 (fixed) | Added AC | SA |']),
    ),
  ).toEqual(['change-log version is not N.N: 1.0 (fixed)']))

test('baReviewAsOneOfSeveralSources_counts', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        draft,
        '| 2026-10-21 | 1.0 | Fixed | SA (on behalf of user); BA review |',
        approve('1.0'),
      ]),
    ),
  ).toEqual([]))

test('versionFirstColumnOrder_isAlsoAccepted', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [
        '| 1.0 | 2026-10-20 | Draft | — |',
        '| 1.0 | 2026-10-21 | Fixes from review | BA review |',
        '| 1.0 | 2026-10-22 | User approval of the PRD | user decision (PO: Jane) |',
      ]),
    ),
  ).toEqual([]))

test('userDecisionWithoutApprovedChange_isNotAnApproval', () =>
  expect(
    checkPrdApproval(
      prd('Approved', '1.0', [draft, ba('1.0'), '| 2026-10-22 | 1.0 | Added AC-1 | user decision (PO: Jane) |']),
    ),
  ).toEqual(['no user-approval row for v1.0']))
