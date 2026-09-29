# CHAIN train trace

Every scheduled production train carries one `trace_id` from the Lab Host through completion. Each actor creates a child span rather than replacing upstream history.

```
LAB scheduled()
  span: S0 scheduled
    |
    v
WORKFLOW
  span: S1 workflow_started
    |
    v
COORDINATOR
  S2 inspect
  S3 plan
    |
    v
INTERNAL CAPABILITY
  S4 execute
    |
    v
BROWSER VERIFIER
  S5 verify
    |
    v
COORDINATOR
  S6 record
  S7 decide
    |
    +--> complete
    +--> bounded retry -> child execute span
    +--> blocked -> evidence retained
    +--> improvement candidate -> test/promotion path, never automatic promotion
```

## What the trace measures

Per span: actor, stage, authority ceiling, start/end, latency, retry count, capability/version, input/output references, evidence reference, status and failure class.

Per train: total latency, number of handoffs, duplicate work, retries, human intervention, verification outcome, unresolved dependencies and final disposition.

The trace is deliberately separate from raw platform logs. Platform logs answer what the runtime emitted. CHAIN traces answer what the production method attempted, why it moved to the next actor, and whether that movement was justified.

## Failure localization

- no S0: scheduler/trigger failure
- S0 but no S1: workflow-start/binding failure
- S1 but no S2: coordinator handoff failure
- S2 without S3: dependency/authority/intent recovery block
- S3 without S4: capability routing/binding failure
- S4 failure: executor/capability failure
- S4 success but S5 failure: false-success or behavioral regression
- S5 success but S6 failure: evidence persistence failure
- S6 without terminal S7: decision/recovery failure

This lets route compression use evidence instead of merely deleting hops because the diagram looked crowded.
