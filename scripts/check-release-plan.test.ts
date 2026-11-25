import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { checkReleasePlans, type ReleasePlanInput } from './check-release-plan'

const APPROVED_LOG = [
  '| 2026-11-25 | 1.0 | BA review | BA review |',
  '| 2026-11-25 | 1.0 | User approval | user decision (PO: Sam) |',
]

const header = (status: string, extra: string[]) => [
  '| Item | Value |',
  '|---|---|',
  ...extra,
  `| Status | ${status} |`,
  '| Version | 1.0 |',
  '',
]

const PRD_ROWS = [
  '| PRD01-US-01 | P-01 | team lead | view | I know | Must |',
  '| PRD01-US-02 | P-01 | team lead | edit | it is right | Must |',
  '| PRD01-US-03 | P-01 | team lead | export | I can send it | Could |',
  '| PRD01-FR-01 | The system shall show | US-01 | Must |',
  '| PRD01-FR-02 | The system shall edit | US-02 | Must |',
  '| PRD01-FR-03 | The system shall export | US-03 | Could |',
  '| PRD01-AC-01 | FR-01 | a | b | c |',
  '| PRD01-AC-02 | FR-01 | a | b | c |',
  '| PRD01-AC-03 | FR-02 | a | b | c |',
  '| PRD01-AC-04 | FR-03 | a | b | c |',
]

const prd = (status: string, rows: string[] = PRD_ROWS) =>
  ['# PRD-01 — Sample', '', ...header(status, ['| Code | `PRD01` (prefix) |']), ...rows, ''].join('\n')

const rel = (n: number, stories: string, size = 'M') =>
  `| PRD01-REL-${n} | Can view | ${stories} | P-01 | — | ${size} |`

const releasePlan = (status: string, rels: string[], changeLog: string[] = APPROVED_LOG, code = 'PRD01') =>
  [
    `# ${code}-REL — Sample release plan`,
    '',
    ...header(status, [`| PRD | \`${code}\` v1.0 |`]),
    '| REL | Goal | Story | Persona | Depends on | Size |',
    '|---|---|---|---|---|---|',
    ...rels,
    '',
    '| Date | Version | Change | Source |',
    '|---|---|---|---|',
    ...changeLog,
    '',
  ].join('\n')

const plan = (...text: string[]) => ['# Plan', '', ...text, ''].join('\n')

const FULL = [rel(1, 'PRD01-US-01; PRD01-US-02')]
const LINE = '**Release plan:** `docs/backlog/PRD01-x.md`'
const SPRINT = '2026-11-25-x-SPR-2026-12-S1.md'

const check = (input: Partial<ReleasePlanInput>) =>
  checkReleasePlans({ prds: { '01-x.md': prd('Approved') }, backlog: {}, plans: {}, ...input })

const checkRels = (rels: string[], status = 'Approved') =>
  check({ backlog: { 'PRD01-x.md': releasePlan(status, rels) } })

const checkPlan = (text: string, status = 'Approved', name = 'p.md') =>
  check({ backlog: { 'PRD01-x.md': releasePlan(status, FULL) }, plans: { [name]: text } })

const inBacklog = (...messages: string[]) => messages.map((m) => `PRD01-x.md: ${m}`)

test('emptyInput_passes', () => expect(checkReleasePlans({ prds: {}, backlog: {}, plans: {} })).toEqual([]))

test('coveredApprovedPlan_passes', () => expect(checkRels(FULL)).toEqual([]))

test('storyCellVariants_normalise', () =>
  expect(checkRels([rel(1, ' PRD01-US-01 (PRD01-AC-01) '), rel(2, ' PRD01-US-01 (AC-02);PRD01-US-02 ;')])).toEqual([]))

test('unknownPrd_fails', () =>
  expect(check({ backlog: { 'PRD09-x.md': releasePlan('Draft', [], [], 'PRD09') } })).toEqual([
    'PRD09-x.md: PRD PRD09 not found',
  ]))

test('foreignRelPrefix_fails', () =>
  expect(checkRels([...FULL, '| PRD02-REL-1 | x | PRD01-US-03 | P-01 | — | M |'])).toEqual(
    inBacklog('PRD02-REL-1 does not belong to PRD01'),
  ))

