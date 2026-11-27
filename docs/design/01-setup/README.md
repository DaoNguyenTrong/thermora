# PRD01-REL-1 boards: Setup and connection

| Item | Value |
| --- | --- |
| Status | Approved |
| Version | 0.2 |
| Updated | 2026-11-27 |
| Canvas | `docs/design/01-setup/` (open `index.html`) |
| Approver | PO + Design lead |
| Inputs (all Approved) | PRD01 v0.2, PRD-00, Personas v0.5, PRD01-REL v0.2, design system v0.4 |
| Platform | Desktop window 1366x768 (Windows, macOS, Ubuntu); primary persona P-01, same screens for P-02 |

The boards use only `../system/tokens.css`, `../system/board.css` and the system's components and patterns. There is no CSS of its own. Each page stacks one 1366x768 window per state. Boards built from existing patterns are light only; they rely on the dark boards in `system/components.html` and `system/patterns.html`. Board 05 is the only one with a dark twin.

## Boards

| File | Title | Covers | Persona |
| --- | --- | --- | --- |
| `01-first-run.html` | Trang chạy lần đầu (3 frames) | PRD01-FR-01, AC-01, AC-02, AC-04 | P-01 |
| `02-service-states.html` | Dịch vụ AI: kết quả kiểm tra (3 frames) | PRD01-FR-03, FR-04, AC-07, AC-10, AC-11, AC-12, AC-19, AC-39 | P-01 |
| `03-setup-help.html` | Hướng dẫn thiết lập (1 frame) | PRD01-FR-05, FR-08, AC-08, AC-13, AC-22, AC-27 | P-01 |
| `04-sign-in.html` | Đăng nhập dịch vụ AI, cases a and b (5 frames) | PRD01-FR-06, AC-09, AC-14, AC-15, AC-16, AC-27 | P-01 |
| `05-data-reminder.html` | Nhắc nhở về dữ liệu (light and dark) | PRD01-FR-09, AC-23, AC-25 | P-01 |
| `06-choose-and-unavailable.html` | Chọn dịch vụ và nút AI chưa dùng được (4 frames, placeholder) | PRD01-FR-07, FR-08, AC-17, AC-21 | P-01 |

Boards 05 and 06 show a placeholder screen named "Dự án" with a "Gửi cho AI" button. It stands for the work PRD02 builds, is labelled as a placeholder on the board, and is not a product control.

## Coverage of REL-1

| Requirement | Board | Note |
| --- | --- | --- |
| FR-01, AC-01 | 01 first run, frame 1 | One field, one-line note, no rail |
| AC-02 | 01, frame 2 | System field-error state |
| AC-04 (BR-03) | 01, frame 3 | Drawn on the first-run page, see design call 7 |
| AC-03, AC-05, AC-37 | 01 | Behaviour with no separate look: trimming, no uniqueness check, asked again on a second machine |
| FR-03, AC-07 | 02 frame 2, 04 frame 4 | Ready |
| AC-08 | 03 | Not installed |
| AC-09 | 04 frames 1 to 3 and 5 | Installed but not signed in |
| AC-10 | 02 frame 2 | Version not supported |
| AC-11 | 02 frame 3 | Cannot be checked; the text never says the machine is offline, only "took too long" or "not confirmed", then "check the network and check again" |
| AC-39 | 02 frames 1 and 3 | Working indicator; "took too long" |
| FR-04, AC-12 | rail indicator in every frame; 02 | Both services listed, the one in use marked |
| FR-05, AC-13 | 03 | Numbered steps for each service; supporter text |
| FR-06, AC-14, AC-15, AC-16 | 04 | Both case a and case b; no field for password, code or token |
| FR-07, AC-17 | 06 frames 1 and 2, rail in frame 4 | Asked once, at first use of the placeholder action; the rail then shows the chosen service |
| AC-19 | 02 frame 2, 04 frame 4 | One Ready service used without asking, and said so |
| FR-08, AC-21 | 06 frames 3 and 4 | Placeholder action unavailable, reason and link to setup help; frame 4 is the chosen service no longer Ready, with no switch to the other service |
| AC-22 | 03 | Opens to the setup help |
| FR-09, AC-23, AC-25 | 05 (light and dark) | One button, no claim about the training option |
| FR-10 (AC-27 only) | 03, 04 frame 5 | Multi-line copy block with states, versions and service names |
| FR-15 | none | Kept on this machine; no screen |
| AC-28 (start-up half) | none | Observed in traffic, not on a screen |
| AC-43 | every frame | No account, role or permission anywhere |

Not covered: none of the REL-1 FRs or ACs lacks a board, except the ones above that have no screen of their own. Not drawn on purpose (REL-2): AC-18, AC-20, AC-24, AC-26, AC-28 health-check half, AC-29 to AC-33, AC-34, AC-38, AC-40 to AC-42, FR-02, FR-11 to FR-14, FR-16, FR-17.

## Design calls

