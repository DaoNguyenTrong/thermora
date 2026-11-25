# Hướng dẫn dựng quy trình làm việc với agent cho một project mới

Tài liệu này mô tả đầy đủ cách dựng lại quy trình làm việc của DAONT-BASE trong một project khác: vòng đời từ ý tưởng đến phát hành, các agent chia theo vai, cổng duyệt, rào chắn git, script kiểm tra, CI và phát hành. Nó không gắn với một stack nào, áp dụng được cho web, mobile, desktop hay app đa nền tảng, và cho nhóm nhiều người.

Đây là hướng dẫn dựng, không phải nguồn quy tắc của DAONT-BASE. Quy tắc đang áp dụng ở repo này vẫn nằm trong `AGENTS.md` và `docs/process/lifecycle.md`.

> **Update (2026-11-25): Agile planning.** The sections below describe the earlier flow and have not been rewritten. Where they differ, `AGENTS.md` and `docs/process/lifecycle.md` win. When setting up a project, apply this instead of the stage table in §6.1:
>
> | Stage | Output | Approver |
> |---|---|---|
> | 0 Idea and vision | personas, module list | PO |
> | 1 Requirements | PRD | PO |
> | 1b Release plan | `docs/backlog/` | PO |
> | 1c-UI UI of `REL-1` | design boards | PO + Design lead |
> | 1c Architecture runway | tech doc v1.0: common part and `REL-1` | Tech lead (+ Security owner for a security area) |
> | 2 UI design | boards of the next release | PO + Design lead |
> | 3 Technical design | next release in the tech doc | Tech lead (+ Security owner for a security area) |
> | 4 Sprint planning | sprint plan | PO (stories), Tech lead (plan file) |
> | 5 Implementation | code, tests | by risk tier |
> | 6 Review and merge | PR into `dev` | `pr-reviewer` or the human approver |
> | 6b Sprint review | demo | PO |
> | 6c Sprint retro | sprint numbers | — |
> | 7 Release | tag, changelog | Release manager |
>
> - Also copy `scripts/check-release-plan.ts`, `scripts/plane-sync.ts` (with their tests), `docs/backlog/`, `.github/workflows/plane-sync.yml` and `.claude/plane.example.json`.
> - Only the session of a module's Owner writes to Plane and `progress.md` (the Sprint owner's session for the Cycle); subagents never call Plane.
> - Plane is optional. To turn it on, follow `README.md` § Turning Plane on.

## 0. Cách đọc

| Ký hiệu | Nghĩa |
|---|---|
| 🔒 | Giữ nguyên ở project mới. Đây là phần làm nên quy trình |
| ⚙️ | Phải thay theo project: tên, đường dẫn, stack, lệnh |
| 👥 | Điều chỉnh khi làm theo nhóm (§15) |
| 📱 | Điều chỉnh cho app đa nền tảng (§16) |

Đọc §1–§2 để nắm ý, rồi làm theo lộ trình ở §17. Các mục ở giữa là chi tiết từng lớp; phụ lục B có khung tệp để chép.

---

## 1. Bảy nguyên tắc cốt lõi 🔒

1. **Phiên chính điều phối, agent làm việc theo vai.** Phiên Claude Code bạn đang nói chuyện là người điều phối. Nó gọi agent theo đúng thứ tự, chuyển câu hỏi và câu trả lời. Nó không tự làm thay việc của agent, và không tự sửa code sản phẩm: code đi qua `implementer`. Subagent không hỏi được người dùng và không gọi được agent khác.
2. **Không vào giai đoạn sau khi giai đoạn trước chưa duyệt.** Persona → PRD → thiết kế giao diện → thiết kế kỹ thuật → kế hoạch → code. Một câu hỏi nghiệp vụ phát hiện ở giai đoạn sau quay về sửa PRD, không được quyết tại chỗ.
3. **Agent không bao giờ bịa quy tắc nghiệp vụ.** Thiếu quy tắc thì dừng và hỏi. Mơ hồ kỹ thuật thì agent tự quyết và ghi lại là quyết định của mình.
4. **Người dùng chỉ bị hỏi những gì không ai khác quyết được.** Mọi câu hỏi đi qua `solution-architect` trước. Agent này trả lời thay người dùng và chỉ chuyển lên những câu thật sự thuộc về họ: tiền, phạm vi, bảo mật, phê duyệt.
5. **Mức kiểm tra theo rủi ro, do script tính.** Hạng 0–2 được tính từ đường dẫn và nội dung thay đổi, không do ai tự đánh giá. Vùng nhạy cảm nhận reviewer mạnh hơn và cần người merge.
6. **Mỗi quy tắc nằm ở một nơi.** Nơi khác chỉ trỏ tới bằng `tệp § mục`, không chép lại. `AGENTS.md` là mục lục.
7. **Lỗi lặp lại hai lần thì tự động hoá.** Không thêm một dòng quy tắc văn bản nữa; biến nó thành lint, test kiến trúc, script hoặc generator. Thay đổi quy trình chỉ áp dụng ở retro cuối module.

---

## 2. Bức tranh tổng thể

```
┌───────────────────────────── Người dùng / Product Owner ─────────────────────────────┐
│  duyệt persona, PRD, thiết kế, tech design, kế hoạch; merge vùng nhạy cảm; phát hành    │
└───────────────▲──────────────────────────────────────────────────────────────────────┘
                │ chỉ những câu SA chuyển lên
┌───────────────┴───────────────┐        ┌──────────────────────────────┐
│ Phiên chính (điều phối)       │◄──────►│ solution-architect           │
│ AGENTS.md + lifecycle.md      │        │ trả lời thay người dùng       │
└──┬────────┬────────┬──────────┘        └──────────────────────────────┘
   │        │        │
   ▼        ▼        ▼
 Tài liệu  Code    Cổng
 ───────   ─────   ─────
 product-manager   implementer        code-reviewer (hạng 2, sau từng task)
 business-analyst  qa-<platform>      pr-reviewer (mỗi phase, merge vào dev)
 ui-designer       sdet               appsec (thiết kế + code nhạy cảm)
 tech-lead                            /git-accept (PR chỉ có tài liệu)

Rào chắn máy móc (chạy bất kể agent nào):
  .claude/settings.json deny + hook chặn lệnh bash → Lefthook (branch guard, secretlint,
  format, commitlint) → scripts/test-gate.sh → CI (cùng gate) → release-kit
```

Có mười lớp. Mỗi lớp là một mục bên dưới:

| # | Lớp | Tệp chính | Mục |
|---|---|---|---|
| 1 | Công cụ trên máy | Claude Code, plugin, MCP | §3 |
| 2 | Tài liệu điều phối | `AGENTS.md`, `docs/process/*` | §5, §6 |
| 3 | Tài liệu sản phẩm | `docs/prd/`, `docs/tech/`, `docs/superpowers/plans/` | §7 |
| 4 | Agent theo vai | `.claude/agents/*.md` | §8 |
| 5 | Rule theo đường dẫn | `.claude/rules/*.md` | §9 |
| 6 | Skill và lệnh | `.claude/skills/`, `.claude/commands/` | §10 |
| 7 | Rào chắn | `.claude/settings.json`, hook, `lefthook.yml` | §11 |
| 8 | Script kiểm tra | `scripts/*.ts`, `scripts/test-gate.sh` | §12 |
| 9 | CI và phát hành | `.github/workflows/`, `.claude/release-kit.json` | §13 |
| 10 | Lớp Codex (tuỳ chọn) | `.codex/`, `.agents/skills/` | §14 |

---

## 3. Công cụ trên máy mỗi thành viên

### 3.1 Bắt buộc

| Công cụ | Dùng cho | Kiểm tra |
|---|---|---|
| Git + GitHub CLI (`gh`) ⚙️ (GitLab: `glab`) | commit, PR, skill `release-kit` | `gh auth status` |
| Bun | Lefthook, script kiểm tra, hook chặn lệnh bash | `bun --version` |
| Claude Code | CLI agent chính | `claude --version` |
| Plugin `superpowers` | brainstorming, writing-plans, subagent-driven-development, TDD, debugging, verification | `/plugin` |
| Plugin `release-kit` | `git-commit`, `git-mr`, `git-sync`, `git-release` | `/plugin` |
| CodeGraph (MCP) | định hướng mã: ai gọi ai, phạm vi ảnh hưởng | `codegraph status` |
| SDK của stack ⚙️📱 | build, test | tuỳ stack |

```bash
curl -fsSL https://bun.sh/install | bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
claude mcp add --scope user codegraph -- codegraph serve --mcp
codegraph init        # ở gốc repo, tạo .codegraph/ (gitignore)
```

Trong Claude Code:

```text
/plugin marketplace add DaoNguyenTrong/daont-claude-plugins
/plugin install superpowers@claude-plugins-official
/plugin install release-kit@daont-claude-plugins
```

### 3.2 Nên có

| Công cụ | Dùng cho |
|---|---|
| Serena (MCP, cài bằng `uv`) | đọc và sửa theo symbol khi language server của stack hỗ trợ tốt. Phải kiểm chứng trên stack mới (§9.3) |
| `context7` | tài liệu thư viện mới nhất |
| `playwright` | điều khiển trình duyệt (web) |
| Công cụ e2e trên thiết bị 📱 | Maestro, Detox, Patrol, XCUITest/Espresso, tuỳ stack |
| Claude Design (Artifact) | canvas thiết kế cho `ui-designer` |

### 3.3 Viết `AI_TOOLS_SETUP.md` cho project mới

Mỗi project có một tệp cài đặt riêng cho người mới, gồm: điều kiện tiên quyết, MCP bắt buộc, plugin, MCP nên có, công cụ tuỳ chọn, cách kiểm tra (`claude mcp list`, `/plugin`, `/mcp`, một câu hỏi thử với `codegraph_explore`) và những điều cần biết: không commit `.codegraph/`, `.claude/settings.local.json`, cấu hình bí mật; hook cần `bun` trên `PATH`. Dùng `AI_TOOLS_SETUP.md` của DAONT-BASE làm khung.

---

## 4. Cấu trúc thư mục chuẩn

```
<repo>/
├── AGENTS.md                      # mục lục quy trình, mọi phiên đều đọc
├── CLAUDE.md                      # (tuỳ chọn) chỉ trỏ tới AGENTS.md
├── AI_TOOLS_SETUP.md              # cài công cụ cho người mới
├── CONTRIBUTING.md                # quy ước commit, nhánh, release cho người
├── CHANGELOG.md                   # do git-release sinh, không sửa tay
├── lefthook.yml  commitlint.config.js  .secretlintrc.json  package.json
├── .claude/
│   ├── settings.json              # quyền, hook, plugin (commit)
│   ├── settings.local.json        # cá nhân (gitignore)
│   ├── agents/*.md                # 11 vai (§8)
│   ├── rules/*.md                 # quy tắc theo đường dẫn (§9)
│   ├── skills/<name>/SKILL.md     # generator, review chuyên biệt (§10)
│   ├── commands/git-accept.md     # cổng merge PR tài liệu
│   ├── reference/*.md             # tài liệu tra cứu, không tự nạp
│   ├── decisions.md               # quyết định nền tảng (append-only)
│   ├── sa-calibration.md          # các lần người dùng sửa câu trả lời của SA
│   └── release-kit.json           # cấu hình release-kit
├── .codex/  .agents/skills/       # (tuỳ chọn) lớp Codex (§14)
├── docs/
│   ├── process/
│   │   ├── lifecycle.md           # chi tiết vòng đời (§6)
│   │   ├── decisions.md           # quyết định quy trình
│   │   ├── progress.md            # tiến độ module + số đo
│   │   └── system-context.md      # quy mô, hạ tầng, chi phí, dữ liệu
│   ├── prd/  README.md _template.md _template-persona.md 00-personas.md 00-*.md NN-*.md
│   ├── tech/ README.md _template.md NN-*.md
│   ├── superpowers/plans/         # kế hoạch triển khai
│   ├── feature-map.md             # bản đồ tính năng góc nhìn người dùng
│   └── agent-error-log.md         # lỗi agent lặp lại + mục "Chờ retro"
├── scripts/
│   ├── test-gate.sh               # gate cục bộ = gate CI
│   ├── risk-tier.ts (+ .test.ts)  # tính hạng kiểm tra
│   ├── claude-bash-guard.ts       # hook chặn lệnh git/gh nguy hiểm
│   ├── check-prd-approval.ts      # thứ tự duyệt PRD
│   ├── check-personas.ts          # persona Approved trước mọi PRD
│   └── check-comments.ts          # độ dài comment
├── .github/workflows/ ci.yml test.yml release.yml
└── <mã nguồn theo stack> ⚙️📱
```

