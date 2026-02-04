-- odds_snapshot_lines table
CREATE TABLE odds_snapshot_lines (
  id BIGSERIAL PRIMARY KEY,
  snapshot_id BIGINT NOT NULL,
  market_id BIGINT NOT NULL,
  line NUMERIC,
  selection TEXT NOT NULL,
  odd_value NUMERIC(8,3) NOT NULL,
  implied_prob NUMERIC(8,6),
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT odds_snapshot_lines_snapshot_fk FOREIGN KEY (snapshot_id) REFERENCES odds_snapshots(id) ON DELETE CASCADE,
  CONSTRAINT odds_snapshot_lines_market_fk FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE RESTRICT
);

CREATE INDEX idx_odds_lines_snapshot_market ON odds_snapshot_lines(snapshot_id, market_id);
CREATE INDEX idx_odds_lines_market_selection ON odds_snapshot_lines(market_id, selection);

