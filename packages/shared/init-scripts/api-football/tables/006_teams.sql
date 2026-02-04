-- teams table
CREATE TABLE teams (
  id BIGSERIAL PRIMARY KEY,
  provider_team_id INTEGER NOT NULL,
  country_id BIGINT NOT NULL,
  venue_id BIGINT,
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  slug TEXT NOT NULL,
  CONSTRAINT teams_provider_id_unique UNIQUE (provider_team_id),
  CONSTRAINT teams_slug_unique UNIQUE (slug),
  CONSTRAINT teams_country_fk FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT,
  CONSTRAINT teams_venue_fk FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

CREATE INDEX idx_teams_country ON teams(country_id);
CREATE INDEX idx_teams_venue ON teams(venue_id) WHERE venue_id IS NOT NULL;
CREATE INDEX idx_teams_name ON teams(name);

