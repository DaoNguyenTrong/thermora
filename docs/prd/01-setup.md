# PRD-01 — Setup and connection

| Item | Value |
|---|---|
| Code | `PRD01` (prefix for every code in this document) |
| Status | Draft |
| Version | 0.1 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-25 |
| Depends on | PRD-00 (Approved v0.3), Personas (Approved v0.5) |
| Design | - |
| Plan | - |

Terms (AI service, display name, project, procedure, report) and the single kind of user are defined in PRD-00 §1 and §3; this document does not redefine them.

## 1. Context and problem

Thermora does not contain an AI. It drives the Claude Code or Codex that is already on the person's machine, signed in with that person's own Claude Pro or ChatGPT Plus subscription (PRD-00 §1; Personas E1). The five people of the pilot team are office-level users who do not use a terminal (Personas P-01-G4 and the usage rows) and the team is mixed: some hold a Claude subscription, some a ChatGPT one. The PO supports them from outside and installs for the pilot (E3). Before anything useful can happen, each machine must be recognised as ready: the AI tool is there, it is a version Thermora works with, and the person is signed in.

Where it hurts: if setup is a puzzle, every machine needs the PO (or "IT") to install or fix it, which the PO named as a failure signal, and an analyst who meets an unexplained error goes back to plain chat (P-01 tolerates extra steps poorly, A5). A second pain is silent: Pro and Plus plans have a usage limit, and when it runs out the person must understand what happened and that their work is safe. Credentials have also been passed in plain chat in this team (E2), so setup must never encourage typing or sharing sign-in details.

This module covers the first run, finding and checking the AI service, guiding the person when it is missing or signed out, the choice between the two services, the data reminders, a health check the person can re-run, and what the person sees when the plan limit is reached or the service cannot be reached. It does not cover running procedures (PRD02) or authoring them (PRD03).

## 2. Goals, non-goals, anti-goals

- **Goals**:
  - A person who has the AI tool installed gets from first launch to "ready" with one question (display name) and, if needed, their own sign-in, with no terminal and no outside help.
  - At any time the person can see, in plain Vietnamese, whether Thermora can work and, if not, what exactly to do next.
  - When something stops working (signed out, plan limit reached, service unreachable), the person is told what happened, that their work is kept, and what to do.
  - The person is reminded once about the training-data option and about data that must not be used (AP-02), without being blocked.
  - Sign-in details stay with the person and their AI service (PRD-00 FR-11).
- **Non-goals**:
  - Running, continuing or testing a procedure when something fails midway: PRD02 and PRD03 (§12).
  - Thermora itself providing, selling or bundling an AI service or subscription; managing accounts; reading the plan type or remaining quota.
  - Detecting or changing the person's "use my data for training" setting.
  - Support for AI services other than Claude Code and Codex.
  - Installing or updating the AI tool by Thermora itself is undecided (open question 1); it is not assumed.
- **Anti-goals** (failure even if every requirement is met):
  - Each machine still needs the PO to fix ordinary problems such as a lapsed sign-in (Personas failure signal).
  - Anyone sees a terminal, a stack trace or an English technical message during ordinary use.
  - Anyone types, pastes, sends or stores an AI password or token because Thermora asked them to.
  - The reminders are shown so often or so firmly that people click past them, or so firmly that setup feels harder than plain chat.
- **Measuring success**: shared measures are in PRD-00 §1 and are owned by PRD02 and PRD03. This module owns one: **ready without help**, the share of the 5 machines on which the person, once Thermora and an AI tool are installed, reaches the ready state in 5 minutes or less with nobody's help (default D9). Measured in rollout by timing and by asking the people, since Thermora collects no usage data (PRD-00 FR-12). The second failure signal, quota running out faster than before (Personas A5), is checked by asking the people, not by Thermora.

## 3. Users and roles

Personas: P-01 Linh, data analyst (primary); P-02 Mai, department head. Both use the same screens. Roles: none; there is a single kind of user (PRD-00 §3). The PO who installs and helps is not a persona and has no role in the app (Personas D2); stories below are the analyst's or head's, including "I can hand the PO something clear when I do need help".

Specific to this module: setup happens once per machine and per person; everything is local to that machine and is not carried in any package (BR-10).