test('foreignStoryPrefix_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01; PRD01-US-02; PRD02-US-01')])).toEqual(
    inBacklog('PRD01-REL-1 story PRD02-US-01 does not belong to PRD01'),
  ))

test('unknownStory_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01; PRD01-US-02; PRD01-US-09')])).toEqual(
    inBacklog('PRD01-REL-1 unknown story PRD01-US-09'),
  ))

test('unreadableStoryEntry_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01; PRD01-US-02; US-03')])).toEqual(inBacklog('PRD01-REL-1 unknown story US-03')))

test('foreignAc_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-02 (AC-01)')], 'Draft')).toEqual(
    inBacklog('PRD01-REL-1 PRD01-US-02 lists PRD01-AC-01, which is not an AC of that story'),
  ))

test('badSize_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01; PRD01-US-02', 'XXL')])).toEqual(
    inBacklog('PRD01-REL-1 size must be S, M, L or XL: XXL'),
  ))

test('duplicateRel_fails', () =>
  expect(checkRels([...FULL, rel(1, 'PRD01-US-03')])).toEqual(inBacklog('duplicate PRD01-REL-1')))

test('wholeTwice_fails', () =>
  expect(checkRels([...FULL, rel(2, 'PRD01-US-01')])).toEqual(
    inBacklog('PRD01-US-01 is planned whole in PRD01-REL-1 and again in PRD01-REL-2'),
  ))

test('partialThenWhole_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01 (AC-01)'), rel(2, 'PRD01-US-01; PRD01-US-02')])).toEqual(
    inBacklog('PRD01-US-01 is planned whole in PRD01-REL-2 and again in PRD01-REL-1'),
  ))

test('overlappingAc_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01 (AC-01, AC-02); PRD01-US-02'), rel(2, 'PRD01-US-01 (AC-02)')])).toEqual(
    inBacklog('PRD01-US-01 PRD01-AC-02 is in both PRD01-REL-1 and PRD01-REL-2'),
  ))

test('mustStoryMissing_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01')])).toEqual(inBacklog('Must story PRD01-US-02 is in no REL')))

test('splitMustStoryUncovered_fails', () =>
  expect(checkRels([rel(1, 'PRD01-US-01 (AC-01); PRD01-US-02')])).toEqual(
    inBacklog('Must story PRD01-US-01 is split but PRD01-AC-02 are in no REL'),
  ))

test('couldStoryMissing_passes', () => expect(checkRels(FULL)).toEqual([]))

test('draftReleasePlan_skipsCoverage', () => expect(checkRels([rel(1, 'PRD01-US-01')], 'Draft')).toEqual([]))

test('prdInReview_skipsCoverage', () =>
  expect(
    check({
      prds: { '01-x.md': prd('In review') },
      backlog: { 'PRD01-x.md': releasePlan('Approved', [rel(1, 'PRD01-US-01')]) },
    }),
  ).toEqual([]))

test('approvedWithoutUserApprovalRow_fails', () =>
  expect(check({ backlog: { 'PRD01-x.md': releasePlan('Approved', FULL, [APPROVED_LOG[0]]) } })).toEqual(
    inBacklog('no user-approval row for v1.0'),
  ))

test('readmeAndTemplate_areIgnored', () =>
  expect(check({ backlog: { 'README.md': 'x', '_template.md': releasePlan('Draft', [], [], 'PRD09') } })).toEqual([]))

test('planWithoutPrdIds_isIgnored', () => expect(checkPlan(plan('Fix the layout.'))).toEqual([]))

test('idsOnlyInCode_areIgnored', () =>
  expect(
    checkPlan(
      plan(
        'For example `PRD01-US-01` and ``PRD01-REL-9``.',
        '````md',
        '```',
        'PRD01-AC-01',
        '```',
        'PRD01-FR-01',
        '````',
        '  ~~~',
        '  PRD01-US-02',
        '  ~~~',
      ),
    ),
  ).toEqual([]))

test('idAfterClosedFence_isDetected', () =>
  expect(checkPlan(plan('```', 'x', '```', 'Do PRD01-US-01.'))).toEqual([
    'p.md: mentions PRD ids but has no **Release plan:** line',
  ]))

