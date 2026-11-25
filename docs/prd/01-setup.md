# PRD-01 — Setup and connection

| Item | Value |
|---|---|
| Code | `PRD01` (prefix for every code in this document) |
| Status | In review |
| Version | 0.2 |
| Approver | PO: DaoNguyenTrong |
| Updated | 2026-11-25 |
| Depends on | PRD-00 (Approved v0.3), Personas (Approved v0.5) |
| Design | - |
| Plan | - |

Terms (AI service, display name, project, procedure, report) and the single kind of user are defined in PRD-00 §1 and §3; this document does not redefine them. Terms specific to this module:

- **Service state**: the result of checking one AI service on this machine: Ready; Not installed; Installed but not signed in; Version not supported; Cannot be checked (§8).
- **Health check**: the check of both services that the person can run at any time. It only looks at the program on the machine and never asks the AI anything (FR-10). The **connection test** is a separate, optional step that does ask the AI and so uses a little of the plan (FR-17).
- **Plan limit**: the usage limit of the person's own subscription (Claude Pro or ChatGPT Plus); when it is used up the AI service refuses work until it is available again.
- **Setup help**: the screens that explain, for each service that is not Ready, what is missing and what to do (FR-05).
- **Supporter**: the person who installs Thermora and the AI tool and helps with problems; in the pilot this is the PO (Personas D2). Not a role in the app. Messages to the person say "the person who supports you", never "the PO".

## 1. Context and problem

Thermora does not contain an AI. It drives the Claude Code or Codex program that is already on the person's machine, signed in with that person's own Claude Pro or ChatGPT Plus subscription (PRD-00 §1; Personas E1). The five people of the pilot team are office-level users who do not use a terminal (Personas P-01-G4 and the usage rows) and the team is mixed: some hold a Claude subscription, some a ChatGPT one. The PO supports them from outside and installs for the pilot (E3). Before anything useful can happen, each machine must be recognised as ready: the AI tool is there, it is a version Thermora works with, and the person is signed in.

Where it hurts: if setup is a puzzle, every machine needs the supporter to install or fix it, which the PO named as a failure signal, and an analyst who meets an unexplained error goes back to plain chat (P-01 tolerates extra steps poorly, A5). A second pain is silent: Pro and Plus plans have a usage limit, and when it runs out the person must understand what happened and that their work is safe (the quota failure signal, A5). Credentials have also been passed in plain chat in this team (E2), so setup must never encourage typing or sharing sign-in details.

Provider terms (decided by the PO on 2026-11-25): the providers allow signing in to their own unmodified tool with one's own subscription for ordinary individual use, but do not allow another application to offer their login, to route requests through a person's plan on behalf of others, or to collect or store their sign-in. The PO chose to keep the plan on these hard rules (BR-01, BR-02, BR-11, BR-12) and to accept the risks recorded in §13 *Accepted risks*.

This module covers the first run, finding and checking the AI service, guiding the person when it is missing or signed out, the choice between the two services, the data reminders, a health check the person can re-run, and what the person sees when the plan limit is reached or the service cannot be reached. It does not cover running procedures (PRD02) or authoring them (PRD03).

## 2. Goals, non-goals, anti-goals

- **Goals**:
  - A person who has the AI tool installed gets from first launch to "ready" with one question (display name) and, if needed, their own sign-in, with no terminal where the provider's sign-in allows it (FR-06).
  - At any time the person can see, in plain Vietnamese, whether Thermora can work and, if not, what exactly to do next.
  - Looking at the state costs nothing: start-up detection and the health check use none of the person's plan (BR-13).
  - When something stops working (signed out, plan limit reached, service unreachable), the person is told what happened, that their work is kept, and what to do.
  - The person is reminded once about the training-data option and about data that must not be used (AP-02), without being blocked.
  - Sign-in details stay with the person and their AI service (PRD-00 FR-11).
- **Non-goals**:
  - Running, continuing or testing a procedure when something fails midway: PRD02 and PRD03 (§12).
  - Thermora itself providing, selling or bundling an AI service or subscription; offering a login of its own; managing accounts; reading the plan type or remaining quota.
  - Installing the AI tool by Thermora itself, or updating Thermora by itself: for the pilot the supporter does both (D15, D20).
  - Detecting or changing the person's "use my data for training" setting.
  - Support for AI services other than Claude Code and Codex.
  - Offering Thermora to anyone outside the company (BR-12).
- **Anti-goals** (failure even if every requirement is met):
  - Each machine still needs the supporter to fix ordinary problems such as a lapsed sign-in (Personas failure signal).
  - Anyone sees a terminal, a stack trace or an English technical message during ordinary use.
  - Anyone types, pastes, sends or stores an AI password or token because Thermora asked them to.
  - The reminders are shown so often or so firmly that people click past them, or setup feels harder than plain chat.
  - Setup and checking eat the plan the person needs for real work.
