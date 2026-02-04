-- match_events table
CREATE TABLE match_events (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  player_id BIGINT,
  assist_player_id BIGINT,
  time_elapsed INTEGER NOT NULL, -- Minutes elapsed (e.g., 45 for 45th minute)
  time_extra INTEGER, -- Extra time (e.g., +2)
  event_type TEXT NOT NULL, -- 'Goal', 'Card', 'subst', 'Var'
  detail TEXT, -- 'Yellow Card', 'Red Card', 'Normal Goal', 'Penalty', 'Own Goal', etc.
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT match_events_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT match_events_team_fk FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT match_events_player_fk FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL,
  CONSTRAINT match_events_assist_player_fk FOREIGN KEY (assist_player_id) REFERENCES players(id) ON DELETE SET NULL
);

CREATE INDEX idx_match_events_match ON match_events(match_id, time_elapsed);
CREATE INDEX idx_match_events_player ON match_events(player_id) WHERE player_id IS NOT NULL;
CREATE INDEX idx_match_events_type ON match_events(event_type);
CREATE INDEX idx_match_events_team ON match_events(team_id);

COMMENT ON TABLE match_events IS 'Match events: goals, cards, substitutions, VAR decisions';
COMMENT ON COLUMN match_events.event_type IS 'Event type: Goal, Card, subst (substitution), Var';
COMMENT ON COLUMN match_events.detail IS 'Event detail: Yellow Card, Red Card, Normal Goal, Penalty, Own Goal, Missed Penalty, etc.';
COMMENT ON COLUMN match_events.time_elapsed IS 'Minutes elapsed when event occurred';
COMMENT ON COLUMN match_events.time_extra IS 'Extra/injury time (e.g., +2 means 45+2)';

