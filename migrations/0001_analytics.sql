CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  sequence INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  received_at INTEGER NOT NULL,
  visible_ms INTEGER NOT NULL,
  targets TEXT NOT NULL CHECK(json_valid(targets))
);
CREATE INDEX IF NOT EXISTS visits_started_at ON visits(started_at);
