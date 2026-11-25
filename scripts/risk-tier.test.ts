import { expect, test } from 'bun:test'
import {
  contentLines,
  fixRatioByTier,
  formatFixRatio,
  hasSensitiveName,
  splitNul,
  tierOf,
  tierOfChange,
  type CommitInfo,
  type Tier,
} from './risk-tier'

test.each<[string, Tier]>([
  // tier 0: docs, markdown, locales, generated code, tests
  ['docs/process/lifecycle.md', 0],
  ['README.md', 0],
  ['src/locales/en.ts', 0],
  ['src/i18n/vi.json', 0],
  ['src/generated/client.ts', 0],
  ['lib/model.g.dart', 0],
  ['.claude/agents/implementer.md', 0],
  ['src/views/products.test.ts', 0],
  ['tests/unit/products_test.go', 0],
  // tier 1: ordinary source
  ['src/views/ProductList.tsx', 1],
  ['lib/screens/product_list.dart', 1],
  ['app/services/product_service.py', 1],
  ['scripts/check-comments.ts', 1],
  ['block.ts', 1],
  // tier 2: sensitive file or directory names
  ['src/services/TokenIssuer.cs', 2],
  ['src/stores/auth.ts', 2],
  ['src/api/session_cookie.go', 2],
  ['lib/security/SecureStorage.dart', 2],
  ['ios/App/KeychainWrapper.swift', 2],
  ['app/src/main/java/com/x/BiometricPrompt.kt', 2],
  ['src/permissions/index.ts', 2],
  // tier 2: infrastructure and dependency files
  ['.github/workflows/ci.yml', 2],
  ['.claude/settings.json', 2],
  ['.codex/hooks.json', 2],
  ['lefthook.yml', 2],
  ['scripts/risk-tier.ts', 2],
  ['scripts/test-gate.sh', 2],
  ['scripts/claude-bash-guard.ts', 2],
  ['package.json', 2],
  ['web/bun.lock', 2],
  ['yarn.lock', 2],
  ['ios/Podfile.lock', 2],
  ['pubspec.lock', 2],
  ['go.sum', 2],
  ['Cargo.lock', 2],
  ['Dockerfile', 2],
  ['docker-compose.prod.yml', 2],
  ['.env.production', 2],
  ['db/migrations/20260101_init.sql', 2],
  ['src/Infra/Migrations/20260101_Init.cs', 2],
  // tier 2: mobile (guide 16.4)
  ['android/app/src/main/AndroidManifest.xml', 2],
  ['ios/Runner/Info.plist', 2],
  ['ios/Runner/Runner.entitlements', 2],
  ['android/app/build.gradle', 2],
  ['android/app/build.gradle.kts', 2],
  ['ios/Podfile', 2],
  ['pubspec.yaml', 2],
  ['Package.swift', 2],
  ['fastlane/Fastfile', 2],
  ['codemagic.yaml', 2],
  ['eas.json', 2],
  ['android/release.jks', 2],
  ['ios/cert.p12', 2],
  ['ios/app.mobileprovision', 2],
])('tierOf(%s) = %d', (path, tier) => expect(tierOf(path)).toBe(tier))

test('tierOf_testUnderSensitivePath_isTier1', () => {
  expect(tierOf('src/auth/AuthService.test.ts')).toBe(1)
  expect(tierOf('scripts/risk-tier.test.ts')).toBe(1)
})

test('hasSensitiveName_matchesTokenPrefixesNotSubstrings', () => {
  expect(hasSensitiveName('src/AuthService.ts')).toBe(true)
  expect(hasSensitiveName('src/user-roles.ts')).toBe(true)
  expect(hasSensitiveName('src/clock.ts')).toBe(false)
  expect(hasSensitiveName('src/controller.ts')).toBe(false)
})

test('tierOfChange_takesTheMaxAndNamesTheReason', () => {
  const r = tierOfChange([
    { path: 'docs/a.md', changedLines: [] },
    { path: '.github/workflows/ci.yml', changedLines: [] },
  ])
  expect(r.tier).toBe(2)
  expect(r.reasons[0]).toStartWith('.github/workflows/ci.yml')
})

test('tierOfChange_docsOnly_isTier0', () =>
  expect(tierOfChange([{ path: 'docs/tech/01.md', changedLines: ['Use [Authorize] on every action'] }]).tier).toBe(0))

