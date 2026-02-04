-- team_players junction table
CREATE TABLE team_players (
  team_id BIGINT NOT NULL,
  player_id BIGINT NOT NULL,
  season_year INTEGER, -- Which season this association is for
  jersey_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, player_id, season_year),
  CONSTRAINT team_players_team_fk FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT team_players_player_fk FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_players_player ON team_players(player_id);
CREATE INDEX idx_team_players_season ON team_players(season_year) WHERE season_year IS NOT NULL;

COMMENT ON TABLE team_players IS 'Links players to teams for specific seasons';
COMMENT ON COLUMN team_players.season_year IS 'Year of the season (e.g., 2024)';
COMMENT ON COLUMN team_players.jersey_number IS 'Player jersey/shirt number';

