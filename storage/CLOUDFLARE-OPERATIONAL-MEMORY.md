# Cloudflare-native operational memory plan

Status: CANDIDATE CONFIGURATION, awaiting actual Cloudflare resource creation/binding.

## Goal

Use the existing five Workers as persistent operational environments before considering additional repositories. Git remains canonical lineage; Cloudflare holds execution state, empirical history, logs, evidence and bounded learned state.

## Shared runtime evidence substrate

Create a D1 database such as `production-system-memory` and apply `storage/runtime-memory-v1.sql`. It stores normalized observations, capability registry entries, route statistics and promotion candidates. Runtime records are evidence, not canonical truth.

Use an R2 bucket such as `runtime-evidence` for screenshots, Browser Run artifacts, larger traces and replay fixtures. Store references in D1 rather than large payloads.

Cloudflare Workers Observability remains the high-volume diagnostic stream. Do not duplicate every platform trace into D1. Normalize only observations useful to learning, verification, comparison or replay.

## Per-Worker access

### labs
Use isolated lab D1/R2 resources, never production stores. May generate experimental observations and artifacts.

### browser-verifier
Read test contracts/targets; write verification records and R2 artifacts. No source mutation or promotion authority. Candidate Browser Run + Durable Object session + R2 topology is supported by Cloudflare, but bind only after resources exist.

### internal-capability
Read capability registry and bounded operational statistics when required. Execute validated capabilities. May append execution observations. It cannot promote a capability.

### coordinator
Primary consumer of route statistics and task history. May update bounded routing preferences and create promotion candidates. It cannot expand its own authority ceiling or silently alter canonical logic.

### production-site
Store product/user state separately from production-system learning/evidence. Do not make runtime-learning tables a substitute for user/product databases.

## Data lifecycle

RAW TELEMETRY -> normalized observation -> verification -> aggregate statistics -> candidate pattern -> replay/adversarial test -> authorized promotion -> canonical Git definition.

Retention policies should be set per data class. Secrets, credentials and unnecessary user content are excluded from learning records.

## Why no extra repo yet

Cloudflare supports monorepos with separate Worker roots, Service Bindings, local/remote bindings, D1, R2, Durable Objects, Workflows and Browser Run. A new repository is justified only by a real isolation, ownership, lifecycle or deployment constraint, not merely because another persistent store or capability is needed.
