-- articles table
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body_md TEXT NOT NULL,
  category TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  CONSTRAINT articles_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_articles_type_published ON articles(type, published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_articles_category ON articles(category) WHERE category IS NOT NULL;

