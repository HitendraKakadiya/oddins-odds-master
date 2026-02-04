-- user_favourites table
CREATE TABLE user_favourites (
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, entity_type, entity_id),
  CONSTRAINT user_favourites_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_favourites_entity ON user_favourites(entity_type, entity_id);

