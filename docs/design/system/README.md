# Design system

| Item | Value |
| --- | --- |
| Status | Approved |
| Version | 0.4 |
| Updated | 2026-11-27 |
| Canvas | `docs/design/system/` |
| Approver | PO + Design lead |

Open `index.html` in a browser. Light is on the left and dark is on the right of each row, 80px apart.

| Board | File |
| --- | --- |
| Foundations: color, state colors, type roles, space, radius, motion, glass, icons, shell sizes and layers | `foundations.html` |
| Components and their states, including the REL-1 components | `components.html` |
| Window shell at 1366×768, the service-in-use indicator in both rails, the first-run page | `patterns.html` |
| Be Vietnam Pro 400, 500, 600, 700 and its licence | `fonts/` |
| The Lucide icons the system uses, one SVG each, and the licences | `icons/` |

Tokens live in `tokens.css`, the single file of values, and it loads the bundled fonts. Screens call the role names. A screen is not part of this stage. The boards load nothing from the network.

## In this version

New in 0.4: radio and choice card; service status (chip and list row); the service-in-use indicator in both rails; numbered setup steps; the wait for the provider's own sign-in; an AI action that is unavailable with its reason; the multi-line copy block; the first-run page; the anatomy of a message. Foundations: the bundled fonts (Be Vietnam Pro and, for mono text, JetBrains Mono 400), a complete `tokens.css` (type roles, state colors, icon sizes, shell sizes, layers), and the Lucide icon set. The 0.3 specimens look the same.

Foundations from the agreed Lớp kính reference, as their own light and dark palettes: surfaces, accent, semantic colors, type up to 18, a 4px space grid, radii 8–22, glass with a solid fallback, quiet ambient on a working window and full ambient only on an empty page.

Components: button (primary, secondary, ghost, danger-soft, danger; heights 40, 44 and 32), text field, select, checkbox, radio, choice card, switch, search, banner, status chip, service status, tabs, list row, inline confirm, inline edit, side panel, toast, empty, loading, tooltip, menu, copy button (one line and several lines), numbered steps, sign-in wait, unavailable action, dialog.

Shell: thin-glass rail in two modes, thin-glass top bar, thick-glass content. The current rail is 240px with labels, the display name and the version. The minimal rail is 72px with icons only; labels and the display name sit in side tooltips, and the version stays visible. The same 40px icon button at the start of the top bar switches mode: "Thu gọn" when the rail is wide, "Mở rộng" when it is narrow. The page title follows that button. The one primary action stays at the end of the bar.

## Not in this version

Organization switcher, roles, invites, command palette, avatars, pagination, multi-select, priority marks, and the reference product's logo. Phone layouts are not drawn. The 44px button height is a specimen only. Window sizes other than 1366×768, theme selection (follow the OS or not), native title bars and a "use when" line for each component are not decided here.

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
11. The minimal rail is a mode of the same 1366×768 window. Its mark is the letter T. Nav icons are 20px with the same 1.5 stroke. Icon-only controls keep a text name in a tooltip.
12. The rail switch is one header button in both modes: 40px, radius 12, a 20px panel icon. The chevron points left to collapse and right to expand. The name sits under the button.