1. [call] One window per state, stacked vertically, light only. The reminder (board 05) also has a dark twin, because a panel that appears on its own is a new interaction.
2. [call] The one-time reminder is the system's side panel at the right of the window. It appears on the next screen after a service first becomes Ready, blocks nothing, and has one button, "Đóng". The button is secondary because the screen's primary action is the placeholder one; there is no close icon so that there is one way to close. The pointers to the provider settings are plain text, not links. It never says the option is off, and says Thermora cannot check it.
3. [call] The first-use choice is an inline block on the placeholder screen, using the choice cards. Nothing is preselected. "Dùng dịch vụ này" uses the unavailable-action pattern with the reason "Chọn một dịch vụ trước." until a card is chosen. There is no "change it in settings" line, because changing the choice is REL-2.
4. [call] Two rail-indicator wordings that system 0.4 does not have: both Ready and none chosen ("Hai dịch vụ AI · Sẵn sàng · Chưa chọn", success icon) and while checking ("Dịch vụ AI · Đang kiểm tra", the system spinner in the info color, as the Checking state in system 0.4; the circle-question icon stays only for "Không kiểm tra được"). Same component, new text only.
5. [call] The page that shows both services is "Dịch vụ AI". It opens only from the rail indicator, so the rail has no second item for it. The only nav item is the placeholder "Dự án".
6. [call] The setup help sits on the same page, under the service rows: one column of steps per service that needs it, and one column of text for the person who supports the user. The service page has no primary action except "Mở trang đăng nhập". "Kiểm tra lại" is per service and secondary; a page-wide re-run is the REL-2 health check.
7. [call] AC-04 (more than 50 characters) is mapped to BR-03, which serves FR-01 and FR-02. REL-1 has FR-01 only, but BR-03 applies to the first entry, so it is drawn on the first-run page. The message is "Tên dài tối đa 50 ký tự." The frame holds 51 characters.
8. [call] Sign-in is drawn as both case a (Thermora opens the provider's page: steps, waiting block, half-done result, success) and case b (outside help, with the text to hand over). Case b tells the person to sign in themselves and not to send a password or code to anyone, the supporter included.
9. [call] When one service is Ready, a banner says which one Thermora uses ("Chỉ có Codex sẵn sàng, nên Thermora dùng Codex."), in addition to the "Đang dùng" chip and the rail indicator.
10. [call] The text for the supporter holds the Thermora version, the service in use, and each service with its version and state, nothing else. A service that is not installed has no version.
11. [call] Command lines in the steps (`npm install -g ...`) and the "Mở trang hướng dẫn" links (`#`) are illustrative. The technical design decides the real ones.
12. [call] Vietnamese the system does not list (call 27): "Dự án" (PRD-00 term, as the placeholder nav item), "Mở trang đăng nhập", "Hai dịch vụ AI", "Sẵn sàng · Chưa chọn", "Thông tin cho người hỗ trợ bạn", "Đóng". The reminder names the provider settings in English, as the providers show them (SA ruling): Claude "Settings → Privacy" (claude.ai privacy controls, toggle name not quoted); ChatGPT "Settings → Data controls", toggle "Improve the model for everyone". A short line says the names may change and to look on the provider's own page. No claim that the option is on or off (BR-04, AC-25).
13. [call] The rail indicator's spinner takes the info color and a 3px margin through inline style on the board, because the system has no info variant of the indicator icon. Proposal for the system: `.svc-use.is-info`.
14. [assumption] Landing after the first-run page (PRD01 does not state it): the "Dịch vụ AI" page while no service is Ready or the check is running, then "Dự án" once one is Ready. Design lead to confirm.
15. [call] FR-06: cases a and b both stay drawn until the technical design decides (Tech lead, with appsec), because the providers' behaviour when launched without a terminal is not confirmed.

16. [call] (0.2, Q4) Offline is never stated. Thermora cannot tell no network from another failed check, so each "Không kiểm tra được" row says "Kiểm tra mất quá lâu." or "Chưa xác nhận được.", then "Kiểm tra kết nối mạng rồi kiểm tra lại."; the banner already says only that nothing is confirmed.
17. [call] (0.2, Q5) Chosen service not Ready: rail shows the service name with "Đã chọn · Chưa sẵn sàng" (the system's warning indicator, new text only). The action keeps the unavailable-action pattern, reason "Dịch vụ bạn đã chọn chưa sẵn sàng." and the link "Xem hướng dẫn thiết lập". The reason does not say why (not installed, signed out, too old); the setup help does. No switch to the other service.
18. [call] (0.2, Q10) The waiting block of case a also says "Đừng gửi mật khẩu hay mã cho ai.", as case b does.
19. [call] (0.2, Q8) Subscription line: in 03 each install list gains a step "Khi cài xong, đăng nhập bằng tài khoản gói đăng ký của bạn." before "Chọn Kiểm tra lại."; in 04 the sign-in steps say "tài khoản gói đăng ký" (Claude, in case a and b).

## Open questions

1. Tech-lead: can the provider's own sign-in be started without a terminal for each tool (case a or b of FR-06)? Both are drawn until it is decided. Which tool is which case may differ.
2. Design lead: confirm design calls 2 (reminder in the side panel) and 4 (two new rail-indicator wordings). If either is rejected it goes into the system first.
3. PO: confirm the wording of the sign-in step in case b.
4. Design lead: confirm the landing after the first-run page (call 14).

## Change log

| Date | Version | Change | Source |
| --- | --- | --- | --- |
| 2026-11-27 | 0.1 | First boards of PRD01-REL-1 for review | metadata |
| 2026-11-27 | 0.1 | SA rulings: provider setting paths, checking indicator, landing and sign-in cases recorded | SA (on behalf of user) |
| 2026-11-27 | 0.1 | User approval of the REL-1 boards, including the reminder side panel, the two new rail-indicator wordings, the landing after the first-run page and the case b sign-in wording. FR-06 case a or b stays open for the technical design | user decision (PO + Design lead: DaoNguyenTrong) |
| 2026-11-27 | 0.2 | Q4 offline wording, Q5 chosen-service-not-ready frame, Q10 waiting text, Q8 subscription line | user decision (PO + Design lead: DaoNguyenTrong), 2026-11-27 |
| 2026-11-27 | 0.2 | User approval of v0.2, including the rail wording "Claude Code · Đã chọn · Chưa sẵn sàng" and the subscription-account wording in boards 03 and 04 | user decision (Design lead: DaoNguyenTrong) |
