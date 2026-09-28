# CHAIN Gauntlet Run 001

Date: 2026-09-28
Branch: setup/worker-topology-v1
Scope: source/contract integration simulation plus provider-trigger observation

## Deterministic gauntlet

| Test | Result |
|---|---|
| happy_path | PASS |
| malformed_envelope_blocks | PASS |
| authority_expansion_blocks | PASS |
| retry_preserves_identity | PASS |
| verifier_rejects_false_success | PASS |
| record_failure_no_reexecute | PASS |
| topology_contract | PASS |

Result: 7/7 PASS.

These results validate the committed CHAIN contracts and simulated handoff semantics. They do not claim live Cloudflare Worker execution.

## Live provider observation

Cloudflare Git integration is detecting PR changes for the configured projects and attempting preview builds. The builds still fail before producing runnable preview URLs. Therefore live black-box Worker and five-Worker end-to-end execution remain BLOCKED on Cloudflare project build/root configuration.

Observed boundary:
Git change -> Cloudflare trigger = VERIFIED
Cloudflare trigger -> successful Worker preview = NOT VERIFIED / currently failing
Worker-to-Worker live Service Binding chain = NOT YET TESTABLE
Full scheduled Workflow train = NOT YET TESTABLE

## CI observation

A GitHub Actions workflow now exists on this feature branch to dry-run all Wrangler configs, exercise the runtime-memory schema, validate contracts, and execute the CHAIN gauntlet. No PR workflow run was returned for the current head at observation time. Do not treat the local deterministic PASS as a CI PASS.

## Next gate

1. Correct Cloudflare monorepo root/build settings for each project.
2. Obtain one successful preview per externally testable Worker.
3. Probe health surfaces.
4. Verify Service Binding calls.
5. Run scheduler/workflow train.
6. Preserve live trace and compare it against this simulated baseline.
