---
# TODO(stack): the source paths of the languages Serena or the LSP serves.
paths:
  - "src/**"
---

# Serena / LSP — Symbol Navigation

When to use Serena (or the stack's LSP) vs CodeGraph is in `AGENTS.md` § Tool Selection. This file records the verified scope behind that table.

## Verify before trusting

DAONT-BASE found that Serena's `find_referencing_symbols` silently missed every caller inside `.vue` files, because each language server only sees its own files. Run the same check for each language of this project before filling in the Tool Selection table:

1. Pick a symbol that is called from several kinds of files.
2. Compare Serena's `find_referencing_symbols` with `codegraph_explore`'s blast radius and with `grep`.
3. Record the result below, with the date.

Until a language is verified, impact checks use the CodeGraph blast radius, and renames are done by hand from that file list, then confirmed by the tests. A language CodeGraph does not index (check `codegraph status`) uses grep + `Read`.

## Verified scope

<!-- TODO(stack): one row per language. -->

| Language | find_symbol / overview / declaration | find_referencing_symbols / rename | Verified on |
|---|---|---|---|

## Gitignored files

Keep `ignore_all_files_in_gitignore: true` in `.serena/project.yml`: it keeps secret-bearing config out of every Serena tool without a hand-kept list that can drift. Gitignored generated code is then invisible to Serena; read it with `Read` or CodeGraph.
