-- Runtime evidence substrate v1
-- Cloudflare D1 candidate schema. Runtime observations are evidence, not canonical truth.

CREATE TABLE IF NOT EXISTS worker_observations (
  observation_id TEXT PRIMARY KEY,
  worker_role TEXT NOT NULL,
  task_id TEXT,
  capability_id TEXT,
  route_id TEXT,
  input_class TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('success','degraded','blocked','retryable_failure','permanent_failure')),
  verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0,1)),
  latency_ms INTEGER,
  retry_count INTEGER NOT NULL DEFAULT 0,
  human_correction INTEGER NOT NULL DEFAULT 0 CHECK (human_correction IN (0,1)),
  evidence_ref TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_observations_worker_created
  ON worker_observations(worker_role, created_at);
CREATE INDEX IF NOT EXISTS idx_observations_capability_verified
  ON worker_observations(capability_id, verified);
CREATE INDEX IF NOT EXISTS idx_observations_route_outcome
  ON worker_observations(route_id, outcome);

CREATE TABLE IF NOT EXISTS capability_registry (
  capability_id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  implementation_kind TEXT NOT NULL,
  maturity TEXT NOT NULL CHECK (maturity IN ('experimental','observed','repeated','validated','default','retired')),
  authority_ceiling TEXT NOT NULL,
  input_contract_ref TEXT NOT NULL,
  output_contract_ref TEXT NOT NULL,
  implementation_ref TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route_statistics (
  route_id TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  verified_successes INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0,
  total_latency_ms INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_candidates (
  candidate_id TEXT PRIMARY KEY,
  candidate_type TEXT NOT NULL,
  current_ref TEXT,
  proposed_ref TEXT NOT NULL,
  evidence_query TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('proposed','testing','verified','rejected','promoted')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at TEXT
);