## 4. User stories

| Code | Persona | As a... | I want... | So that... | Priority |
|---|---|---|---|---|---|
| PRD01-US-01 | P-01, P-02 | analyst or head | to be asked only for my display name the first time I open Thermora | starting is as light as plain chat (P-01-G4, A5) and my name appears on what I do (PRD-00 FR-02) | Must |
| PRD01-US-02 | P-01, P-02 | analyst or head | to see at a glance whether my AI service is ready and which one Thermora will use | I know before starting a job whether it can work (P-01-G3) | Must |
| PRD01-US-03 | P-01, P-02 | analyst or head | to be told in plain Vietnamese what is missing or signed out and what to do, without a terminal | I can fix ordinary problems myself (P-01-G4) | Must |
| PRD01-US-04 | P-01, P-02 | analyst or head | to sign in myself, with my own subscription, on the AI service's own screen, and never type its sign-in details into Thermora | my account stays mine (PRD-00 US-08; E2) | Must |
| PRD01-US-05 | P-01, P-02 | analyst or head with both services ready | to choose which one Thermora uses, and change my mind later | the work goes on the subscription I want to spend (A5) | Should |
| PRD01-US-06 | P-01, P-02 | analyst or head | to be reminded once to turn off "use my data for training" in my plan and not to use financial or HR data | I use AI within what the company accepts (PRD-00 BR-10; AP-02) | Must |
| PRD01-US-07 | P-01, P-02 | analyst or head | to re-run a health check whenever something seems wrong, and copy the result for the PO | the PO can help from one clear message instead of a vague complaint | Must |
| PRD01-US-08 | P-01, P-02 | analyst or head | to be told clearly when my plan limit is used up or the service cannot be reached, that my work is safe and what I can do | I do not lose work or time wondering (P-01-G3, A5) | Must |
| PRD01-US-09 | P-01, P-02 | analyst or head | to change my display name and see which version of Thermora I have | my name is right in what I export, and the PO knows which version I run | Should |

## 5. Functional requirements