`.gitignore`. Giữ đúng các ngoại lệ, nếu không sẽ mất cấu hình dùng chung:

```gitignore
/.superpowers/
.codegraph/
.serena/*
!.serena/project.yml          # cấu hình Serena dùng chung (language server) — commit
.codex/*
!.codex/hooks.json
!.codex/agents/
!.codex/agents/**
.claude/worktrees/
.claude/scheduled_tasks.lock
.claude/settings.local.json
verify-output/
# ⚙️ mọi tệp cấu hình chứa bí mật; 📱 keystore, *.jks, *.p12, *.mobileprovision, google-services.json nếu chứa khoá
```

---

## 5. `AGENTS.md`: mục lục của quy trình 🔒

`AGENTS.md` là tệp mọi phiên Claude Code và Codex đều nạp. Nó chỉ giữ những quy tắc mọi phiên cần ngay; chi tiết trỏ sang tệp khác. Nên giữ dưới khoảng 150 dòng.

Dàn ý, theo đúng thứ tự trong DAONT-BASE:

1. **Bố cục monorepo** ⚙️📱: bảng `Path | Stack | Rule liên quan`. Với app đa nền tảng, mỗi lớp một dòng (ví dụ `api/`, `app/` dùng chung, `ios/`, `android/`, `desktop/`, `shared/contract/`). Ghi rõ nguồn sự thật của hợp đồng API và cách client được sinh ra.
2. **Vòng đời phần mềm**: bảng 8 giai đoạn (§6.1) với đầu ra và người làm, cùng một đoạn về vai trò điều phối của phiên chính.
3. **Lệnh thường dùng** ⚙️: test từng lớp, type-check, `scripts/test-gate.sh`. Danh sách đầy đủ ở `.claude/rules/commands.md`.
4. **Quy trình agent**:
   - *Pre-Task Protocol*: trỏ sang `.claude/agents/implementer.md`, nơi duy nhất mô tả các bước; ghi rằng phiên chính không sửa thư mục mã sản phẩm.
   - *Lỗi lặp*: hai lần thì tự động hoá.
   - *Worktree*: thiếu tệp gitignore, đọc `.claude/reference/worktrees.md` trước.
5. **Commit**: câu hỏi không phải lệnh commit; kiểm nhánh trước khi commit; stage theo đường dẫn, không `git add -A`; không `--no-verify`; chỉ push hay mở PR khi có lệnh, trừ khi đã cấp quyền một lần cho cả kế hoạch; mục `## Changelog`; mỗi lúc một PR vào `dev`; mọi merge vào `dev` đi qua cổng.
6. **Chọn công cụ**: CodeGraph trước để định hướng, rồi Serena hoặc LSP, rồi `Read`. Không grep trước. Bảng "khi biết symbol thì dùng gì" kèm phạm vi đã kiểm chứng cho từng ngôn ngữ ⚙️.
7. **Tích hợp superpowers**: skill nhường quy tắc của repo. Ghi rõ:
   - tài liệu đi vào `docs/prd/`, `docs/tech/` thay vì `docs/superpowers/specs/`;
   - kế hoạch đi vào `docs/superpowers/plans/`;
   - thiếu quy tắc nghiệp vụ thì dừng;
   - làm trên một nhánh `feature/*`, không tạo worktree;
   - không dùng `finishing-a-development-branch`, vì merge thuộc `pr-reviewer`.
8. **Codex** (tuỳ chọn): bảng đổi tên tool và skill (§14).
9. **Bất biến quan trọng** ⚙️: một đến ba quy tắc kiến trúc không bao giờ được phá, kèm test kiến trúc ép nó. Ở DAONT-BASE đó là entity chỉ dựng qua `static Create`.
10. **Nhật ký quyết định**: ba nơi theo phạm vi:
    - module → §12 của `docs/tech/<module>.md`;
    - nền tảng → `.claude/decisions.md`;
    - quy trình → `docs/process/decisions.md`.

Mỗi thư mục con có `AGENTS.md` riêng (`backend/AGENTS.md`, `app/AGENTS.md`…) chỉ liệt kê rule áp dụng cho thư mục đó, để Codex và phiên mở trong thư mục con cũng nhận đúng quy tắc.

---

## 6. Vòng đời: `docs/process/lifecycle.md` 🔒

Chép cấu trúc `docs/process/lifecycle.md` của DAONT-BASE. Các mục sau là phần cốt lõi.

### 6.1 Các giai đoạn

| # | Giai đoạn | Đầu ra | Người làm | Cổng |
|---|---|---|---|---|
| 0 | Ý tưởng, tầm nhìn | Persona, danh mục module, ưu tiên | Phiên chính (`brainstorming`) + `product-manager`, BA review | Người dùng |
| 1 | Yêu cầu | PRD | `product-manager`, BA review | Người dùng |
| 2 | Thiết kế giao diện | Bảng thiết kế gắn mã yêu cầu | `ui-designer` | Người dùng |
| 3 | Thiết kế kỹ thuật | `docs/tech/` | `tech-lead`, `appsec` nếu nhạy cảm | Người dùng |
| 4 | Kế hoạch | `docs/superpowers/plans/` | Phiên chính (`writing-plans`) | Người dùng; đồng thời quyết có cấp quyền push/PR không |
| 5 | Triển khai | Code, test, mục feature-map | `implementer`, mỗi lần một task | Theo hạng |
| 6 | Review, merge | PR vào `dev` | `pr-reviewer` hoặc `/git-accept` | Tự động, trừ vùng cần người dùng |
| 7 | Phát hành | Tag, changelog | `release-kit:git-release` | Người dùng |
| 8 | Vận hành, phản hồi | Phản hồi | Người dùng | Quay lại 0, 1 hoặc 5 |

Để bớt lượt gọi, phiên chính gom câu hỏi của một giai đoạn vào một lượt gọi `solution-architect`. Câu hỏi thuần kỹ thuật đã có mặc định hợp lý thì phiên chính tự quyết và ghi vào kế hoạch.

### 6.2 Cỡ công việc: quyết định cần tài liệu nào

| Cỡ | Khi nào | Đường đi |
|---|---|---|
| S | Sửa lỗi, việc vặt, không đổi hành vi hay hợp đồng | Bỏ giai đoạn 0–4; lỗi thì có test thất bại trước |
| M | Đổi hoặc thêm hành vi trong module đã có | Sửa PRD, thiết kế và tech design phần bị ảnh hưởng; kế hoạch ngắn |
| L | Module mới, hoặc chạm quyền, phiên, định danh | Đủ 0–6, `appsec` nếu nhạy cảm |

Việc S hoá ra cần đổi hành vi thì dừng và nâng lên M.

### 6.3 Hạng kiểm tra: quyết định kiểm kỹ đến đâu

| Hạng | Thay đổi | Kiểm tra |
|---|---|---|
| 0 | Tài liệu, locale, tệp sinh tự động, chỉ test | Chỉ CI; phiên chính tự xem diff |
| 1 | Hành vi thường ở vùng không nhạy cảm | `implementer` Sonnet; một lượt `pr-reviewer` Sonnet cho cả PR của phase |
| 2 | Xác thực, token, phiên, quyền, tách tenant, khoá và đồng thời, migration, CI và hook, chính script tính hạng ⚙️📱 | `appsec` review tech design; reviewer Opus sau từng task; khoảng 5 lỗi cài thử (mutation); `pr-reviewer` chạy Opus; người dùng merge |

Hạng là hạng cao nhất trong các tệp của thay đổi, do `bun scripts/risk-tier.ts --base origin/dev` tính. Người làm được nâng hạng, không được hạ.

Ở DAONT-BASE, hạng 2 còn gồm `package.json`, lockfile, `Dockerfile`, `docker-compose*`, `.env*`, tệp cấu hình ứng dụng và `.claude/settings*.json` (`risk-tier.ts` § `TIER2_PATHS`).

Hai cơ chế độc lập, đừng gộp làm một:
- **Hạng** (script) quyết định ai review và review bằng model nào.
- **Vùng cần người dùng** (§6.4, do `pr-reviewer.md` § 4 và bước phạm vi của `git-accept.md` ép) quyết định ai được merge.

Ví dụ: `.claude/agents/*.md` và `AGENTS.md` là hạng 0 (tài liệu), nhưng vẫn thuộc vùng cần người dùng, nên không tự merge được.

### 6.4 Cổng giữa các giai đoạn

- Không vào giai đoạn sau khi giai đoạn trước chưa duyệt.
- Sửa một tài liệu đã duyệt thì đưa nó về *In review*, tăng phiên bản, và xét lại tài liệu hạ nguồn. Sửa dòng liên kết hoặc metadata không tính.
- Sau 3 lượt sửa PR vẫn chưa đạt thì `ESCALATE`: chỉ ra tài liệu cần nghĩ lại, không có lượt sửa thứ 4.
- **Vùng cần người dùng** ⚙️: danh sách đường dẫn và chủ đề mà `pr-reviewer` không tự merge, gồm auth, `.claude/`, `.github/`, `AGENTS.md`, CI, hook, migration, cấu hình triển khai, và sửa hay xoá mục cũ của `decisions.md`.

### 6.5 Lệch thiết kế khi triển khai

- **Nhỏ** (không đổi hợp đồng API, quyền, mô hình dữ liệu lưu trữ, hành vi người dùng thấy): `implementer` làm tiếp và ghi vào mục *Lệch nhỏ so với thiết kế* của PR.
- **Lớn**: dừng task. `tech-lead` sửa tài liệu trên nhánh đang làm, người dùng duyệt lại, rồi mới làm tiếp. Không chắc thì coi là lớn.
- Kế hoạch đặt phần rủi ro kỹ thuật cao thành task spike đầu tiên, để lệch lớn lộ ra sớm.

### 6.6 Commit tài liệu

- PRD và tech design của một module nằm chung nhánh `chore/<module>-docs` với một PR nháp từ bản nháp đầu. Mỗi bản duyệt được commit lên đó. PR được merge một lần qua `/git-accept` khi mọi tài liệu đã *Approved*.
- Kế hoạch đi trên nhánh `feature/*`, chung PR với code.
- `implementer` không sửa và không commit PRD, tech design hay kế hoạch.

### 6.7 Độ dài tài liệu

