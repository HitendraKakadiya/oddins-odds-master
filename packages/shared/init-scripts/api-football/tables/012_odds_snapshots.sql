-- odds_snapshots table
CREATE TABLE odds_snapshots (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  bookmaker_id BIGINT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  source TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT odds_snapshots_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT odds_snapshots_bookmaker_fk FOREIGN KEY (bookmaker_id) REFERENCES bookmakers(id) ON DELETE RESTRICT
);

CREATE INDEX idx_odds_snapshots_match ON odds_snapshots(match_id, captured_at DESC);
CREATE INDEX idx_odds_snapshots_bookmaker ON odds_snapshots(bookmaker_id, captured_at DESC);
CREATE INDEX idx_odds_snapshots_live ON odds_snapshots(is_live, captured_at DESC) WHERE is_live = true;

