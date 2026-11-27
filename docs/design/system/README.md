# Design system

| Item | Value |
| --- | --- |
| Status | Approved |
| Version | 0.2 |
| Updated | 2026-11-27 |
| Canvas | `docs/design/system/` |
| Approver | PO + Design lead |

Open `index.html` in a browser. Light is on the left and dark is on the right of each row, 80px apart.

| Board | File |
| --- | --- |
| Foundations: color, type, space, radius, motion, glass | `foundations.html` |
| Components and their states | `components.html` |
| Window shell at 1366×768 | `patterns.html` |

Tokens live in `tokens.css`. Screens call the role names. A screen is not part of this stage.

## In this version

Foundations from the agreed Lớp kính reference, as their own light and dark palettes: surfaces, accent, semantic colors, type up to 18, a 4px space grid, radii 8–22, glass with a solid fallback, quiet ambient on a working window and full ambient only on an empty page.

Components: button (primary, secondary, ghost, danger-soft, danger; heights 40, 44 and 32), text field, select, checkbox, switch, search, banner, status chip, tabs, list row, inline confirm, inline edit, side panel, toast, empty, loading, tooltip, menu, copy button, dialog.

Shell: thin-glass rail in two modes, thin-glass top bar (page title and the one primary action), thick-glass content. The current rail is 240px with labels, the display name and the version. The minimal rail is 72px with icons only; the same labels, the display name and "Mở rộng" sit in side tooltips, and the version stays visible. A control on the rail switches mode.

## Not in this version

Organization switcher, roles, invites, command palette, avatars, pagination, radio, multi-select, priority marks, and the reference product's logo. Phone layouts are not drawn. The 44px button height is a specimen only.

## Design calls

1. The face is Be Vietnam Pro. The reference names a scale and no family; the UI is Vietnamese.
2. Hover and pressed colors are a mix of the role color. The reference shows the states and does not publish separate hex values.
3. Menu, toast and dialog use one shadow (`--elevation`). The reference makes them solid, with no backdrop blur, and does not publish a shadow.
4. On a dark rail the product name uses `accent`. `brand` `#4F3D91` stays the light-theme name color; on the dark glass it does not clear 4.5:1, which matches the reference note that links on dark use `accent`.
5. Focus on an invalid field stays the `focus` ring. The border and the message carry the error.
6. The copy button is Vietnamese only. Its width fits the longer of "Sao chép" and "Đã sao chép". Success is the button text for about two seconds plus a hidden status region, with no toast.
7. A dialog is only for an irreversible action. The specimen is deleting what this machine has stored.
8. Quiet ambient opacity follows the reference per theme: light .35, dark .30. Full ambient is light .75 and dark .55.
9. Neutral and accent-soft chip colors come from the reference chip row. The reference teal "in review" chip and the priority orange are not tokens.
10. Red is only danger. Green is only success.
11. The minimal rail is a mode of the same 1366×768 window. Its mark is the letter T. Nav icons are 20px with the same 1.5 stroke. Icon-only controls keep a text name in a side tooltip.

## Change log

| Date | Version | Change | Source |
| --- | --- | --- | --- |
| 2026-11-27 | 0.1 | First boards, from the agreed Lớp kính proposal. | user decision (PO: DaoNguyenTrong) to write the system |
| 2026-11-27 | 0.1 | User approval of the design system v0.1 | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.2 | Added the minimal rail beside the current rail | user decision (PO + Design lead: DaoNguyenTrong) |
