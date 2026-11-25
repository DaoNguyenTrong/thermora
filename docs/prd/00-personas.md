# Personas

| Item | Value |
|---|---|
| Code | `P` (persona prefix `P-nn`, anti-persona `AP-nn`) |
| Status | Draft |
| Version | 0.2 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-25 |
| Product | Thermora |

Source labels for every claim: **[User]** confirmed by a user; **[Data]** has evidence, recorded in §5; **[Assumption]** unverified, must have a row in §6. Describe only people, not features or solutions.

Evidence note: no end user has been interviewed yet. In this document **[User] means "stated by the PO"** about the team they know first-hand (E1, E3): size, workflow, roles, accounts, machines. **[Data]** rests on a work chat log between the team's technical-support person and the department head (E2). Needs and behaviours inferred from these are [Assumption] and each has a row in §6; the department head is the persona representative and verifies them (see §6). This is a proto-persona set.

Naming: "PRD00" is the common part (glossary, roles, permission matrix, status lifecycle); this file is "Personas" (code `P`). See `docs/prd/README.md` § Catalogue.

## 1. Overview

| Code | Name | Type | Estimated weight | One-line description |
|---|---|---|---|---|
| P-01 | Linh, data analyst | Primary | 4 of the 5 pilot-team members (80%) | Turns raw hydro-meteorological data into the customer's product-effectiveness report; works with office tools, not a terminal. |
| P-02 | Hùng, department head | Secondary | 1 of the 5 pilot-team members (20%) | Knows the reporting process best; writes the team's standard in plain language and approves every report before it is sent. |
| AP-01 | Developer already working in a terminal | Anti-persona | — | Uses Claude Code or Codex directly and needs no guided layer. |
| AP-02 | Staff handling financial or HR data | Anti-persona | — | Excluded until the company has a policy on sending such data to external AI services. |

