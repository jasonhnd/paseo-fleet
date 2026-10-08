# Recommended workflow

> Skeleton. This is a suggested way to run a team of coding agents with the two plugins, not a requirement.

## Roles

| Role | Does |
|---|---|
| Lead | Talks to you, splits requests into cards, accepts finished work, records questions only you can answer. Does not write code. |
| Executor | Implements a card: code, tests, documentation, pull requests. |
| Reviewer | Checks an executor's work. Always from a different model family than the executor. |
| Reader | Reads and summarizes code or documents. |
| Decision | Settles technical questions inside a specification. |
| Batch | Small operational tasks, such as merging an approved pull request. |

Which model plays each role is configuration, not part of the rules.

## Difficulty tiers

| Tier | Meaning |
|---|---|
| L1 | Simple: clear rules, a small change. |
| L2 | Routine: clear requirements, a focused change. |
| L3 | Complex: several files or documents, needs its own breakdown. |
| L4 | Critical: money, permissions, security, data migration, external commitments, release. |

The tier selects the model and reasoning effort from the dispatch matrix. L4 work always gets a high-risk reviewer.

## Cross-family review

An executor's output goes to a reviewer from another model family. A second rejection brings in the lead, who checks whether the brief itself was unclear before sending the card back.

## Asking the person

Questions go to the decisions inbox with lettered options and a recommendation. Anything reversible, the lead decides and reports.