- Kế hoạch mô tả giao diện public, danh sách tệp, ca kiểm thử và tiêu chí nghiệm thu. Không viết sẵn mã hoàn chỉnh.
- PRD nhắm khoảng 500 dòng (giới hạn mềm).
- Tech design dạng ngắn khoảng 200 dòng cho module không nhạy cảm.

### 6.8 Push, PR, merge

- Mỗi phase của kế hoạch là một nhánh `feature/<module>-phase-<n>` và một PR vào `dev`, tối đa khoảng 1.500 dòng mã không tính test và tệp sinh.
- Xếp chồng tối đa một tầng: phase N+1 được cắt từ phase N khi PR N đã qua `pr-reviewer`.
- Mỗi PR một mục đích. Không gộp tài liệu chờ duyệt với tooling.
- Mỗi lúc chỉ một PR vào `dev`: rebase lên `origin/dev`, rồi `push --force-with-lease`, rồi `gh pr merge --merge`. Lịch sử gần thẳng, mỗi PR một merge commit.
- Dọn nhánh sau merge: xác nhận nhánh đã nằm trong `origin/dev`, xoá nhánh remote, rồi `git branch -d` (không bao giờ `-D`).

### 6.9 Phát hành, ổn định, hotfix

- Chuẩn: cắt `release/vX.Y.Z` từ `dev`, soạn CHANGELOG trên đó, sửa lỗi QA trên `fix/*` vào nhánh release, rồi PR `release → main` và tag.
- Hotfix: `hotfix/*` cắt từ `main`, `code-reviewer`, rồi `git-release`.
- Sau mỗi lần phát hành, merge `main` về `dev` bằng merge commit.
- `quick`: `dev → main` không qua giai đoạn ổn định, chỉ khi người dùng yêu cầu rõ.

### 6.10 Truy vết

Mã yêu cầu đi suốt chuỗi: `P-nn` → `PRDxx-US-nn` → `PRDxx-FR-nn` / `AC-nn` → tiêu đề bảng thiết kế → mục tech design → task kế hoạch → tên test → dòng `PRD:` của feature-map → mô tả PR. Một mã không có hạ nguồn, hoặc một thành phần không có mã thượng nguồn, là một phát hiện ở bất kỳ khâu review nào.

### 6.11 Retro cuối module và đóng băng quy trình

Khi PR cuối của module merge:

1. Một agent Sonnet phân loại các commit `fix` theo nguyên nhân gốc.
2. Ghi các nhóm vào `docs/agent-error-log.md`.
3. Nhóm gặp từ hai lần trở lên thì tự động hoá.
4. Ghi số đo vào `progress.md`: số ngày, số PR, tỉ lệ `fix` (tổng và theo hạng), số câu hỏi tới người dùng, token agent.
5. Gom các thay đổi quy trình vào một PR.
6. Nếu tỉ lệ `fix` của hạng 1 cao hơn hạng 2, đưa các đường dẫn đó lên hạng 2.

Giữa module, chỉ sửa lỗi quy trình đang chặn việc. Ý cải tiến ghi vào mục *Chờ retro*.

### 6.12 Tiết kiệm chi phí phiên chính

- Opus dùng cho brainstorming, lập kế hoạch và review hạng 2.
- Khi kế hoạch đã duyệt, đề nghị người dùng chuyển sang `/model sonnet` để chạy. Phiên chính không tự đổi model.
- Mỗi phase chạy trong một phiên mới, tiếp tục từ ledger `.superpowers/sdd/<kế hoạch>/progress.md`.

---

## 7. Tài liệu sản phẩm và nhật ký

### 7.1 Persona: `docs/prd/00-personas.md` 🔒

Persona là cổng bắt buộc trước mọi PRD; `scripts/check-personas.ts` chặn điều này trong gate và CI. Mẫu `_template-persona.md` có:

- tổng quan (mã `P-nn`, phản persona `AP-nn`, chính/phụ);
- mỗi persona: mục tiêu, nỗi đau và cách xoay xở hôm nay, bối cảnh dùng (thiết bị, tần suất, ngôn ngữ, mức thành thạo), tình huống;
- phản persona;
- xung đột giữa các persona;
- bằng chứng;
- giả định cần kiểm chứng.

Mọi khẳng định gắn nhãn `[Người dùng]`, `[Dữ liệu]` hoặc `[Giả định]`.

Checklist duyệt:

- mỗi persona có ít nhất 2 mục tiêu, 2 nỗi đau và 2 tình huống;
- có đúng một persona chính và ít nhất một phản persona;
- không quá nửa số dòng của một persona là `[Giả định]`;
- không mô tả tính năng;
- thiết bị đủ rõ để chọn bố cục 📱.

### 7.2 PRD: `docs/prd/` 🔒

- `README.md` có hai phần. *Quy trình* gồm các bước: persona trước → soạn → BA review sớm → SA trả lời → review cuối và duyệt → thiết kế → tech → kế hoạch. *Danh mục* có các cột mã, PRD, trạng thái, phiên bản, phụ thuộc, thiết kế.
- `00-*.md` (PRD-00) giữ glossary, vai trò, ma trận quyền và vòng đời trạng thái. Các PRD khác chỉ tham chiếu tới nó.
- Mẫu `_template.md` có metadata (mã, trạng thái, phiên bản, người duyệt, phụ thuộc, thiết kế, kế hoạch) và các mục:
  1. bối cảnh;
  2. mục tiêu, không phải mục tiêu, phản mục tiêu;
  3. người dùng và vai trò;
  4. user story, có cột *Persona*;
  5. yêu cầu chức năng (FR);
  6. quy tắc nghiệp vụ (BR);
  7. tiêu chí nghiệm thu Given/When/Then (AC);
  8. trạng thái và trường hợp biên;
  9. dữ liệu ở mức nghiệp vụ;
  10. thông báo;
  11. yêu cầu phi chức năng;
  12. phụ thuộc, kèm mục *Chuyển cho PRD khác*;
  13. câu hỏi mở và *Mặc định đề xuất*;
  14. bảng quyết định;
  15. change log.
- Mã không bao giờ đánh lại. Sau lần duyệt đầu, mục bị bỏ được đánh `~~Removed~~`.
- Trạng thái đi Draft → In review → Approved. Change log ghi nguồn của mỗi thay đổi: `user decision`, `SA (thay người dùng)`, `BA review`, `metadata`. `check-prd-approval.ts` kiểm thứ tự: dòng BA review đứng trước dòng người dùng duyệt, và sau dòng duyệt chỉ có `metadata`.

### 7.3 Tech design: `docs/tech/` 🔒

Mẫu có 15 mục:

1. phạm vi và truy vết;
2. kiến trúc;
3. mô hình dữ liệu;
4. hợp đồng API (bảng route, request, response, lỗi, chính sách truy cập);
5. phân quyền;
6. luồng chính;
7. bảo mật và quyền riêng tư (threat model nếu nhạy cảm);
8. ghép với thiết kế giao diện;
9. hiệu năng;
10. di chuyển dữ liệu và triển khai;
11. chiến lược kiểm thử;
12. quyết định, rủi ro, phương án đã loại, phạm vi *Module* hay *Nền tảng*;
13. truy vết;
14. câu hỏi mở;
15. lịch sử.

Dạng ngắn bắt buộc có §1, §3, §4, §5, §11, §12 và §13. `README.md` có danh mục và mục *Ràng buộc đã biết*.

📱 Với app đa nền tảng, thêm vào §2, §8 và §10: phần nào chạy chung, phần nào riêng từng nền tảng; offline và đồng bộ; phiên bản tối thiểu của client mà API phải phục vụ; quyền hệ điều hành (camera, vị trí, thông báo); phát hành qua store và feature flag.

### 7.4 Kế hoạch: `docs/superpowers/plans/YYYY-MM-DD-<tên>.md`

Do `superpowers:writing-plans` viết. Đầu kế hoạch ghi các lệnh người dùng đã cấp (quyền push và PR), danh sách phase, và hạng của từng task. Mỗi task ghi mã FR/AC, tệp, giao diện, ca test và tiêu chí nghiệm thu. Task cuối là cập nhật feature-map.

### 7.5 Các tệp trạng thái và nhật ký

| Tệp | Nội dung | Ai ghi |
|---|---|---|
| `docs/feature-map.md` | Mỗi tính năng: vào bằng đâu, code ở đâu, selector hoặc testid, test đã có, dữ liệu test, cách kiểm tra, dòng `PRD:` | `implementer`, trong cùng PR với code |
| `docs/process/progress.md` | Bảng module × giai đoạn, và bảng *Số đo* | Chỉ phiên chính |
| `docs/process/system-context.md` | Người dùng, quy mô, triển khai, hiệu năng, chi phí, dữ liệu; mỗi giá trị gắn `[Người dùng]`, `[Đề xuất]` hoặc *Chưa xác định* | Phiên chính, người dùng duyệt |
| `.claude/decisions.md` | Quyết định nền tảng; chỉ ghi lý do, dưới 80 từ, viết tiếng Anh, append-only, đảo ngược bằng `Supersedes:` | Người làm thay đổi, trong cùng PR |
| `docs/process/decisions.md` | Quyết định quy trình, mới nhất ở trên | Phiên chính |
| `.claude/sa-calibration.md` | Mỗi lần người dùng sửa câu trả lời của SA: SA trả lời gì, người dùng chọn gì, bài học | Phiên chính, trong cùng PR với tài liệu được sửa |
| `docs/agent-error-log.md` | Lỗi agent lặp lại, và mục *Chờ retro* | Phiên chính, ở retro |

---

## 8. Agent theo vai: `.claude/agents/*.md`

### 8.1 Danh sách 11 vai

| Agent | Vai | Quyền ghi | Model | Ghi chú khi đổi stack |
|---|---|---|---|---|
| `product-manager` | Viết persona và PRD | chỉ `docs/prd/` | mặc định | 🔒 Gần như giữ nguyên |
| `business-analyst` | Review PRD/persona; biến yêu cầu thành AC; tìm quy tắc thiếu | chỉ đọc | nên `sonnet` | 🔒 |
| `solution-architect` | Trả lời câu hỏi thay người dùng; chuyển lên những câu thuộc người dùng | chỉ đọc | mặc định/Opus | ⚙️ Viết lại "Who you are" theo stack và kiểu sản phẩm 📱 |
| `ui-designer` | Thiết kế trên canvas, gắn mã yêu cầu | canvas | mặc định | ⚙️ Viết lại toàn bộ phần ngôn ngữ thiết kế, giữ các quy tắc chung |
| `tech-lead` | Viết `docs/tech/` | chỉ `docs/tech/` | mặc định | ⚙️ Quy tắc kiến trúc theo stack |
| `implementer` | Làm một task của kế hoạch, hoặc một việc S | mã sản phẩm | `sonnet` | ⚙️ Lệnh verify, công cụ định hướng |
| `qa-<platform>` | Viết test cho một nền tảng, dựa trên router/locale/testid thật | test | nên `sonnet` | ⚙️📱 Một agent cho mỗi nền tảng có UI riêng |
| `sdet` | Chứng minh bản sửa test chập chờn bằng chạy lặp, tắt retry | chỉ đọc | nên `sonnet` | ⚙️ Lệnh chạy lặp theo framework |
| `code-reviewer` | Review diff theo bảng rule của repo | chỉ đọc | `sonnet` (Opus cho hạng 2) | ⚙️ Bảng "vùng → rule → kiểm gì" |
| `pr-reviewer` | Cổng merge vào `dev`: PASS, CHANGES_REQUESTED, NEEDS_HUMAN, NOT_READY, ESCALATE | merge `dev` | `sonnet` (Opus cho hạng 2) | ⚙️ Tên check CI, vùng cần người dùng |
| `appsec` | Review tech design và code nhạy cảm | chỉ đọc | phiên chính truyền `model: opus` | ⚙️ Liệt kê đường cấp token thật của project 📱 |

