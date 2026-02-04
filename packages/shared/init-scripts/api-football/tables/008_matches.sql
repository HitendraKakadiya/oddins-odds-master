-- matches table
CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  provider_fixture_id INTEGER NOT NULL,
  season_id BIGINT NOT NULL,
  league_id BIGINT NOT NULL,
  home_team_id BIGINT NOT NULL,
  away_team_id BIGINT NOT NULL,
  venue_id BIGINT,
  kickoff_at TIMESTAMPTZ NOT NULL,
  timezone TEXT,
  status TEXT NOT NULL,
  elapsed INTEGER,
  home_goals INTEGER,
  away_goals INTEGER,
  ht_home_goals INTEGER,
  ht_away_goals INTEGER,
  last_provider_update_at TIMESTAMPTZ,
  CONSTRAINT matches_provider_id_unique UNIQUE (provider_fixture_id),
  CONSTRAINT matches_season_fk FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  CONSTRAINT matches_league_fk FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE RESTRICT,
  CONSTRAINT matches_home_team_fk FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  CONSTRAINT matches_away_team_fk FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  CONSTRAINT matches_venue_fk FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

CREATE INDEX idx_matches_league_kickoff ON matches(league_id, kickoff_at);
CREATE INDEX idx_matches_season_kickoff ON matches(season_id, kickoff_at);
CREATE INDEX idx_matches_status_kickoff ON matches(status, kickoff_at);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);

