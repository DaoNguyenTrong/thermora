import { afterEach, describe, expect, test } from 'bun:test'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseIds, planItem, runSync, type SyncEvent, type SyncInput } from './plane-sync'

const TOKEN = 'secret-token-value'
const PR_URL = 'https://github.com/acme/app/pull/7'
const STATES = {
  inProgress: 'st-progress',
  readyForTesting: 'st-ready',
  testing: 'st-testing',
  done: 'st-done',
  pending: 'st-pending',
  cancelled: 'st-cancelled',
}
const CONFIG = {
  baseUrl: 'https://plane.example.invalid',
  workspaceSlug: 'acme',
  projectId: 'proj-1',
  projectIdentifier: 'PRJ',
  states: STATES,
}
const API = 'https://plane.example.invalid/api/v1/workspaces/acme/'
const ITEM_1 = `${API}projects/proj-1/work-items/item-1/`

type Call = { method: string; url: string; init: RequestInit; body?: unknown }
type Fake = { state?: string; project?: string; links?: string[]; respond?: (call: Call) => Response | undefined }

function fakePlane({ state = 'st-progress', project = 'proj-1', links = [], respond }: Fake = {}) {
  const calls: Call[] = []
  const fetchFn = async (url: string, init: RequestInit) => {
    const call = {
      method: init.method ?? 'GET',
      url,
      init,
      body: init.body ? JSON.parse(String(init.body)) : undefined,
    }
    calls.push(call)
    const override = respond?.(call)
    if (override) return override
    const item = /work-items\/PRJ-(\d+)\/$/.exec(url)
    if (item) return Response.json({ id: `item-${item[1]}`, project, state })
    if (url.endsWith('/links/') && call.method === 'GET')
      return Response.json({ results: links.map((l) => ({ url: l })) })
    return Response.json({})
  }
  return { calls, fetchFn }
}

async function run(overrides: Partial<SyncInput> = {}, plane = fakePlane()) {
  const out: string[] = []
  await runSync({
    event: 'opened',
    configText: JSON.stringify(CONFIG),
    token: TOKEN,
    description: 'Plane: PRJ-1',
    commits: '',
    prUrl: PR_URL,
    fetchFn: plane.fetchFn,
    log: (m) => out.push(m),
    warn: (m) => out.push(`warn: ${m}`),
    ...overrides,
  })
  const writes = plane.calls.filter((c) => c.method !== 'GET')
  return { ...plane, out: out.join('\n'), writes, patches: writes.filter((c) => c.method === 'PATCH') }
}

describe('parseIds', () => {
  test('reads only lines starting with Plane:, de-duplicated, across texts', () =>
    expect(
      parseIds(
        ['## Requirements\r\nPlane: PRJ-12, PRJ-15\r\nsee PRJ-99\n  Plane: PRJ-98', 'feat: x\n\nPlane: PRJ-12 PRJ-3'],
        'PRJ',
      ),
    ).toEqual(['PRJ-12', 'PRJ-15', 'PRJ-3']))

  test.each(['Plane: none (tooling)', 'Plane: none (follow-up of PRJ-4)', 'Plane: None', 'Plane:', 'no trailer PRJ-1'])(
    'yields nothing for %s',
    (text) => expect(parseIds([text], 'PRJ')).toEqual([]),
  )

  test('accepts only <identifier>-<number> tokens', () =>
    expect(
      parseIds(['Plane: ABC-1, prj-2, PRJ-3x, PRJ-, XPRJ-4, PRJ-5/../../x, PRJ-6?a=b, $(id), PRJ-7'], 'PRJ'),
    ).toEqual(['PRJ-7']))

  test('caps at 50', () => {
    const line = `Plane: ${Array.from({ length: 80 }, (_, i) => `PRJ-${i + 1}`).join(', ')}`
    expect(parseIds([line], 'PRJ')).toHaveLength(50)
  })
})