Ở DAONT-BASE, chỉ `implementer`, `code-reviewer` và `pr-reviewer` có `model: sonnet` trong frontmatter. Các agent khác không ghi model, và quy tắc cá nhân trong `~/.claude/CLAUDE.md` yêu cầu phiên chính luôn truyền `model` khi gọi. Với nhóm 👥, quy tắc cá nhân không áp dụng cho mọi người, nên đặt model trong frontmatter của mọi agent: `sonnet` cho agent implement, review, QA và BA; để trống cho agent viết tài liệu cần suy luận sâu (PM, SA, tech-lead, ui-designer). `appsec` và review hạng 2 được phiên chính truyền `opus`.

### 8.2 Khung một tệp agent

Mọi agent theo cùng một khung. Giữ khung, chỉ thay phần đặc thù:

```markdown
---
name: <tên>
description: <một câu: làm gì, khi nào dùng, giới hạn (Read-only / never invents ...)>
model: sonnet            # với agent implement/review
tools: Read, Grep, Glob, Bash, Skill, mcp__codegraph__codegraph_explore
---

You are the <vai> for <Project> (see `AGENTS.md`). <Một câu về mục tiêu.>

You cannot talk to the user. The main session relays decisions to you; treat only relayed
decisions as the user's. Answers from `solution-architect` are applied the same way; record
their source as "SA (thay người dùng)".

Skills: <skill nào nạp khi nào; skill nào KHÔNG nạp và vì sao>.

## Inputs — refuse a brief that lacks these
## Sources / Rules / Process        ← phần đặc thù của vai
## Do not                            ← vùng cấm ghi, việc của vai khác
## Output                            ← định dạng trả về, tiếng Việt, giới hạn số dòng
```

Năm điều làm agent đáng tin:

1. Ghi rõ đầu vào bắt buộc, và từ chối brief thiếu.
2. Ghi rõ vùng được ghi; mọi thứ khác là *Do not*.
3. Có định dạng đầu ra cố định với giới hạn số dòng, để phiên chính không phải đọc dài.
4. Ghi rõ skill nào không nạp. Ví dụ `pr-reviewer` không nạp `code-review`, vì nó chạy nền và trả phát hiện sau khi merge.
5. Mỗi khẳng định đều có bằng chứng vừa chạy (`verification-before-completion`).

### 8.3 Những điểm phải giữ của từng agent 🔒

- **`product-manager`**:
  - mỗi PRD chỉ quyết phần của module mình;
  - chia chỗ hở thành *Câu hỏi mở* (tối đa khoảng 8 mỗi lượt) và *Mặc định đề xuất* (viết như đã quyết, liệt kê để duyệt một lần);
  - không viết "làm thế nào" (endpoint, bảng, framework);
  - không soạn PRD khi persona chưa *Approved*.
- **`business-analyst`**: có ba chế độ (PRD review, persona review, feature request). Phát hiện gắn nhãn `blocking` hoặc `non-blocking`; mỗi chỗ hở là một câu hỏi có đề xuất. Agent này review ngay bản nháp đầu, để người dùng chỉ nhận một lượt câu hỏi gộp.
- **`solution-architect`**:
  - đọc `system-context.md` và `sa-calibration.md` trước mỗi lần trả lời;
  - chọn cái đơn giản nhất đủ dùng ở quy mô thật;
  - an toàn theo mặc định;
  - dùng checklist chất lượng ⚙️ (tenant, quyền, hiệu năng, vận hành, đa ngôn ngữ, múi giờ, audit, accessibility, dữ liệu cá nhân);
  - có danh sách *không bao giờ tự quyết*: phê duyệt, tiền, phạm vi, persona, nới lỏng bảo mật, sửa `system-context.md`;
  - mỗi câu trả lời có các trường *Trả lời / Lý do / Phương án loại / Đảo ngược / Tự tin / Ảnh hưởng*.
- **`tech-lead`**:
  - truy vết mọi phần thiết kế về mã PRD;
  - quyết định có trade-off ghi ở §12; quyết định *Nền tảng* thì `implementer` chép sang `.claude/decisions.md`;
  - module nhạy cảm cần threat model và cờ *Needs appsec review*.
- **`implementer`**: Pre-Task Protocol 8 bước, và là nguồn duy nhất của các bước này:
  1. memory, decisions;
  2. `git status` và `git diff`;
  3. CodeGraph;
  4. Serena hoặc LSP;
  5. impact check mọi nơi gọi; 5b. feature-map; 5c. tái hiện lỗi trước khi sửa;
  6. thực thi từng bước nhỏ;
  7. verify (test, test kiến trúc và static check, e2e cho luồng người dùng, lỗi không còn tái hiện);
  8. ghi quyết định.

  Ngoài ra: phân biệt lệch nhỏ và lệch lớn; commit theo đường dẫn; chỉ push khi brief cho phép; vòng review tối đa 3 lượt.
- **`pr-reviewer`**:
  - điều kiện tiên quyết: nhánh đã rebase lên base mới nhất;
  - đếm lượt sửa bằng marker HTML trong comment PR (`<!-- pr-review verdict=... round=n -->`), để còn nhớ qua các phiên;
  - kiểm tra theo thứ tự: hạng → rule → PRD → tech design → feature-map → thiết kế → decisions → changelog → test → CI;
  - có danh sách *không bao giờ tự merge*;
  - merge bằng `--merge`; cấm `--admin`, `--auto`, `--squash`, `--rebase`, `--delete-branch`;
  - PR `fix/*` vào `release/vX.Y.Z` được review đầy đủ nhưng trả `NEEDS_HUMAN`; PR `chore/reconcile-main-*` cũng là của người dùng merge.
- **`ui-designer`**: giữ các quy tắc chung, thay phần ngôn ngữ thiết kế:
  - tránh "vẻ AI tạo ra" (10 quy tắc kiểm được);
  - ít dialog;
  - copy bằng ngôn ngữ người dùng;
  - dữ liệu thật;
  - mỗi bảng ghi mã FR và persona chính;
  - bảng sáng/tối cho mẫu mới;
  - chỉ thiết kế khi PRD đã *Approved*.

---

## 9. Rule theo đường dẫn: `.claude/rules/*.md` ⚙️

### 9.1 Cơ chế

Mỗi tệp rule có frontmatter `paths:`. Claude chỉ nạp rule khi phiên chạm vào đường dẫn khớp, nên ngữ cảnh luôn gọn:

```markdown
---
paths:
  - "app/**"
  - "packages/ui/**"
---

# <Tên quy tắc>

<Một câu: tệp này quyết định điều gì.>
```

Tệp không có `paths:` thì để ở `.claude/reference/`: chỉ đọc khi cần, không tự nạp.

### 9.2 Bộ rule nên có, viết lại cho stack mới

| Rule | Nội dung | Ghi chú |
|---|---|---|
| `architecture.md` | Các lớp và hướng phụ thuộc; test kiến trúc ép nó | Mỗi stack có công cụ riêng: ArchUnit, dependency-cruiser, eslint boundaries, import_lint… |
| `code-conventions.md` | Mẫu bắt buộc (factory, đặt tên, lỗi, async) | Chỉ những gì lint không ép được |
| `<client>-conventions.md` 📱 | Cấu trúc thư mục app, state, điều hướng, theme, i18n | Một tệp cho mỗi client có code riêng |
| `testing.md` | Bảng "thay đổi gì → test ở lớp nào → phải phủ gì", cách viết test, hạ tầng test, e2e, coverage, test chập chờn | Phần quan trọng nhất cần viết lại |
| `commands.md` | Mọi lệnh build, run, test, codegen, migration | Agent không đoán lệnh |
| `api-contract.md` | Nguồn sự thật của hợp đồng, cách sinh client, quy tắc khi đổi endpoint | 📱 Sinh cho nhiều client (TS, Dart, Kotlin, Swift) |
| `authentication.md` | Mọi đường cấp và đọc token, cookie, phiên; quy tắc fail-closed | `appsec` đọc tệp này |
| `localization.md` | Ngôn ngữ, khoá, định dạng ngày và số | |
| `comments.md` 🔒 | Khi nào viết comment; điều không bao giờ ghi trong comment; tối đa 3 dòng × 120 ký tự | Giữ nguyên, script ép |
| `serena.md` (hoặc `lsp.md`) | Phạm vi công cụ symbol đã kiểm chứng | Xem §9.3 |

### 9.3 Kiểm chứng công cụ symbol trên stack mới

DAONT-BASE phát hiện `find_referencing_symbols` của Serena bỏ sót nơi gọi nằm trong `.vue`. Với stack mới, trước khi viết bảng *Chọn công cụ* trong `AGENTS.md`, hãy tự kiểm:

1. Chọn một symbol được gọi ở nhiều loại tệp.
2. So kết quả của Serena với `codegraph_explore` và `grep`.
3. Ghi phạm vi đáng tin vào `serena.md`.

Với ngôn ngữ chưa kiểm chứng, mặc định dùng CodeGraph để tính phạm vi ảnh hưởng.

---

## 10. Skill và lệnh

| Thành phần | Mục đích | Mang sang |
|---|---|---|
| `.claude/commands/git-accept.md` | Cổng merge PR chỉ có tài liệu: đúng nhánh và đã rebase, có changelog, phạm vi chỉ tài liệu (trừ `.claude/`, `.github/`, `AGENTS.md`, `docs/process/` ngoài `progress.md`), CI xanh, `check-prd-approval`, đọc diff tìm tham chiếu hỏng, comment ghi kết quả, merge `--merge`, dọn nhánh | 🔒 ⚙️ tên check CI |
| `.claude/skills/new-<slice>/` | Generator dựng một lát cắt mới (entity → service → DTO → API → test), cộng các bước template không làm được | ⚙️ Viết lại cho stack: lỗi lặp nhiều nhất thường là thiếu một tầng |
| `.claude/skills/<arch>-review/` | Review kiến trúc chuyên biệt | ⚙️ |
| Plugin `release-kit` | `git-commit`, `git-mr` (PR body có `## Changelog` và `prExtraSections`), `git-sync`, `git-release` | 🔒, cấu hình qua `.claude/release-kit.json` |
| Plugin `superpowers` | brainstorming, writing-plans, subagent-driven-development, executing-plans, TDD, systematic-debugging, verification, receiving-code-review | 🔒, ghi đè hành vi trong `AGENTS.md` § Superpowers Integration |

Nguyên tắc: một việc lặp từ ba lần trở lên với các bước cố định thì làm thành skill hoặc generator, thay vì mô tả bằng văn bản.

---

## 11. Rào chắn máy móc 🔒

Văn bản không đủ: agent đôi khi vẫn chạy `git add -A` hay `--no-verify`. Ba lớp chặn chạy độc lập với agent.

### 11.1 `.claude/settings.json`: quyền và hook

Đây là cấu hình chung của project (commit vào repo). Nó chặn lệnh nguy hiểm, chạy guard trước mỗi lệnh Bash, và khai báo plugin. Mẫu ở phụ lục B.1.