test('lineStartingWithTripleBacktickSpan_doesNotOpenAFence', () =>
  expect(checkPlan(plan('```x``` is an example.', 'Do PRD01-US-01.'))).toEqual([
    'p.md: mentions PRD ids but has no **Release plan:** line',
  ]))

test('crlfFence_isIgnored', () => expect(checkPlan('```\r\nPRD01-US-01\r\n```\r\n')).toEqual([]))

test('planWithoutReleasePlanLine_fails', () =>
  expect(checkPlan(plan('Do PRD01-US-01.', `- ${LINE}`))).toEqual([
    'p.md: mentions PRD ids but has no **Release plan:** line',
  ]))

test('sprintNamedPlanWithoutLine_fails', () =>
  expect(checkPlan(plan('Sprint goal.'), 'Approved', SPRINT)).toEqual([
    `${SPRINT}: sprint plan has no **Release plan:** line`,
  ]))

test('planWithMissingReleasePlan_fails', () =>
  expect(checkPlan(plan('**Release plan:** docs/backlog/PRD02-y.md'))).toEqual([
    'p.md: release plan docs/backlog/PRD02-y.md not found',
  ]))

test('planWithDraftReleasePlan_fails', () =>
  expect(checkPlan(plan(LINE), 'Draft')).toEqual(['p.md: release plan docs/backlog/PRD01-x.md is not Approved']))

test('planWithUnapprovedPrd_fails', () =>
  expect(
    check({
      prds: { '01-x.md': prd('In review') },
      backlog: { 'PRD01-x.md': releasePlan('Approved', FULL) },
      plans: { 'p.md': plan(LINE) },
    }),
  ).toEqual(['p.md: PRD PRD01 is not Approved']))

test('planWithUnknownRel_fails', () =>
  expect(checkPlan(plan(LINE, 'Do `PRD01-REL-9`, PRD01-REL-9 and PRD01-REL-1.'))).toEqual([
    'p.md: unknown PRD01-REL-9',
  ]))

test('validSprintPlan_passes', () =>
  expect(checkPlan(plan(LINE, 'PRD01-REL-1: PRD01-US-01 (AC-01).'), 'Approved', SPRINT)).toEqual([]))

const OTHER_ROWS = PRD_ROWS.map((r) => r.replaceAll('PRD01', 'PRD02'))
const OTHER_PRD = ['# PRD-02', '', ...header('Approved', ['| Code | `PRD02` |']), ...OTHER_ROWS, ''].join('\n')
const otherReleasePlan = (status: string) =>
  releasePlan(status, ['| PRD02-REL-1 | x | PRD02-US-01; PRD02-US-02 | P-01 | — | M |'], APPROVED_LOG, 'PRD02')

const checkTwoModules = (text: string, other?: string, otherPrd = OTHER_PRD) =>
  check({
    prds: { '01-x.md': prd('Approved'), '02-y.md': otherPrd },
    backlog: {
      'PRD01-x.md': releasePlan('Approved', FULL),
      ...(other === undefined ? {} : { 'PRD02-y.md': otherReleasePlan(other) }),
    },
    plans: { 'p.md': plan(LINE, text) },
  })

test('planNamingModuleWithoutReleasePlan_fails', () =>
  expect(checkTwoModules('Do PRD02-US-01, PRD02-AC-01.')).toEqual(['p.md: no release plan for PRD02']))

test('planNamingOtherModuleInInlineCode_fails', () =>
  expect(checkTwoModules('Do `PRD02-FR-01`.')).toEqual(['p.md: no release plan for PRD02']))

test('planNamingOtherModuleInFence_passes', () =>
  expect(checkTwoModules(['```', 'PRD02-US-01 PRD02-REL-9', '```'].join('\n'))).toEqual([]))

test('planNamingModuleWithDraftReleasePlan_fails', () =>
  expect(checkTwoModules('PRD02-US-01', 'Draft')).toEqual([
    'p.md: release plan docs/backlog/PRD02-y.md is not Approved',
  ]))

