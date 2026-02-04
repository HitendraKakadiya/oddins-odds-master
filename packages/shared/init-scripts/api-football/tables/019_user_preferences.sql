-- user_preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  timezone TEXT,
  default_markets JSONB,
  default_leagues JSONB,
  CONSTRAINT user_preferences_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

