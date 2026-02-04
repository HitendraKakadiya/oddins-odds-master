-- season_teams table
CREATE TABLE season_teams (
  season_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  PRIMARY KEY (season_id, team_id),
  CONSTRAINT season_teams_season_fk FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  CONSTRAINT season_teams_team_fk FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_season_teams_team ON season_teams(team_id);

