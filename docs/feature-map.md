# Feature Map

A feature map from the user's point of view: where to enter, where the code lives, how to verify. Each feature is one `##` section; `implementer` adds it in the same PR as the code. Add new features with the same structure. Entries are empty until the first module ships.

Template for one entry:

```markdown
## <Feature name>

- **Entry point:** <screen, command or route a user starts from> (<selector or testid>). Roles: <who can use it>.
- **UI:** <files, components, testids>
- **Backend / logic:** <endpoints or functions -> service / handler>
- **Existing tests:** <unit, integration, e2e paths and what they cover; known gaps>
- **Test data:** <accounts, fixtures, seed notes>
- **How to check it works:** <numbered steps with expected result>
- **Common risks:** <pitfalls when testing or changing it>
- **PRD:** <PRDxx-FR-nn, PRDxx-AC-nn>
```

---