- **Measuring success**: shared measures are in PRD-00 §1 and are owned by PRD02 and PRD03. This module owns one: **ready without help**, the share of the 5 machines on which the person, once Thermora and an AI tool are installed, reaches the ready state in 5 minutes or less with nobody's help (default D9, a proposed default the PO confirms at approval; not yet PO-approved). Measured in rollout by timing and by asking the people, since Thermora collects no usage data (PRD-00 FR-12). The second failure signal, quota running out faster than before (Personas A5), is checked by asking the people, not by Thermora.

## 3. Users and roles

Personas: P-01 Linh, data analyst (primary); P-02 Mai, department head. Both use the same screens. Roles: none; there is a single kind of user (PRD-00 §3). The supporter is not a persona and has no role in the app (Personas D2); stories below are the analyst's or head's, including "I can hand the supporter something clear when I do need help".

Specific to this module: setup happens once per machine and per person; everything is local to that machine and is not carried in any package (BR-10).

## 4. User stories

| Code | Persona | As a... | I want... | So that... | Priority |
|---|---|---|---|---|---|
| PRD01-US-01 | P-01, P-02 | analyst or head | to be asked only for my display name the first time I open Thermora | starting is as light as plain chat (P-01-G4, A5) and my name appears on what I do (PRD-00 FR-02) | Must |
| PRD01-US-02 | P-01, P-02 | analyst or head | to see at a glance whether my AI service is ready and which one Thermora will use | I know before starting a job whether it can work, and I can resume work without surprises (P-01-G3, P-02-G2) | Must |
| PRD01-US-03 | P-01, P-02 | analyst or head | to be told in plain Vietnamese what is missing or signed out and what to do, without a terminal where possible | I can fix ordinary problems myself (P-01-G4) | Must |
| PRD01-US-04 | P-01, P-02 | analyst or head | to sign in myself, with my own subscription, on the AI service's own screen, and never type its sign-in details into Thermora | my account stays mine (PRD-00 US-08; E2) | Must |
| PRD01-US-05 | P-01, P-02 | analyst or head with both services ready | to choose which one Thermora uses, never have it switched for me, and change my mind later | the work goes on the subscription I want to spend (A5) | Must |
| PRD01-US-06 | P-01, P-02 | analyst or head | to be reminded once to turn off "use my data for training" in my plan and not to use financial or HR data | I use AI within what the company accepts (PRD-00 BR-10; AP-02) | Must |
| PRD01-US-07 | P-01, P-02 | analyst or head | to re-run a health check whenever something seems wrong, and copy the result for the person who supports me | they can help from one clear message instead of a vague complaint | Must |
| PRD01-US-08 | P-01, P-02 | analyst or head | to be told clearly when my plan limit is used up or the service cannot be reached, that my work is safe and what I can do | I do not lose work or time wondering (P-01-G3; quota failure signal, A5) | Must |
| PRD01-US-09 | P-01, P-02 | analyst or head | to change my display name and see which version of Thermora I have | my name is right in what I export, and the supporter knows which version I run | Should |

## 5. Functional requirements