### 11.2 `scripts/claude-bash-guard.ts`: hook PreToolUse

Hook đọc payload JSON từ stdin, phân tích lệnh (kể cả lệnh lồng `$()`, chuỗi `&&`, `;`) và in quyết định *deny* kèm lý do trỏ về quy tắc. Script luôn thoát với mã 0. Nhóm luật hiện có:

| Luật | Chặn |
|---|---|
| `force` | `push --force` / `-f`; chỉ cho phép `--force-with-lease` |
| `longLivedPush` | push thẳng vào `main` hoặc `dev` |
| `push` | push vào nhánh ngoài `feature/*`, `fix/*`, `chore/*`, `hotfix/*`, `release/*` và tag `v*`; cấm `--all`, refspec wildcard, đổi config push qua `-c` |
| `longLived` | xoá `main` hoặc `dev` |
| `hooks` | `--no-verify`/`-n`, ghi đè `core.hooksPath`, biến `LEFTHOOK` |
| `commitAll`, `addAll` | `git commit -a`/`--all`; `git add -A`/`.`/`:/`, `-u` không có đường dẫn |
| `branchDelete` | `git branch -D` hoặc `--delete --force` |
| `ghMerge` | `gh pr merge` với `--admin`, `--auto`, `--delete-branch` |
| `repoDelete` | xoá repo GitHub |
| `stdinShell`, `unreadable` | lệnh shell đọc từ stdin (heredoc, pipe), hoặc lệnh không phân tích được |

Script có test riêng (`claude-bash-guard.test.ts`) và thuộc hạng 2. Chép nguyên sang project mới, chỉ đổi tên nhánh dài hạn nếu khác. Codex dùng cùng script qua `.codex/hooks.json`.

### 11.3 Lefthook, commitlint, secretlint

`bun install` ở gốc repo cài hook qua script `prepare: lefthook install`. Pre-commit chạy tuần tự (`piped: true`):

1. branch guard chặn commit vào `main`;
2. chặn dấu xung đột merge;
3. `secretlint` trên tệp đã stage;
4. format (prettier, dart format, ktlint, swiftformat… ⚙️📱) và re-stage;
5. `check-comments.ts --staged`, chạy cuối.

Commit-msg chạy commitlint theo Conventional Commits.

Bẫy đã gặp: glob của Lefthook (`gobwas/glob`) coi `dir/**/*` là cần ít nhất một thư mục con, nên bỏ sót tệp nằm ngay trong `dir/`. Dùng hai mẫu `dir/*.ext` và `dir/**/*.ext`.

---

## 12. Script kiểm tra 🔒

Viết bằng TypeScript chạy với Bun, có test `*.test.ts` chạy bằng `bun test scripts/`. Script không phụ thuộc stack sản phẩm, nên dùng được cho mọi project.

| Script | Làm gì | Chỗ phải thay ⚙️ |
|---|---|---|
| `test-gate.sh` | Chạy cục bộ đúng các bước của CI (trừ coverage): test script → check-comments → check-personas → test từng lớp → kiểm hợp đồng API không lệch → build/type-check/lint client. Đây cũng là gate của `git-release` | Toàn bộ bước build/test theo stack 📱; sửa cùng lúc với `test.yml` |
| `risk-tier.ts` | Tính hạng 0/1/2 từ đường dẫn (`TIER2_PATHS`, `TIER0_PATHS`, `TEST_PATHS`), tên tệp (`SENSITIVE_WORDS`) và nội dung dòng thay đổi (`TIER2_CONTENT`). Có chế độ `--fix-ratio <dải>` cho retro | Danh sách đường dẫn, từ nhạy cảm, mẫu nội dung theo stack 📱 (§16.4) |
| `check-prd-approval.ts` | PRD *Approved* có dòng BA review trước dòng duyệt, và chỉ có `metadata` sau đó | Tên cột và nhãn nguồn nếu đổi ngôn ngữ |
| `check-personas.ts` | Có PRD module mà `00-personas.md` chưa *Approved* thì báo lỗi | — |
| `check-comments.ts` | Không khối comment nào quá 3 dòng hoặc dòng quá 120 ký tự; có chế độ `--staged` | Ba hằng số: `SOURCE` (đuôi tệp được quét; hiện có `ts, vue, cs, css`…, chưa có `dart, kt, swift, py`), `GENERATED` (thư mục sinh tự động, được bỏ qua) và `DIRECTIVE` (comment chỉ thị như `eslint-disable`, `#pragma`, không tính). Thêm cú pháp comment của ngôn ngữ mới (`#`, `///`) nếu có |

Thêm script khi retro phát hiện lỗi lặp (§6.11). Ví dụ: kiểm tham chiếu `tệp § mục` hỏng, nếu lỗi này xuất hiện hai lần.

---

## 13. CI và phát hành

### 13.1 Mô hình nhánh 🔒

```
main ◄── release/vX.Y.Z ◄── dev ◄── feature/<module>-phase-<n>
  ▲            ▲                ◄── fix/*  chore/*  chore/<module>-docs
  │            └── fix/* (ổn định)
  └── hotfix/* (từ main)            sau mỗi lần phát hành: merge main → dev
```

### 13.2 Workflow

- **`test.yml`** (reusable, `workflow_call`): một job `comments` luôn chạy (test script, check-comments, check-personas), và mỗi lớp mã một job, chỉ chạy khi có input.
- **`ci.yml`**: chạy trên PR vào `dev`, `main`, `release/**` và push vào `dev`. Job `changes` lọc đường dẫn để chỉ chạy phần bị chạm; job bị bỏ qua tính là đạt.
- **`release.yml`**: chạy khi có tag `v*`. Chạy test, rồi build bản phát hành có phiên bản lấy từ tag, rồi tạo release.

Đặt các job `test / *` làm required check trên `main` 👥 (§15.3).

**Tên check sinh ra thế nào.** `ci.yml` gọi `test.yml` dưới một job tên `test`, nên mỗi job trong `test.yml` hiện thành check `test / <tên job>` (ví dụ `test / comments`, `test / backend`). Job lọc đường dẫn hiện thành `changes`. Ba nơi đọc cứng các tên này, phải sửa cùng lúc khi đổi job ⚙️:
- `pr-reviewer.md` § 3 mục 9 (Gates);
- `git-accept.md` bước 3;
- `ciTriggerNote` trong `release-kit.json`.

Nếu chỉ dùng GitHub, bỏ `.gitlab-ci.yml` và dòng comment trong `ci.yml` nhắc đồng bộ với nó.

### 13.3 `.claude/release-kit.json`

Mẫu ở phụ lục B.3. Các khoá chính:

- `devBranch`, `mainBranch`;
- `gate` (lệnh gate);
- `devWrites` (`push` hoặc `pr`);
- `devMergeCommand: "/git-accept"`;
- `pushAfterRebase: "force-with-lease"`;
- `prExtraSections` (các mục bắt buộc trong PR: *Requirements*, *Lệch nhỏ so với thiết kế*, *Verification*, *Risk tier*);
- `versionFiles` 📱 (tệp chứa số phiên bản cần tăng theo tag);
- `modes`.

### 13.4 Mô tả PR

Mục `## Changelog` có từng dòng dạng `- Added|Changed|Deprecated|Removed|Fixed|Security: <một câu cho người đọc>`, hoặc chỉ `none`. Sau nó luôn là một mục `## ` khác, vì `git-release` đọc tới heading kế tiếp; dòng chữ tự do ở cuối sẽ làm hỏng nó. Không sửa `CHANGELOG.md` bằng tay.

---

## 14. Lớp Codex (tuỳ chọn)

`.claude/` vẫn là nguồn chỉ dẫn. Codex đọc qua một lớp mỏng:

- `.codex/agents/<name>.toml`: chỉ có `name`, `description`, và `developer_instructions` bảo agent đọc `.claude/agents/<name>.md` rồi làm theo. Không chép prompt sang (phụ lục B.5).
- `.codex/hooks.json`: chạy cùng `claude-bash-guard.ts`. Hook mới phải được trust bằng `/hooks`.
- `.agents/skills/<name>/`: bản skill cho Codex, trỏ về `.claude/skills/` hoặc `.claude/commands/`.
- `AGENTS.md` § Codex có bảng đổi tên tool (Read/Edit → công cụ có sẵn; `mcp__codegraph__…` → tool `codegraph_explore`; Artifact → không có, dừng và báo) và bảng đổi tên skill.

---

## 15. Làm việc theo nhóm 👥

DAONT-BASE được viết cho một người duy trì. Trong đó "người dùng" vừa là chủ sản phẩm, vừa là người duyệt, vừa là người merge. Với nhóm, giữ nguyên quy trình và thay các điểm sau.

### 15.1 Tách vai "người dùng" thành vai người thật

Thêm bảng này vào `AGENTS.md`, và thay chữ "người dùng" bằng tên vai trong các tệp agent khi cần:

| Cổng | Vai duyệt | Ghi chú |
|---|---|---|
| Persona, PRD, ưu tiên, phạm vi | Product Owner (PO) | Một người chốt; người khác góp ý trên PR nháp |
| Thiết kế giao diện | PO + Design lead | |
| Tech design, kế hoạch, quyền push/PR | Tech lead (người) | Module nhạy cảm: thêm Security owner |
| Merge vùng cần người dùng (§6.4) | CODEOWNERS của vùng đó | Ép bằng branch protection (§15.3) |
| Phát hành | Release manager | |
| Câu chuyển lên từ `solution-architect` | Theo loại câu: nghiệp vụ → PO, kỹ thuật → Tech lead | `solution-architect.md` ghi rõ ai nhận loại nào |

Change log ghi tên vai và tên người duyệt, ví dụ `user decision (PO: <tên>)`, để `check-prd-approval.ts` và người đọc truy được.

### 15.2 Mỗi người một phiên chính, mỗi phiên một nhánh

- Một module (hoặc một phase) có đúng một người điều phối, tức một phiên chính, tại một thời điểm. Ghi tên người phụ trách vào một cột mới *Phụ trách* trong `progress.md`.
- Mỗi người làm trong checkout của mình. Hai implementer không bao giờ dùng chung một checkout.
- Quy tắc "mỗi lúc một PR vào `dev`" giữ nguyên, nhưng cần một hàng chờ chung: dùng merge queue của GitHub, hoặc quy ước ai rebase và merge trước. Nhánh chưa rebase thì `pr-reviewer` trả `NOT_READY`.
- `progress.md`, `docs/prd/README.md` và `docs/tech/README.md` hay xung đột khi nhiều người cùng sửa. Chỉ sửa dòng của module mình, và rebase ngay trước khi merge.

### 15.3 Ép cổng bằng nền tảng git, không chỉ bằng agent

Cổng của DAONT-BASE chạy phía client (`/git-accept`, `pr-reviewer`), vì repo cá nhân không có branch protection (xem `.claude/decisions.md` mục 2026-10-20). Với nhóm, thêm các lớp sau:

- **Branch protection** trên `main` và `dev`: bắt buộc PR, bắt buộc required check `test / *`, cấm force push, cấm xoá nhánh.
- **`CODEOWNERS`** cho vùng cần người dùng: `.claude/`, `.github/`, `AGENTS.md`, `lefthook.yml`, `scripts/risk-tier.ts`, thư mục auth, migration, cấu hình ký và phát hành 📱.
- **Ai được để `pr-reviewer` tự merge**: tốt nhất là một tài khoản bot hoặc GitHub App có quyền merge PR hạng 0–1. Nếu tổ chức yêu cầu một người phê duyệt, `pr-reviewer` chỉ post verdict, người review bấm approve và merge.
- **Merge queue** nếu nhiều PR vào `dev` cùng ngày.

