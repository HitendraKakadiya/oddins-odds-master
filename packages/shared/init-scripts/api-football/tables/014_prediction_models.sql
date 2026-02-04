-- prediction_models table
CREATE TABLE prediction_models (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'internal',
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT prediction_models_unique UNIQUE (name, version, source)
);

CREATE INDEX idx_prediction_models_active ON prediction_models(is_active) WHERE is_active = true;