13. Font: Be Vietnam Pro 400, 500, 600, 700 as TTF from the google/fonts repository (SIL Open Font License, `fonts/OFL.txt`), loaded by `@font-face` in `tokens.css`. Fallback: system-ui, "Segoe UI", -apple-system, "SF Pro Text", Ubuntu, "Noto Sans", sans-serif. Not converted to WOFF2.
14. Icons: Lucide (ISC licence; a few of its icons come from Feather, MIT; both texts are in `icons/LICENSE.txt`), stroke 1.5, sizes 16 and 20, inlined as SVG. The stroke stays 1.5px at both sizes (`vector-effect: non-scaling-stroke`). Used: circle-check, triangle-exclamation-point, circle-exclamation-point, circle-question-mark, info, package-x, log-in, external-link, rotate-cw, copy, check, x, search, chevron-down, panel-left-close, panel-left-open, layout-grid, list, circle, user. Names are those of Lucide's main branch on 2026-11-27 (older releases call them triangle-alert, circle-alert and circle-help). The last four of the list only mark placeholder shell items (layout-grid, list, circle) and the person (user).
15. State colors are written out as values per theme (accent-hover, accent-pressed, accent-disabled, accent-soft-wash, accent-soft-pressed, accent-soft-deep, danger-soft-hover, danger-soft-pressed, danger-button-hover, danger-button-pressed, danger-button-disabled). They equal the 0.3 mixes. The icon-button hover and the spinner track use an opacity token over the current color, because that color changes by place. Board chrome (page background and headings around the specimens) keeps its own colors, named in a comment in `board.css`.
16. Layers: content 1, raised (rail) 2, menu and tooltip 10, toast 20, overlay and dialog 30.
17. The select caret is now the Lucide chevron-down inside a wrapper, instead of a CSS-drawn triangle.
18. [call] Service state wording and look: Sẵn sàng (success, check); Chưa cài đặt, Chưa đăng nhập, Phiên bản chưa được hỗ trợ (warning, each with its own icon: the person has a next step); Không kiểm tra được (neutral, question mark); Đang kiểm tra (info, the existing spinner). Icon and words always together. The list row holds name and version, state, one line of next step, and one small secondary button when there is something to do.
19. [call] Service in use: in the rail footer above the name and version, an icon, the service name and "Đang dùng · Sẵn sàng". It opens the place that shows both services. With no service ready it reads "Chưa có dịch vụ AI · Cần thiết lập" with the warning icon. In the minimal rail it is an icon with a side tooltip that gives name and state.
20. [call] Choice: selected = accent-soft fill and accent border, so the choice is not shown by the small dot alone. The card is one label; a disabled card says why in its second line. No card sits inside another card.
21. [call] Steps: the number is a 24px accent-soft disc. A step may hold a copyable line and an outside link. The copyable line is the text to give the person who supports the user, so it may contain a command; the command in the specimen is illustrative. The last step always points back to "Kiểm tra lại".
22. [call] Waiting for sign-in: an in-page block, not a dialog. It has no field. The cancel action stays visible. The two results are a success banner and a warning banner that offers to reopen the provider's page.
23. [call] Unavailable AI action: `aria-disabled="true"`, not `disabled`, drawn like the disabled primary button. It keeps focus. The reason and the link to setup help sit beside it as normal text and are tied to it with `aria-describedby`. "Gửi cho AI" stands for the placeholder AI action of the release plan.
24. [call] Multi-line copy block: a `pre` in the mono role, keyboard-focusable, same copy button and the same copied and failed states as 0.3. The specimen holds the Thermora version, the service in use, and each service with its version and state, nothing more.
25. [call] First-run page: no rail, full ambient, a 480px glass panel at the left with the name at the top left, one field, one primary action. Error text for an empty name: "Hãy nhập tên để tiếp tục." For more than 50 characters: "Tên dài tối đa 50 ký tự." (not drawn). The error replaces the one-line note and the field keeps the focus ring.
26. [call] Message anatomy: three sentences in order, what happened, whether the work is safe, what to do next. The words not to use are listed in § Technical-term list below; the board is a specimen of it. The PO confirms the wording at approval.
27. [call] Vietnamese wording the PRD does not give: Tên hiển thị, Dịch vụ AI, Kiểm tra lại, Xem hướng dẫn, Xem hướng dẫn thiết lập, Đang dùng, Chuyển sang Codex, Gửi cho AI, quy trình (procedure), lịch sử thao tác (history), người hỗ trợ bạn (supporter).
28. [call] Mono font: JetBrains Mono Regular, bundled as the variable TTF from the google/fonts repository (SIL Open Font License, `fonts/OFL-JetBrainsMono.txt`), limited to weight 400 by `@font-face`. Reason: with no bundled mono face, Ubuntu drew Vietnamese marks detached in the copy block. `--font-mono` is "JetBrains Mono", ui-monospace, "Cascadia Mono", "SFMono-Regular", Consolas, monospace.

## Technical-term list

PRD01 D11 puts this list in the design. It applies to messages: banners, field errors, empty states, tooltips and button text. Each term on the left is not written; the words on the right are.

| Not written | Written instead |
| --- | --- |
| token, mã xác thực | đăng nhập |
| API, máy chủ, timeout | không kết nối được, mất quá lâu |
| CLI, terminal, dòng lệnh | nhờ người hỗ trợ bạn |
| quota, rate limit | gói của bạn đã dùng hết lượt |
| mã lỗi, stack trace | không hiện; chỉ nằm trong thông tin sao chép |

The names "Claude Code" and "Codex" are allowed. The list does not apply to the copyable text of AC-27, which may carry service names, versions and states. The PO confirms the wording at approval.

## Display-name length error

For a name of more than 50 characters the message is "Tên dài tối đa 50 ký tự." The 51-character case is drawn on the first-run and settings screen boards at 1c-UI, using the existing field-error state. No board is added for it here.

## Change log

| Date | Version | Change | Source |
| --- | --- | --- | --- |
| 2026-11-27 | 0.1 | First boards, from the agreed Lớp kính proposal. | user decision (PO: DaoNguyenTrong) to write the system |
| 2026-11-27 | 0.1 | User approval of the design system v0.1 | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.2 | Added the minimal rail beside the current rail | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.3 | Moved the rail switch into the top bar, one button for both modes | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.4 | REL-1 components (choice, service status, in-use indicator, steps, sign-in wait, unavailable action, copy block, first-run page, message anatomy); bundled font; complete tokens; Lucide icons | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.4 | SA rulings: bundled JetBrains Mono for mono text; technical-term list moved into the README | SA (on behalf of user) |
| 2026-11-27 | 0.4 | User approval of the design system v0.4, including the technical-term list wording | user decision (PO + Design lead: DaoNguyenTrong) |
