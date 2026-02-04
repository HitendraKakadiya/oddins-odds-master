-- team_match_stats table
CREATE TABLE team_match_stats (
  match_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  is_home BOOLEAN NOT NULL,
  stats JSONB NOT NULL,
  PRIMARY KEY (match_id, team_id),
  CONSTRAINT team_match_stats_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT team_match_stats_team_fk FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_match_stats_team ON team_match_stats(team_id, match_id);

