-- provider_sources table
CREATE TABLE provider_sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT,
  CONSTRAINT provider_sources_name_unique UNIQUE (name)
);

CREATE INDEX idx_provider_sources_name ON provider_sources(name);

