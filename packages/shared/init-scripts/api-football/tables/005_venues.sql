-- venues table
CREATE TABLE venues (
  id BIGSERIAL PRIMARY KEY,
  provider_venue_id INTEGER,
  name TEXT NOT NULL,
  city TEXT,
  capacity INTEGER,
  surface TEXT,
  CONSTRAINT venues_provider_id_unique UNIQUE (provider_venue_id)
);

CREATE INDEX idx_venues_name ON venues(name);
CREATE INDEX idx_venues_city ON venues(city) WHERE city IS NOT NULL;

