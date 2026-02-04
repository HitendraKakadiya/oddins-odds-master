-- markets table
CREATE TABLE markets (
  id BIGSERIAL PRIMARY KEY,
  provider_market_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  is_line_market BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT markets_provider_id_unique UNIQUE (provider_market_id),
  CONSTRAINT markets_key_unique UNIQUE (key)
);

CREATE INDEX idx_markets_name ON markets(name);
CREATE INDEX idx_markets_line ON markets(is_line_market) WHERE is_line_market = true;

