import { describe, expect, test } from 'bun:test'
import { findComments, isChecked, usesHashComments } from './check-comments'

const lines = (n: number, prefix = '// ') => Array.from({ length: n }, (_, i) => `${prefix}line ${i}`).join('\n')

describe('findComments', () => {
  test('allows a block of exactly three lines', () => {
    expect(findComments(lines(3)).long).toEqual([])
  })

  test('flags a fourth line with the block start and length', () => {
    expect(findComments(`const a = 1\n${lines(4)}\nconst b = 2`).long).toEqual([{ line: 2, length: 4 }])
  })

  test('a blank line or code line splits blocks', () => {
    expect(findComments(`${lines(3)}\n\n${lines(3)}`).long).toEqual([])
    expect(findComments(`${lines(3)}\nfoo()\n${lines(3)}`).long).toEqual([])
  })

  test('a trailing comment after code is not a comment line', () => {
    expect(findComments(`${lines(3)}\nfoo() // why`).long).toEqual([])
  })

  test('counts every line of a /* */ block, including CSS lines without a leading *', () => {
    const css = '/* one\n   two\n   three\n   four */\n.a { color: red; }'
    expect(findComments(css).long).toEqual([{ line: 1, length: 4 }])
  })

  test('JSDoc delimiter-only lines do not count', () => {
    expect(findComments('/**\n * one\n * two\n * three\n */\nexport const a = 1').long).toEqual([])
  })

  test('XML doc tag-only lines do not count, tagged prose does', () => {
    const doc = '/// <summary>\n/// One.\n/// </summary>\n/// <returns>Two.</returns>'
    expect(findComments(doc).long).toEqual([])
    expect(findComments(`${doc}\n/// <remarks>Three.</remarks>\n/// <remarks>Four.</remarks>`).long).toEqual([
      { line: 2, length: 4 },
    ])
  })

  test('per-parameter and per-response XML doc lines do not count', () => {
    const params = Array.from({ length: 6 }, (_, i) => `/// <param name="p${i}">Field ${i}.</param>`)
    const doc = ['/// <summary>One.</summary>', ...params, '/// <response code="200">Ok.</response>']
    expect(findComments(doc.join('\n')).long).toEqual([])
  })

  test('HTML comments in a Vue template count like any other', () => {
    expect(findComments('<!--\n  a\n  b\n  c\n  d\n-->').long).toEqual([{ line: 2, length: 4 }])
  })

  test('directives are not counted', () => {
    const src = `${lines(3)}\n// eslint-disable-next-line no-console\nconsole.log(1)`
    expect(findComments(src).long).toEqual([])
    expect(findComments(`// @ts-expect-error wrong type\n${lines(3)}`).long).toEqual([])
  })

  test('flags a counted comment line wider than 120 chars', () => {
    const wide = `// ${'x'.repeat(118)}`
    expect(findComments(wide).wide).toEqual([{ line: 1, length: 121 }])
    expect(findComments(`// ${'x'.repeat(117)}`).wide).toEqual([])
  })

  test('a one-line XML doc element is exempt from the width cap but still counts', () => {
    const remarks = `/// <remarks>${'x'.repeat(130)}</remarks>`
    expect(findComments(remarks).wide).toEqual([])
    expect(findComments(`/// ${'x'.repeat(130)}`).wide).toEqual([{ line: 1, length: 134 }])
    expect(findComments(Array(4).fill(remarks).join('\n')).long).toEqual([{ line: 1, length: 4 }])
  })

  test('per-parameter XML doc lines are exempt from the width cap', () => {
    const param = `/// <param name="p">${'x'.repeat(130)}</param>`
    expect(findComments(param).wide).toEqual([])
  })

  test('reports change-history wording as a hint', () => {
    const { history } = findComments('// Originally #3d3071, now lighter.\nconst c = 1')
    expect(history).toEqual([{ line: 1, length: 1, history: 'Originally' }])
  })
})

describe('hash comments (py, rb)', () => {
  const hashLines = (n: number) => lines(n, '# ')

  test('flags a fourth # line', () => {
    expect(findComments(`x = 1\n${hashLines(4)}\ny = 2`, { hash: true }).long).toEqual([{ line: 2, length: 4 }])
    expect(findComments(hashLines(3), { hash: true }).long).toEqual([])
  })

  test('shebang, coding and tool directives are not counted', () => {
    const src = `#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n# noqa: E501\n${hashLines(3)}`
    expect(findComments(src, { hash: true }).long).toEqual([])
  })

  test('flags a # line wider than 120 chars and history wording', () => {
    expect(findComments(`# ${'x'.repeat(119)}`, { hash: true }).wide).toEqual([{ line: 1, length: 121 }])
    expect(findComments('# Originally slower\nx = 1', { hash: true }).history).toHaveLength(1)
  })

  test('without the hash option a # line is code (CSS id, Rust attribute)', () => {
    expect(findComments(`#a { color: red; }\n${hashLines(5)}`).long).toEqual([])
  })

  test('usesHashComments covers py and rb only', () => {
    expect(usesHashComments('app/main.py')).toBe(true)
    expect(usesHashComments('lib/a.rb')).toBe(true)
    expect(usesHashComments('src/a.rs')).toBe(false)
    expect(usesHashComments('src/a.css')).toBe(false)
  })
})

describe('/// doc comments (Rust, Swift, C#, Dart)', () => {
  test('count like any other comment line', () => {
    expect(findComments(lines(4, '/// ')).long).toEqual([{ line: 1, length: 4 }])
  })
})

describe('isChecked', () => {
  test.each([
    'src/main.ts',
    'src/App.tsx',
    'src/a.jsx',
    'src/App.vue',
    'src/App.svelte',
    'src/Program.cs',
    'app/Main.java',
    'app/Main.kt',
    'build.gradle.kts',
    'ios/App.swift',
    'lib/main.dart',
    'cmd/main.go',
    'src/lib.rs',
    'app/main.py',
    'lib/a.rb',
    'src/index.php',
    'src/app.css',
    'src/app.scss',
  ])('covers hand-written source file %s', (path) => {
    expect(isChecked(path)).toBe(true)
  })

  test.each([
    'node_modules/pkg/index.js',
    'web/dist/app.js',
    'build/out.js',
    'src/generated/client.ts',
    'app/.dart_tool/x.dart',
    'ios/Pods/Lib/a.swift',
    'lib/model.g.dart',
    'lib/model.freezed.dart',
    'src/Migrations/20260101_Init.Designer.cs',
    'docs/examples/sample.ts',
  ])('skips generated code and docs: %s', (path) => {
    expect(isChecked(path)).toBe(false)
  })

  test('skips non-source files', () => {
    expect(isChecked('README.md')).toBe(false)
    expect(isChecked('lefthook.yml')).toBe(false)
    expect(isChecked('scripts/test-gate.sh')).toBe(false)
  })
})
