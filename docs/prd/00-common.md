# PRD-00 — Common part: glossary, roles, permission matrix, status lifecycles

| Item | Value |
|---|---|
| Code | `PRD00` (prefix for every code in this document) |
| Status | Draft |
| Version | 0.1 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-25 |
| Depends on | Personas (`00-personas.md`, Approved v0.4) |
| Design | - (no screens of its own; terms and rules are used by every module's design) |
| Plan | - |

Naming: "PRD00" is this common part (file `00-common.md`); the personas file is "Personas" (code `P`). Other PRDs refer to this file as "PRD-00 §Glossary", "PRD-00 §Roles", "PRD-00 §Permission matrix" and "PRD-00 §Status lifecycles". Where a rule here says "owned by PRDxx", that module specifies how the action behaves; this file only says what the terms mean and who may do what.

## 1. Context and problem

Thermora is a desktop app on each person's own computer (Windows, macOS, Ubuntu; PC or laptop). It drives the Claude Code or Codex the person already has, using that person's own subscription. There is no server. Each department writes its own standard: the head describes how a job is done, and the analysts do the job to that standard. The pilot is the 5-person hydro-meteorological operations team (1 head, 4 analysts), supported from outside by the PO (Personas §1, E1, E3).

Because there is no server and no shared folder (E4), nobody can enforce a rule centrally. Without shared definitions the four modules would each invent their own words for "procedure", "report", "approved", and their own idea of who may do what. This document fixes those once. It decides only common vocabulary, roles, permissions, status values and shared business concepts; how each action behaves is decided by the module that owns it.

### Glossary

Terms are written in English here. The Vietnamese words shown in the app are chosen by the design and must be used the same way everywhere (FR-10).

| Term | Meaning |
|---|---|
| Department | A named group of people who work to one shared standard and have one head. In the pilot there is exactly one: the hydro-meteorological operations support team. It is not an organisation chart unit in the product, only the boundary of "who shares these procedures". |
| Person | One human using Thermora on their own machine, with a display name, one department and one role. |
| Head | The person who writes the department's standard and approves reports (role, see §3; Personas P-02). |
| Analyst | A person who uses the department's procedures to produce reports (role, see §3; Personas P-01). |
| Technical supporter | The person who installs Thermora and fixes machines (role, see §3). In the pilot: the PO. |
| Procedure (the "standard") | The department's written way of doing one kind of job: an agent team (an orchestrator plus role agents) with steps, templates and checks. Example: the product-effectiveness report. Owned by PRD03. |
| Procedure version | One numbered state of a procedure (v1, v2, ...). It has a status (§8). |
| Orchestrator | The agent that discusses the task with the user, proposes a plan the user confirms, and assigns work to role agents. Owned by PRD02. |
| Role agent | An agent with one job in a procedure (for example collect data, analyse, write, check). Role agents do not talk freely to each other. Owned by PRD02. |
| Check-and-fix loop | The only exchange between agents: a check agent sends work back for fixes, at most 3 rounds, then the person decides. Owned by PRD02. |
| Project | The persistent home of one report: a folder on the owner's machine that keeps the raw files, the chosen procedure and its version, the conversation context, the work in progress and the results. Reopening a project continues the work with everything kept. Owned by PRD02. |
| Report | The customer-facing result of one job, produced in a project; deliverables are an Excel file and a PDF. A report has one owner. |
| Owner | The one analyst responsible for a report (or the head, when the head produces it and acts as analyst). |
| Report version | One numbered state of a report (v1, v2, ...). It has a status (§8). A correction after a send-back is always a new report version. |
| Deliverables | The Excel and PDF files made from an Approved report version for the customer. |
| Approval | The head's decision that a report may go to the customer. A human act in REL-1; recorded in Thermora as the status Approved, with the head's name and date. |
| Send back | The head's decision that a submitted report needs corrections. It is recorded with a comment; it is an event, not a status (§8). |
| Package | A file bundle that carries a published procedure version or a report version from one machine to another, sent by the people themselves over Zalo or email. Owned by PRD02 (export and import). |
| Customer | A hydropower plant that receives reports. Not a user and not a persona. |
| Raw files | The Excel, CSV and JSON input files a report is built from. |
| AI service | Claude Code (Anthropic) or Codex (OpenAI), signed in with the person's own Claude Pro or ChatGPT Plus subscription. |

### Shared success measures

Targets accepted by the PO after 3 months of pilot (Personas, P-01 and P-02 "Success for them is", source [User] E1). The module that owns each defines how it is measured; there is no usage tracking inside the product (open question 4).

| Measure | Target | Owner of the definition |
|---|---|---|
| Unfinished work is continued the next day with no re-uploading or re-explaining | Yes, for every report | PRD02 |
| Time for the same recurring report | At least 30% less than today | PRD02 |
| Reports passing the head's check with fewer send-backs | Fewer than today | PRD02 |
| Procedures created or edited by the head alone, about one working session | At least 3 team procedures in use | PRD03 |
| Team members using it weekly | At least 80% | PRD01 |
| Another department asks for it | At least one | PO (outside the product) |

## 2. Goals, non-goals, anti-goals

- **Goals**:
  - One vocabulary, one list of roles, one permission matrix and one set of status values that every module uses without redefining.
  - A model of "who may do what" that works with no server and is honest about its limits (open question 2).
  - Keep a person's AI account theirs: no module asks for or moves credentials (open question 3).
- **Non-goals**:
  - How any action behaves (running a procedure, authoring, exporting): PRD01 to PRD04.
  - Central user management, single sign-on, an admin console, or enforcement that survives someone editing files outside Thermora.
  - More than one department using the product together (revisit when a second department asks; Personas §1).
  - Incident handling and customer replies (later releases, Personas D4).
- **Anti-goals**:
  - A permission system so heavy that an analyst prefers plain chat (Personas, failure signal).
  - A role model that makes the head's approval skippable by accident: a report must not reach the customer through Thermora without an Approved version.
  - Anything that makes the technical supporter a gatekeeper for the content of reports.
- **Measuring success**: the shared measures above. This PRD adds one check of its own: in the pilot, no person has to ask what a term or a status means (observed by the PO during rollout).

## 3. Users and roles

Personas: P-01 Linh, data analyst (primary); P-02 Mai, department head (secondary). The technical supporter is not a persona (Personas D2); it is a role this document names.

### Roles

| Role | Held by (pilot) | Persona | What the role is for |
|---|---|---|---|
| Head | 1 person per department | P-02 | Writes, tests, publishes and retires the department's procedures; reviews and approves or sends back reports; may reassign a report's owner. If the head also produces a report, they act as analyst for that report (Personas D3). |
| Analyst | the other 4 people | P-01 | Uses published procedures to produce reports; owns the reports they start; submits them for approval; makes corrections as new versions. Cannot change a procedure. |
| Technical supporter | the PO (outside the team) | none | Installs Thermora, connects it to the person's AI service together with that person, sets each person's name, department and role on the machine, and fixes problems. Has no right over procedures or reports: it can neither write, approve nor read content as a matter of role (open question 3 covers sign-in). |

Rules about roles: one person holds one role in one department (BR-09). A role is set when Thermora is installed on a machine and changed only by the technical supporter (FR-02). What "role" means technically when there is no server is open question 2.

### Permission matrix

One line per action: who may do it. "Owner" means the owner of that report. "Head*" means subject to open question 1. "-" means nobody. How each action behaves belongs to the module named in the last column.

| Action | Head | Analyst | Tech. supporter | Owning PRD |
|---|---|---|---|---|
| Install Thermora, connect an AI service, set a person's name, department and role | no | no (own machine: connect own AI service only) | yes | PRD01 |
| Sign in to one's own AI service on one's own machine | yes | yes | no (never with another person's login) | PRD01 |
| Create and edit a procedure draft | yes | no | no | PRD03 |
| Test-run a procedure draft | yes | no | no | PRD03 |
| Publish a procedure version | yes | no | no | PRD03 |
| Retire a procedure | yes | no | no | PRD03 |
| Export a published procedure as a package | yes | no | no | PRD02 |
| Import a procedure package | yes | yes | no | PRD02 |
| Use a published procedure (start a report from it) | yes (as analyst) | yes | no | PRD02 |
| Start a report (create its project) | yes (as analyst) | yes | no | PRD02 |
| Work in a report's draft version (add files, talk to the orchestrator, edit) | owner only | owner only | no | PRD02 |
| Mark a report version Submitted | owner only | owner only | no | PRD02 |
| Approve a report version | yes (Head*) | no | no | PRD02 (PRD04 for in-app review) |
| Send a report version back with a comment | yes | no | no | PRD02 (PRD04 for in-app return) |
| Start a new version of a sent-back report | owner only | owner only | no | PRD02 |
| Reassign a report to another owner | yes | no | no | PRD02 |
| Export a report as a package (for hand-over) | owner, head | owner only | no | PRD02 |
| Import a report package to review it or to receive corrections | yes | yes (own reports, or to receive the head's comments) | no | PRD02 |
| Export deliverables (Excel and PDF) from an Approved version | yes | owner only | no | PRD02 |
| Delete a report that was never submitted | owner | owner | no | PRD02 |
| Delete a Submitted or Approved report version | - | - | - | PRD02 (kept; see BR-08) |
| Send deliverables to the customer | yes (outside Thermora) | no, only after the head's approval | no | outside the product |
| Reopen and continue one's own unfinished report | owner | owner | no | PRD02 |

Cells: a role may do the action only when it is marked yes (or owner). The matrix is the single list other PRDs must follow; a module that needs a new action adds the line here first.

## 4. User stories

| Code | Persona | As a... | I want... | So that... | Priority |
|---|---|---|---|---|---|
| PRD00-US-01 | P-02 | department head | only me to be able to change and publish the department's procedures | all four analysts work to one standard and nobody follows a private copy | Must |
| PRD00-US-02 | P-01 | analyst | to know which reports are mine and what state each is in | I know what I still owe without asking in chat | Must |
| PRD00-US-03 | P-02 | department head | to approve a report, or send it back with a comment, and have that recorded under my name | only reports I accepted reach the customer, and the analyst knows what to fix | Must |
| PRD00-US-04 | P-01 | analyst | a correction after a send-back to become a new version while the earlier one is kept | I can see what changed and nothing the head reviewed is silently overwritten | Must |
| PRD00-US-05 | P-01, P-02 | analyst or head | to use my own AI account and never type, share or send its sign-in details through Thermora | my subscription and data stay mine | Must |
| PRD00-US-06 | P-01, P-02 | analyst or head | the same words and the same status names on every screen, in Vietnamese | I never wonder whether two words mean the same thing | Should |
| PRD00-US-07 | P-02 | department head | to know which version of a procedure each report was made with | I can judge a report against the standard that applied to it | Should |

## 5. Functional requirements

| Code | Requirement | Story | Priority |
|---|---|---|---|
| PRD00-FR-01 | Each person on a machine has a display name, one department and one role. These appear in every record of who did what. | US-02, US-03 | Must |
| PRD00-FR-02 | A person's role and department are set when Thermora is installed and can be changed only by the technical supporter. | US-01 | Must |
| PRD00-FR-03 | An action is offered only to the roles the permission matrix allows. When someone reaches a disallowed action anyway (for example by opening a received file), the product refuses it and says in plain Vietnamese which role may do it. | US-01 | Must |
| PRD00-FR-04 | Every procedure version has a status: Draft, Published or Retired, with the transitions and rules in §8. | US-01, US-07 | Must |
| PRD00-FR-05 | Every report version has a status: Draft, Submitted or Approved, with the transitions and rules in §8. | US-02, US-03 | Must |
| PRD00-FR-06 | A Published procedure version and a Submitted or Approved report version are never changed. A change is always a new version (a new Draft). | US-04 | Must |
| PRD00-FR-07 | Every status change, send-back and ownership change is recorded with who, when, the version and, for a send-back, the head's comment. The record travels with the version in a package. | US-03, US-04 | Must |
| PRD00-FR-08 | Each report has exactly one owner at any time; the head may reassign it. | US-02 | Should |
| PRD00-FR-09 | A report records which procedure version it was started with. | US-07 | Should |
| PRD00-FR-10 | The glossary terms and status names are used with one fixed Vietnamese wording across all modules. | US-06 | Should |
| PRD00-FR-11 | Thermora never asks for, displays, stores or places in a package any sign-in detail of a person's AI service; each person signs in on their own machine with their own subscription. | US-05 | Must |
| PRD00-FR-12 | Thermora tells every person, at first use, which data must not be used (financial and HR data) and that report data goes to their AI service provider; it does not detect or block data. | US-05 | Should |

## 6. Business rules

| Code | Rule | Applies to |
|---|---|---|
| PRD00-BR-01 | Single writer: only the head of a department writes, tests, publishes and retires its procedures. Analysts use them and do not edit them. | FR-03, FR-04 |
| PRD00-BR-02 | Each report has one owner. Only the owner changes the report's Draft version and marks it Submitted. | FR-05, FR-08 |
| PRD00-BR-03 | Only the head sets Approved. The approval records the head's name and the date. | FR-05, FR-07 |
| PRD00-BR-04 | Proposed (open question 1): the head may approve a report they own, but the record shows "approved by its owner" so it can be seen. If the head is absent, reports wait; there is no deputy in REL-1. | FR-05, FR-07 |
| PRD00-BR-05 | A send-back is recorded with a comment and is not a status. The sent-back version stays as it is; the owner continues in a new report version (Draft) and submits it again. | FR-05, FR-06, FR-07 |
| PRD00-BR-06 | A new report can be started only from a Published procedure version. A report keeps the procedure version it was started with; publishing a newer version does not change reports already started. | FR-04, FR-09 |
| PRD00-BR-07 | At most one version of a procedure is Published at a time. Publishing a new version retires the one before. | FR-04 |
| PRD00-BR-08 | Version numbers go up by one (1, 2, 3), are never reused and never overwritten. A Submitted or Approved report version cannot be deleted in Thermora. Only a report that was never submitted may be deleted, and only by its owner. | FR-06 |
| PRD00-BR-09 | A person belongs to one department and holds one role in it; a department has one head. If the head produces a report, they act as an analyst for that report. | FR-01, FR-02 |
| PRD00-BR-10 | Deliverables for the customer are made only from an Approved report version. The head's approval is required before anything is sent to the customer; the sending itself is a human act outside Thermora. | FR-05 |
| PRD00-BR-11 | The technical supporter has no right over procedures or reports: it cannot write, publish, approve, send back or reassign. | FR-03 |
| PRD00-BR-12 | AI sign-in details belong to one person. They are not shared, not sent in chat, and Thermora never needs them from anyone else. Accounts are per person, not per department. | FR-11 |
| PRD00-BR-13 | Financial and HR data is out of scope (Personas AP-02). Hydro-meteorological data going to Anthropic or OpenAI is accepted as the status quo; users are reminded to switch off "use my data for training" in their plan (reminder owned by PRD01). | FR-12 |
| PRD00-BR-14 | Roles guide what the product offers; with no server they do not protect against someone changing files outside Thermora. Proposed (open question 2): this is accepted for the pilot. | FR-03 |
| PRD00-BR-15 | A report's check-and-fix loop runs at most 3 rounds; after that the person decides (owned by PRD02). | Glossary |

## 7. Acceptance criteria

| Code | Requirement | Given | When | Then |
|---|---|---|---|---|
| PRD00-AC-01 | FR-03 | A person whose role is analyst | They look for any action to create, edit, publish or retire a procedure | None is offered. |
| PRD00-AC-02 | FR-03 | An analyst opens a procedure package that carries a draft procedure | They try to use or edit it | The product refuses, and the message names the head as the role that may publish procedures. |
| PRD00-AC-03 | FR-01, FR-02 | A newly installed machine | The technical supporter sets name "A", department and role analyst | Every later record made on that machine shows "A" and the role. |
| PRD00-AC-04 | FR-02 | A person who is an analyst | They try to change their own role | Not possible; only the technical supporter can. |
| PRD00-AC-05 | FR-04 | A procedure with a Draft version | The head publishes it | The version becomes Published, with the head's name and date. |
| PRD00-AC-06 | FR-04 | A procedure with Published v2 | The head publishes v3 | v3 is Published and v2 is Retired; exactly one is Published. |
| PRD00-AC-07 | FR-04 | A Retired procedure version | An analyst tries to start a new report from it | Not possible; only a Published version can be chosen. |
| PRD00-AC-08 | FR-05, FR-07 | A report version in Draft | Its owner marks it Submitted | The status is Submitted, with the owner's name and date. |
| PRD00-AC-09 | FR-05 | A Submitted report version | An analyst who is not the head tries to approve it | Not possible. |
| PRD00-AC-10 | FR-05, FR-07 | A Submitted report version | The head approves it | The status is Approved, recording the head's name and date. |
| PRD00-AC-11 | FR-05, FR-07 | A Submitted report version | The head sends it back with a comment | The comment and date are recorded, the version stays unchanged, and the owner can start a new version (Draft) that carries the comment. |
| PRD00-AC-12 | FR-06 | An Approved report version | Anyone tries to edit it | Not possible; the only way to change the report is a new version in Draft. |
| PRD00-AC-13 | FR-06 | A new version after a send-back | It is created | It is v(n+1); version n remains viewable. |
| PRD00-AC-14 | FR-05 | A report that is Draft or Submitted | Anyone tries to export deliverables | Not possible until a version is Approved. |
| PRD00-AC-15 | FR-08 | A report with owner Linh | The head reassigns it to another analyst | The new owner is recorded, and only they may change the Draft from then on. |
| PRD00-AC-16 | FR-08 | An analyst who is not the owner | They try to edit another analyst's Draft report | Not possible. |
| PRD00-AC-17 | FR-09 | A report started from procedure v2 | The head publishes v3 | The report still shows v2 as its procedure version. |
| PRD00-AC-18 | FR-11 | Any package export | A package is created | It contains no AI sign-in detail. |
| PRD00-AC-19 | FR-11 | Setup on a person's machine | The person connects their AI service | The person signs in themselves; Thermora does not ask the technical supporter for or show a password. |
| PRD00-AC-20 | FR-12 | First use of Thermora by a person | They open it | They see the reminder about financial and HR data and about report data going to their AI provider, and must acknowledge it once. |
| PRD00-AC-21 | FR-10 | Any screen of any module | A status or glossary term is shown | It uses the fixed Vietnamese wording for that term. |
| PRD00-AC-22 | FR-03 | The head who also produced a report | They open the matrix-governed actions on that report | They have the owner's actions as analyst, and approve per open question 1. |
| PRD00-AC-23 | FR-03 | The technical supporter on a machine | They look for any action on a procedure or report | None to write, publish, approve, send back or reassign is offered. |

## 8. States and edge cases

### Status lifecycles

**Procedure version**

| Status | Meaning | Who sets it | Moves to |
|---|---|---|---|
| Draft | Being written or tested by the head. Not visible for starting reports. | Head (creates; editing keeps it Draft) | Published |
| Published | The department's current standard. The only status from which a new report can start. Never edited. | Head, by publishing | Retired |
| Retired | No longer to be used for new reports. Reports already started keep it. Kept for the record. | Head, or automatically when a newer version is published (BR-07) | none |

Changing a Published version means starting a new Draft version from it. A Draft that is never published may be deleted by the head.

**Report version**

| Status | Meaning | Who sets it | Moves to |
|---|---|---|---|
| Draft | The owner is producing or correcting the report. | Owner (a report starts as Draft; a new version after a send-back starts as Draft) | Submitted |
| Submitted | The owner says it is ready for the head's review. Not edited. | Owner | Approved, or sent back (an event; the owner then starts a new Draft version) |
| Approved | The head accepted it; deliverables may be made and sent. Not edited. | Head | none (a later change is a new Draft version) |

Send back is an event, not a status: the head's comment and date are stored with the Submitted version, which stays as it was.

### Edge cases

- Empty: a department with no Published procedure shows analysts that none is available yet; they cannot start a report (wording owned by PRD02).
- Many versions: a procedure or report with 20 or more versions still shows its history in order, newest first.
- Head absent: Submitted reports wait. There is no deputy in REL-1 (open question 1).
- Head leaves or role passes: the technical supporter changes the role on the machines; earlier records keep the old head's name.
- Analyst leaves: the head reassigns that analyst's open reports (FR-08).
- Two copies of one report: since hand-over is by package, the owner's copy is the working copy; a copy held by someone else is read-only for review (owned by PRD02).
- A package from outside the department or edited by hand: handled by PRD02 import rules; the role model does not detect it (BR-14).
- A role mismatch at install (someone is set as head by mistake): only the technical supporter can fix it; no data is lost.

## 9. Data (business level)

Only the shared fields; each module adds its own.

| Field | Meaning | Required | Limits | Who may edit |
|---|---|---|---|---|
| Display name | The person's name as shown in records | Yes | Plain text, up to 60 characters | Technical supporter |
| Department | The department the person belongs to | Yes | One department; named | Technical supporter |
| Role | Head, Analyst or Technical supporter | Yes | One role per person | Technical supporter |
| Procedure name | Name of a procedure | Yes | Up to 100 characters; unique within the department | Head |
| Procedure version | Number, status, author, publish date | Yes | Numbers 1, 2, 3 ...; never reused | Head (status only) |
| Report version | Number, status, owner, procedure version used, history of status changes and send-back comments | Yes | Numbers 1, 2, 3 ...; never reused | By rule in §8 |
| History entry | Who did what to which version, when, with the comment of a send-back | Yes | Cannot be edited or removed in Thermora | Nobody |

## 10. Notifications and events

There is no server, so Thermora sends no notification. People tell each other over Zalo or email, together with the package.

| Event | Who receives it | Channel | Notes |
|---|---|---|---|
| Procedure published | The analysts | Outside Thermora (the head sends the package) | Recorded in history. PRD04 may add in-app delivery later. |
| Report submitted | The head | Outside Thermora (owner sends the package) | Recorded in history. In-app submit is PRD04. |
| Report approved or sent back | The owner | Outside Thermora (head sends the package) | Recorded with the comment. In-app return is PRD04. |
| Status or owner change | The record of the version | Inside Thermora, history | Always recorded (FR-07). |

## 11. Non-functional requirements

- Language: Vietnamese for every screen and message (Personas D1); the English glossary above is the reference for meaning.
- Platforms and devices: Windows, macOS and Ubuntu; desktop PC and laptop; smallest screen about 14 inches, 1366x768 (Personas D5).
- Privacy and security: no server and no usage data leaves the machine except what the person's own AI service receives and the packages people choose to send (open question 4 for measurement). AI sign-in details are never handled by Thermora (FR-11). Customer data in packages is the sender's responsibility; later modules handling customer messages must set data rules (Personas §7).
- Integrity: the permission model is cooperative (BR-14); history cannot be edited inside Thermora.
- Usability: a person with office-level skills and no terminal can tell, on every screen, which role they have and what state a report is in.
- Traceability: every report version shows who produced, submitted and approved it, and which procedure version it used.

## 12. Dependencies

Personas (Approved v0.4). No other PRD precedes this one; PRD01 to PRD04 depend on it. External services: Claude Code and Codex, each person's own subscription.

### Handed to other PRDs

| Target PRD | What must be specified | Arises from |
|---|---|---|
| PRD01 | Installation by the technical supporter: setting name, department and role; the person signs in to their own AI service themselves; the supporter never needs another person's login; a first-use reminder about excluded data and the training option. | Roles; BR-11, BR-12, BR-13; credentials seen in chat (E2) |
| PRD01 | What happens when a machine has no connected or signed-in AI service (the roles cannot do their work). | Roles |
| PRD02 | Report project behaviour: start from a Published procedure, reopen and continue, the version of the procedure used. | Glossary; BR-06 |
| PRD02 | Moving to Submitted, Approved, send-back and new version: how the person sees and does each; recording the head's comment and name; self-approved flag if open question 1 is confirmed. | §8 lifecycle; BR-03 to BR-05 |
| PRD02 | Package export and import for procedures and reports: what a package carries (history, versions), how an import is checked (wrong department, older version, edited by hand), read-only copies for review, and that no sign-in detail is ever included. | Hand-over by package; BR-12 |
| PRD02 | Export of Excel and PDF only from an Approved version; deleting a never-submitted report; reassigning the owner. | BR-02, BR-08, BR-10 |
| PRD02 | How the head's checklist is used at approval (per item or as a whole). | Personas P-02-G3 |
| PRD03 | How a procedure is drafted, tested, published, retired and versioned in practice; what is kept when a Published version becomes a new Draft. | §8 lifecycle; BR-01, BR-07 |
| PRD04 | In-app submit, review and return replacing the package hand-over; delivery of the latest Published procedure; any deputy approver. | §10; open question 1 |
| Later modules | Handling of customer messages and incident data (customer data may be in them). | Personas §7 |

## 13. Open questions

| # | Question | Proposed answer | Why it matters | Status |
|---|---|---|---|---|
| 1 | May a department head approve a report they produced themselves, and who approves when the head is absent? (Handed from Personas; matters if the head also analyses, A8.) | Yes in the pilot, because the head is the only approver in a 5-person team. The record states "approved by its owner" so it is visible. No deputy in REL-1: reports wait for the head; a deputy is considered with PRD04. Alternative: forbid self-approval and require a second person, which blocks a head-owned report entirely until a deputy role exists. | Decides whether the matrix needs a deputy role now, and what the approval record shows (BR-04, matrix "Head*", AC-22). Four-eyes review is the common control for approvals; blocking it here costs a new role. | Open |
| 2 | With no server, what does "permission" mean? Each person controls their own files, and anyone could edit a file or choose a different role outside Thermora. | Roles are a guide inside the product: they decide what is offered and what a received file may be used for, and the technical supporter sets each person's role at install. Thermora does not prevent or detect a determined person changing files outside it. Accepted for a 5-person trusted team; revisit before a second department or customer-facing risk grows. | Without this, PRD01 to PRD03 may promise protection the product cannot give. Changes whether tamper detection (for example a check on received packages) is built in REL-1. (BR-14, FR-02, FR-03) | Open |
| 3 | AI credentials were passed in plain chat (E2). What is Thermora's position, and may the technical supporter ever use someone else's sign-in or see report content when helping? | Thermora never asks for, shows or stores sign-in details; each person signs in on their own machine; accounts stay per person; the supporter helps while the person signs in and never needs their login. The supporter has no content rights by role (BR-11), but when helping on a machine may see what is on screen, and this is accepted. Packages never include sign-in details. | Security and account ownership; it shapes PRD01 setup and PRD02 packages. (FR-11, BR-11, BR-12, AC-18, AC-19) | Open |
| 4 | Is any usage measured inside the product (for example reports per week, time per report) to prove the pilot targets? | No: no usage data is collected or sent. The PO measures by asking the 5 people and timing a few jobs (Personas A4, A5). | Privacy and scope. Without measuring in the product, the targets in §1 are checked by hand; adding it later needs a decision about where the data would be kept, as there is no server. (§1 measures, §11) | Open |

### Proposed defaults

Written into the PRD as proposals; the PO reviews the table once at approval.

| # | Default | Codes affected | Reason |
|---|---|---|---|
| D1 | The technical supporter is a named role with no content rights. It sets name, department and role at install; it is not a persona (Personas D2). | Roles, matrix, BR-11, FR-02 | The role exists so installation duties have an owner without giving them power over reports. |
| D2 | A department is a named group with one head; each person belongs to one department with one role. One department in the pilot. | Glossary, BR-09 | Matches Personas (each department writes its own standard) and keeps the pilot simple. |
| D3 | A procedure has numbered versions with statuses Draft, Published, Retired; one Published version at a time; publishing retires the previous one; a Published version is never edited. | FR-04, FR-06, BR-07, BR-08, §8 | The head needs a clear "current standard" and the analysts need one version to follow. |
| D4 | Report version statuses are exactly Draft, Submitted, Approved (PO decision for REL-1). Owner sets Submitted; only the head sets Approved; send-back is a recorded event, not a status; a correction is a new Draft version. | FR-05, FR-06, BR-02, BR-03, BR-05, §8 | Keeps the three values the PO wants and matches "corrections come back as a new version". |
| D5 | A report keeps the procedure version it started with when a newer one is published. | FR-09, BR-06, AC-17 | A report is judged against the standard that applied; changing it mid-way would invalidate earlier work. |
| D6 | Version numbers are whole numbers 1, 2, 3; history entries cannot be edited or removed inside Thermora. | BR-08, §9, FR-07 | Simple and traceable. |
| D7 | The head may reassign a report's owner (for example when an analyst leaves). | FR-08, matrix | The report must always have one owner. |
| D8 | Only a never-submitted report may be deleted, by its owner; Submitted and Approved versions are kept. | BR-08, matrix | Protects what the head reviewed. |
| D9 | Export of deliverables and sending to the customer require an Approved version; sending itself stays outside Thermora. | BR-10, matrix, AC-14 | The head's approval before the customer is not optional (Personas P-02). |
| D10 | Thermora shows a one-time reminder about financial and HR data and the AI provider, and does not detect or block data. | FR-12, BR-13, AC-20 | The PO accepted the status quo; blocking needs detection, which is not planned. |
| D11 | Display name up to 60 characters; procedure name up to 100 characters and unique in the department. | §9 | Sensible limits for records and screens. |
| D12 | No notifications in REL-1; people notify each other over Zalo or email with the package. | §10 | No server exists; in-app delivery is PRD04. |
| D13 | Priorities: FR-01 to FR-07, FR-11 and BR-related rules Must; FR-08, FR-09, FR-10, FR-12 Should; stories US-01 to US-05 Must, US-06 and US-07 Should. | §4, §5 | Status, roles and sign-in rules are needed by the REL-1 walking skeleton; wording consistency and traceability can follow. |

## 14. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`. See `docs/prd/README.md` § Parsed by scripts.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-25 | 0.1 | First draft from Personas v0.4 and the stage 0 decisions | — |
