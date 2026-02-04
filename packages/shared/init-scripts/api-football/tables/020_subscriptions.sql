-- subscriptions table
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL,
  plan_key TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  CONSTRAINT subscriptions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider, provider_subscription_id) WHERE provider_subscription_id IS NOT NULL;

