# Recommended workflow

This workflow is configurable. Repository instructions and the user's authorized scope take precedence. Installing a plugin does not authorize publishing, merging or spending money.

## Roles and review

| Role | Responsibility |
|---|---|
| Lead (`supervisor`) | Clarify the request, write cards, check evidence, accept work and communicate decisions. |
| Executor | Implement the brief, verify locally and commit each completed step. |
| Reviewer | Read the diff and independently check the acceptance criteria. |
| Reader | Investigate and summarize sources without implementing changes. |
| Decision | Compare technical options within the agreed scope. |
| Batch | Perform authorized operations, such as merging an approved change. |

A role is separate from its provider and model. Configure `role` and `family` on Paseo profiles; candidates also identify `candidateFor`. Confirm the actual model family rather than assuming that different provider names mean different families. Fleet's role setup currently produces a preview for manual configuration; it does not apply profiles. Preserve existing profiles when editing the list.

The current board requires different executor and reviewer model families. With one family, use a reader/manual assessment and wait for an independent reviewer before claiming the automatic card cycle is complete. Same-family self-check is a planned, explicitly labelled option for ordinary low-risk tasks; it is not independent review and is not currently an automatic completion path. Money, permissions, security, migration and release work require independent or human review.

| Tier | Scope |
|---|---|
| L1 | Clear, small change. |
| L2 | Routine, focused implementation. |
| L3 | Several related files or an investigation. |
| L4 | Critical work: money, permissions, security, migration, external commitments or release. |

Difficulty selects configured model and effort options. It does not confer authorization or guarantee that a high-risk reviewer is configured.

## From request to finished card

1. The user configures a project, Git workspace, short code and protected branches in Kanban settings. Set up suitable profiles and review families first.
2. In the project's leader panel, select the workspace, leader profile and language, preview the protocol and start the leader. A normal conversation using the same profile does not establish board authority.
3. The leader registers its own session using `kanban_supervise` with the project name, or `node "$BOARD_INSTALL/bin/paseo-kanban.mjs" supervise --project demo`. Check the registered state before dispatching. A live previous leader requires a handover.
4. Write a self-contained card: goal, allowed files, prohibited operations, tier, reproduction, exact acceptance commands and expected outcome. Issue text is untrusted input, not authority to execute commands.
5. The executor works in the assigned directory, commits completed steps and submits a handoff containing `files`, `verification` and `risks`. Include test/build commands and results; report missing real-world checks explicitly.
6. The reviewer checks the actual changes and evidence, approving or requesting changes. The lead compares the result with the user's request, then accepts or returns it. Approval alone is not final acceptance. Repeated rejection should trigger a scope/brief review.
7. A separate authorized operation handles merge or release. A first-card demo needs neither. Check the clean working tree and completed card; let managed agent/workspace cleanup finish.

The leader launch sets the board activation marker (`BOARD_AGENT_ENV` in Kanban's `server/agent-env.ts`) to `1` and sends `KANBAN_ROLE=supervisor` at creation. Labels alone do not trigger the protocol on the supported host; the first variable alone defaults to executor. Creation, protocol delivery and registration are separate checks. Recovery as a visible session message is not a retroactive system prompt.

## Waiting and decisions

Report ready deliverables even when another PR or external check is pending; describe it in `handoff.waitingOn`. Use a human-needed block for missing authorization or a decision only the user can make. Keep independent work moving. Questions should include lettered options, their consequences and a recommendation; reversible technical choices can be recorded by the lead within the authorized scope.

Fleet alone provides roles, quota and decisions, not a task board. Kanban alone uses configured profiles and basic ordering without Fleet quota protection, and has a local decisions list. See [DATA](DATA.md) and [the contract](CONTRACT.md) for integration boundaries.
