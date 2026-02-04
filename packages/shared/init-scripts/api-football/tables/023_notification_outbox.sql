-- notification_outbox table
CREATE TABLE notification_outbox (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_outbox_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notification_outbox_status_next ON notification_outbox(status, next_attempt_at) WHERE status = 'pending';
CREATE INDEX idx_notification_outbox_user ON notification_outbox(user_id, created_at DESC);

