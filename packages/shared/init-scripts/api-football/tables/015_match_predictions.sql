-- match_predictions table
CREATE TABLE match_predictions (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  model_id BIGINT NOT NULL,
  market_id BIGINT NOT NULL,
  line NUMERIC,
  selection TEXT,
  payload JSONB NOT NULL,
  probability NUMERIC(8,6),
  confidence SMALLINT,
  generated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT match_predictions_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT match_predictions_model_fk FOREIGN KEY (model_id) REFERENCES prediction_models(id) ON DELETE RESTRICT,
  CONSTRAINT match_predictions_market_fk FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE RESTRICT
);

CREATE INDEX idx_match_predictions_match ON match_predictions(match_id, generated_at DESC);
CREATE INDEX idx_match_predictions_market ON match_predictions(market_id, generated_at DESC);
CREATE INDEX idx_match_predictions_model ON match_predictions(model_id);