describe('planItem', () => {
  test.each<[SyncEvent, string, boolean]>([
    ['opened', 'st-ready', true],
    ['merged', 'st-testing', true],
    ['closed', 'st-progress', false],
  ])('%s moves to %s, link %s', (event, moveTo, link) =>
    expect(planItem(event, event === 'closed' ? 'st-ready' : 'st-other', STATES)).toEqual({ link, moveTo }),
  )

  test.each(['st-done', 'st-cancelled', 'st-pending'])('never moves an item in %s', (state) => {
    for (const event of ['opened', 'merged', 'closed'] as const)
      expect(planItem(event, state, STATES).moveTo).toBeUndefined()
  })

  test.each(['st-testing', 'st-progress', 'st-other'])('closed leaves an item in %s alone', (state) =>
    expect(planItem('closed', state, STATES)).toEqual({ link: false, moveTo: undefined }),
  )

  test('updating an open PR does not pull a Testing item back to Ready For Testing', () =>
    expect(planItem('opened', 'st-testing', STATES)).toEqual({ link: true, moveTo: undefined }))

  test('drafted pulls a Ready For Testing item back to In Progress', () =>
    expect(planItem('drafted', 'st-ready', STATES)).toEqual({ link: false, moveTo: 'st-progress' }))

  test.each(['st-testing', 'st-progress', 'st-other', 'st-done', 'st-cancelled', 'st-pending'])(
    'drafted leaves an item in %s alone',
    (state) => expect(planItem('drafted', state, STATES)).toEqual({ link: false, moveTo: undefined }),
  )

  test('does not rewrite the state it already has', () =>
    expect(planItem('merged', 'st-testing', STATES).moveTo).toBeUndefined())
})

