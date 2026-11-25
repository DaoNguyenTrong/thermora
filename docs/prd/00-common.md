# PRD-00 — Common part: glossary, shared concepts, status lifecycles

| Item | Value |
|---|---|
| Code | `PRD00` (prefix for every code in this document) |
| Status | Approved |
| Version | 0.3 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-25 |
| Depends on | Personas (`00-personas.md`, Approved v0.4) |
| Design | - (no screens of its own; terms and rules are used by every module's design) |
| Plan | - |

Naming: "PRD00" is this common part (file `00-common.md`); the personas file is "Personas" (code `P`). Other PRDs refer to this file as "PRD-00 §Glossary" and "PRD-00 §Status lifecycles". Where a rule here says "owned by PRDxx", that module specifies how the action behaves; this file only says what the terms mean and which rules are shared.
## 1. Context and problem

Thermora is a desktop app on each person's own computer (Windows, macOS, Ubuntu; PC or laptop). It drives the Claude Code or Codex the person already has, using that person's own subscription. There is no server. The first version is a personal tool: the person who uses it can do everything in it. The pilot is the 5-person hydro-meteorological operations team (1 head, 4 analysts), supported from outside by the PO (Personas §1, E1, E3).

Because there is no server and no shared folder (E4), people share procedures and reports as files they send to each other over Zalo or email. Without shared definitions the modules would each invent their own words for "procedure", "report" and "finished". This document fixes those once. It decides only common vocabulary, status values and shared business concepts; how each action behaves is decided by the module that owns it.

**Persona roles are not app permissions.** The personas describe people. In real life the head writes the standard and approves reports (Personas P-02), and the analysts do the reports (P-01). Thermora does not know or enforce this: it has a single kind of user (§3). Readers must not take a persona's role as something the app checks. Report approval happens outside the app: the head still approves over Zalo as today.

### Glossary

Terms are written in English here. The Vietnamese words shown in the app are chosen by the design and must be used the same way everywhere (FR-10).

| Term | Meaning |
|---|---|
| Department | A group of people who work to one shared standard. In real life only; Thermora has no department object and does not check membership. In the pilot there is one: the hydro-meteorological operations support team. |
| User | The one human using Thermora on their own machine, with a display name. There is only one kind of user (§3). |
| Procedure (the "standard") | The written way of doing one kind of job: an agent team (an orchestrator plus role agents) with steps, templates and checks. Example: the product-effectiveness report. Owned by PRD03. |
| Procedure version | One numbered state of a procedure (v1, v2, ...). It has a status (§8). |
| Current version | The procedure version whose status is Published: the one a new report is started from. A procedure has at most one. |
| Retire | To mark a procedure version as no longer for new reports. A retired version stays viewable and keeps serving reports already started with it. |
| Test run | A trial of a Draft procedure version to see whether it works before it is published. It makes no report. Owned by PRD03. |
| Orchestrator | The agent that discusses the task with the user, proposes a plan the user confirms, and assigns work to role agents. Owned by PRD02. |
| Role agent | An agent with one job in a procedure (for example collect data, analyse, write, check). Role agents do not talk freely to each other. Owned by PRD02. |
| Check-and-fix loop | The only exchange between agents: a check agent sends work back for fixes before the person sees it. The number of rounds is set by PRD02. |
| Project | The persistent home of one report: a folder on the user's machine that keeps the raw files, the chosen procedure and its version, the conversation context, the work in progress and the results. Reopening a project continues the work with everything kept. Owned by PRD02. |
| Report | The customer-facing result of one job, produced in a project; deliverables are an Excel file and a PDF. |
| Report version | One numbered state of a report (v1, v2, ...). It has a status, In progress or Finished (§8). |
| Finished | The user's statement that a report version is done. A finished version is no longer edited. Whether the head approves it, and sending it to the customer, happen outside Thermora. |
| Deliverables | The Excel and PDF files made from a report version for the customer. |
| Package | A file bundle that carries a procedure version or a report version from one machine to another, sent by the people themselves over Zalo or email. Owned by PRD02 (export and import). |
| Imported procedure | A procedure received in a package. The imported copy belongs to the user who imported it, who may edit it. |
| Origin | The record kept with an imported procedure of where it came from: the display name of the person who exported it (the last person to export it), the version number it had on their machine, and the export date. |
| Procedure identifier | A mark given to a procedure when it is first written and carried unchanged in every package of it. It is how Thermora recognises that two packages, or a package and a procedure the user holds, are the same procedure. |
| History entry | One record of who did what to which version and when: a new version, publish, retire, finish, import. |
| Customer | A hydropower plant that receives reports. Not a user and not a persona. |
| Raw files | The Excel, CSV and JSON input files a report is built from. |
| AI service | Claude Code (Anthropic) or Codex (OpenAI), signed in with the person's own Claude Pro or ChatGPT Plus subscription. |

### Shared success measures

Targets accepted by the PO for the pilot (Personas P-01 and P-02 "Success for them is", source [User], E1). The module that owns each defines how it is measured; the product collects no usage data (FR-12), so the PO checks them by asking the 5 people and timing a few jobs (Personas A4, A5).

| Measure | Target | Owner of the definition |
|---|---|---|
| Unfinished work is continued the next day with no re-uploading or re-explaining | Yes, for every report | PRD02 |
| Time for the same recurring report | At least 30% less than today | PRD02 |
| The head's send-backs (decided outside Thermora) | Fewer than today | PRD02 |
| Procedures created or edited alone, about one working session | At least 3 team procedures in use | PRD03 |
| Team use (stage-0 success signal) | At least 80% of the team use it weekly | PRD02 |
| Spread (stage-0 success signal) | At least one other department asks for it | PRD02 |

The last two signals are from the PO's stage-0 interview (E1; user decision, PO: DaoNguyenTrong). Like the rest they are measured by asking the people, not by usage data (FR-12).
## 2. Goals, non-goals, anti-goals

- **Goals**:
  - One vocabulary, one set of status values and one set of shared concepts that every module uses without redefining.
  - A single kind of user with nothing to set up: no role, no permission, no sign-in to Thermora itself (§3).
  - Procedures and reports can be shared like a file, and the receiver can tell where an imported procedure came from and when a newer version arrives.
  - Keep a person's AI account theirs: no module asks for or moves credentials.
- **Non-goals**:
  - Roles, permissions, approval inside the app, a permission matrix. All deferred (§3).
  - How any action behaves (running a procedure, authoring, exporting, importing): PRD01 to PRD03.
  - Central user management, a server, or protection against someone editing files outside Thermora.
  - Incident handling and customer replies (later releases, Personas D4).
- **Anti-goals**:
  - Any set-up step or restriction that makes an analyst prefer plain chat (Personas, failure signal).
  - Presenting the app as if it enforced the head's approval: it does not (§1).
- **Measuring success**: the shared measures above. This PRD adds one check of its own: in the pilot, no person has to ask what a term or a status means (observed by the PO during rollout).
## 3. Users and roles

Personas: P-01 Linh, data analyst (primary); P-02 Mai, department head (secondary). Both are served by the same single kind of user in the app.

### Roles

Thermora has a single kind of user in this version. There are no roles and no permission matrix: every user can do everything (create, edit, test, publish and retire procedures; start, finish and export reports; export and import packages). No role is chosen at install and nobody signs in to Thermora itself (sign-in to the person's own AI service is owned by PRD01).

Roles are deferred. Revisit them before Thermora is used for shared or department use, where one person must be kept from changing another's work or where approval must be recorded in the app (decision of the PO, 2026-11-25).

The roles in the personas (the head writes the standard and approves reports; the analysts do the work) describe real life and stay as they are. The app does not enforce them (§1).
## 4. User stories

Goal codes are those of Personas §2 (P-nn-Gn goals, P-nn-Sn situations, P-nn-Fn pains).

| Code | Persona | As a... | I want... | So that... | Priority |
|---|---|---|---|---|---|
| PRD00-US-01 | P-01, P-02 | analyst or head | to use everything in Thermora without choosing a role or a permission | there are no extra steps compared with plain chat (P-01-G4, A5) | Must |
| PRD00-US-02 | P-01 | analyst | to see which of my reports are in progress and which are finished | I know what I still owe without asking in chat (P-01-F3) | Must |
| PRD00-US-03 | P-01 | analyst | a finished report to stay as it was, and a correction to become a new version while the earlier one is kept | I can see what changed and what I sent is not silently overwritten (P-01-S3, P-01-S4) | Must |
| PRD00-US-04 | P-02 | department head | to change a procedure as a new version that leaves the earlier version alone | reports under way keep the standard they started with while the team moves to the improved one (P-02-G1, P-02-S2) | Must |
| PRD00-US-05 | P-01, P-02 | analyst or head | to know which procedure version each report was made with | I can judge a report against the standard that applied to it (P-02-G3, P-01-G1) | Should |
| PRD00-US-06 | P-01, P-02 | analyst or head | to receive a procedure sent as a package, have it as my own copy and edit it if I need to | the standard reaches me over Zalo without a shared folder, and I am not blocked from adapting it (P-02-S4, E4) | Must |
| PRD00-US-07 | P-01, P-02 | analyst or head | to be told where an imported procedure came from and when a newer version of it arrives | nobody follows an outdated procedure by accident (P-02-S4) | Should |
| PRD00-US-08 | P-01, P-02 | analyst or head | to use my own AI account, never type, share or send its sign-in details through Thermora, and not be tracked by Thermora | my subscription and data stay mine (credentials passed in chat, E2) | Must |
| PRD00-US-09 | P-01, P-02 | analyst or head | the same words and the same status names on every screen, in Vietnamese | I never wonder whether two words mean the same thing | Should |
## 5. Functional requirements

| Code | Requirement | Story | Priority |
|---|---|---|---|
| PRD00-FR-01 | Every action of every module is available to every user. Thermora asks for no role, no permission and no sign-in to itself. | US-01 | Must |
| PRD00-FR-02 | The user has a display name that appears in history entries and in the origin of a procedure they export. Where and when it is set is owned by PRD01. | US-06, US-07 | Must |
| PRD00-FR-03 | Every procedure version has a status: Draft, Published or Retired, with the transitions and rules in §8. | US-04 | Must |
| PRD00-FR-04 | Every report version has a status: In progress or Finished, with the transitions and rules in §8. | US-02 | Must |
| PRD00-FR-05 | A Published or Retired procedure version and a Finished report version are never changed. A change is always a new version (a new Draft or a new In progress version). | US-03, US-04 | Must |
| PRD00-FR-06 | Every new version, publish, retire, finish and import is recorded as a history entry (who, what, which version, when). History entries cannot be edited or removed inside Thermora. | US-02, US-03 | Must |
| PRD00-FR-07 | A report records which procedure version it was started with. | US-05 | Should |
| PRD00-FR-08 | An imported procedure belongs to the user who imported it and may be edited by them. It records its origin (exporting person's display name, their version number, export date) and carries the procedure identifier of the package. It is not linked back to the sender's copy. | US-06, US-07 | Must |
| PRD00-FR-09 | When a package carries a newer version of a procedure the user already holds (same procedure identifier), Thermora says so and lets the user update to it or keep what they have. How the import behaves is owned by PRD02. | US-07 | Should |
| PRD00-FR-10 | The glossary terms and status names are used with one fixed Vietnamese wording across all modules. | US-09 | Should |
| PRD00-FR-11 | Thermora never asks for, displays, stores or places in a package any sign-in detail of a person's AI service; each person signs in on their own machine with their own subscription. | US-08 | Must |
| PRD00-FR-12 | Thermora collects and sends no usage data of its own. | US-08 | Should |
## 6. Business rules

| Code | Rule | Applies to |
|---|---|---|
| PRD00-BR-01 | There are no roles in this version. Whoever uses Thermora on a machine may do every action on what is on that machine. Roles are revisited before shared or department use (§3). | FR-01 |
| PRD00-BR-02 | The head's approval of a report is outside Thermora (over Zalo, as today). Thermora has no approved, submitted or sent-back status and records no approval. | FR-04 |
| PRD00-BR-03 | A new report can be started only from a Published procedure version. A report keeps the procedure version it was started with; publishing or retiring does not change reports already started. | FR-03, FR-07 |
| PRD00-BR-04 | At most one version of a procedure is Published at a time. Publishing a version retires the one before. | FR-03 |
| PRD00-BR-05 | Version numbers go up by one (1, 2, 3), are never reused and never overwritten. A new version is always the next number of that procedure or report. | FR-05 |
| PRD00-BR-06 | Sharing is done by the people, not by Thermora: a package is exported, sent over Zalo or email (or any other way), and imported. Thermora sends nothing and receives nothing itself. Sending deliverables to the customer is also outside Thermora. | FR-08 |
| PRD00-BR-07 | An imported procedure or report belongs to the importer. Editing or changing it makes a new version in the importer's copy; the sender's copy is unaffected. The origin stays unchanged. The version numbers of the importer's copy are their own; the origin keeps the sender's number separately. | FR-05, FR-08 |
| PRD00-BR-08 | A newer origin version arriving never overwrites the user's copy: it is added as a new version of that copy only if the user chooses to update (FR-09). | FR-08, FR-09 |
| PRD00-BR-09 | AI sign-in details belong to one person. They are not shared, not sent in chat, and Thermora never needs them from anyone else. Accounts are per person, not per department. | FR-11 |
| PRD00-BR-10 | Financial and HR data is out of scope (Personas AP-02). Hydro-meteorological data going to Anthropic or OpenAI is accepted as the status quo. The reminder to users is owned by PRD01. | US-08 |
| PRD00-BR-11 | The app does not protect against a person changing files outside Thermora. | FR-05 |
| PRD00-BR-12 | A procedure version that is imported arrives Published, so the receiver can start reports from it at once (publishing it retires any version the receiver had Published, BR-04). | FR-03, FR-08 |
| PRD00-BR-13 | A newer version arriving for a procedure the user has edited is added as a new version beside the user's own versions; the user chooses which one to publish. Nothing is published or retired by the arrival itself. | FR-09 |
| PRD00-BR-14 | Two packages carry the same procedure when they carry the same procedure identifier, whoever exported them. The identifier is created when the procedure is first written and never changes. The origin is the last person who exported the package. | FR-08, FR-09 |
| PRD00-BR-15 | An imported report arrives as the importer's own copy with the status it had when exported (In progress or Finished). A change to a Finished one makes a new version (BR-05, BR-07). Its other import behaviour is owned by PRD02. | FR-04, FR-05 |
## 7. Acceptance criteria

| Code | Requirement | Given | When | Then |
|---|---|---|---|---|
| PRD00-AC-01 | FR-01 | Thermora started for the first time on a machine | The user goes through first use | Nothing about the user is asked other than a display name; no role, permission or Thermora account. |
| PRD00-AC-02 | FR-01 | A user at any point in the app | They look for any action to create, edit, test, publish or retire a procedure, or to start, finish or export a report, or to export or import a package | Every one is offered. |
| PRD00-AC-03 | FR-02 | A user with display name "A" | They finish a report version | The history entry shows "A", the action and the date. |
| PRD00-AC-04 | FR-02 | A user with display name "A" | They export a procedure package | The origin recorded in the package shows "A". |
| PRD00-AC-05 | FR-03 | A procedure with a Draft version | The user publishes it | The version is Published and a history entry is recorded. |
| PRD00-AC-06 | FR-03 | A procedure with Published v2 | The user publishes v3 | v3 is Published and v2 is Retired; exactly one version is Published. |
| PRD00-AC-07 | FR-03 | A procedure whose versions are all Retired or Draft | The user tries to start a new report from it | Not possible; only a Published version can be chosen. |
| PRD00-AC-08 | FR-03 | No procedure has a Published version | The user wants to start a report | They are told no procedure is available yet and cannot start one. |
| PRD00-AC-09 | FR-03 | A Retired version that a report was started with | The user opens that report | The report still shows that version and the version stays viewable. |
| PRD00-AC-10 | FR-04 | A user starts a report | The project is created | Its first report version is In progress. |
| PRD00-AC-11 | FR-04 | A report version In progress | The user marks it Finished | The status is Finished, with the date, and a history entry is recorded. |
| PRD00-AC-12 | FR-04 | A Finished report version | The user looks for a way to change its status back or to approve, submit or send it back | None is offered; the only options are viewing it, exporting deliverables and starting a new version. |
| PRD00-AC-13 | FR-05 | A Finished report version | The user tries to edit it | Not possible; they are offered a new version In progress. |
| PRD00-AC-14 | FR-05 | A Published procedure version v2 | The user chooses to change it | A new Draft v3 is created from it; v2 is unchanged and viewable. |
| PRD00-AC-15 | FR-05 | A procedure with versions v1 to v3 | A new Draft is created | It is v4; v1 to v3 stay viewable and no number is reused. |
| PRD00-AC-17 | FR-06 | Any history entry | The user looks for a way to edit or remove it | None is offered. |
| PRD00-AC-18 | FR-07 | A report started from procedure v2 | v3 is published | The report still shows v2 as its procedure version. |
| PRD00-AC-19 | FR-08 | A procedure imported from a package | The user opens it | It shows its origin: exporting person's display name, their version number and export date. |
| PRD00-AC-20 | FR-08 | An imported procedure | The user edits it | A new Draft version is made in their copy; the origin record is unchanged. |
| PRD00-AC-23 | FR-10 | Design-review check: the list of glossary terms and status names in §1 and §8 | The design is reviewed | Each term has one Vietnamese wording in the design's term list and no screen shows another word for it. |
| PRD00-AC-24 | FR-11 | Any package export | A package is created | It contains no AI sign-in detail. |
| PRD00-AC-25 | FR-11 | A user connecting their AI service | They follow the steps shown | Thermora does not ask for, show or store their password or sign-in token. |
| PRD00-AC-26 | FR-12 | A user working normally for a week | Network traffic of Thermora is observed | Nothing is sent about usage; traffic is only to the user's own AI service. |
## 8. States and edge cases

### Status lifecycles

**Procedure version**

| Status | Meaning | Who sets it | Moves to |
|---|---|---|---|
| Draft | Being written or test-run. Not available for starting reports. | The user (creates; editing keeps it Draft) | Published |
| Published | The current version: the only status from which a new report can start. Never edited. | The user, by publishing | Retired |
| Retired | No longer for new reports. Reports already started keep it. Stays viewable; kept for the record. | The user, or automatically when a newer version is published (BR-04) | none |

Guards: only a Draft can be published; only a Published version can be retired by hand; a Retired version is not brought back, since starting from it makes a new Draft. Changing a Published or Retired version means starting a new Draft version from it. Deleting a Draft is owned by PRD03; deleting other versions by PRD02 (§12).

**Report version**

| Status | Meaning | Who sets it | Moves to |
|---|---|---|---|
| In progress | The report is being produced or corrected. A new report, and a new version after a Finished one, starts here. | The user | Finished |
| Finished | The user says it is done. Not edited. Approval and sending to the customer happen outside Thermora. | The user | none (a change is a new version In progress) |

### Edge cases

- Empty: no Published procedure means no report can be started; the user is told (wording owned by PRD02). A report with no Finished version has no "finished" mark and nothing to hand over.
- Many versions: how a long history is listed is owned by PRD02 (§12).
- A procedure retired while reports from it are In progress: they continue with it (BR-03).
- A newer version of an imported procedure arrives after the user edited their copy: the arrival never overwrites; if the user updates, it is added as a new version beside their own versions and the user chooses which to publish (BR-08, BR-13). How the user compares is owned by PRD02.
- The same procedure imported twice, or an older version arriving: handled by PRD02 import rules.
- A package edited by hand or from an unknown person: Thermora cannot detect it (BR-11); PRD02 decides what is shown at import.
- Two copies of one report on two machines: they are independent copies; there is no sync (BR-07).
## 9. Data (business level)

Only the shared fields; each module adds its own.

| Field | Meaning | Required | Limits | Who may edit |
|---|---|---|---|---|
| Display name | The person's name as shown in history entries and origins | Yes | Length limit decided by PRD01 | The user |
| Procedure version | Number, status, creation and publish dates, origin (if imported) | Yes | Numbers 1, 2, 3 ...; never reused | The user (status by the rules in §8) |
| Origin | Exporting person's display name, their version number, export date | Only for an imported procedure | Never changed after import | Nobody |
| Procedure identifier | Mark of the procedure, same in every package of it | Yes, for every procedure | Created at first writing; never changed | Nobody |
| Report version | Number, status, procedure version used, finish date | Yes | Numbers 1, 2, 3 ...; never reused | By rule in §8 |
| History entry | Who did what to which version, when | Yes | Cannot be edited or removed in Thermora | Nobody |
## 10. Notifications and events

There is no server, so Thermora sends no notification. People tell each other over Zalo or email, together with the package.

| Event | Who receives it | Channel | Notes |
|---|---|---|---|
| Procedure shared or updated | The colleagues who should use it | Outside Thermora (the sender sends the package) | The receiver sees the origin and any newer version at import (FR-08, FR-09). |
| Version or status change | The record of the version | Inside Thermora, history | Always recorded (FR-06). |

Note: telling the head that a report is finished, and the head's approval, happen outside Thermora over Zalo, as today; Thermora records only the Finished status (BR-02).
## 11. Non-functional requirements

- Language: Vietnamese for every screen and message (Personas D1); the English glossary above is the reference for meaning.
- Platforms and devices: Windows, macOS and Ubuntu; desktop PC and laptop; smallest screen about 14 inches, 1366x768 (Personas D5).
- Privacy and security: no usage data leaves the machine except what the person's own AI service receives and the packages people choose to send (FR-12). AI sign-in details are never handled by Thermora (FR-11). Customer data in packages is the sender's responsibility; later modules handling customer messages must set data rules (Personas §7).
- Integrity: history cannot be edited inside Thermora; a person who changes files outside Thermora is not detected (BR-11).
- Usability: a person with office-level skills and no terminal can tell, on every screen, what state a report and a procedure version are in.
- Traceability: every report version shows which procedure version it used and, for an imported procedure, its origin.
## 12. Dependencies

Personas (Approved v0.4). No other PRD precedes this one; PRD01 to PRD03 depend on it. PRD04 (Sharing within a department) is deferred and not in the plan. External services: Claude Code and Codex, each person's own subscription.

### Handed to other PRDs

| Target PRD | What must be specified | Arises from |
|---|---|---|
| PRD01 | First use: the user's display name (where it is set, length limit); sign-in to the person's own AI service done by the person; a one-time reminder about excluded data (financial and HR) and the AI provider's training option, which Thermora does not detect or block. | FR-02, FR-11, BR-09, BR-10; credentials seen in chat (E2) |
| PRD01 | What happens when a machine has no connected or signed-in AI service. | FR-01 |
| PRD02 | Report project behaviour: start from a Published procedure, reopen and continue, record the procedure version used; marking Finished; starting a new version after Finished; whether deliverables are exported from a Finished version only or also from In progress. | Glossary; FR-04, FR-07, BR-03 |
| PRD02 | Package export and import for procedures and reports: contents (versions, history, origin), what is shown before an imported procedure is used (an imported procedure runs on the user's own AI service), import of an older, duplicate, same-name or hand-edited package, how a newer version is offered (FR-09) and what happens to the user's own edits, and that no sign-in detail is ever included. | FR-08, FR-09, BR-06 to BR-09, BR-11 |
| PRD02 | Deleting a report and its versions; listing the versions of a report and of a procedure with its history entries, newest first, including when there are many (about 20 or more); the check-and-fix loop rounds. | BR-05, FR-06, glossary |
| PRD02 | Acceptance criteria for import: a newer version of a procedure already held is announced and the user may update or keep what they have; keeping leaves the procedure unchanged; an imported procedure arrives Published (BR-12); an arrival beside edited versions (BR-13); matching by procedure identifier (BR-14); an imported report arrives with its status (BR-15). | FR-08, FR-09, BR-08, BR-12 to BR-15 |
| PRD03 | Anyone authors a procedure: drafting, test run, publishing, retiring, versioning in practice; what is kept when a Published version becomes a new Draft; deleting a Draft; procedure name rules and limits. | §8; BR-04 |
| Later modules | Handling of customer messages and incident data (customer data may be in them). | Personas §7 |
| Later (roles) | Roles, permissions and in-app approval and sending when shared or department use is considered; this was PRD04's content and is deferred. | §3, BR-01, BR-02 |
## 13. Open questions

None. Round 2 questions of the BA second review are settled as defaults D12 to D14. Questions 1 to 3 of v0.1 (self-approval, permissions without a server, credentials and the supporter) are closed by the PO's decision that the first version has no roles; credential handling stays as FR-11 and BR-09. Question 4 (usage measuring) became default D9.

### Proposed defaults

Written into the PRD as proposals; the PO reviews the table once at approval.

| # | Default | Codes affected | Reason |
|---|---|---|---|
| D1 | Report version statuses are "In progress" and "Finished" (English names; Vietnamese wording is for design). | FR-04, §8 | The PO asked for two plain statuses; these are the clearest. |
| D2 | A procedure has numbered versions with statuses Draft, Published, Retired; one Published version at a time; publishing retires the previous; a Published or Retired version is never edited; a Retired version is not brought back, a new Draft is made instead. | FR-03, FR-05, BR-04, §8 | The user needs a clear "current standard" and the received copies need a stable version. |
| D3 | A Finished report version is never edited; a correction is a new version In progress and the earlier version is kept. | FR-04, FR-05, BR-05, AC-13 | What was sent to the customer stays traceable. |
| D4 | An imported procedure records its origin (exporter's display name, their version number, export date). It is a copy that belongs to the importer, with no link back. (The idea was accepted by the PO; the three fields are proposed.) | FR-08, §9, BR-07 | Lets the user tell where it came from and when a newer version arrives. |
| D5 | A newer origin version is offered as an update the user may take or decline; taking it adds a new version to their copy and never overwrites their own edits. | FR-09, BR-08, AC-21, AC-22 | Protects what the user changed while staying informed. |
| D6 | A report keeps the procedure version it started with when a newer one is published or the old one retired. | FR-07, BR-03, AC-18 | A report is judged against the standard that applied. |
| D7 | Version numbers are whole numbers 1, 2, 3, never reused; history entries cannot be edited or removed inside Thermora. | FR-06, BR-05, §9 | Simple and traceable. |
| D8 | The display name is the only identity; Thermora has no accounts of its own. | FR-02, §9 | There are no roles to attach to an identity. |
| D9 | Thermora collects and sends no usage data; the PO checks the pilot measures by asking the 5 people and timing a few jobs. | FR-12, §1 measures, AC-26 | Privacy and scope; there is no server. |
| D10 | Thermora sends no notification; people tell each other with the package over Zalo or email. | §10, BR-06 | No server exists. |
| D12 | An imported procedure version arrives Published; if the user had edited their copy, a newer arrival is added as a new version beside theirs and the user chooses which to publish. | BR-12, BR-13, FR-09 | Imported work is usable at once and the user's edits are never overwritten. |
| D13 | Same procedure is recognised by an identifier created at first writing and carried in the package; the origin is the last exporter. | BR-14, FR-08, FR-09, §9 | Needed to tell "newer version of the same procedure" from "another procedure" without a server. |
| D14 | An imported report arrives as the importer's own copy with the status it had; a change to a Finished one makes a new version; other behaviour goes to PRD02. | BR-15, BR-07 | Consistent with procedures; detail belongs to the owning module. |
| D11 | Priorities: FR-01 to FR-06, FR-08 and FR-11 Must; FR-07, FR-09, FR-10 and FR-12 Should; stories US-01 to US-04, US-06 and US-08 Must; US-05, US-07 and US-09 Should. | §4, §5 | Statuses, versions, sharing and sign-in rules are needed by the REL-1 walking skeleton; traceability and wording can follow. |
## 14. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`. See `docs/prd/README.md` § Parsed by scripts.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-25 | 0.1 | First draft from Personas v0.4 and the stage 0 decisions | — |
| 2026-11-25 | 0.2 | Scope change: first version is a personal tool. Roles and the permission matrix removed (single kind of user, roles deferred); report statuses reduced to In progress and Finished, approval and send-back removed (outside the app); imported procedures belong to the receiver and record their origin, single-writer rule dropped; PRD04 deferred; persona roles stated not to be app permissions | user decision (PO: DaoNguyenTrong) |
| 2026-11-25 | 0.2 | Credential handling kept (FR-11, BR-09); self-approval, tamper and supporter-visibility questions dropped as moot | SA (on behalf of user) |
| 2026-11-25 | 0.2 | Applied the early BA review: module behaviour moved to §12; unsourced success targets removed; testable acceptance criteria and lifecycle ACs added; glossary terms added; persona goal codes in stories; usage measuring became default D9 | BA review |
| 2026-11-25 | 0.3 | Applied the BA second review: imported procedure status, update beside edited copy, matching by procedure identifier, imported report as importer's copy (BR-12 to BR-15, D12 to D14); listing and import ACs (AC-16, AC-21, AC-22) moved to §12 for PRD02; AC-01 wording; AC-23 marked a design-review check; §10 notices made a note; status In review | BA review |
| 2026-11-25 | 0.3 | Restored the stage-0 success signals (80% of the team weekly; another department asks) to the shared measures, measured by asking the people | user decision (PO: DaoNguyenTrong), stage-0 interview (E1) |
| 2026-11-25 | 0.3 | User approval of PRD00 v0.3, including the Proposed defaults D1 to D14 | user decision (PO: DaoNguyenTrong) |