| Code | Requirement | Story | Priority |
|---|---|---|---|
| PRD01-FR-01 | The first time Thermora is opened on a machine it asks for a display name and nothing else about the person: no Thermora account, role or permission (PRD-00 FR-01, FR-02). It says in one line where the name appears (history entries and the origin of procedures the person exports). | US-01 | Must |
| PRD01-FR-02 | The person can change the display name at any time. The new name is used from then on; history entries already recorded keep the name they were recorded with (PRD-00 FR-06). | US-09 | Should |
| PRD01-FR-03 | Thermora checks, at every start and whenever the person asks, each of the two supported AI services (Claude Code, Codex) and gives each one one state: Ready; Not installed; Installed but not signed in; Version not supported; Cannot be checked. | US-02 | Must |
| PRD01-FR-04 | Thermora shows the state of both services in one place the person can open from anywhere in the app, and always shows which service is in use. | US-02 | Must |
| PRD01-FR-05 | For each state other than Ready, Thermora shows what it means and the next step in plain Vietnamese, in numbered steps that need no terminal where the AI service allows it. Where a step cannot be done without outside help, the message says so and offers the text to hand to the PO (FR-10). | US-03 | Must |
| PRD01-FR-06 | For "Installed but not signed in", Thermora leads the person to the AI service's own sign-in, which the person completes with their own account on that service's own screen, then checks again. Thermora never asks for, shows, stores or passes on a password, code or token (PRD-00 FR-11). How far Thermora can start the sign-in without a terminal is open question 1. | US-04 | Must |
| PRD01-FR-07 | When both services are Ready, Thermora asks once which to use, remembers the answer on this machine, and lets the person change it at any time. When only one is Ready, it is used automatically and the person is told. Thermora never switches silently: if the chosen service stops being Ready and the other is Ready, Thermora says so and asks. | US-05 | Should |
| PRD01-FR-08 | While no service is Ready, the person can still open Thermora and look at what is already on the machine (projects, procedures, reports) and export it. Anything that needs the AI is not available and says why, with a way to the setup help (FR-05). | US-03 | Must |
| PRD01-FR-09 | At the first moment an AI service is Ready, Thermora shows a one-time reminder: (a) in the person's own plan, turn off the option that lets the provider use their data for training, with the steps for Claude and for ChatGPT; (b) do not put financial or HR data into Thermora (Personas AP-02). The reminder is closed with one button, does not block anything, and can be read again later from the health check. Thermora does not detect, verify or claim anything about the setting. | US-06 | Must |
| PRD01-FR-10 | The person can run a health check at any time. It lists, for each service, the checks of FR-03 and a short connection test, each as OK or a problem with the plain next step; it shows the Thermora version and the service in use. The result can be copied as plain text to send to the PO; the text holds states and versions only, no sign-in detail and no content of the person's files (PRD-00 FR-11). | US-07 | Must |
| PRD01-FR-11 | When the AI service reports that the plan's usage limit is reached, Thermora says so in plain words, says that work so far is kept, shows when it can be used again if the service tells it, and offers the choices: wait and retry, or use the other service if it is Ready. It does not switch by itself (FR-07). | US-08 | Must |
| PRD01-FR-12 | When the AI service cannot be reached or fails in another way, Thermora says in plain words that it could not connect, that work so far is kept, and offers: try again, run the health check, or copy the details for the PO (the text of FR-10 plus the service's own error text, with no sign-in detail). | US-08 | Must |
| PRD01-FR-13 | A sign-in that lapses while Thermora is open is treated like "Installed but not signed in" (FR-06): the person is told and led to sign in again; work so far is kept. | US-04, US-08 | Must |
| PRD01-FR-14 | Thermora shows its own version in the health check and in the app's information screen. How a new version reaches the person is open question 2; until decided, a new version is delivered by the PO as an installer and Thermora does not contact any server to update itself. | US-09 | Should |
| PRD01-FR-15 | Display name, chosen service and "reminder seen" are kept on this machine only. They are not included in any package and are not shared. | US-01, US-05 | Must |

## 6. Business rules

| Code | Rule | Applies to |
|---|---|---|
| PRD01-BR-01 | Thermora drives only Claude Code and Codex as installed on the machine, signed in with the person's own subscription. It has no AI service of its own and never uses an account other than the person's. Whether such use is within the providers' terms for a personal subscription is open question 3. | FR-03, FR-06 |
| PRD01-BR-02 | Sign-in always happens on the AI service's own screen or tool, by the person. Thermora never asks for, shows, stores, copies, packages or sends a password, code or token; no message, health-check text or package contains one (PRD-00 FR-11, BR-09). | FR-06, FR-10, FR-12 |
| PRD01-BR-03 | The display name is required, 1 to 50 characters after leading and trailing spaces are removed; letters (including Vietnamese letters with marks), digits, spaces and common punctuation are allowed. It need not be unique: two people may use the same name. | FR-01, FR-02 |
| PRD01-BR-04 | The reminders of FR-09 never block, and Thermora never states or implies that the training option is off. The person is responsible for their own plan setting. | FR-09 |
| PRD01-BR-05 | Detection, the health check and the connection test send nothing about the person's work. The only traffic is between Thermora and the person's own AI service, plus nothing else (PRD-00 FR-12). | FR-03, FR-10 |
| PRD01-BR-06 | There is no automatic switch between AI services. Each is a separate paid subscription of the person, so the person decides. | FR-07, FR-11 |
| PRD01-BR-07 | Every message in this module says what happened, whether the person's work is safe, and what to do next, in plain Vietnamese without technical terms. Technical text appears only inside the text the person chooses to copy for the PO. | FR-05, FR-11, FR-12 |
| PRD01-BR-08 | Thermora can work only with Claude Code and Codex versions it declares as supported. A version below that is reported as "Version not supported" with the plain next step (ask the PO to update it); the list of supported versions is part of the technical design. | FR-03 |
| PRD01-BR-09 | Thermora does not know or check which plan the person has (Pro, Plus or other) or how much is left. Any account that is signed in is accepted; a plan that cannot be used shows up as the limit or failure messages of FR-11 and FR-12. | FR-03, FR-11 |
| PRD01-BR-10 | Setup choices belong to one person on one machine; nothing in this module is shared between machines. | FR-15 |

## 7. Acceptance criteria

| Code | Requirement | Given | When | Then |
|---|---|---|---|---|
| PRD01-AC-01 | FR-01 | Thermora opened for the first time on a machine | The first screen appears | It asks only for a display name, with a one-line note on where the name appears; no account, role, password or permission is asked. |
| PRD01-AC-02 | FR-01, BR-03 | The first-run screen | The person leaves the name empty or only spaces and continues | They are told a name is needed and cannot continue. |
| PRD01-AC-03 | BR-03 | The first-run screen | The person enters "  Nguyễn Thị Hồng  " | The name is accepted and kept as "Nguyễn Thị Hồng". |
| PRD01-AC-04 | BR-03 | The first-run screen | The person enters 51 characters | They are told the limit is 50 and cannot continue until it is shortened. |
| PRD01-AC-05 | BR-03 | Another person on another machine already uses the name "An" | This person enters "An" | It is accepted; no uniqueness is checked. |
| PRD01-AC-06 | FR-02 | A user named "A" with earlier history entries | They change the name to "B" and finish a report version | The new entry shows "B"; the earlier entries still show "A". |
| PRD01-AC-07 | FR-03 | Claude Code is installed, supported and signed in | Thermora starts | Claude Code shows Ready. |
| PRD01-AC-08 | FR-03 | Codex is not installed | The check runs | Codex shows Not installed, with the next step. |
| PRD01-AC-09 | FR-03 | Claude Code is installed but the person is signed out | The check runs | Claude Code shows Installed but not signed in. |
| PRD01-AC-10 | FR-03, BR-08 | An installed version below the supported one | The check runs | It shows Version not supported and tells the person to ask the PO to update it. |
| PRD01-AC-11 | FR-03 | The computer has no internet and Codex is installed | The check runs | Installed state is found; the sign-in state shows Cannot be checked with the reason in plain words; nothing is shown as Ready that was not confirmed. |
| PRD01-AC-12 | FR-04 | The app at any screen | The person opens the connection state | Both services and their states are shown, with the one in use marked; the screen is usable at 1366×768. |
| PRD01-AC-13 | FR-05, BR-07 | Neither service is installed | The person opens the setup help | For each service the missing part and the next steps are shown in numbered plain Vietnamese, with no English technical terms in the message; where outside help is needed it says so and offers the text for the PO. |
| PRD01-AC-14 | FR-06 | A service is installed but signed out | The person follows the sign-in step | They are led to the service's own sign-in; Thermora has no field for a password, code or token; after sign-in and "check again" the state is Ready. |
| PRD01-AC-15 | FR-06, BR-02 | Any sign-in step | The person looks through every Thermora screen involved | None asks for, shows or stores a password, code or token. |
| PRD01-AC-16 | FR-06 | The person left the sign-in half done | They come back and check again | The state is still Installed but not signed in and the same next step is shown. |
| PRD01-AC-17 | FR-07 | Both services are Ready and no choice has been made | The person reaches the point of using one | They are asked to choose once; the choice is remembered on restart. |
| PRD01-AC-18 | FR-07 | Both Ready and Claude Code chosen | The person changes the choice to Codex in settings | Codex is used from then on; nothing is sent to Claude Code. |
| PRD01-AC-19 | FR-07 | Only Codex is Ready | Thermora starts | Codex is used without asking, and the person is told which service is in use. |
| PRD01-AC-20 | FR-07, BR-06 | Claude Code chosen, then it stops being Ready while Codex is Ready | The person tries to run something | They are told why and asked whether to use Codex; nothing runs on Codex until they say yes. |
| PRD01-AC-21 | FR-08 | No service is Ready and the machine holds earlier projects | The person opens Thermora | They can open and view projects, procedures and reports and export; actions that need the AI are unavailable and say why, with a way to the setup help. |
| PRD01-AC-22 | FR-08 | No service is Ready and no project exists | The person opens Thermora | An empty state explains that the AI service must be ready first and leads to the setup help. |
| PRD01-AC-23 | FR-09 | A service has just become Ready for the first time on this machine | The next screen appears | The reminder appears once, with both parts (training option; no financial or HR data), the steps for each provider, and one button to close it; nothing else is blocked. |
| PRD01-AC-24 | FR-09 | The reminder was closed | Thermora is restarted | It is not shown again; it can be read again from the health check. |
| PRD01-AC-25 | FR-09, BR-04 | The reminder | The person closes it without doing anything | Thermora continues normally and shows no claim that the training option is off. |
| PRD01-AC-26 | FR-10 | A person with both services Ready | They run the health check | Each service shows each check as OK or a problem with the next step, plus the Thermora version and the service in use. |
| PRD01-AC-27 | FR-10 | The health check has finished | The person copies the result | The text holds states, versions and the service names only; it holds no sign-in detail and nothing from the person's files. |
| PRD01-AC-28 | FR-10, BR-05 | The health check running | Thermora's traffic is observed | Only the person's own AI service is contacted and no file content or work data is sent. |
| PRD01-AC-29 | FR-11 | The service reports the plan limit is reached during a run | Thermora receives the message | The person sees plain words that the limit is reached, that their work so far is kept, the time it is available again if the service gave one, and the choices to wait and retry or, if the other service is Ready, to use it. |
| PRD01-AC-30 | FR-11 | The limit message gives no time | The message is shown | No time is invented; the message says the time is not known. |
| PRD01-AC-31 | FR-12 | The service cannot be reached | A run is attempted | The person sees plain words that it could not connect and that work is kept, with try again, health check and copy details for the PO; no technical error is shown on screen. |
| PRD01-AC-32 | FR-12, BR-02 | The details for the PO are copied after a failure | The text is read | It holds the states, versions and the service's error text, and no sign-in detail. |
| PRD01-AC-33 | FR-13 | Thermora is open and the sign-in lapses | The next use of the service fails for that reason | The person is told they are signed out, led to sign in again, and told work is kept. |
| PRD01-AC-34 | FR-14 | The app's information screen | The person opens it | The Thermora version is shown, the same as in the health check. |
| PRD01-AC-35 | FR-14 | Thermora running for a week | Network traffic is observed | Thermora contacts no server of its own to look for updates. |
| PRD01-AC-36 | FR-15 | A procedure or report package is exported | The package is inspected | It holds no display name setting, chosen service or reminder state (the display name appears only as the origin of PRD-00 FR-08). |
| PRD01-AC-37 | FR-15 | The same person on a second machine | They open Thermora there | They are asked for a display name again; nothing was carried over. |

## 8. States and edge cases

- **Service states** (FR-03): Ready; Not installed; Installed but not signed in; Version not supported; Cannot be checked. A service shown as Ready was confirmed in this check; one that could not be confirmed is never Ready.
- **AI tool in an unusual place**: if Thermora cannot find an installed tool in the usual places it shows Not installed; the health-check text lets the PO see this.
- **Both services unusable, no project yet**: Thermora opens to the setup help, not to an empty working screen (AC-22).
- **Signed in to a lapsed plan**: the tool is signed in but the plan cannot be used; this appears as the limit or failure message (BR-09), not as a setup state.
- **Plan limit reached during a long job**: what Thermora does with the job itself (keeps progress, resumes later) is PRD02; this module shows the message and choices (§12).
- **Both services at limit**: each is told separately; no automatic action (BR-06).
- **Sign-in lapses in the middle of a task**: FR-13; the task's state is PRD02's.
- **Same display name on two machines** is allowed (BR-03); history entries cannot tell two people with the same name apart.
- **Name changed after exports**: packages already sent keep the old name in their origin (they are files).
- **Very small screen (1366×768)**: the setup help, the health check and the reminder fit without side scrolling; long steps scroll vertically.
- **Machine offline at start**: installed state is still found; sign-in and the connection test show Cannot be checked, with the plain reason.
- **Reminder shown on a second AI service becoming Ready later**: not shown again; once per machine.

## 9. Data (business level)

| Field | Meaning | Required | Limits | Who may edit |
|---|---|---|---|---|
| Display name | The person's name as shown in history entries and exported origins | Yes | 1 to 50 characters after trimming; not unique | The user |
| AI service in use | Claude Code or Codex | Yes once any service is Ready | One of the two | The user |
| Reminder seen | Whether the one-time reminder was closed on this machine, and when | Yes (kept by Thermora) | Once per machine | Thermora; the user can re-read it |
| Service state | The state of each service from FR-03, as last checked | Shown, not edited | The five states in §8 | Nobody (set by the check) |

Sign-in details are never a field of this module (BR-02).

## 10. Notifications and events

Thermora sends nothing outside the machine (PRD-00 §10). These are in-app messages only.

| Event | Who receives it | Channel | Notes |
|---|---|---|---|
| First run | The person | In the app | Display name request (FR-01). |
| A service becomes Ready for the first time | The person | In the app | The one-time reminder (FR-09). |
| A service is not Ready | The person | In the app, setup help | State and next step (FR-05). |
| Plan limit reached | The person | In the app | Message and choices (FR-11). |
| Service unreachable or failed | The person | In the app | Message, retry, copy for the PO (FR-12). |
| Sign-in lapsed | The person | In the app | Led to sign in again (FR-13). |
| Health check result for the PO | The PO | Outside Thermora: the person pastes the copied text into Zalo or email | Text only (FR-10). |

## 11. Non-functional requirements

- **Language**: Vietnamese for every screen, message and reminder (Personas D1); no English technical wording in messages (BR-07).
- **Platforms**: Windows, macOS, Ubuntu; desktop PC and laptop; smallest screen about 14 inches, 1366×768 (Personas D5).
- **Skills**: no terminal for ordinary use; a person with office-level skills can complete setup (Personas P-01 proficiency). Where the terminal cannot be avoided, the message says so and hands over to the PO (open question 1).
- **Privacy and security**: no sign-in detail is handled, stored or copied (BR-02); nothing is sent except to the person's own AI service (BR-05); no usage data (PRD-00 FR-12).
- **Speed**: the state of both services is shown within a few seconds of starting (default D2); a check never freezes the app; a slow check shows that it is working.
- **Traceability**: the health-check text names the Thermora version and the service versions so the PO can reproduce a problem.

## 12. Dependencies

PRD-00 (single kind of user, display name, credential rule, no usage data); Personas. External: Claude Code and Codex (the person's own installation and subscription). PRD02 and PRD03 depend on this module: they run only on a Ready service.

### Handed to other PRDs

| Target PRD | What must be specified | Arises from |
|---|---|---|
| PRD02 | What happens to a running job and its progress when the plan limit is reached, the service is unreachable or the sign-in lapses: progress kept, how the person resumes, what the project shows. | FR-11, FR-12, FR-13 |
| PRD02 | Whether the AI service can be chosen per project as well as per machine, and what a project does when it was started on one service and is continued on the other. | FR-07 |
| PRD02 | Which actions need a Ready service (starting or continuing a run) and which do not (viewing, export, import of a package). | FR-08 |
| PRD02 | What is shown when a package or project comes from a newer Thermora version than the one installed. | FR-14 |
| PRD03 | Whether a procedure is written for one service or both, and what a test run does when the person's service is not the one the procedure targets or is not Ready. | FR-07, FR-08 |
| Later modules (incident, customer replies) | Data rules for customer messages; the reminder here covers only financial and HR data. | FR-09, Personas §7 |

## 13. Open questions

| # | Question | Proposed answer | Why it matters | Status |
|---|---|---|---|---|
| 1 | When Claude Code or Codex is not installed, or the sign-in can only be started from a terminal, how far does Thermora go? Options: (a) Thermora only detects and guides; the PO installs the tool on each pilot machine and, if sign-in needs a terminal, does it once with the person; (b) Thermora installs the tool and starts the sign-in itself, with no terminal. | (a) for the pilot: the PO already owns installation of the 5 machines (E3), Thermora detects, explains and hands the PO a copyable message (FR-05, FR-10), and starts the provider's own sign-in where that is possible without a terminal (FR-06). Self-install by Thermora (b) is considered after the pilot if the PO still has to fix many machines. | (b) is a large piece of work and touches security (running installers); (a) keeps the failure signal "each machine needs IT" alive for the first install but not for later problems. It sets how many setup screens and states exist. | Open |
| 2 | How does a new version of Thermora reach the 5 people? Options: (a) the PO sends a new installer over Zalo or email, like packages; (b) Thermora checks for and downloads updates itself. | (a): there is no server and PRD-00 says Thermora sends no usage data and contacts only the person's own AI service (PRD-00 FR-12, AC-26); an update check would be a new outgoing connection to a place the PO must host and run. Thermora shows its version (FR-14) so the PO can tell who has what. | (b) needs a hosting place and a change to the privacy rule; (a) risks people running different versions (affects package compatibility, §12). | Open |
| 3 | Is using a personal Claude Pro or ChatGPT Plus subscription through Thermora (which drives the official Claude Code or Codex tool for several people's reports) within the providers' terms for those plans? | Thermora drives only the official tool the person installed and signed in (BR-01) and never handles sign-in details (BR-02). The PO confirms the providers' current terms for personal plans before the pilot; if a provider disallows it, that provider is dropped from the supported list. | If a provider's terms do not allow it, a whole service (and some of the team) cannot use Thermora; it changes scope, not wording. | Open |

### Proposed defaults

| # | Default | Codes affected | Reason |
|---|---|---|---|
| D1 | Display name: required, 1 to 50 characters after trimming, not unique, editable at any time; earlier history entries keep the name they were written with. | FR-01, FR-02, BR-03, AC-02 to AC-06 | A name is all PRD-00 needs; history cannot be edited (PRD-00 FR-06). |
| D2 | Both services are checked at every start and on request; a service is Ready only when confirmed; the result appears within a few seconds. | FR-03, FR-04, §8, §11 | Stale readiness would send the person into a failing job. |
| D3 | If both are Ready, ask once, remember, changeable; if one, use it and say so; never switch silently. | FR-07, BR-06, AC-17 to AC-20 | Each is a separate paid subscription (A5). |
| D4 | One-time, non-blocking reminder at the first moment a service is Ready, re-readable from the health check; Thermora does not detect or verify the training setting. | FR-09, BR-04, AC-23 to AC-25 | PRD-00 handed a one-time, non-blocking reminder to this module. |
| D5 | The health check shows the five states, a short connection test, versions and the service in use; it is copyable as text for the PO with no sign-in detail and no file content. | FR-10, AC-26 to AC-28, AC-32 | Turns "it does not work" into one message for the PO. |
| D6 | With no service Ready, the person can view and export what exists; running is unavailable with a reason and a link to setup. | FR-08, AC-21, AC-22 | Work already done is never locked behind setup. |
| D7 | Quota-reached and unreachable messages follow what happened, work is kept, next steps; no time is invented; no automatic switch. | FR-11, FR-12, BR-06, BR-07, AC-29 to AC-32 | The person pays for each subscription and needs to know their work is safe. |
| D8 | Thermora declares minimum supported tool versions; below that, "Version not supported" and ask the PO to update. | FR-03, BR-08, AC-10 | Unsupported versions fail in confusing ways. |
| D9 | Success measure "ready without help": setup to the ready state in 5 minutes or less with nobody's help once Thermora and a tool are installed, timed in rollout and by asking. | §2 | A number is needed for the failure signal "each machine needs IT". |
| D10 | Settings are per machine, not shared and not in any package. | FR-15, BR-10, AC-36, AC-37 | No server; packages must never carry personal settings. |
| D11 | Messages have three parts (what happened, is work safe, what to do) in plain Vietnamese; technical text only inside the copyable text. | BR-07, AC-13, AC-31 | Office-level users without a terminal (Personas). |
| D12 | A lapsed sign-in during use is treated like signed out. | FR-13, AC-33 | Same fix for the person. |
| D13 | Thermora does not read the plan type or the remaining quota; any signed-in account is accepted. | BR-09 | The tools may not expose it; avoids an invented rule. |
| D14 | Priorities: Must for FR-01, FR-03 to FR-06, FR-08 to FR-13, FR-15 and stories US-01 to US-04, US-06 to US-08; Should for FR-02, FR-07, FR-14 and stories US-05, US-09. | §4, §5 | Setup, sign-in, the reminder and failure messages are needed for the REL-1 walking skeleton; choice between services, rename and version display can follow. |
| D15 | Until open question 2 is decided, a new version is delivered by the PO as an installer and Thermora contacts no server to update itself. | FR-14, AC-35 | Consistent with PRD-00 FR-12. |

## 14. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`. See `docs/prd/README.md` § Parsed by scripts.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-25 | 0.1 | First draft from Personas v0.5 and PRD-00 v0.3 | — |
