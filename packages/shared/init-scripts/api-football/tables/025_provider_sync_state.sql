-- provider_sync_state table
CREATE TABLE provider_sync_state (
  source_id BIGINT NOT NULL,
  entity TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ,
  cursor JSONB,
  last_error_at TIMESTAMPTZ,
  last_error TEXT,
  PRIMARY KEY (source_id, entity),
  CONSTRAINT provider_sync_state_source_fk FOREIGN KEY (source_id) REFERENCES provider_sources(id) ON DELETE CASCADE
);

CREATE INDEX idx_provider_sync_state_entity ON provider_sync_state(entity);
CREATE INDEX idx_provider_sync_state_synced ON provider_sync_state(last_synced_at DESC);

