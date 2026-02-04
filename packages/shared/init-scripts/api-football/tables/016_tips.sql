-- tips table
CREATE TABLE tips (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  prediction_id BIGINT,
  title TEXT NOT NULL,
  short_reason TEXT,
  tip_rank INTEGER,
  published_at TIMESTAMPTZ,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT tips_match_fk FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT tips_prediction_fk FOREIGN KEY (prediction_id) REFERENCES match_predictions(id) ON DELETE SET NULL
);

CREATE INDEX idx_tips_published ON tips(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_tips_match ON tips(match_id);
CREATE INDEX idx_tips_premium ON tips(is_premium, published_at DESC) WHERE is_premium = true;

