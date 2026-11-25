# Port quy trình Agile từ DAONT-BASE sang AI-BASE

Nguồn: DAONT-BASE `dbfa515..b1583d1` (PR #81 `902c275`, #82 `b6de890`, #83 `b1583d1`).
Thiết kế gốc và lý do: `DAONT-BASE/docs/superpowers/specs/2026-11-25-agile-planning-design.md`.
Quy tắc đang áp dụng: `DAONT-BASE/docs/process/lifecycle.md` (nguồn đúng hơn thiết kế gốc).

## 1. Thay đổi đã triển khai

| # | Thay đổi | Nội dung chính |
|---|---|---|
| 1 | Kế hoạch phát hành (1b) | `docs/backlog/PRDxx-<tên>.md`: story map, `PRDxx-REL-n`, cỡ áo. `REL-1` là walking skeleton; REL đã duyệt không đánh số lại |
| 2 | Nền kiến trúc (1c) | Tech v1.0 = phần chung + `REL-1`; trạng thái tech tính theo từng REL; UI `REL-1` làm trước |
| 3 | Vòng sprint | Refinement (trước một sprint), planning, code, review/merge, sprint review, retro |
| 4 | DoR / DoD | Theo story hoặc phần story theo tập AC; point Fibonacci, tối đa 8; velocity = 3 sprint gần nhất |
| 5 | Tiến độ | Cột mới, bảng *Sprint*, bảng *Story* (khi không có Plane), PR tài liệu sau sprint qua `/git-accept` |
| 6 | Gate | `check-release-plan.ts` trong test gate, CI, `/git-accept` |
| 7 | Plane | Ánh xạ, mốc trạng thái, quyền ghi, `Plane:` trong PR và trailer commit, `Plane: none (<lý do>)` |
| 8 | CI đồng bộ Plane | `plane-sync.ts`: gắn link PR, Ready For Testing / Testing / In Progress |
| 9 | Nội dung work item | Tiếng Việt, ngắn; mẫu title và mô tả cho story và bug |

## 2. Khác biệt của AI-BASE (không chép đè)

Hầu hết tệp trùng tên đã khác nhiều. Port bằng cách viết lại từng đoạn theo diff, không copy cả tệp.

- Tài liệu bằng **tiếng Anh**; `.claude/decisions.md` mỗi mục khoảng 80 từ.
- **Làm theo nhóm:** vai người trong `AGENTS.md` § Team Roles, cột *Owner*, branch protection, hàng đợi merge.
- **Không phụ thuộc stack:** phần riêng sản phẩm để `TODO(stack)`; agent test là `qa-app`.
- **Đã bỏ GitLab:** không port `.gitlab-ci.yml`, các giới hạn GitLab, và dòng `.gitlab-ci.yml` trong `risk-tier.ts`.

## 3. Tệp cần port

| Tệp | Cách port |
|---|---|
| `scripts/check-release-plan.ts` + test | Chép rồi đổi chuỗi theo § 4 |
| `scripts/check-prd-approval.ts` | Chỉ thêm `export` cho `headerValue`; giữ `DATE_ROW` của AI-BASE |
| `scripts/plane-sync.ts` + test | Chép gần nguyên |
| `scripts/risk-tier.ts` + test | Thêm tier 2: `scripts/plane-sync(.test).ts`, `.claude/plane*.json` (phải đứng trước luật tier 0 của `.claude/`) |
| `scripts/test-gate.sh` | Thêm `bun scripts/check-release-plan.ts` sau `check-personas` |
| `.github/workflows/test.yml` | Thêm bước đó vào job `scripts` |
| `.github/workflows/plane-sync.yml` | Chép; **không** đưa vào required checks của branch protection |
| `.claude/plane.example.json` | Chép |
| `docs/backlog/{README,_template}.md` | Dịch; lịch sử thay đổi dùng đúng định dạng PRD của AI-BASE |
| `docs/tech/{README,_template}.md` | Bảng trạng thái theo REL, cột `REL`; bỏ dòng `Status` chung |
| `docs/prd/README.md` | Bước thiết kế theo REL, trỏ tới kế hoạch phát hành |
| `docs/process/lifecycle.md` | Phần lớn nhất; xem § 5 và § 6 |
| `docs/process/progress.md` | Cột và bảng mới, giữ cột *Owner* |
| `docs/process/decisions.md`, `.claude/decisions.md` | Viết mục mới của AI-BASE, không chép lịch sử |
| `.claude/commands/git-accept.md` | Chạy `check-prd-approval` cả trên `docs/backlog/*.md`; câu về `progress.md` nhắc thêm PR sau sprint |
| 7 agent: `business-analyst`, `implementer`, `pr-reviewer`, `product-manager`, `solution-architect`, `tech-lead`, `ui-designer` | Thêm lại từng đoạn theo diff |
| `AGENTS.md` | Bảng vòng đời có 1b, 1c-UI, 1c, 6b, 6c; ai ghi Plane |
| `README.md`, `workflow-setup-guide.md` | Nhắc quy trình mới và bước bật Plane |

Spec và plan trong `DAONT-BASE/docs/superpowers/` không chép sang.

## 4. Chuỗi phụ thuộc ngôn ngữ trong `check-release-plan.ts`

- `headerValue(…, 'Mã')` → `'Code'`. Khoá `'PRD'` và `**Release plan:**` giữ nguyên.
- Trạng thái dùng `status()` của AI-BASE (khoá `Status`).
- Dòng duyệt trong fixture test: `User approval`, nguồn theo `docs/prd/_template.md` § 14 của AI-BASE.
- Kiểm tra mức ưu tiên bắt đầu bằng `Must`, và thứ tự cột bảng US/FR/AC phải khớp mẫu PRD của AI-BASE.
- Comment đầu tệp trỏ tới tên mục tiếng Anh trong `lifecycle.md`.

## 5. Sửa luôn khi port (DAONT-BASE còn hở)

- Mục `1c`, `1d`… trong `lifecycle.md` trùng số với mã giai đoạn 1b, 1c: đặt số khác.
- Bỏ tham chiếu tới tệp spec trong § Plane (dự phòng label `pt-n`) và câu "Bản thân DAONT-BASE không có tệp này".
- Việc tạo work item `bug` chưa có trong bảng mốc trạng thái.
- "Module có hạng 2" sai: hạng tính theo thay đổi; thống nhất tiêu chí gọi `appsec`.
- `pr-reviewer` chưa dẫn chiếu DoR/DoD dù `lifecycle.md` nói có.
- `tech-lead` ghi cỡ áo nhưng không rõ ai ghi dòng lịch sử thay đổi.
- Tiêu đề mẫu backlog ghi `REL-XX`, mã là `PRDXX-REL`.
- Retro cần "thời gian ở Pending" nhưng không có Plane thì không có nguồn.
- CI: cập nhật PR đang mở kéo item *Testing* về *Ready For Testing*; chuyển PR về draft không rút trạng thái.

## 6. Cần quyết trước khi port (chế độ nhóm)

| Câu hỏi | Đề xuất |
|---|---|
| Ai là PO duyệt kế hoạch phát hành, chốt sprint, nghiệm thu? | Vai PO trong § Team Roles |
| "Phiên chính" nào ghi Plane, `progress.md`? | Phiên của *Owner* module/phase |
| Nhiều module, nhiều Owner trong một sprint: ai tính velocity, đóng Cycle? | Một người được chỉ định cho mỗi sprint |
| Plane trong template không phụ thuộc stack? | Giữ tuỳ chọn: không có `.claude/plane.json` thì bỏ qua |
| Ngôn ngữ nội dung trên Plane | `TODO(team)` thay vì cố định tiếng Việt |
| Token | Nhiều người push được thì ai cũng đọc được `PLANE_API_KEY`: dùng tài khoản bot ít quyền, hoặc environment chỉ nhánh bảo vệ (đọc tài liệu GitHub trước) |

## 7. Thứ tự và kiểm tra

1. Script và test (checker, plane-sync, risk-tier).
2. Gate, CI, `plane-sync.yml` (hạng 2: review Opus).
3. Mẫu `docs/backlog`, `docs/tech`.
4. `lifecycle.md`, `progress.md`, decisions.
5. Agent, `AGENTS.md`, `git-accept`, README và guide.

Kiểm tra: `scripts/test-gate.sh`; mọi tham chiếu `§` trỏ tới heading có thật; copy mẫu backlog thành tệp thử, chạy checker rồi xoá.

Chưa được kiểm chứng ở nguồn: quy trình chưa chạy với module nào; `plane-sync` chưa ghi lên Plane thật; phạm vi secret của GitHub chưa đối chiếu tài liệu.
