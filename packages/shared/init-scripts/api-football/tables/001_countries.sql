-- countries table
CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  flag_url TEXT,
  CONSTRAINT countries_name_unique UNIQUE (name)
);

CREATE INDEX idx_countries_code ON countries(code) WHERE code IS NOT NULL;

