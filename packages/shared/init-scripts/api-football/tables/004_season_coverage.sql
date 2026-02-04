-- season_coverage table
CREATE TABLE season_coverage (
  season_id BIGINT PRIMARY KEY,
  fixtures BOOLEAN NOT NULL DEFAULT false,
  events BOOLEAN NOT NULL DEFAULT false,
  lineups BOOLEAN NOT NULL DEFAULT false,
  stats_fixtures BOOLEAN NOT NULL DEFAULT false,
  stats_players BOOLEAN NOT NULL DEFAULT false,
  standings BOOLEAN NOT NULL DEFAULT false,
  injuries BOOLEAN NOT NULL DEFAULT false,
  predictions BOOLEAN NOT NULL DEFAULT false,
  odds BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT season_coverage_season_fk FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