describe('runSync', () => {
  test('opened links the PR and sets Ready For Testing, sending only the URL and a state id', async () => {
    const r = await run({ description: 'Secret PR title text\nPlane: PRJ-1' })
    expect(r.calls.map((c) => `${c.method} ${c.url}`)).toEqual([
      `GET ${API}work-items/PRJ-1/`,
      `GET ${ITEM_1}links/`,
      `POST ${ITEM_1}links/`,
      `PATCH ${ITEM_1}`,
    ])
    expect(r.writes.map((c) => c.body)).toEqual([{ url: PR_URL, title: 'Pull request' }, { state: 'st-ready' }])
  })

  test('every request carries the key, a timeout signal and follows no redirect', async () => {
    const r = await run()
    expect(r.calls).not.toHaveLength(0)
    for (const { init } of r.calls) {
      expect(new Headers(init.headers).get('X-Api-Key')).toBe(TOKEN)
      expect(init.redirect).toBe('manual')
      expect(init.signal).toBeInstanceOf(AbortSignal)
    }
  })

  test('does not link a URL that is already linked', async () => {
    const r = await run({}, fakePlane({ links: [PR_URL] }))
    expect(r.writes.map((c) => c.method)).toEqual(['PATCH'])
  })

  test('takes ids from commit messages', async () => {
    const r = await run({ description: '', commits: 'fix: a\n\nPlane: PRJ-2\n' })
    expect(r.patches.map((c) => c.url)).toEqual([`${API}projects/proj-1/work-items/item-2/`])
  })

  test('merged without a PR URL only sets Testing', async () => {
    const r = await run({ event: 'merged', prUrl: undefined })
    expect(r.writes.map((c) => c.body)).toEqual([{ state: 'st-testing' }])
    expect(r.calls.some((c) => c.url.endsWith('/links/'))).toBe(false)
  })

  test('closed only sets In Progress', async () => {
    const r = await run({ event: 'closed' }, fakePlane({ state: 'st-ready' }))
    expect(r.writes.map((c) => c.body)).toEqual([{ state: 'st-progress' }])
  })

  test('closed does not pull a Testing item back', async () => {
    const r = await run({ event: 'closed' }, fakePlane({ state: 'st-testing' }))
    expect(r.writes).toEqual([])
  })

  test('an update to an open PR links it but leaves a Testing item there', async () => {
    const r = await run({}, fakePlane({ state: 'st-testing' }))
    expect(r.writes.map((c) => c.method)).toEqual(['POST'])
  })

  test('drafted only sets In Progress', async () => {
    const r = await run({ event: 'drafted' }, fakePlane({ state: 'st-ready' }))
    expect(r.writes.map((c) => c.body)).toEqual([{ state: 'st-progress' }])
  })

  test.each(['st-done', 'st-cancelled', 'st-pending'])('keeps %s, still adding the link', async (state) => {
    const r = await run({}, fakePlane({ state }))
    expect(r.writes.map((c) => c.method)).toEqual(['POST'])
  })

  test.each(['javascript:alert(1)', 'not a url', 'https://user:pw@example.invalid/x'])(
    'does not link the bad URL %s',
    async (prUrl) => {
      const r = await run({ prUrl })
      expect(r.writes.map((c) => c.method)).toEqual(['PATCH'])
    },
  )

  test.each<[string, Partial<SyncInput>]>([
    ['no config', { configText: undefined }],
    ['bad config JSON', { configText: '{' }],
    ['null config', { configText: 'null' }],
    ['no token', { token: undefined }],
    ['blank token', { token: '  ' }],
    ['no ids', { description: 'Plane: none (docs)' }],
    ['http baseUrl', { configText: JSON.stringify({ ...CONFIG, baseUrl: 'http://plane.example.invalid' }) }],
    ['empty baseUrl', { configText: JSON.stringify({ ...CONFIG, baseUrl: '' }) }],
    [
      'userinfo in baseUrl',
      { configText: JSON.stringify({ ...CONFIG, baseUrl: 'https://a:b@plane.example.invalid' }) },
    ],
    ['slug with a slash', { configText: JSON.stringify({ ...CONFIG, workspaceSlug: 'a/../b' }) }],
    ['projectId with a slash', { configText: JSON.stringify({ ...CONFIG, projectId: '../x' }) }],
    ['regex as identifier', { configText: JSON.stringify({ ...CONFIG, projectIdentifier: '.*' }) }],
    ['missing done state', { configText: JSON.stringify({ ...CONFIG, states: { ...STATES, done: '' } }) }],
    ['unknown event', { event: 'deleted' as SyncEvent }],
  ])('%s: warns and sends nothing', async (_, overrides) => {
    const r = await run(overrides)
    expect(r.calls).toEqual([])
    expect(r.out).toContain('warn: ')
  })

  test.each<[string, () => Response]>([
    ['HTTP error', () => new Response('nope', { status: 500 })],
    ['redirect', () => new Response(null, { status: 302, headers: { location: 'https://evil.invalid/' } })],
    ['bad JSON', () => new Response('<html>', { status: 200 })],
    [
      'network error',
      () => {
        throw new TypeError(`failed with header ${TOKEN}`)
      },
    ],
  ])('%s on one item: warns without the token and goes on with the next', async (_, fail) => {
    const plane = fakePlane({ respond: (c) => (c.url.endsWith('PRJ-1/') ? fail() : undefined) })
    const r = await run({ description: 'Plane: PRJ-1, PRJ-2' }, plane)
    expect(r.out).toContain('warn: PRJ-1')
    expect(r.out).not.toContain(TOKEN)
    expect(r.patches.map((c) => c.url)).toEqual([`${API}projects/proj-1/work-items/item-2/`])
  })

  test.each<[string, object]>([
    ['another project', { id: 'item-1', project: 'proj-2', state: 'st-ready' }],
    ['an id that is not an id', { id: '../../x', project: 'proj-1', state: 'st-ready' }],
    ['a state that is not a string', { id: 'item-1', project: 'proj-1', state: { id: 'st-done' } }],
  ])('writes nothing for a work item with %s', async (_, item) => {
    const plane = fakePlane({ respond: (c) => (c.url.endsWith('PRJ-1/') ? Response.json(item) : undefined) })
    const r = await run({}, plane)
    expect(r.writes).toEqual([])
    expect(r.out).toContain('warn: PRJ-1')
  })

  test('a failing link list adds no link but still moves the item', async () => {
    const plane = fakePlane({
      respond: (c) => (c.url.endsWith('/links/') ? new Response('', { status: 500 }) : undefined),
    })
    const r = await run({}, plane)
    expect(r.writes.map((c) => c.method)).toEqual(['PATCH'])
    expect(r.out).toContain('warn: PRJ-1')
  })
})