test('planNamingModuleWithUnapprovedPrd_fails', () =>
  expect(checkTwoModules('PRD02-US-01', 'Approved', OTHER_PRD.replace('| Approved |', '| In review |'))).toEqual([
    'p.md: PRD PRD02 is not Approved',
  ]))

test('planNamingTwoApprovedModules_passes', () =>
  expect(checkTwoModules('PRD01-US-01, PRD02-REL-1.', 'Approved')).toEqual([]))

test('releasePlanLineInFence_isIgnored', () =>
  expect(checkPlan(plan('```', LINE, '```', 'Do PRD01-US-01.'))).toEqual([
    'p.md: mentions PRD ids but has no **Release plan:** line',
  ]))

const checkWithNotes = (...notes: string[]) =>
  check({ backlog: { 'PRD01-x.md': [releasePlan('Draft', FULL), ...notes].join('\n') } })

test('unknownIdsOutsideRelRows_fail', () =>
  expect(checkWithNotes('- PRD01-US-09 — x', '- `PRD01-AC-09`, US-08, (AC-07)', '- PRD01-US-09 again')).toEqual(
    inBacklog(
      'PRD01-US-09 is not in PRD01',
      'PRD01-AC-09 is not in PRD01',
      'PRD01-US-08 is not in PRD01',
      'PRD01-AC-07 is not in PRD01',
    ),
  ))

test('knownIdsOutsideRelRows_pass', () =>
  expect(checkWithNotes('- PRD01-US-03, US-01, AC-04, PRD01-AC-01; PRDXX-US-nn; P-01.')).toEqual([]))

test('mistypedBacklogStatus_fails', () =>
  expect(checkRels(FULL, 'Aproved')).toEqual(inBacklog('no recognised Status (Draft, In review, Approved)')))

test('twoReleasePlansForOnePrd_fail', () =>
  expect(
    check({
      backlog: { 'PRD01-x.md': releasePlan('Approved', FULL), 'PRD01-y.md': releasePlan('Draft', FULL) },
    }),
  ).toEqual(['PRD01-y.md: PRD01 already has a release plan: PRD01-x.md']))

test('fileNamePrefixDiffersFromHeader_fails', () =>
  expect(check({ backlog: { 'PRD02-x.md': releasePlan('Approved', FULL) } })).toEqual([
    'PRD02-x.md: file name prefix PRD02 differs from header PRD PRD01',
  ]))

// An approved PRD keeps a dropped item in its table, marked `~~Removed~~` (product-manager.md rule 3).
const withRemoved = (row: string) => ({ '01-x.md': prd('Approved', [...PRD_ROWS, row]) })

test.each([
  '| PRD01-US-04 | P-01 | ~~Removed~~ 2026-11-25 | | | Must |',
  '| ~~PRD01-US-04~~ | P-01 | team lead | print | I have paper | Must |',
])('removedStory_needsNoRel_andStaysKnown: %s', (row) =>
  expect(
    check({
      prds: withRemoved(row),
      backlog: { 'PRD01-x.md': `${releasePlan('Approved', FULL)}\n- PRD01-US-04 was dropped\n` },
    }),
  ).toEqual([]),
)

test('removedAc_isNotRequiredOfASplitStory', () => {
  const rows = PRD_ROWS.map((r) => (r.startsWith('| PRD01-AC-02') ? '| ~~PRD01-AC-02~~ | FR-01 | a | b | c |' : r))
  const rels = [rel(1, 'PRD01-US-01 (AC-01); PRD01-US-02')]
  expect(
    check({ prds: { '01-x.md': prd('Approved', rows) }, backlog: { 'PRD01-x.md': releasePlan('Approved', rels) } }),
  ).toEqual([])
})

// The checker reads PRD columns by position, so the template must keep them there.
test('prdTemplate_keepsTheColumnsTheCheckerReads', () => {
  const template = readFileSync(join(import.meta.dir, '../docs/prd/_template.md'), 'utf8')
  const header = (first: string) => template.split('\n').find((l) => l.startsWith(first))
  expect(header('| Code | Persona |')).toEndWith('| Priority |')
  expect(header('| Code | Requirement | Story |')).toBeDefined()
  expect(header('| Code | Requirement | Given |')).toBeDefined()
})
