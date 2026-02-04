-- leagues table
CREATE TABLE leagues (
  id BIGSERIAL PRIMARY KEY,
  provider_league_id INTEGER NOT NULL,
  country_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  logo_url TEXT,
  slug TEXT NOT NULL,
  CONSTRAINT leagues_provider_id_unique UNIQUE (provider_league_id),
  CONSTRAINT leagues_country_slug_unique UNIQUE (country_id, slug),
  CONSTRAINT leagues_country_fk FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT
);

CREATE INDEX idx_leagues_country ON leagues(country_id);
CREATE INDEX idx_leagues_slug ON leagues(slug);

