-- players table
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  provider_player_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position TEXT, -- 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'
  nationality TEXT,
  date_of_birth DATE,
  height INTEGER, -- in cm
  weight INTEGER, -- in kg
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT players_provider_id_unique UNIQUE (provider_player_id)
);

CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_position ON players(position) WHERE position IS NOT NULL;
CREATE INDEX idx_players_nationality ON players(nationality) WHERE nationality IS NOT NULL;

COMMENT ON TABLE players IS 'Player information from API-Football';
COMMENT ON COLUMN players.provider_player_id IS 'Player ID from API-Football';
COMMENT ON COLUMN players.position IS 'Primary position: Goalkeeper, Defender, Midfielder, Attacker';