test('tierOfChange_plainSource_isTier1', () =>
  expect(tierOfChange([{ path: 'src/views/List.tsx', changedLines: ['const a = 1'] }]).tier).toBe(1))

test.each([
  '    [Authorize(Roles = "Admin")]',
  '    headers: { Authorization: `Bearer ${t}` }',
  '    cookie.SameSite = None',
  '    res.set("Set-Cookie", v)',
  "  localStorage.setItem('access_token', token)",
  '  document.cookie = value',
  "  fetch(url, { credentials: 'include' })",
  '  ALTER TABLE products ADD COLUMN sku text;',
  '  GRANT SELECT ON products TO reader;',
  '  <intent-filter>',
  '  <array><string>applinks:example.com</string></array>',
  '  import CodePush from "react-native-code-push"',
  '  "expo-updates": "~0.25.0"',
])('tierOfChange_contentPattern(%s)_isTier2', (line) =>
  expect(tierOfChange([{ path: 'src/views/Thing.ts', changedLines: [line] }]).tier).toBe(2),
)

test('tierOfChange_markerInTest_staysAtItsPathTier', () =>
  expect(tierOfChange([{ path: 'src/x.test.ts', changedLines: ['withCredentials: true'] }]).tier).toBe(0))

test('tierOfChange_testWithRemovedLines_isTier1', () => {
  const file = { path: 'tests/x.test.ts', changedLines: ['expect(a).toBe(1)'] }
  expect(tierOfChange([{ ...file, removedLines: ['expect(a).toBe(1)'] }]).tier).toBe(1)
  expect(tierOfChange([{ ...file, removedLines: [] }]).tier).toBe(0)
})

test('tierOfChange_empty_isTier0', () => expect(tierOfChange([]).tier).toBe(0))

test('tierOfChange_reasonsCappedAtFive', () => {
  const files = Array.from({ length: 8 }, (_, i) => ({ path: `db/migrations/m${i}.sql`, changedLines: [] }))
  expect(tierOfChange(files).reasons).toHaveLength(5)
})

const commit = (subject: string, ...paths: string[]): CommitInfo => ({
  subject,
  files: paths.map((path) => ({ path, changedLines: [] })),
})

test('fixRatioByTier_countsFixSubjectsPerTier', () =>
  expect(
    fixRatioByTier([
      commit('fix(auth): keep remember-me on refresh', 'src/auth/session.ts'),
      commit('feat(auth): add switch', '.github/workflows/ci.yml'),
      commit('feat(products): list', 'src/views/List.tsx'),
    ]),
  ).toEqual({ 0: { fix: 0, total: 0 }, 1: { fix: 0, total: 1 }, 2: { fix: 1, total: 2 } }))

test('fixRatioByTier_fixPatternIsStrict', () => {
  const src = 'src/views/A.tsx'
  const r = fixRatioByTier(
    ['fix: a', 'fix(x): a', 'fix!: a', 'fixture: a', 'Revert "fix: a"'].map((s) => commit(s, src)),
  )
  expect(r[1]).toEqual({ fix: 3, total: 5 })
})

test('fixRatioByTier_skipsCommitsWithNoFiles', () =>
  expect(fixRatioByTier([commit('fix: empty')])[0]).toEqual({ fix: 0, total: 0 }))

test('formatFixRatio_printsOneRowPerTierWithWholePercentOrDash', () =>
  expect(formatFixRatio({ 0: { fix: 0, total: 0 }, 1: { fix: 1, total: 3 }, 2: { fix: 2, total: 4 } })).toBe(
    [
      '| Tier | fix | Total | Ratio |',
      '|---|---|---|---|',
      '| 0 | 0 | 0 | — |',
      '| 1 | 1 | 3 | 33% |',
      '| 2 | 2 | 4 | 50% |',
    ].join('\n'),
  ))

test('contentLines_keepsDashedContentAndDropsHeaders', () =>
  expect(
    contentLines(
      [
        'diff --git a/x.sql b/x.sql',
        '--- a/x.sql',
        '+++ b/x.sql',
        '@@ -1 +1 @@',
        '--- old note',
        '+++ new note',
        '-a',
        '+b',
      ].join('\n'),
    ),
  ).toEqual({ changed: ['-- old note', '++ new note', 'a', 'b'], removed: ['-- old note', 'a'] }))

test('splitNul_keepsNonAsciiPathsUnquoted', () =>
  expect(splitNul('src/auth/café.ts\0docs/a.md\0')).toEqual(['src/auth/café.ts', 'docs/a.md']))
