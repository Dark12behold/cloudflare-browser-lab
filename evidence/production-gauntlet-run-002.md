# Production Gauntlet Run 002 — Worker Topology

Date: 2026-09-29
Branch: setup/worker-topology-v1
Scope: GitHub -> CI -> Cloudflare preview movement

## Stimulus
Recent topology-reasoning and capability-host changes on the existing Worker topology branch.

## Direct observations

1. GitHub Actions run 36503404898 (Validate Worker Topology, run #14) completed SUCCESS for commit c530bf1.
2. Successful jobs:
   - Wrangler dry-run: coordinator
   - Wrangler dry-run: production-site
   - Wrangler dry-run: internal-capability
   - Wrangler dry-run: browser-verifier
   - Wrangler dry-run: lab
   - runtime-memory SQLite schema apply/exercise
   - JSON contract invariants
   - CHAIN component/integration gauntlet
3. Cloudflare Git integration comments on PR #2 report failed preview builds for commit fcac661 for:
   - internal-capability
   - browser-verifier
   - lab
   - coordinator
   - production-site
   - legacy cloudflare-browser-lab project
4. No preview URL was emitted for those failed builds.
5. Cloudflare dashboard log links exist, but this tool path does not expose their log contents.

## Boundary classification

GitHub mutation: direct control through authorized connector.
GitHub Actions result: direct observation.
Cloudflare Git trigger/build status returned to GitHub: indirect observation.
Exact Cloudflare failure cause: unresolved.
Shared build-configuration/root/install failure: inferred candidate, NOT verified fact.

## Comparison

Local/CI Wrangler compile-config validation succeeds for all five current Worker configs while Cloudflare preview builds fail across every attached project. Independent per-Worker source failure is therefore a weaker candidate than a shared Cloudflare-side build/deployment configuration problem, but exact cause requires build-log evidence.

## Candidate production technique

When N independent Worker targets pass the same compile/config gate but fail at the same external deployment boundary:
1. classify the common boundary before modifying Worker implementations;
2. inspect shared build root/install/build command/environment first;
3. change one shared variable;
4. replay one representative target;
5. only fan out after the representative target passes.

This reduces duplicated repair attempts and creates a cleaner causal experiment.

## Topology compression finding

The legacy cloudflare-browser-lab project is still reacting to PR commits in addition to the five-role topology. It is a candidate redundant deployment trigger. Do not remove it until its purpose and Cloudflare project configuration are verified.

## Result

CI_VALIDATION: PASS
CLOUDFLARE_PREVIEW: FAIL
RUNTIME_WORKER_BEHAVIOR: UNRESOLVED
PROMOTION: BLOCKED
NEXT_MTP: obtain one Cloudflare build log -> classify shared failure -> repair one representative preview -> verify -> fan out.