Mẫu `.github/CODEOWNERS` ⚙️:

```text
# Vùng cần người dùng (lifecycle.md § Cổng giữa các giai đoạn)
/.claude/                 @org/tech-leads
/.github/                 @org/tech-leads
/AGENTS.md                @org/tech-leads
/lefthook.yml             @org/tech-leads
/scripts/                 @org/tech-leads
/docs/process/            @org/tech-leads
/docs/prd/                @org/product-owners
/api/**/auth/             @org/security
/ios/fastlane/  /android/app/*.gradle*   @org/release-managers
```

Branch protection (thay `OWNER/REPO` và tên check):

```bash
for b in main dev; do
  gh api -X PUT repos/OWNER/REPO/branches/$b/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["changes", "test / comments", "test / app"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "require_code_owner_reviews": true, "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
done
```

Đặt `required_approving_review_count: 0` để `pr-reviewer` vẫn tự merge được PR hạng 0–1 ngoài vùng CODEOWNERS. Vùng CODEOWNERS vẫn cần người thật phê duyệt.

**Đề xuất mặc định cho nhóm** (mình chọn; đổi được):
- `pr-reviewer` chạy dưới tài khoản `gh` của người điều phối phase và tự merge PR hạng 0–1 ngoài vùng CODEOWNERS.
- Hạng 2 và vùng CODEOWNERS: `pr-reviewer` chỉ post verdict, chủ vùng bấm approve và merge.
- Khi có từ 3 PR mỗi ngày vào `dev`, bật merge queue. Quy tắc "rebase trước khi review" giữ nguyên, nhưng bước merge cuối do queue làm. Sửa `pr-reviewer.md` § 5 để dùng `gh pr merge --merge --auto` chỉ khi queue bật, và ghi quyết định này vào `docs/process/decisions.md`.

### 15.4 Cấu hình dùng chung và cá nhân

| Commit vào repo | Không commit |
|---|---|
| `.claude/settings.json`, `agents/`, `rules/`, `skills/`, `commands/`, `release-kit.json` | `.claude/settings.local.json` (quyền và MCP cá nhân) |
| `.codex/`, `lefthook.yml`, scripts | `.codegraph/`, `.serena/cache`, ledger `.superpowers/` |
| `AI_TOOLS_SETUP.md` | token, bí mật, cấu hình máy |

Phần nhóm cần thống nhất nhưng không commit được, như plugin cá nhân và `~/.claude/CLAUDE.md` (quy tắc chọn model, nhịp chạy subagent), thì ghi vào `AI_TOOLS_SETUP.md` § "Cấu hình cá nhân khuyến nghị".

### 15.5 Retro và thay đổi quy trình theo nhóm

- Retro cuối module có cả nhóm. Số đo trong `progress.md` thêm cột *Phụ trách*.
- Mỗi người có thể gặp lỗi agent khác nhau. Ghi tất cả vào `agent-error-log.md`, retro gộp lại.
- Thay đổi `AGENTS.md`, `.claude/` hay `lifecycle.md` cần Tech lead duyệt qua CODEOWNERS, và chỉ áp dụng sau retro (§6.11).
- `sa-calibration.md` ghi rõ ai đã sửa câu trả lời của SA. Hai thành viên có "gu" khác nhau là một câu hỏi cho PO, không phải hai bài học trái nhau.

### 15.6 Ngôn ngữ của nhóm

Quy trình DAONT-BASE viết tài liệu sản phẩm và quy trình bằng tiếng Việt, còn prompt agent, rule và `.claude/decisions.md` bằng tiếng Anh. Nếu nhóm có người không đọc tiếng Việt, chuyển tài liệu sang tiếng Anh và sửa các chỗ gắn cứng chữ tiếng Việt:
- `check-prd-approval.ts`: tên cột, nhãn nguồn, trạng thái;
- `check-personas.ts`;
- `prExtraSections` (*Lệch nhỏ so với thiết kế*);
- nhãn `[Người dùng]`, `[Giả định]`, `[Dữ liệu]`;
- dòng "Return, in Vietnamese" ở cuối mỗi tệp agent;
- tiêu đề mục trong các mẫu PRD và tech.

Chọn một ngôn ngữ trước pha 3; đổi giữa chừng tốn kém.

---

## 16. App đa nền tảng 📱

### 16.1 Bố cục repo

Mỗi lớp là một dòng trong bảng bố cục của `AGENTS.md`, có rule riêng và một job CI riêng:

```
api/            # backend (nếu có)
app/            # mã dùng chung (Flutter / React Native / KMP shared / .NET MAUI)
ios/ android/ desktop/ web/   # phần riêng từng nền tảng: native module, cấu hình, ký
packages/       # thư viện nội bộ, design system
shared/contract/   # OpenAPI/GraphQL/proto — nguồn sự thật, sinh client cho mọi nền tảng
```

### 16.2 Vai agent

- **`qa-<platform>`**: một agent cho mỗi nền tảng có UI và cách test riêng (`qa-mobile`, `qa-web`, `qa-desktop`), hoặc một `qa-app` nếu dùng framework chung. Giữ các quy tắc gốc: lấy route, màn hình và chuỗi từ mã thật; selector bằng test ID (`testID`, `accessibilityIdentifier`, `Key`); đặt tên kịch bản theo `P-nn PRDxx-US-nn`; chạy lặp khoảng 10 lần với retry tắt trước khi báo ổn định.
- **`ui-designer`**:
  - Mỗi màn hình ghi nền tảng và kích thước mục tiêu (phone, tablet, desktop), lấy từ thiết bị của persona.
  - Ghi rõ chỗ theo quy ước nền tảng (iOS HIG, Material) và chỗ theo design system riêng.
  - Vùng chạm tối thiểu 44pt (iOS) hoặc 48dp (Android).
  - Thiết kế trạng thái offline, đang đồng bộ, hỏi quyền hệ điều hành, và cập nhật bắt buộc.
- **`solution-architect`**: thêm vào checklist chất lượng:
  - offline và xung đột đồng bộ;
  - tương thích ngược API với client cũ chưa cập nhật;
  - kích thước bản cài;
  - pin và mạng;
  - quyền hệ điều hành;
  - chính sách store;
  - deep link;
  - push notification.
- **`appsec`**:
  - lưu token (Keychain, Keystore; không dùng storage thường);
  - certificate pinning nếu cần;
  - deep link không cấp quyền;
  - bí mật không nằm trong bản build;
  - đường cấp token trên mọi client.
- **`sdet`**: lệnh chạy lặp theo công cụ e2e của nền tảng, trên emulator hoặc simulator cố định phiên bản.

### 16.3 Test và gate

- Bảng trong `testing.md` có một dòng cho mỗi loại thay đổi trên mỗi nền tảng: logic dùng chung → unit; widget hoặc component → component test; native module → test nền tảng; luồng người dùng → e2e trên thiết bị.
- `test-gate.sh` chạy phần dùng chung và các nền tảng build được trên máy hiện tại. Nền tảng không build được (iOS trên Linux) thì ghi rõ là bỏ qua và để CI lo, không im lặng bỏ.
- CI dùng ma trận runner: `ubuntu` cho Android, web và phần chung; `macos` cho iOS và macOS; `windows` cho Windows. Job `changes` lọc theo thư mục nền tảng.
- e2e trên thiết bị thường không nằm trong CI của mỗi PR vì chậm. Chạy theo lịch (nightly) hoặc trên nhánh `release/*`, và ghi kết quả vào `verify-output/`.
- Runner macOS tốn phí gấp nhiều lần runner Linux. Chỉ chạy job iOS khi `changes` báo `ios/` hoặc phần dùng chung thay đổi, và ghi ngân sách này vào `system-context.md` § Chi phí.

Khung `scripts/test-gate.sh` cho app đa nền tảng ⚙️:

```bash
#!/usr/bin/env bash
# Same checks as .github/workflows/test.yml, minus coverage. Change both together.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

skipped=()
run_if() { # run_if <name> <required-tool> <command...>
  local name=$1 tool=$2; shift 2
  if command -v "$tool" >/dev/null; then echo "▶ $name"; "$@"; else skipped+=("$name (no $tool)"); fi
}

bun test scripts/
bun scripts/check-comments.ts
bun scripts/check-personas.ts

run_if api      dotnet   api/scripts/test.sh                  # ⚙️ hoặc go test ./..., pytest...
run_if contract bun      scripts/check-contract-drift.sh      # export spec + so với bản đã commit
run_if app      flutter  bash -c 'cd app && flutter analyze && flutter test'
run_if android  java     bash -c 'cd app && flutter build apk --debug'
if [[ "$(uname)" == Darwin ]]; then
  run_if ios xcodebuild bash -c 'cd app && flutter build ios --no-codesign'
else
  skipped+=("ios (not macOS)")
fi

if ((${#skipped[@]})); then
  printf 'test-gate: SKIPPED — CI must cover these:\n'; printf '  - %s\n' "${skipped[@]}"
fi
```

Phần bị bỏ qua luôn được in ra, không im lặng. `git-release` vẫn dùng gate này; các nền tảng bị bỏ qua phải xanh trên CI trước khi phát hành.

**Bí mật ký app.**
- Không commit keystore, certificate hay provisioning profile.
- Lưu chúng ở GitHub Actions Secrets (base64) hoặc dùng `fastlane match` với repo riêng được mã hoá.
- `secretlint` mặc định không bắt tệp nhị phân `.jks`/`.p12`, nên chặn chúng bằng `.gitignore` và thêm một lệnh trong `lefthook.yml` từ chối stage các đuôi này.
- Thay đổi workflow ký là hạng 2 và thuộc vùng CODEOWNERS.