describe('command line', () => {
  const roots: string[] = []
  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
  })

  function spawn(args: string[], env: Record<string, string>, config?: string) {
    const root = mkdtempSync(join(tmpdir(), 'plane-sync-'))
    roots.push(root)
    mkdirSync(join(root, '.claude'))
    copyFileSync(join(import.meta.dir, 'plane-sync.ts'), join(root, 'plane-sync.ts'))
    if (config !== undefined) writeFileSync(join(root, '.claude/plane.json'), config)
    const r = Bun.spawnSync([process.execPath, 'plane-sync.ts', ...args], {
      cwd: root,
      env,
      stdin: Buffer.from('Plane: PRJ-1\n'),
    })
    return { code: r.exitCode, out: r.stdout.toString() + r.stderr.toString() }
  }

  test('exits 0 with a warning when there is no config', () => {
    const r = spawn(['opened'], { PLANE_API_KEY: TOKEN })
    expect(r.code).toBe(0)
    expect(r.out).toContain('plane.json')
  })

  test('refuses a non-https baseUrl, exit 0, as a GitHub annotation', () => {
    const config = JSON.stringify({ ...CONFIG, baseUrl: 'http://127.0.0.1:1' })
    const r = spawn(['opened'], { PLANE_API_KEY: TOKEN, GITHUB_ACTIONS: 'true' }, config)
    expect(r.code).toBe(0)
    expect(r.out).toContain('::warning::plane-sync: baseUrl')
    expect(r.out).not.toContain(TOKEN)
  })
})

// Guards on the CI wiring. They hold for the committed files only: a branch can edit its own copy.
describe('GitHub workflow', () => {
  const text = () => readFileSync(join(import.meta.dir, '../.github/workflows/plane-sync.yml'), 'utf8')
  type Step = { uses?: string; run?: string; with?: Record<string, unknown>; env?: Record<string, string> }
  const workflow = () => Bun.YAML.parse(text()) as any
  const steps = (): Step[] => workflow().jobs['plane-sync'].steps

  test('runs on pull_request into dev with read access only', () => {
    expect(Object.keys(workflow().on)).toEqual(['pull_request'])
    expect(workflow().on.pull_request.branches).toEqual(['dev'])
    expect(workflow().permissions).toEqual({ contents: 'read' })
  })

  test('checks out the base commit, never the head', () => {
    const checkouts = steps().filter((s) => s.uses?.startsWith('actions/checkout@'))
    expect(checkouts.map((s) => s.with?.ref)).toEqual(['${{ github.event.pull_request.base.sha }}'])
    expect(steps().some((s) => /git (checkout|switch|merge|reset)/.test(s.run ?? ''))).toBe(false)
  })

  test('gives the secret to one step and interpolates nothing into a shell', () => {
    expect(text().match(/secrets\./g)).toHaveLength(1)
    expect(steps().filter((s) => s.env?.PLANE_API_KEY)).toHaveLength(1)
    for (const step of steps()) expect(step.run ?? '').not.toContain('${{')
  })

  const condition = () => workflow().jobs['plane-sync'].if.replace(/\s+/g, ' ')

  test('skips a draft pull request unless it is being closed or was just converted to draft', () => {
    expect(condition()).toContain(
      "(github.event.action == 'closed' || github.event.action == 'converted_to_draft' || " +
        "(github.event.pull_request.state == 'open' && !github.event.pull_request.draft))",
    )
  })

  test('runs on conversion to draft and passes it on as drafted', () => {
    expect(workflow().on.pull_request.types).toContain('converted_to_draft')
    const event = steps().find((s) => s.env?.EVENT)!.env!.EVENT
    expect(event).toStartWith("${{ github.event.action == 'converted_to_draft' && 'drafted' ||")
  })

  // The post-release main -> dev merge carries the release's commit trailers but serves no work item.
  test('skips the reconcile pull request', () => {
    expect(condition()).toContain("!startsWith(github.event.pull_request.head.ref, 'chore/reconcile-main-')")
  })

  test('is not a required check', () => {
    const setup = readFileSync(join(import.meta.dir, 'setup-branch-protection.sh'), 'utf8')
    expect(setup).not.toContain('plane')
  })

  test('skips forks and can never fail the pull request', () => {
    expect(workflow().jobs['plane-sync'].if).toContain(
      'github.event.pull_request.head.repo.full_name == github.repository',
    )
    for (const step of workflow().jobs['plane-sync'].steps) expect(step['continue-on-error']).toBe(true)
  })
})

