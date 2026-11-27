# Design

The design canvas for Thermora. Static HTML boards, opened in a browser and reviewed on the module docs PR. Claude Design, Figma and Google Stitch are not used (PO and Design lead, 2026-11-27; `docs/process/decisions.md`).

| Item | Value |
|---|---|
| Language | Approved 2026-11-27 |
| REL-1 boards | Draft, for PO and Design lead review |
| Tokens | `tokens.css` |
| Components | `components.css` |
| Wording | `terms.md` |
| Index | `index.html` |

Agents write boards as HTML in this folder. They use these tokens and terms, and they do not publish to another canvas.

## Visual language

A desktop work tool for an office user on a 1366×768 screen (Personas D5). Left-aligned, one primary action per view, lists and numbered steps. Light is the working theme. A new pattern also has a dark board, built from the same tokens, placed 80px to the right of the light board.

| Token | Light | Dark |
|---|---|---|
| Background / text | `#F4F1EA` / `#1C1915` | `#1C1915` / `#F4F1EA` |
| Muted text | `#4E483F` | `#C8BFB2` |
| Border, radius | 1px `#E4DDD2`, 4px | 1px `#3F3830`, 4px |
| Primary action | `#1F4E5F` on `#F4F1EA` text | `#8FB8C4` on `#1C1915` text |
| Font | Be Vietnam Pro, 14px body, 16px screen title | same |
| Status | Label text plus a tint: ready, attention, stopped | same hues |

No gradient, glow, nested card or decorative icon. Status color never carries the meaning alone. Buttons are at least 40px tall.

## Design calls for REL-1

- The first-run screen asks only for the display name. It has no connection chip.
- After that, the title bar always shows the display name and a chip for the connection. The chip opens the connection screen.
- The reminder is a banner on the next screen, with one button. It does not block the screen and does not say the training option is off.
- When both services are Ready and no choice has been made, the connection screen says Chưa chọn. It does not ask. The question appears on the placeholder action (release plan N8). The two choices are equal buttons, so neither looks like the default.
- When only one service is Ready, a line says Thermora will use it.
- Setup help shows the text that will be copied, then the copy button. Sample versions on the boards are not the supported-version list (that list is the technical design).
- Sign-in has two help boards: open the provider's own sign-in, or tell the person that the supporter is needed. No board has a field for a password, code or token.
- "Bắt đầu việc" is the placeholder action. It is removed when PRD02 has a real action (release plan N9). The label lives only on the board title, not as a second product.

## REL-1 boards

| Board | Pattern | Covers |
|---|---|---|
| `prd01/01-ten-hien-thi.html` | Window + form (new) | US-01, AC-01, AC-02, AC-03, AC-04. AC-05 and AC-37 reuse this screen |
| `prd01/02-trang-thai.html` | Status list (new) | US-02, AC-07, AC-09, AC-10, AC-11, AC-12, AC-19, AC-39 |
| `prd01/03-huong-dan.html` | Numbered help (new) | US-03, US-04 AC-14 to AC-16, AC-13, AC-22, AC-27 |
| `prd01/04-nhac-du-lieu.html` | Banner (new) | US-06, AC-23, AC-25. AC-24 is REL-2 |
| `prd01/05-hanh-dong-mau.html` | Placeholder action (new) | US-05 AC-17, US-03 AC-21 |

AC-15 is the absence of any sign-in field on these boards. AC-28's start-up half is the check described on the status board: no request is drawn because none is made.

## Not in REL-1

Health check screen, connection test, changing the chosen service, plan-limit and unreachable messages, a lapsed sign-in during work, renaming, and the version screen. Those are REL-2.