**Công cụ định hướng mã.** CodeGraph hỗ trợ nhiều ngôn ngữ (TypeScript, Kotlin, Swift, C#, Go…). Sau `codegraph init`, chạy `codegraph status` để xem ngôn ngữ nào đã được index, rồi hỏi thử một symbol của từng ngôn ngữ trong project. Ngôn ngữ chưa được index thì ghi vào `AGENTS.md` § Chọn công cụ là "dùng grep + Read", để agent không tin vào phạm vi ảnh hưởng thiếu.

### 16.4 Bổ sung hạng 2 trong `risk-tier.ts`

Các đường dẫn và nội dung sau nên vào hạng 2:

- cấu hình ký và phát hành: keystore, `*.jks`, provisioning profile, `*.entitlements`, `fastlane/`, `codemagic.yaml`, `eas.json`;
- khai báo quyền: `AndroidManifest.xml`, `Info.plist`;
- cấu hình build: `build.gradle*`, `Podfile`, `pubspec.yaml`, `Package.swift`;
- mã lưu token và bảo mật: từ khoá `Keychain`, `Keystore`, `SecureStorage`, `biometric`;
- deep link: `intent-filter`, `associated-domains`;
- cập nhật OTA (CodePush, EAS Update).

### 16.5 Phát hành nhiều nền tảng

- Tag `vX.Y.Z` vẫn là phiên bản. `versionFiles` trong `release-kit.json` liệt kê các tệp chứa phiên bản: `pubspec.yaml`, `package.json`, `Info.plist`, `build.gradle`. Số build tăng tự động trong CI.
- `release.yml` theo tag: build, ký, đẩy lên kênh nội bộ (TestFlight, Play internal track, kênh beta desktop), sau đó người dùng duyệt để đẩy lên production. Đẩy lên store production luôn là việc của người dùng, không phải của agent.
- Giai đoạn ổn định (`release/*`) gồm cả thời gian chờ store duyệt. Hotfix của app cài trên máy cần kế hoạch cho người dùng chưa cập nhật (feature flag, phiên bản tối thiểu).
- `system-context.md` ghi phiên bản hệ điều hành tối thiểu, các store, chính sách cập nhật bắt buộc, và thời gian hỗ trợ client cũ.

---

## 17. Lộ trình dựng cho project mới

Làm theo thứ tự. Mỗi pha có tiêu chí xong; chưa đạt thì không sang pha sau.

### 17.0 Chép từ đâu, sửa gì

Nguồn để chép là một checkout của DAONT-BASE ở một tag cố định (ví dụ `v1.6.5`), không phải nhánh đang chạy, để mọi tệp cùng một phiên bản quy trình. Ghi tag đó vào mục đầu tiên của `docs/process/decisions.md` ở project mới.

```bash
# Xuất một bản sạch ở tag cố định, không động vào checkout đang làm của DAONT-BASE
SRC=$(mktemp -d) && git -C ../DAONT-BASE fetch --tags && git -C ../DAONT-BASE archive v1.6.5 | tar -x -C "$SRC"
NEW=.   # gốc repo mới
mkdir -p "$NEW/.claude" "$NEW/scripts" "$NEW/docs/process" "$NEW/docs/prd" "$NEW/docs/tech"
cp -r "$SRC/.claude/agents" "$SRC/.claude/commands" "$NEW/.claude/"
cp "$SRC/.claude/settings.json" "$NEW/.claude/"
cp "$SRC"/scripts/{claude-bash-guard,risk-tier,check-comments,check-personas,check-prd-approval}{,.test}.ts "$NEW/scripts/"
cp "$SRC/docs/process/lifecycle.md" "$NEW/docs/process/"
cp "$SRC"/docs/prd/{README,_template,_template-persona}.md "$NEW/docs/prd/"
cp "$SRC"/docs/tech/{README,_template}.md "$NEW/docs/tech/"
```

Không chép `.claude/rules/`, `.claude/skills/`, `decisions.md`, `feature-map.md`, `progress.md` hay `agent-error-log.md`. Các tệp này gắn với stack hoặc lịch sử của DAONT-BASE; dựng mới theo §9, §10 và phụ lục B.4.

Sau khi chép, `grep -rn "StarterKit\|DAONT-BASE\|backend/\|frontend/\|FEEDBACK-HUB" .claude docs scripts` liệt kê mọi chỗ còn tên cũ. Bảng dưới là những chỗ phải sửa theo nội dung, không chỉ đổi tên:

| Tệp | Phải sửa |
|---|---|
| `lifecycle.md` | §2 bảng hạng (ví dụ hạng 2); §3 *Vùng cần người dùng*; §6 giới hạn 1.500 dòng và đường dẫn tệp sinh; §6b `release-kit` và `devWrites`; §1 dòng giai đoạn 8 ("sản phẩm dùng DAONT-BASE") |
| `implementer.md` | Đoạn mở đầu (thư mục được sửa); Pre-Task bước 4–5 (Serena chỉ cho C#); bước 7 (lệnh verify); đoạn *Backend rules / Frontend rules*; *Do not* (`appsettings*.json`) |
| `pr-reviewer.md` | § 3 mục 1 (bảng rule), mục 5 (thiết kế: token, vi/en), mục 9 (tên check CI); § 4 (vùng không tự merge) |
| `code-reviewer.md` | Bảng *Area / Rule file / What to check* |
| `tech-lead.md` | Writing rules 4–6 (kiến trúc, hợp đồng API, phân quyền theo stack) |
| `solution-architect.md` | *Who you are*; danh sách *Cross-cutting* trong rule 4 |
| `ui-designer.md` | *Source of truth*, *Design language*, brand; giữ *Avoid the AI-generated look* và *Rules* |
| `appsec.md` | Bước 1 (tên hàm cấp token, cookie thật); bước 4 (tệp cấu hình bí mật) |
| `qa-frontend.md` → `qa-<platform>.md` | Bước 1–3 (router, locale, selector); lệnh chạy |
| `sdet.md` | Lệnh chạy lặp; bước tạo worktree (tệp cấu hình cần chép) |
| `git-accept.md` | Bước 3 (tên check CI); bước 2 (danh sách đường dẫn bị chặn) |
| `risk-tier.ts` | `SENSITIVE_WORDS`, `TIER2_PATHS`, `TIER0_PATHS`, `SOURCE_FILE`, `TIER2_CONTENT`; cập nhật test theo đường dẫn mới |
| `check-comments.ts` | `SOURCE`, `GENERATED`, `DIRECTIVE` (§12) |
| `claude-bash-guard.ts` | Tên nhánh dài hạn và tiền tố nhánh được push nếu khác `main`/`dev`/`feature|fix|chore|hotfix|release` |
| `settings.json` | `enabledPlugins`: thêm `superpowers@claude-plugins-official` để người mới được nhắc cài |

### Pha 1: Nền tảng repo (khoảng nửa ngày)

- [ ] Tạo repo remote, `main` và `dev`. Push cả hai lên `origin` (`risk-tier.ts` và `pr-reviewer` cần `origin/dev`). Đặt `dev` làm nhánh làm việc.
- [ ] `package.json` ở gốc với `lefthook`, `@commitlint/cli`, `@commitlint/config-conventional`, `secretlint`, `@secretlint/secretlint-rule-preset-recommend`, formatter của stack (ví dụ `prettier`), cùng script `prepare: lefthook install`.
- [ ] `lefthook.yml` (phụ lục B.2), `commitlint.config.js`, `.secretlintrc.json`, `.gitignore` (§4), `.editorconfig`.
- [ ] Chép theo §17.0: `claude-bash-guard.ts`, `check-comments.ts` (hook pre-commit gọi nó ngay từ commit đầu tiên), test của chúng, và `.claude/settings.json` (phụ lục B.1).
- **Xong khi:** `bun install` cài được hook; `git commit` trên `main` bị chặn; Claude chạy `git add -A` bị chặn; `bun test scripts/` xanh.

**PR khởi tạo.** Cho đến hết pha 5, `pr-reviewer` và `/git-accept` chưa dùng được, vì chúng cần tên check CI và tệp agent chưa có. Các PR của pha 1–5 do người dựng tự merge bằng `gh pr merge --merge` sau khi CI xanh, mỗi PR một pha. Ghi điều này trong mô tả PR.

### Pha 2: Công cụ agent (khoảng 1–2 giờ mỗi người)

- [ ] Cài theo §3; viết `AI_TOOLS_SETUP.md`.
- [ ] `codegraph init`; kiểm chứng Serena hoặc LSP cho các ngôn ngữ của project (§9.3).
- **Xong khi:** `claude mcp list` báo connected; `/plugin` có `superpowers` và `release-kit`; một câu hỏi với `codegraph_explore` trả về source.

### Pha 3: Quy trình và tài liệu (khoảng 1 ngày)

- [ ] Chép `docs/process/lifecycle.md`, đổi tên project, danh sách vùng cần người dùng ⚙️, giới hạn PR; thêm §15/§16 nếu cần.
- [ ] Tạo `docs/process/decisions.md` (mục đầu: "Áp dụng quy trình từ DAONT-BASE", kèm phạm vi đã đổi), `progress.md` (bảng trống, 👥 thêm cột *Phụ trách*), và `system-context.md` (mọi giá trị *Chưa xác định*).
- [ ] Chép `docs/prd/{README,_template,_template-persona}.md`, `docs/tech/{README,_template}.md`; tạo `docs/feature-map.md`, `docs/agent-error-log.md`, `.claude/decisions.md`, `.claude/sa-calibration.md` từ các header ở phụ lục B.4.
- [ ] Chọn ngôn ngữ tài liệu cho nhóm (§15.6).
- [ ] Viết `AGENTS.md` theo §5, và `AGENTS.md` cho từng thư mục con. Tham chiếu tới agent và rule chưa có thì vẫn viết; chúng được kiểm ở cuối pha 5.
- **Xong khi:** `lifecycle.md` không còn tên DAONT-BASE và các chỗ ở bảng §17.0 đã sửa; mọi tệp trong `docs/` mà `AGENTS.md` nhắc tới đã tồn tại.

### Pha 4: Script kiểm tra và CI (khoảng 1 ngày)

- [ ] Đưa `check-personas.ts`, `check-prd-approval.ts`, `risk-tier.ts` (đã chép ở §17.0) vào gate; sửa `risk-tier.ts` theo bảng §17.0 và §16.4; sửa `check-comments.ts` cho đuôi tệp của stack.
- [ ] Viết `test-gate.sh` cho stack (khung ở §16.3); viết `test.yml`, `ci.yml`, `release.yml` với cùng các bước. Ghi lại tên các check sinh ra (§13.2).
- [ ] Tạo `.claude/release-kit.json` (phụ lục B.3).
- [ ] 👥 Bật branch protection và CODEOWNERS (§15.3) với đúng tên check vừa ghi.
- **Xong khi:** `scripts/test-gate.sh` xanh trên repo trống; một PR thử vào `dev` có CI xanh và hiện đúng tên check; `bun scripts/risk-tier.ts --base origin/dev` in hạng 0 cho một thay đổi trong `docs/` và hạng 2 cho một thay đổi `.github/`.

### Pha 5: Agent, rule, skill (khoảng 1–2 ngày)

- [ ] Chép 11 tệp agent. Đổi tên project; viết lại phần ⚙️ theo §8.1; 📱 tạo `qa-<platform>`.
- [ ] Viết rule theo §9.2: `testing.md`, `commands.md` và `architecture.md` trước, kèm test kiến trúc.
- [ ] Sửa `.claude/commands/git-accept.md` theo tên check ở pha 4. Viết generator `new-<slice>` khi đã có lát cắt đầu tiên làm mẫu.
- [ ] (Tuỳ chọn) Tạo lớp Codex (§14).
- **Xong khi:**
  - mọi tham chiếu `tệp § mục` trong `AGENTS.md`, `lifecycle.md` và các tệp agent trỏ tới tệp và mục có thật (B.6 cho prompt kiểm);
  - một việc cỡ S thử chạy trọn vòng mà không phải sửa tay: một chỉnh sửa tài liệu qua `/git-accept`, và một thay đổi mã nhỏ qua `implementer` rồi `pr-reviewer`.

Từ đây mọi PR đi qua cổng; hết chế độ PR khởi tạo.

### Pha 6: Module đầu tiên (chạy thật để hiệu chỉnh)

- [ ] Giai đoạn 0: brainstorming → persona → duyệt. Chốt danh mục module trong `docs/prd/README.md`.
- [ ] Chạy một module cỡ L nhỏ qua đủ giai đoạn 1–7.
- [ ] Retro cuối module (§6.11): đây là lúc chỉnh giới hạn 1.500 dòng, danh sách hạng 2, và bổ sung `sa-calibration.md`.
- **Xong khi:** module đã merge, phát hành thử một tag, và số đo đầu tiên có trong `progress.md`.

---

## 18. Vận hành hằng ngày: một vòng module mẫu

Câu lệnh mẫu bạn gõ cho phiên chính ở từng giai đoạn:

| Giai đoạn | Bạn nói | Phiên chính làm |
|---|---|---|
| 0 | "Mình muốn làm sản phẩm X cho nhóm Y" | `brainstorming` phỏng vấn → `product-manager` viết persona → BA review → SA trả lời → bạn duyệt |
| 1 | "Soạn PRD module Đặt lịch" | Tạo nhánh `chore/booking-docs` và PR nháp → PM soạn → BA review → SA → gom câu hỏi cho bạn → lặp → bạn duyệt |
| 2 | "Thiết kế giao diện module Đặt lịch" | `ui-designer` → bạn xem canvas và comment → duyệt |
| 3 | "Viết tech design" | `tech-lead` (và `appsec` nếu nhạy cảm) → bạn duyệt → `/git-accept` merge PR tài liệu |
| 4 | "Lập kế hoạch, cho phép push và mở PR từng phase" | `writing-plans` → bạn duyệt; quyền push ghi ở đầu kế hoạch. Đề nghị `/model sonnet` |
| 5 | "Chạy phase 1" | `subagent-driven-development`: `implementer` từng task (gộp 2–3 task nhỏ cùng màn hình), review theo hạng |
| 6 | (tự động) | `pr-reviewer` → PASS thì merge; NEEDS_HUMAN thì bạn merge |
| 7 | "Release minor" | `release-kit:git-release` cắt `release/vX.Y.Z` → QA → bạn xác nhận → tag |
| Sau cùng | "Retro module Đặt lịch" | §6.11 |

Việc cỡ S: "Sửa lỗi Z (cỡ S)". Phiên chính giao cho `implementer` với hướng dẫn tái hiện, kiểm hạng, rồi review theo hạng.

---

## 19. Bẫy đã gặp ở DAONT-BASE

Đây là những lỗi đã xảy ra. Mang theo để project mới không gặp lại:

| Bẫy | Cách chặn |
|---|---|
| Agent đoán route hoặc chuỗi UI từ tài liệu cũ | `qa-*` bắt buộc đọc router và locale thật; selector bằng test ID |
| Sửa test chập chờn bằng một lệnh chờ không làm gì, hoặc chỉ xanh một lần | `sdet`: chạy lặp 10 lần, tắt retry; cấm sleep cố định |
| Coi cookie là định danh phiên | `authentication.md` liệt kê định danh thật; `appsec` liệt kê mọi đường cấp token |
| Ghi tệp tạm vào `/tmp` | Dùng scratchpad hoặc `verify-output/` |
| `pr-reviewer` nạp `code-review` chạy nền, lỗi mất dữ liệu lộ ra sau khi đã merge | Ghi rõ skill không được nạp; chỉ merge khi mọi kiểm tra đã xong trong lượt chạy |
| `gh pr merge --delete-branch` xoá cả nhánh local và đổi checkout dùng chung | Cấm trong guard; dọn nhánh theo §6.8 |
| PR tài liệu gộp với tooling bị kẹt chờ phần chậm nhất | Mỗi PR một mục đích (§6.8) |
| PR reconcile `main → dev` có diff rỗng mà vẫn tốn một lượt merge | `devWrites: "push"`: merge `main` vào `dev` trực tiếp |
| Công cụ symbol bỏ sót nơi gọi trong một loại tệp | Kiểm chứng trên stack mới (§9.3) |
| Worktree thiếu cấu hình gitignore và client sinh tự động | `.claude/reference/worktrees.md`; không tạo worktree cho skill run |
| Build song song hỏng vì `obj/` dùng chung | Subagent build tuần tự; ghi trong `commands.md` |
| Glob của Lefthook bỏ sót tệp ở tầng đầu | Dùng hai mẫu glob (§11.3) |
| Quy tắc chép ở nhiều nơi rồi lệch nhau | Mỗi quy tắc một nơi; tham chiếu bằng `§` |

---

## Phụ lục A: Những chỗ riêng DAONT-BASE phải thay

| Ở DAONT-BASE | Thay bằng |
|---|---|
| "StarterKit", "DAONT-BASE" trong mọi tệp agent và rule | Tên project mới |
| Bảng bố cục `backend/` .NET, `frontend/` Vue, `shared/openapi/` | Bố cục của project (§16.1) |
| Bất biến "Entity Pattern `static Create`", `ArchitectureTests.cs` | Bất biến kiến trúc của stack mới, kèm test kiến trúc |
| `IHasOrganization`, tenant theo tổ chức, `X-TimeZone` | Mô hình tenant và múi giờ của sản phẩm mới, hoặc bỏ |
| Ngôn ngữ thiết kế "Lớp kính · WeatherPlus", brand `#4F3D91`/`#8CC640`, font Plus Jakarta Sans | Design system mới; giữ các quy tắc "tránh vẻ AI" và "ít dialog" |
| Hồ sơ SA "Vue 3 dashboard, thời tiết" | Kinh nghiệm phù hợp với sản phẩm và nền tảng mới |
| `backend/scripts/test.sh`, `bun run --cwd frontend …`, OpenAPI drift check | Lệnh của stack mới, trong `commands.md` và `test-gate.sh` |
| `TIER2_PATHS` có `backend/…/Auth`, `Program.cs`, `AppDbContext.cs`, `frontend/src/router/` | Đường dẫn nhạy cảm của stack mới (§16.4) |
| Tên check CI `test / comments`, `test / backend`, `test / frontend`, `test / guide` | Tên job mới, sửa cùng lúc trong `pr-reviewer.md`, `git-accept.md`, `release-kit.json` |
| Vùng cần người dùng "widget key, Redis, SignalR, storage" | Vùng nhạy cảm của sản phẩm mới |
| `.gitlab-ci.yml` song song GitHub | Chỉ giữ nền tảng CI thật sự dùng |
| Nghị định 13/2023 trong checklist SA | Giữ nếu xử lý dữ liệu cá nhân ở Việt Nam; thêm GDPR hoặc luật khác nếu cần |
| Lịch sử trong `decisions.md`, `agent-error-log.md`, `feature-map.md`, `progress.md` | Bắt đầu trống; không nhập trạng thái *Approved* hay số đo của project cũ |

## Phụ lục B: Khung tệp

### B.1 `.claude/settings.json`

```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(gh *)"],
    "deny": [
      "Bash(git add -A)",
      "Bash(git add .)",
      "Bash(git commit -a:*)",
      "Bash(git commit --no-verify:*)",
      "Bash(git push --force:*)",
      "Bash(git push -f:*)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bun \"$CLAUDE_PROJECT_DIR\"/scripts/claude-bash-guard.ts", "timeout": 10 }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "release-kit@daont-claude-plugins": true,
    "superpowers@claude-plugins-official": true
  },
  "extraKnownMarketplaces": {
    "daont-claude-plugins": {
      "source": { "source": "github", "repo": "DaoNguyenTrong/daont-claude-plugins" },
      "autoUpdate": true
    }
  }
}
```

### B.2 `lefthook.yml`

```yaml
pre-commit:
  piped: true
  commands:
    branch-guard:
      priority: 1
      run: |
        branch=$(git rev-parse --abbrev-ref HEAD)
        if [ "$branch" = "main" ]; then
          echo "Blocked: direct commits to 'main' aren't allowed — release via PR (git-release)."
          exit 1
        fi
    conflict-markers:
      priority: 2
      run: |
        if git diff --cached -U0 | grep -qE '^\+(<{7}|={7}|>{7})( |$)'; then
          echo "Blocked: staged changes contain unresolved merge-conflict markers."
          exit 1
        fi
    secretlint:
      priority: 3
      glob: "**"
      run: bunx secretlint {staged_files}
    format:                       # ⚙️📱 một lệnh cho mỗi formatter của stack
      priority: 4
      glob: ["app/*.{ts,tsx}", "app/**/*.{ts,tsx}"]
      run: bunx prettier --write {staged_files}
      stage_fixed: true
    comments:
      priority: 9
      run: bun scripts/check-comments.ts --staged

commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit {1}
```

### B.3 `.claude/release-kit.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/DaoNguyenTrong/daont-claude-plugins/main/plugins/release-kit/release-kit.schema.json",
  "prCli": "gh",
  "devBranch": "dev",
  "mainBranch": "main",
  "versioningNote": "<cách đánh phiên bản của từng phần>",
  "versionFiles": [],
  "gate": { "phase1": "scripts/test-gate.sh", "mandatory": "scripts/test-gate.sh" },
  "changelogPath": "CHANGELOG.md",
  "devWrites": "push",
  "devMergeCommand": "/git-accept",
  "pushAfterRebase": "force-with-lease",
  "prExtraSections": ["Requirements", "Lệch nhỏ so với thiết kế", "Verification", "Risk tier"],
  "ciTriggerNote": "<workflow nào chạy khi có tag, required check nào>",
  "modes": ["standard", "quick", "hotfix"]
}
```

### B.4 Header của các nhật ký

**`.claude/decisions.md`** (viết tiếng Anh):

```markdown
# Decision Log

Record only platform / cross-cutting decisions that no single module owns ... (out of scope: module
decisions → docs/tech §12, process → docs/process/lifecycle.md, UI styling, copy, one-off fixes).
Newest entry at top. Title: `### YYYY-MM-DD — <decision>`. Write only the why and the rejected
alternative, under ~80 words. Who writes: whoever makes the change, in the same PR.
Append-only: reverse with a new entry carrying `Supersedes: <old title>` (needs the user's approval).

---
```

**`.claude/sa-calibration.md`**:

```markdown
# Solution-architect calibration log

Each time the user overrides an answer `solution-architect` gave on their behalf, the main session
adds one entry here in the same PR as the corrected document, newest first. Never edited or removed.

### YYYY-MM-DD: <short topic>
- SA answered: <...>
- User decided: <...>
- Lesson: <one sentence>
```

**`docs/agent-error-log.md`**:

```markdown
# Nhật ký lỗi agent lặp lại

Mỗi mục: ngày, việc đang làm, lỗi, nguyên nhân, hành động. Mục mới ở trên. Lỗi đã tự động hoá
ghi "Đã chuyển thành: …". Retro cuối module (lifecycle.md § Retro) thêm mục vào đây.

## Chờ retro

_(trống)_

---
```

**`docs/process/progress.md`**:

```markdown
| Module | Phụ trách | PRD | UI | Tech | appsec | Plan | Code | Merged |
|---|---|---|---|---|---|---|---|---|

## Số đo

| Module | Số ngày | Số PR | Tỉ lệ commit `fix` | `fix` theo hạng (0/1/2) | Câu hỏi tới người dùng | Token agent (nghìn) | Ghi chú |
|---|---|---|---|---|---|---|---|
```

### B.5 `.codex/agents/<name>.toml`

```toml
name = "implementer"
description = "<chép từ frontmatter của .claude/agents/implementer.md>"
developer_instructions = """
Before any other action, read `.claude/agents/implementer.md` and follow it. That file is your
instruction source. This file only publishes you to Codex.
Names of tools and skills in that file are Claude's. Resolve them with the root `AGENTS.md` § Codex.
"""
```

### B.6 Prompt khởi động cho phiên đầu tiên ở project mới

Khi các pha 1–5 đã xong, mở Claude Code ở gốc repo mới và gõ:

```text
Đọc AGENTS.md và docs/process/lifecycle.md. Kiểm tra mọi tham chiếu `tệp § mục` còn đúng,
liệt kê những chỗ còn ghi tên project cũ hoặc lệnh của stack cũ, rồi bắt đầu giai đoạn 0:
phỏng vấn mình để dựng persona.
```