// Runs the Sync step's own shell against a real repository, with `bun` replaced by `cat`.
describe('GitHub commit range', () => {
  const roots: string[] = []
  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
  })

  const workflow = () =>
    Bun.YAML.parse(readFileSync(join(import.meta.dir, '../.github/workflows/plane-sync.yml'), 'utf8')) as any
  const syncStep = () => workflow().jobs['plane-sync'].steps.find((s: { name?: string }) => s.name === 'Sync')

  // dev: base -> earlier (another PR) -> merge of feature; feature forked from base and merged dev back in.
  function repo() {
    const root = mkdtempSync(join(tmpdir(), 'plane-range-'))
    roots.push(root)
    const env = {
      PATH: process.env.PATH!,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_AUTHOR_NAME: 't',
      GIT_AUTHOR_EMAIL: 't@example.invalid',
      GIT_COMMITTER_NAME: 't',
      GIT_COMMITTER_EMAIL: 't@example.invalid',
    }
    const git = (...args: string[]) => {
      const r = Bun.spawnSync(['git', ...args], { cwd: root, env })
      if (r.exitCode !== 0) throw new Error(r.stderr.toString())
      return r.stdout.toString().trim()
    }
    const commit = (message: string) => git('commit', '--allow-empty', '-qm', message)
    git('init', '-qb', 'dev')
    commit('base')
    git('checkout', '-qb', 'feature')
    commit('own-work')
    git('checkout', '-q', 'dev')
    commit('other-pr')
    git('checkout', '-q', 'feature')
    git('merge', '-q', '--no-ff', '-m', 'sync-dev', 'dev')
    const head = git('rev-parse', 'HEAD')
    git('update-ref', 'refs/remotes/origin/dev', 'dev')
    const merge = () => {
      git('checkout', '-q', 'dev')
      git('merge', '-q', '--no-ff', '-m', 'merge-commit', 'feature')
      git('update-ref', 'refs/remotes/origin/dev', 'dev')
      return git('rev-parse', 'HEAD')
    }
    const subjects = (event: string, mergeSha: string) => {
      const script = `bun() { cat; }\n${syncStep().run}`
      const r = Bun.spawnSync(['bash', '-e', '-c', script], {
        cwd: root,
        env: { ...env, EVENT: event, PR_HEAD: head, MERGE_SHA: mergeSha },
      })
      return r.stdout.toString().split('\n').filter(Boolean).sort()
    }
    return { merge, subjects }
  }

  test('passes the head and merge commits through env, never the base sha', () => {
    expect(syncStep().env.PR_HEAD).toBe('${{ github.event.pull_request.head.sha }}')
    expect(syncStep().env.MERGE_SHA).toBe('${{ github.event.pull_request.merge_commit_sha }}')
    expect(JSON.stringify(syncStep())).not.toContain('base.sha')
  })

  test.each(['opened', 'closed', 'drafted'])('%s reads the head commits that dev does not have', (event) =>
    expect(repo().subjects(event, '')).toEqual(['own-work', 'sync-dev']),
  )

  test('merged reads what the merge commit brought into dev', () => {
    const r = repo()
    expect(r.subjects('merged', r.merge())).toEqual(['own-work', 'sync-dev'])
  })
})