The primary persona is the one the product favours when two personas conflict. There is only one. Names and quotes are illustrative labels for composite people matching the real roles, not real individuals. The customers (hydropower plants) who receive the reports are not users of the product and are not personas. The PO (the team's technical-support person) is not a persona; see §7 default D2.

## 2. Personas

### P-01 — Linh, data analyst

> "I just want to continue yesterday's report, not explain the whole job to the AI again." (illustrative)

**Context**: [User] One of 4 data analysts in the hydro-meteorological operations support team (5 people in total, one department head). [Data] The team runs and supports a service for hydropower plant customers (operations and operations consulting; E2). [User] The team's most frequent job is the product-effectiveness evaluation report: data is gathered from many sources into raw files (Excel, CSV, JSON), compared and analysed, and written up as a report for the customer. [User] The head reviews and approves each report before it is sent; deliverables are Excel and PDF. [Data] The team's daily work also includes watching customer messages and handling incidents, checking forecasts (for example rain probability), entering and updating data for each plant, and trying a change on one plant before rolling it out to the others (E2). [User] Each analyst has a personal Claude Pro or ChatGPT Plus subscription (mixed within the team). [User] The wider company's non-technology departments use AI ad hoc in chat tools, with no shared process or templates.

**Goals** (what they need to achieve, not features)

| # | Goal | Source |
|---|---|---|
| P-01-G1 | Produce the customer report to the department's standard, so it passes the head's review without rework. | [User] |
| P-01-G2 | Finish recurring reports quickly, without re-explaining the job and its background to the AI each time. | [Assumption] |
| P-01-G3 | Pick up an unfinished job the next day with everything needed to continue, with no re-uploading or re-explaining. | [User] |
| P-01-G4 | Do the daily work without needing a command line. | [User] |

**Current pains**

| # | Pain | How they cope today | Source |
|---|---|---|---|
| P-01-F1 | Context is lost when a chat fills up, so the work has no lasting home. | Download the files from the chat and upload them into another AI tool (Claude Cowork) to continue; patchy, slow, costly, and the result is not what they wanted. | [Assumption] (the PO described this case for company staff; not yet confirmed for this team, see A1) |
| P-01-F2 | Two people doing the same job get different structure and quality, because each prompts the AI their own way. | Each person improvises; the head sends reports back for fixes. | [Assumption] |
| P-01-F3 | There is no task list: what is still open lives in memory and chat history, so a team member has to ask the head whether they still owe anything. | Ask in the team chat ("do I still owe you any task?"); observed twice for one team member. | [Data] E2 |

**Usage context**

| Main device | Frequency | When and where | Language | Digital proficiency | Source |
|---|---|---|---|---|---|
| Own computer; Windows, macOS or Ubuntu (all three in use in the company) | Weekly or more, for the recurring reports | [Assumption] Office hours, at the desk, with a normal office network connection | [Assumption] Vietnamese for daily work (see §7 D1) | Office-level (Excel, documents, slides); does not use a terminal | [User] for devices and proficiency; [Assumption] for the rest (A4, A6, A10) |

**Behaviour and constraints**: Works alongside Excel, CSV and JSON files and PDF output, and uses the Zalo PC app on the desktop for team coordination [Data] E2. Replies to customers follow a tone standard and need senior approval before they are sent [Data] E2. Customer incident descriptions are often hard to understand, so the person handling one compares it with earlier similar incidents [Data] E2. Accounts are issued per person, not per department, and credentials have been passed in plain chat [Data] E2: a security habit to be aware of, not a rule. Every report waits for the head's approval before it goes to the customer [User]; speed is pursued within that constraint. Pays for their own AI subscription, so a job that burns quota faster than today is a cost to them [Assumption]. Has little tolerance for extra steps compared with plain chat [Assumption]. Hydro data going to external AI services is accepted as today's status quo [User]; no financial or HR data is involved. Customer messages may contain customer data [Data] E2; this is a data consideration for later modules, not a rule here.

**Typical situations** (input for user stories)

| # | When... | They want... | So that... |
|---|---|---|---|
| P-01-S1 | a new effectiveness report is due for a customer | to start from the department's standard procedure and be asked for anything missing | the report is right the first time and needs no re-briefing |
| P-01-S2 | they closed the work yesterday with the report half done | to reopen the same job and continue with all earlier context | nothing is re-uploaded or re-explained and the day's time goes into the report itself |
| P-01-S3 | the head sends the report back with corrections | to see what must change and fix it within the same job | the revision is quick |
| P-01-S4 | the report is approved | to export the Excel and PDF deliverables for the customer | the customer receives the final files without manual rework |
| P-01-S5 | *(later release)* a customer reports an incident that is hard to understand | to compare it with earlier similar incidents | the cause is found faster and the reply is consistent |
| P-01-S6 | *(later release)* a reply to a customer is drafted | to have it checked against the tone standard and pass it to a senior colleague for approval | the customer gets an accurate, approved reply |

**Success for them is**: they continue unfinished work the next day with no re-uploading; the same report takes at least 30% less time than today; the head's send-backs become rarer.

**System roles they usually hold**: analyst-type member of a department (roles defined in PRD00 § Roles; to be named there).

### P-02 — Hùng, department head

> "I know exactly how a good report is made. I can say it in words; I am not going to write code." (illustrative)

**Context**: [User] Head (trưởng phòng) of the 5-person hydro-meteorological operations support team. [User] Writes the team's standard, which the other 4 follow; each department writes its own standard (no central AI team). [User] Reviews and approves each customer report before it is sent. [User] Knows the process best but is not a programmer and describes procedures in plain language. [Data] Assigns tasks to the team through chat and decides how sensitive customer replies are reviewed (E2).

**Goals** (what they need to achieve, not features)

| # | Goal | Source |
|---|---|---|
| P-02-G1 | Put the department's way of working into a written standard that the team actually follows. | [User] |
| P-02-G2 | Create or change a procedure alone, in about one working session, without developer help. | [User] |
| P-02-G3 | Approve each report against a known checklist before it reaches the customer. | [User] |
| P-02-G4 | Get consistent results across the 4 analysts, with fewer send-backs. | [Assumption] |

**Current pains**

| # | Pain | How they cope today | Source |
|---|---|---|---|
| P-02-F1 | The standard exists only in people's heads and habits, so results differ between analysts. | Reviews and sends back reports for fixes. | [Assumption] |
| P-02-F2 | AI use in the team has no shared process or templates, which wastes time and money. | None shared; each person uses AI chat or Cowork on their own. | [User] (PO's view of the company) |
| P-02-F3 | Tasks are handed out in chat with no list, so there is no overview of what is open or who owes what. | Answers "do I still owe you any task?" questions from team members in chat. | [Data] E2 |

**Usage context**

| Main device | Frequency | When and where | Language | Digital proficiency | Source |
|---|---|---|---|---|---|
| Own computer; Windows, macOS or Ubuntu | Authoring: occasional (when a procedure is new or changes). Review: each report | [Assumption] Office hours, at the desk | [Assumption] Vietnamese (see §7 D1) | Office-level; not a programmer | [User] for device and proficiency; [Assumption] for the rest (A4, A6, A10) |

**Behaviour and constraints**: Personal Claude Pro or ChatGPT Plus subscription, like the analysts [User]. Expresses procedures as plain-language descriptions, steps and checklists [User]. Is accountable for what the customer receives, so approval before sending is not optional [User]. Sets a tone standard for customer replies and may ask two senior colleagues to review a sensitive reply before it is sent; a candid draft explaining a fault was held back this way [Data] E2. Coordinates through the Zalo PC app on the desktop [Data] E2. May also do analysis work themselves [Assumption; see A9 and §7 D3].

**Typical situations** (input for user stories)

| # | When... | They want... | So that... |
|---|---|---|---|
| P-02-S1 | the team starts using AI for a recurring report type | to explain the procedure in her own words (steps, roles, templates, checks) and see it work on a real case | the team has a working, tested standard without anyone writing code |
| P-02-S2 | a report keeps getting the same mistake | to adjust the standard once | every analyst benefits from the change |
| P-02-S3 | an analyst hands over a finished report | to review it against the checklist and approve it or send it back with comments | only correct reports reach the customer |
| P-02-S4 | the standard is updated | the 4 analysts to work to the latest version | nobody follows an outdated procedure |

**Success for them is**: they create or edit a procedure alone in about one session; at least 3 team procedures exist and are in use; analysts' reports pass the checklist with fewer send-backs.

**System roles they usually hold**: department head with authoring and approval rights (roles defined in PRD00 § Roles; to be named there).

## 3. Anti-personas

### AP-01 — Developer already working in a terminal

Software developers who already use Claude Code or Codex directly in a terminal. They can set up rules, skills and agents themselves and gain nothing from a guided layer. Requests that serve only this person are rejected.

### AP-02 — Staff handling financial or HR data

People such as accounting staff, whose data must not go to external AI services until the company has a policy for it. Accounting was considered for the pilot and rejected for this reason. Requests to support these departments, or to make financial or HR data safe to send, are rejected until such a policy exists.

## 4. Conflicts between personas

None identified. Speed versus approval is a constraint on P-01 (every report waits for the head's approval, see P-01 behaviour), not a conflict between personas.

## 5. Evidence

| # | Type (interview / metrics / ticket / expert) | Description, count | Date | Persona |
|---|---|---|---|---|
| E1 | expert (PO knowledge) | One interview with the PO, who knows the company and the pilot team first-hand. No end-user interviews yet. | 2026-11-25 | P-01, P-02, AP-01, AP-02 |
| E2 | work chat log (anonymized) | Team chat on Zalo PC between the technical-support person and the department head, supplied by the PO. Names, customer plant names and credentials removed. Shows: customers are hydropower plants; daily work beyond reports (customer messages, incidents, forecast checks, per-plant data updates, trying a change on one plant first); hard-to-read incident descriptions compared with earlier ones; customer replies with a tone standard and senior approval; tasks handed out in chat with no list; per-person accounts with credentials passed in chat; Zalo PC as the coordination tool. | 2026-11-25 | P-01, P-02 |
| E3 | expert (PO statement) | The PO is the team's technical-support person (technical support and incidents for the hydropower customers, bug fixes, account issuing) and the rollout and installation owner for the pilot; the department head is the persona representative who verifies the assumptions in §6 together with the analysts. | 2026-11-25 | P-01, P-02 |

## 6. Assumptions to verify

Verification is by interviewing the department head (persona representative) first, then the 4 analysts.

| # | Assumption | Persona | How to verify | Milestone |
|---|---|---|---|---|
| A1 | Analysts lose context and patch between chat and Cowork in their own reporting work, not only elsewhere in the company (P-01-F1). | P-01 | Interview the head and the 4 analysts; ask for the last time it happened | Before REL-1 design starts |
| A2 | Results differ in structure and quality between analysts, which causes send-backs (P-01-F2, P-02-F1, P-02-G4). | P-01, P-02 | Ask the head; review a sample of recent reports and count send-backs | Before REL-1 design starts |
| A3 | Analysts want to be asked for missing information before work starts (P-01-S1). | P-01 | Interview the analysts; observe 2 report sessions | Pilot kickoff |
| A4 | Analysts use the recurring report weekly or more, at their desks in office hours (P-01 and P-02 usage rows). | P-01, P-02 | Ask the head; time the current workflow and log frequency for 2 weeks | Pilot kickoff |
| A5 | Analysts tolerate extra steps poorly versus plain chat; quota use matters to them (P-01-G2). | P-01 | Interview; compare quota use before and during the pilot | Pilot month 1 |
| A6 | Vietnamese is the working language of both personas. | P-01, P-02 | Ask the head and the 4 analysts | Before REL-1 design starts |
| A8 | The standard today lives in people's habits, not in a document. | P-02 | Ask the head for any existing written procedure | Before REL-1 design starts |
| A9 | The head may also do analysis work. | P-02 | Ask the head how much of her time goes to producing reports | Before REL-1 design starts |
| A10 | Device detail for all 5 people: laptop or desktop, screen size and resolution, which operating system each uses, and quality of the office network. | P-01, P-02 | Ask the head; short survey of the 5 people | Before REL-1 design starts |
| A11 | A shared or synced folder is available to all 5 people (relevant to how work files are handed over between them). | P-01, P-02 | Ask the head what shared storage the team uses today | Before REL-1 design starts |

## 7. Open questions

None. Q1 to Q3 of v0.1 became proposed defaults D1 to D3 below; Q4 (who may change a procedure) is decided by the PO ("the head writes, the other 4 follow") and belongs to PRD00 and the Authoring PRD; Q5 (acceptability of proto-personas) is not a PO question and was removed on BA advice.

### Proposed defaults

The PO reviews this table once, at approval; anything rejected becomes an open question.

| # | Default | Why | Shapes |
|---|---|---|---|
| D1 | Screens and messages are in Vietnamese for the pilot; English may be added later if another department needs it. | Both personas work in Vietnamese (A6). | P-01, P-02 usage rows |
| D2 | No third persona. The PO (technical support, bug fixes, account issuing) is also the rollout and installation owner for the pilot (source: user decision, PO: DaoNguyenTrong, E3); each person sets up their own machine with the PO's help. Whoever installs or fixes a machine is an actor that PRD00 § Roles may need to name, not a persona. Revisit and add a persona when a second department asks. | The installer role has no goals of its own in the product yet. | §1, PRD00 |
| D3 | The department head writes the standard and approves reports. If the head also analyses (A9), that person acts as P-01 for that job. | Keeps two personas with different main goals. | P-02 |
| D4 | The first release stays on the product-effectiveness report. Incident analysis and drafting customer replies are recorded as typical situations for later (P-01-S5, P-01-S6) and are not in scope of the first release. | The PO's success measures are about the report. | P-01-S5, P-01-S6 |

### Handed to other PRDs

| To | Item |
|---|---|
| PRD00 | May a department head approve a report they produced themselves? (matters if A9 holds.) |
| PRD00 | Whether the person who installs or supports machines needs a named role. |
| PRD00 | Report status (draft / submitted / approved) and who may set each. |
| Sharing PRD (PRD04) | In-app submit, review and return of a report; today the head's approval stays a human act. |

## 8. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-25 | 0.1 | First draft from the stage 0 PO interview | — |
| 2026-11-25 | 0.2 | Applied the BA early review: P-01-F1 relabelled [Assumption]; [User] defined as "stated by the PO"; removed invented or feature-like content (P-02-F3, A7, the flexibility-versus-strictness row, AP-01 examples); catchphrases marked illustrative; speed versus approval turned into a constraint; outcome wording for goals and situations; device detail moved to A10; naming of PRD00 versus Personas fixed; Q1 to Q3 became defaults D1 to D3, Q4 and Q5 removed, head-approves-own-report handed to PRD00 | BA review |
| 2026-11-25 | 0.2 | Added the PO's role and the head as persona representative (E3, D2, §6 verification); added E2 (anonymized work chat) with new context, pains and situations, D4 and A11 | user decision (PO: DaoNguyenTrong) |
| 2026-11-25 | 0.2 | Recorded the first-release delivery decisions (no server, files in a project folder, single-writer rule, module order) in the README catalogue; effect here limited to A11 and the Handed to other PRDs table | SA (on behalf of user) |
