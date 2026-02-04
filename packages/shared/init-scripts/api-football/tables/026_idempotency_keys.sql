-- idempotency_keys table
CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_idempotency_keys_scope_expires ON idempotency_keys(scope, expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_idempotency_keys_expires ON idempotency_keys(expires_at) WHERE expires_at IS NOT NULL;

