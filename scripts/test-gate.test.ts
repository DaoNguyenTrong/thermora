import { afterEach, describe, expect, test } from 'bun:test'
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Runs the real test-gate.sh, copied into a throwaway repo layout, with bun stubbed on PATH.
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function layout({ bun = 'exit 0', gate = readFileSync(join(import.meta.dir, 'test-gate.sh'), 'utf8') } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'test-gate-'))
  roots.push(root)
  mkdirSync(join(root, 'scripts'))
  mkdirSync(join(root, 'stubs'))
  mkdirSync(join(root, 'docs/prd'), { recursive: true })
  copyFileSync(join(import.meta.dir, 'test-gate.sh'), join(root, 'scripts/test-gate.sh'))
  if (gate) writeFileSync(join(root, 'scripts/test-gate.sh'), gate)
  writeFileSync(join(root, 'stubs/bun'), `#!/usr/bin/env bash\necho "bun $*" >> "${root}/calls"\n${bun}\n`)
  chmodSync(join(root, 'stubs/bun'), 0o755)
  return root
}

function run(root: string) {
  const proc = Bun.spawnSync(['bash', join(root, 'scripts/test-gate.sh')], {
    env: { ...process.env, PATH: `${join(root, 'stubs')}:${process.env.PATH}` },
  })
  let calls = ''
  try {
    calls = readFileSync(join(root, 'calls'), 'utf8')
  } catch {}
  return { code: proc.exitCode, stdout: proc.stdout.toString(), calls }
}

describe('test-gate.sh', () => {
  test('runs the always-run checks in order', () => {
    const result = run(layout())
    expect(result.code).toBe(0)
    expect(result.calls.trim().split('\n')).toEqual([
      'bun test scripts/',
      'bun scripts/check-comments.ts',
      'bun scripts/check-personas.ts',
      'bun scripts/check-release-plan.ts',
    ])
  })

  test('checks the numbered PRDs for approval order when there are any', () => {
    const root = layout()
    writeFileSync(join(root, 'docs/prd/01-feedback.md'), '# PRD-01\n')
    expect(run(root).calls).toContain('bun scripts/check-prd-approval.ts docs/prd/01-feedback.md')
  })

  test('fails when a check fails, without running the later ones', () => {
    const result = run(layout({ bun: 'exit 1' }))
    expect(result.code).toBe(1)
    expect(result.calls.trim().split('\n')).toEqual(['bun test scripts/'])
  })

  test('prints a step with a missing tool in the SKIPPED list instead of failing', () => {
    const base = readFileSync(join(import.meta.dir, 'test-gate.sh'), 'utf8')
    const gate = base.replace(
      '\nif ((${#skipped[@]}))',
      '\nrun_if app no-such-tool-xyz echo should-not-run\nif ((${#skipped[@]}))',
    )
    const result = run(layout({ gate }))
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('SKIPPED')
    expect(result.stdout).toContain('app (no no-such-tool-xyz)')
    expect(result.stdout).not.toContain('should-not-run')
  })

  test('runs a step whose tool exists', () => {
    const base = readFileSync(join(import.meta.dir, 'test-gate.sh'), 'utf8')
    const gate = base.replace('\nif ((${#skipped[@]}))', '\nrun_if app bash echo ran-app\nif ((${#skipped[@]}))')
    const result = run(layout({ gate }))
    expect(result.stdout).toContain('ran-app')
    expect(result.stdout).not.toContain('SKIPPED')
  })
})