| Code | Requirement | Story | Priority |
|---|---|---|---|
| PRD01-FR-01 | The first time Thermora is opened on a machine it asks for a display name and nothing else about the person: no Thermora account, role or permission (PRD-00 FR-01, FR-02). It says in one line where the name appears (history entries and the origin of procedures the person exports). | US-01 | Must |
| PRD01-FR-02 | The person can change the display name at any time, under the same rules as the first entry (BR-03). The new name is used from then on; how earlier history entries show it is PRD-00 FR-06 and PRD02 (§12). | US-09 | Should |
| PRD01-FR-03 | Thermora checks, at every start and whenever the person asks, each of the two supported AI services (Claude Code, Codex) and gives each one one state: Ready; Not installed; Installed but not signed in; Version not supported; Cannot be checked. The check only finds the program, its version and its sign-in status; it sends no request to the AI and uses none of the plan (BR-13). | US-02 | Must |
| PRD01-FR-04 | Thermora shows the state of both services in one place the person can open from anywhere in the app, and always shows which service is in use. | US-02 | Must |
| PRD01-FR-05 | For each state other than Ready, Thermora shows what it means and the next step in plain Vietnamese, in numbered steps that need no terminal where the AI service allows it. For Cannot be checked it gives the reason and the step (for example: check the internet connection, then check again). Where a step cannot be done without outside help, the message says so and offers text to hand to the person who supports the user (FR-10). | US-03 | Must |
| PRD01-FR-06 | For "Installed but not signed in", Thermora leads the person to the AI service's own sign-in, which the person completes with their own account on that service's own screen, then checks again. Either Thermora starts the provider's own sign-in without a terminal, or it says that outside help is needed and offers text for the person who supports the user; which of the two applies is decided in the technical design (§12). Thermora never asks for, shows, stores or passes on a password, code or token (PRD-00 FR-11) and offers no login of its own (BR-02). | US-04 | Must |
| PRD01-FR-07 | When both services are Ready, Thermora asks once which to use and remembers the answer on this machine. When only one is Ready, it is used automatically and the person is told. Thermora never switches silently: if the chosen service stops being Ready, or its plan limit is reached, and the other is Ready, Thermora says so and asks (BR-06). | US-05 | Must |
| PRD01-FR-08 | While no service is Ready, anything that needs the AI is unavailable and says why, with a way to the setup help (FR-05). Which other actions stay available (viewing, export) is PRD02's decision (§12). | US-03 | Must |
| PRD01-FR-09 | At the first moment an AI service is Ready, Thermora shows a one-time reminder: (a) in the person's own plan, find and turn off the option that lets the provider use their data for training, with a pointer to where to find it in each provider's own account settings (Claude, ChatGPT); (b) do not put financial or HR data into Thermora (Personas AP-02). The reminder is closed with one button, does not block anything, and can be read again later from the health check. Thermora does not detect, verify or claim anything about the setting. | US-06 | Must |
| PRD01-FR-10 | The person can run a health check at any time. It lists, for each service, the checks of FR-03, each as OK or a problem with the plain next step; it shows the Thermora version and the service in use. It makes no request to the AI (BR-13). The result can be copied as plain text to send to the supporter; the text holds states and versions only, no sign-in detail, no credential file and no content of the person's files (PRD-00 FR-11). | US-07 | Must |
| PRD01-FR-11 | When the AI service reports that the plan limit is reached, Thermora says so in plain words, says that work so far is kept, shows when it can be used again if the service tells it, and offers: wait and retry, or, if the other service is Ready, ask whether to use it (FR-07). It does not switch by itself. | US-08 | Must |
| PRD01-FR-12 | When the AI service cannot be reached or fails in another way, Thermora says in plain words that it could not connect, that work so far is kept, and offers: try again, run the health check, or copy the details for the supporter (the text of FR-10 plus the service's own error text, with no sign-in detail). | US-08 | Must |
| PRD01-FR-13 | A sign-in that lapses while Thermora is open is treated like "Installed but not signed in" (FR-06): the person is told and led to sign in again; work so far is kept. | US-04, US-08 | Must |
| PRD01-FR-14 | Thermora shows its own version in the health check and in the app's information screen. A new version is delivered by the supporter as an installer; Thermora does not contact any server to update itself (D15); see also PRD-00 AC-26. | US-09 | Should |
| PRD01-FR-15 | Display name, chosen service and "reminder seen" are kept on this machine only. They are not shared. | US-01, US-05 | Must |
| PRD01-FR-16 | The person can change the chosen service at any time from the settings. | US-05 | Should |
| PRD01-FR-17 | The health check offers a separate **connection test** that really asks the AI a trivial question to prove the whole path works. It runs only when the person explicitly asks, after a message that says it uses a little of their plan. It is never run at start-up or as part of the health check without that request. | US-07 | Should |

## 6. Business rules

| Code | Rule | Applies to |
|---|---|---|
| PRD01-BR-01 | Thermora only drives the official, unmodified Claude Code or Codex program that the person installed and signed in to themselves through the provider's own sign-in. It has no AI service of its own and never uses an account other than the person's. | FR-03, FR-06 |
| PRD01-BR-02 | Sign-in always happens through the AI provider's own sign-in, by the person. Thermora never reads, asks for, shows, stores, copies, packages or sends a password, code, login token or credential file, and offers no login of its own; no message, health-check text or package contains one (PRD-00 FR-11, BR-09). | FR-06, FR-10, FR-12 |
| PRD01-BR-03 | The display name is required, 1 to 50 characters after leading and trailing spaces are removed; any printable characters (including Vietnamese letters with marks) are allowed. It need not be unique: two people may use the same name. | FR-01, FR-02 |
| PRD01-BR-04 | The reminders of FR-09 never block, and Thermora never states or implies that the training option is off. The person is responsible for their own plan setting. | FR-09 |
| PRD01-BR-05 | Detection and the health check send nothing about the person's work and no request to the AI; any other traffic is only with the person's own AI service (PRD-00 FR-12). | FR-03, FR-10 |
| PRD01-BR-06 | There is no automatic switch between AI services. Each is a separate paid subscription of the person, so the person decides: Thermora asks before using one when both are Ready and before moving to the other. | FR-07, FR-11 |
| PRD01-BR-07 | Every message in this module says what happened, whether the person's work is safe, and what to do next, in plain Vietnamese without any term from the design's technical-term list. Technical text appears only inside the text the person chooses to copy for the supporter. | FR-05, FR-11, FR-12 |
| PRD01-BR-08 | Thermora can work only with Claude Code and Codex versions it declares as supported. A version below that is reported as "Version not supported" with the plain next step (ask the person who supports you to update it); the list of supported versions is part of the technical design. | FR-03 |
| PRD01-BR-09 | Thermora does not know or check which plan the person has (Pro, Plus or other) or how much is left. Any account that is signed in is accepted; a plan that cannot be used shows up as the limit or failure messages of FR-11 and FR-12. | FR-03, FR-11 |
| PRD01-BR-10 | Setup choices belong to one person on one machine; nothing in this module is shared between machines. | FR-15 |
| PRD01-BR-11 | One person's sign-in is never used for another person. Each person works only through the AI tool signed in on their own machine (PRD-00 BR-09). | FR-06 |
| PRD01-BR-12 | Thermora is an internal tool for the company's own staff. It is not offered, sold or given to people outside the company. | §1, §2 |
| PRD01-BR-13 | Start-up detection and the health check do not use the person's plan: they find the program, its version and its sign-in status and send no request to the AI. A check that does use the plan (the connection test) runs only when the person explicitly asks, and says so beforehand. | FR-03, FR-10, FR-17 |

## 7. Acceptance criteria

| Code | Requirement | Given | When | Then |
|---|---|---|---|---|
| PRD01-AC-01 | FR-01 | Thermora opened for the first time on a machine | The first screen appears | It asks only for a display name, with a one-line note on where the name appears; no account, role, password or permission is asked. |
| PRD01-AC-02 | FR-01, BR-03 | The first-run screen | The person leaves the name empty or only spaces and continues | They are told a name is needed and cannot continue. |
| PRD01-AC-03 | BR-03 | The first-run screen | The person enters "  Nguyễn Thị Hồng  " | The name is accepted and kept as "Nguyễn Thị Hồng". |
| PRD01-AC-04 | BR-03 | The first-run screen | The person enters 51 characters | They are told the limit is 50 and cannot continue until it is shortened. |
| PRD01-AC-05 | BR-03 | Another person on another machine already uses the name "An" | This person enters "An" | It is accepted; no uniqueness is checked. |
| PRD01-AC-06 | FR-02 | A user named "A" | They change the name to "B" | "B" is shown as their name from then on. |
| PRD01-AC-07 | FR-03 | Claude Code is installed, supported and signed in | Thermora starts | Claude Code shows Ready. |
| PRD01-AC-08 | FR-03, FR-05 | Codex is not installed | The check runs | Codex shows Not installed, with the next step. |
| PRD01-AC-09 | FR-03 | Claude Code is installed but the person is signed out | The check runs | Claude Code shows Installed but not signed in. |
| PRD01-AC-10 | FR-03, BR-08 | An installed version below the supported one | The check runs | It shows Version not supported and tells the person to ask the person who supports them to update it. |
| PRD01-AC-11 | FR-03, FR-05 | The sign-in state cannot be confirmed (for example offline) and Codex is installed | The check runs | The program is found; the sign-in state shows Cannot be checked, with the reason in plain words and the next step (check the internet connection, then check again); nothing is shown as Ready that was not confirmed. |
| PRD01-AC-12 | FR-04 | The app at any screen | The person opens the connection state | Both services and their states are shown, with the one in use marked; the screen is usable at 1366×768. |
| PRD01-AC-13 | FR-05, BR-07 | Neither service is installed | The person opens the setup help | For each service the missing part and the next steps are shown in numbered plain Vietnamese; no message contains a term from the design's technical-term list; where outside help is needed it says so and offers the text for the person who supports them. |
| PRD01-AC-14 | FR-06 | A service is installed but signed out | The person follows the sign-in step | Case (a): Thermora starts the provider's own sign-in without a terminal; after sign-in and "check again" the state is Ready. Case (b): Thermora says that outside help is needed to sign in and offers text for the person who supports them. In both cases Thermora has no field for a password, code or token. |
| PRD01-AC-15 | FR-06, BR-02, BR-11 | Any sign-in step | The person looks through every Thermora screen involved | None asks for, shows or stores a password, code, token or credential file; none offers a Thermora login or a way to use another person's sign-in. |
| PRD01-AC-16 | FR-06 | The person left the sign-in half done | They come back and check again | The state is still Installed but not signed in and the same next step is shown. |
| PRD01-AC-17 | FR-07 | Both services are Ready and no choice has been made | The person reaches the point of using one | They are asked to choose once; the choice is remembered on restart. |
| PRD01-AC-18 | FR-16 | Both Ready and Claude Code chosen | The person changes the choice to Codex in settings | Codex is used from then on; nothing is sent to Claude Code. |
| PRD01-AC-19 | FR-07 | Only Codex is Ready | Thermora starts | Codex is used without asking, and the person is told which service is in use. |
| PRD01-AC-20 | FR-07, BR-06 | Claude Code chosen, then it stops being Ready while Codex is Ready | The person tries to run something | They are told why and asked whether to use Codex; nothing runs on Codex until they say yes. |
| PRD01-AC-21 | FR-08 | No service is Ready | The person tries an action that needs the AI | The action is unavailable, says why, and gives a way to the setup help. |
| PRD01-AC-22 | FR-08 | No service is Ready and no project exists | The person opens Thermora | Thermora opens to the setup help, which explains that an AI service must be ready first. |
| PRD01-AC-23 | FR-09 | A service has just become Ready for the first time on this machine | The next screen appears | The reminder appears once, with both parts (training option with where to find it in each provider's account settings; no financial or HR data) and one button to close it; nothing else is blocked. |
| PRD01-AC-24 | FR-09 | The reminder was closed | Thermora is restarted | It is not shown again; it can be read again from the health check. |
| PRD01-AC-25 | FR-09, BR-04 | The reminder | The person closes it without doing anything | Thermora continues normally and shows no claim that the training option is off. |
| PRD01-AC-26 | FR-10 | A person with both services Ready | They run the health check | Each service shows each check as OK or a problem with the next step, plus the Thermora version and the service in use. |
| PRD01-AC-27 | FR-10 | The health check has finished | The person copies the result | The text holds states, versions and the service names only; it holds no sign-in detail, no credential file and nothing from the person's files. |
| PRD01-AC-28 | FR-03, FR-10, BR-05, BR-13 | Thermora starts and the health check is run, without a connection test | The traffic to the AI service is observed | No request is sent to the AI, none of the plan is used, and no file content or work data leaves the machine. |
| PRD01-AC-29 | FR-11 | The service reports the plan limit is reached during a run | Thermora receives the message | The person sees plain words that the limit is reached, that their work so far is kept, the time it is available again if the service gave one, and the choices to wait and retry or, if the other service is Ready, to be asked whether to use it. |
| PRD01-AC-30 | FR-11 | The limit message gives no time | The message is shown | No time is invented; the message says the time is not known. |
| PRD01-AC-31 | FR-12 | The service cannot be reached | A run is attempted | The person sees plain words that it could not connect and that work is kept, with try again, health check and copy details for the supporter; no technical error is shown on screen. |
| PRD01-AC-32 | FR-12, BR-02 | The details for the supporter are copied after a failure | The text is read | It holds the states, versions and the service's error text, and no sign-in detail. |
| PRD01-AC-33 | FR-13 | Thermora is open and the sign-in lapses | The next use of the service fails for that reason | The person is told they are signed out, led to sign in again, and told work is kept. |
| PRD01-AC-34 | FR-14 | The app's information screen | The person opens it | The Thermora version is shown, the same as in the health check. |
| PRD01-AC-37 | FR-15 | The same person on a second machine | They open Thermora there | They are asked for a display name again; nothing was carried over. |
| PRD01-AC-38 | FR-02, BR-03 | The person is changing the display name | They enter an empty name or 51 characters | They are told why and the old name is kept. |
| PRD01-AC-39 | FR-03, §11 | A service check that takes long | The check runs | While it runs a working indicator is shown and the app stays usable; if it is not finished after 10 seconds that service shows Cannot be checked with the reason "took too long" and the next step. |
| PRD01-AC-40 | FR-17, BR-13 | The health check screen | The person asks for the connection test | Before anything is sent, a message says the test uses a little of their plan and asks them to confirm; if they decline, nothing is sent. |
| PRD01-AC-41 | FR-17 | The person confirmed the connection test | It finishes | It shows OK, or a problem handled as in FR-11 or FR-12. |
| PRD01-AC-42 | FR-11, BR-06 | Both services have reached their plan limit | Thermora receives the second limit message | Each service is reported separately; no automatic action is taken and nothing is retried without the person asking. |
| PRD01-AC-43 | FR-01 to FR-17 | Any screen of this module | The person looks for accounts, roles or permissions | None exists: every person on the machine sees the same screens (PRD-00 §3). |

Note: AC-35 and AC-36 were removed in v0.2 as duplicates; their numbers are not reused.

## 8. States and edge cases

- **Service states** (FR-03): Ready; Not installed; Installed but not signed in; Version not supported; Cannot be checked. A service shown as Ready was confirmed in this check; one that could not be confirmed is never Ready.
- **AI tool in an unusual place**: if Thermora cannot find an installed tool in the usual places it shows Not installed; the health-check text lets the supporter see this.
- **Both services unusable, no project yet**: Thermora opens to the setup help, not to an empty working screen (AC-22).
- **Signed in to a lapsed plan**: the tool is signed in but the plan cannot be used; this appears as the limit or failure message (BR-09), not as a setup state.
- **Plan limit reached during a long job**: what Thermora does with the job itself (keeps progress, resumes later) is PRD02; this module shows the message and choices (§12).
- **Both services at limit**: each is told separately; no automatic action (AC-42).
- **Sign-in lapses in the middle of a task**: FR-13; the task's state is PRD02's.
- **Same display name on two machines** is allowed (BR-03); history entries cannot tell two people with the same name apart.
- **Name changed after exports**: packages already sent keep the old name in their origin (they are files).
- **Very small screen (1366×768)**: the setup help, the health check and the reminder fit without side scrolling; long steps scroll vertically.
- **Machine offline at start**: the program is still found; sign-in shows Cannot be checked, with the plain reason and next step (AC-11).
- **Provider changes its terms or sign-in without notice**: Thermora may stop being able to use that service; see §13 *Accepted risks*.
- **Reminder shown on a second AI service becoming Ready later**: not shown again; once per machine.

## 9. Data (business level)

| Field | Meaning | Required | Limits | Who may edit |
|---|---|---|---|---|
| Display name | The person's name as shown in history entries and exported origins | Yes | 1 to 50 characters after trimming; not unique | The user |
| AI service in use | Claude Code or Codex | Yes once any service is Ready | One of the two | The user |
| Reminder seen | Whether the one-time reminder was closed on this machine, and when | Yes (kept by Thermora) | Once per machine | Thermora; the user can re-read it |
| Service state | The state of each service from FR-03, as last checked | Shown, not edited | The five states in §8 | Nobody (set by the check) |

Sign-in details and credential files are never a field of this module (BR-02).

## 10. Notifications and events

Thermora sends nothing outside the machine (PRD-00 §10). These are in-app messages only.

| Event | Who receives it | Channel | Notes |
|---|---|---|---|
| First run | The person | In the app | Display name request (FR-01). |
| A service becomes Ready for the first time | The person | In the app | The one-time reminder (FR-09). |
| A service is not Ready | The person | In the app, setup help | State and next step (FR-05). |
| Plan limit reached | The person | In the app | Message and choices (FR-11). |
| Service unreachable or failed | The person | In the app | Message, retry, copy for the supporter (FR-12). |
| Sign-in lapsed | The person | In the app | Led to sign in again (FR-13). |
| Connection test about to use the plan | The person | In the app | Notice and confirmation (FR-17). |
| Health check result for the supporter | The supporter | Outside Thermora: the person pastes the copied text into Zalo or email | Text only (FR-10). |

## 11. Non-functional requirements

- **Language**: Vietnamese for every screen, message and reminder (Personas D1); no English technical wording in messages (BR-07).
- **Platforms**: Windows, macOS, Ubuntu; desktop PC and laptop; smallest screen about 14 inches, 1366×768 (Personas D5).
- **Skills**: no terminal for ordinary use; a person with office-level skills can complete setup (Personas P-01 proficiency). Where the terminal cannot be avoided, the message says so and hands over to the supporter (FR-06).
- **Privacy and security**: no sign-in detail or credential file is read, handled, stored or copied (BR-02); nothing is sent except to the person's own AI service (BR-05); no usage data (PRD-00 FR-12).
- **Provider terms**: Thermora drives only the official, unmodified tool signed in by the person (BR-01), never handles login (BR-02), never uses one person's sign-in for another (BR-11) and is for the company's own staff only (BR-12). The PO accepts the residual risk in §13 *Accepted risks*.
- **Plan usage**: setup, start-up detection and the health check use none of the person's plan (BR-13).
- **Speed**: each service shows a state within 10 seconds of starting; a check never freezes the app; a slow check shows that it is working and after 10 seconds shows Cannot be checked (AC-39).
- **Traceability**: the health-check text names the Thermora version and the service versions so the supporter can reproduce a problem.

## 12. Dependencies

PRD-00 (single kind of user, display name, credential rule, no usage data); Personas. External: Claude Code and Codex (the person's own installation and subscription). PRD02 and PRD03 depend on this module: they run only on a Ready service.

### Handed to other PRDs

| Target PRD | What must be specified | Arises from |
|---|---|---|
| PRD02 | What happens to a running job and its progress when the plan limit is reached, the service is unreachable or the sign-in lapses: progress kept, how the person resumes, what the project shows. | FR-11, FR-12, FR-13 |
| PRD02 | Whether the AI service can be chosen per project as well as per machine, and what a project does when it was started on one service and is continued on the other. | FR-07 |
| PRD02 | Which actions need a Ready service (starting or continuing a run) and which do not (viewing existing projects, procedures and reports, export, import of a package), and what is shown for each when no service is Ready. | FR-08 |
| PRD02 | What is shown when a package or project comes from a newer Thermora version than the one installed. | FR-14 |
| PRD02 | History entries keep the display name they were recorded with after the person renames themselves (PRD-00 FR-06); packages never carry per-machine settings (display name setting, chosen service, reminder state) beyond the exported origin. | FR-02, FR-15 |
| PRD03 | Whether a procedure is written for one service or both, and what a test run does when the person's service is not the one the procedure targets or is not Ready. | FR-07, FR-08 |
| Later modules (incident, customer replies) | Data rules for customer messages; the reminder here covers only financial and HR data. | FR-09, Personas §7 |
| Technical design (tech-lead) | Whether the provider's own sign-in can be started without a terminal for each tool (FR-06 case a or b); how a service is found and its version and sign-in status read without any request to the AI (BR-13) and without reading credential files; the supported version list (BR-08). | FR-03, FR-06 |
| PRD-00 (later edit) | The terms Service state, Health check, Plan limit, Setup help and Supporter, now defined at the top of this document, may move to the PRD-00 glossary if another module uses them. | Terms |

## 13. Open questions

None. Q1 (installation and sign-in without a terminal) became defaults D20 and AC-14, Q2 (how updates arrive) became D15, and Q3 (provider terms) was answered by the PO on 2026-11-25 (option A; see *Accepted risks*).

### Accepted risks

Accepted by the PO (user decision, PO: DaoNguyenTrong, 2026-11-25), on the evidence of https://code.claude.com/docs/en/legal-and-compliance read the same day; no explicit OpenAI rule was found for applications that drive the Codex program.

| # | Risk | Revisit trigger |
|---|---|---|
| R1 | A provider may change or start to enforce its terms without notice, which could make a service unusable for Thermora or for the team. | Any change to either provider's terms of use. |
| R2 | Heavy automated use may exhaust a plan's limit faster than ordinary use (plans assume ordinary, individual usage); this is the quota failure signal of Personas (A5). | The pilot hitting plan limits often. |

### Proposed defaults

| # | Default | Codes affected | Reason |
|---|---|---|---|
| D1 | Display name: required, 1 to 50 characters after trimming, any printable characters, not unique, editable at any time; earlier history entries keep the name they were written with. | FR-01, FR-02, BR-03, AC-02 to AC-06, AC-38 | A name is all PRD-00 needs; history cannot be edited (PRD-00 FR-06). |
| D2 | Both services are checked at every start and on request; a service is Ready only when confirmed; each shows a state within 10 seconds, otherwise Cannot be checked. | FR-03, FR-04, §8, §11, AC-39 | Stale readiness would send the person into a failing job; a concrete time is testable. |
| D3 | If both are Ready, ask once, remember, changeable in settings; if one, use it and say so; never switch silently. | FR-07, FR-16, BR-06, AC-17 to AC-20 | Each is a separate paid subscription (A5). |
| D4 | One-time, non-blocking reminder at the first moment a service is Ready, re-readable from the health check; Thermora does not detect or verify the training setting and points only to where the option is found. | FR-09, BR-04, AC-23 to AC-25 | PRD-00 handed a one-time, non-blocking reminder to this module. |
| D5 | The health check shows the five states, versions and the service in use; it is copyable as text for the supporter with no sign-in detail and no file content. | FR-10, AC-26, AC-27, AC-32 | Turns "it does not work" into one message for the supporter. |
| D6 | With no service Ready, anything needing the AI is unavailable with a reason and a way to setup; which other actions stay available is PRD02's. | FR-08, AC-21, AC-22 | The BA review: view and export belong to PRD02. |
| D7 | Quota-reached and unreachable messages follow what happened, work is kept, next steps; no time is invented; no automatic switch. | FR-11, FR-12, BR-06, BR-07, AC-29 to AC-32, AC-42 | The person pays for each subscription and needs to know their work is safe. |
| D8 | Thermora declares minimum supported tool versions; below that, "Version not supported" and ask the person who supports you to update. | FR-03, BR-08, AC-10 | Unsupported versions fail in confusing ways. |
| D9 | Success measure "ready without help": setup to the ready state in 5 minutes or less with nobody's help once Thermora and a tool are installed, timed in rollout and by asking. Not yet PO-approved: the PO confirms it at approval. | §2 | A number is needed for the failure signal "each machine needs IT". |
| D10 | Settings are per machine, not shared and not in any package. | FR-15, BR-10, AC-37 | No server; packages must never carry personal settings. |
| D11 | Messages have three parts (what happened, is work safe, what to do) in plain Vietnamese; technical text only inside the copyable text; the list of technical terms is kept in the design. | BR-07, AC-13, AC-31 | Office-level users without a terminal (Personas); testable by the term list. |
| D12 | A lapsed sign-in during use is treated like signed out. | FR-13, AC-33 | Same fix for the person. |
| D13 | Thermora does not read the plan type or the remaining quota; any signed-in account is accepted. | BR-09 | The tools may not expose it; avoids an invented rule. |
| D14 | Priorities: Must for FR-01, FR-03 to FR-13, FR-15 and stories US-01 to US-08; Should for FR-02, FR-14, FR-16, FR-17 and story US-09. | §4, §5 | Setup, sign-in, the choice rule, the reminder and failure messages are needed for the REL-1 walking skeleton; rename, version display, changing the choice later and the connection test can follow. |
| D15 | A new version of Thermora is delivered by the supporter as an installer, and Thermora shows its version; it contacts no server to update itself (SA on behalf of user; answers former question 2). | FR-14, §2 | Consistent with PRD-00 FR-12; there is no server. |
| D16 | Start-up detection and the health check only find the program, its version and its sign-in status and never send a request to the AI; they use none of the plan (SA on behalf of user). | FR-03, FR-10, BR-13, AC-28 | Looking at the state must not eat the plan (quota failure signal, A5). |
| D17 | The connection test is optional, runs only on the person's explicit request, and says beforehand that it uses a little of the plan (SA on behalf of user). | FR-17, BR-13, AC-40, AC-41 | A real test is useful but costs plan usage. |
| D18 | Messages to the person say "the person who supports you" and copyable text is for the "supporter"; the PO is not named in the app. | FR-05, BR-07, BR-08 | The supporter may not always be the PO (BA review). |
| D19 | Provider-terms rules: Thermora drives only the official, unmodified tool signed in by the person, never touches login tokens or credential files, offers no login, never uses one person's sign-in for another, and is for the company's own staff only (PO decision, option A, 2026-11-25). | BR-01, BR-02, BR-11, BR-12, §13 | The PO chose to keep the plan within the providers' stated terms and accept the recorded risk. This is a PO decision, not a default to confirm. |
| D20 | For the pilot the PO installs the AI tools; Thermora detects and guides. Whether the provider's sign-in can be started without a terminal is decided in the technical design; until then the sign-in step is written as two cases (SA on behalf of user; answers former question 1). | FR-05, FR-06, AC-14, §12 | Self-install is large and touches security; a post-pilot option if many machines still need the supporter. |

## 14. Change log

Source labels: `user decision (<Role>: <name>)`, `SA (on behalf of user)`, `BA review`, `metadata`. An approval row's *Change* starts with `User approval`. See `docs/prd/README.md` § Parsed by scripts.

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-11-25 | 0.1 | First draft from Personas v0.5 and PRD-00 v0.3 | — |
| 2026-11-25 | 0.2 | Applied the BA early review: view and export without a Ready service moved to PRD02 (FR-08); AC-14 written as two cases; the minimum choice rule made Must (FR-07, FR-16 split); defined module terms and "supporter" wording; testable ACs (term list, printable characters, 10 seconds); added ACs for Cannot be checked, slow check, rename, both at limit, connection test, no accounts; removed duplicate ACs (former AC-35, AC-36); persona traceability; FR-09 wording | BA review |
| 2026-11-25 | 0.2 | Applied BA final review non-blocking items: BR-05 wording, AC-11 premise, §12 technical-design row, FR-14 pointer to PRD-00 AC-26, note on removed AC-35 and AC-36 | BA review |
| 2026-11-25 | 0.2 | Provider terms, option A: BR-01, BR-02, BR-11 to BR-12 and NFR added; accepted risks R1 and R2 with revisit triggers; question 3 removed | user decision (PO: DaoNguyenTrong) |
| 2026-11-25 | 0.2 | Detection and health check use no plan; connection test only on request (FR-17, BR-13); D9 kept as a proposed default for the PO to confirm; former question 1 became D20 and question 2 merged into D15; status In review with no open questions | SA (on behalf of user) |
