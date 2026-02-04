-- alerts table
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  match_id BIGINT,
  league_id BIGINT,
  market_id BIGINT,
  threshold JSONB,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT alerts_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT alerts_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT alerts_league_fk FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
  CONSTRAINT alerts_market_fk FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

CREATE INDEX idx_alerts_user_enabled ON alerts(user_id, is_enabled) WHERE is_enabled = true;
CREATE INDEX idx_alerts_type ON alerts(type);

