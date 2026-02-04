-- match_lineups table
CREATE TABLE match_lineups (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  player_id BIGINT NOT NULL,
  position TEXT NOT NULL, -- 'G', 'D', 'M', 'F' (Goalkeeper, Defender, Midfielder, Forward)
  grid_position TEXT, -- e.g., '4-4-2' position on field
  is_starter BOOLEAN NOT NULL DEFAULT true,
  jersey_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT match_lineups_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT match_lineups_team_fk FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT match_lineups_player_fk FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT match_lineups_unique UNIQUE (match_id, team_id, player_id)
);

CREATE INDEX idx_match_lineups_match ON match_lineups(match_id, team_id);
CREATE INDEX idx_match_lineups_player ON match_lineups(player_id);
CREATE INDEX idx_match_lineups_starter ON match_lineups(match_id, is_starter) WHERE is_starter = true;

COMMENT ON TABLE match_lineups IS 'Starting lineups and substitutes for matches';
COMMENT ON COLUMN match_lineups.position IS 'Player position: G (Goalkeeper), D (Defender), M (Midfielder), F (Forward)';
COMMENT ON COLUMN match_lineups.grid_position IS 'Position on field grid (e.g., 4:2 for formation 4-4-2)';
COMMENT ON COLUMN match_lineups.is_starter IS 'True if player started the match, false if substitute';

