-- seasons table
CREATE TABLE seasons (
  id BIGSERIAL PRIMARY KEY,
  league_id BIGINT NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT seasons_league_year_unique UNIQUE (league_id, year),
  CONSTRAINT seasons_league_fk FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE
);

CREATE INDEX idx_seasons_league ON seasons(league_id);
CREATE INDEX idx_seasons_current ON seasons(is_current) WHERE is_current = true;

