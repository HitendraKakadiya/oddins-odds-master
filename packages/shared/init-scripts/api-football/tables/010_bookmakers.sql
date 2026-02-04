-- bookmakers table
CREATE TABLE bookmakers (
  id BIGSERIAL PRIMARY KEY,
  provider_bookmaker_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  CONSTRAINT bookmakers_provider_id_unique UNIQUE (provider_bookmaker_id),
  CONSTRAINT bookmakers_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_bookmakers_name ON bookmakers(name);

