# Worker topology setup

Five Cloudflare projects share this repository but have independent roots and authority.

| Cloudflare project | Root directory | Role |
|---|---|---|
| lab | /workers/labs | disposable experimental host |
| browser-verifier | /workers/browser-verifier | browser/runtime evidence verifier |
| internal-capability | /workers/internal-capability | private RPC capability router |
| coordinator | /workers/coordinator | route/dependency/recovery coordinator |
| production-site | /workers/production-site | public product surface |

## Cloudflare build settings
For each project set its Root directory to the matching path above. Leave Build command empty unless a real build step is introduced. Deploy command should use Wrangler deploy. Preview command should use Wrangler preview/default preview behavior. Production branch is main.

Use build watch paths so a Worker rebuilds for its own directory plus shared dependencies, rather than every repository commit.

## Deployment order
Because Service Binding targets must exist before callers deploy:
1. internal-capability
2. lab
3. browser-verifier
4. coordinator
5. production-site

## Binding plan
- browser-verifier: Browser Run binding after resource creation/verification; R2 for evidence artifacts; Durable Object only if persistent browser sessions prove useful.
- coordinator -> internal-capability: Service Binding CAPABILITIES.
- production-site -> internal-capability: Service Binding CAPABILITIES.
- runtime operational memory: D1 schema in `storage/runtime-memory-v1.sql`; bind only after a real D1 database exists.
- large runtime evidence: R2; bind only after a real bucket exists.
- add KV/Queues/Workflows/DO/AI only when a contract requires their behavior.
- no secrets or private reasoning artifacts in this public repository.

## Runtime learning boundary
See `shared/contracts/learning-envelope-v1.json` and `storage/CLOUDFLARE-OPERATIONAL-MEMORY.md`.
Workers may accumulate empirical history and bounded learned operational state. Runtime experience may propose canonical changes but cannot silently promote them.

## Deliberate controls
Internal Capability has workers_dev and preview URLs disabled because it is intended to be private behind Service Bindings. Public-facing and lab Workers keep preview URLs for verification. Observability is enabled on all five. Runtime resource bindings are least-privilege and are not invented before their actual resource IDs/names exist.
