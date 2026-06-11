import { createClient } from '@libsql/client';

// Turso in prod; a local file when TURSO_DATABASE_URL isn't set (dev).
const url = process.env.TURSO_DATABASE_URL || 'file:celoseer.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient(authToken ? { url, authToken } : { url });

let initialized = false;

/** Create tables on first use. Safe to call repeatedly. */
export async function initDb() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bets (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT    NOT NULL,
      market_id      INTEGER NOT NULL,
      market_title   TEXT,
      outcome        TEXT    NOT NULL,
      amount         REAL    NOT NULL,
      odds           REAL    NOT NULL,
      potential_win  REAL    NOT NULL,
      profit         REAL    NOT NULL,
      status         TEXT    NOT NULL DEFAULT 'active',
      result         TEXT,
      tx_hash        TEXT,
      created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_bets_wallet ON bets(wallet_address)`);

  // ── Chain-indexed read model (populated from contract events) ──────────────
  // Market catalog, built from MarketCreated / MarketResolved events.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS markets (
      id         INTEGER PRIMARY KEY,   -- on-chain market id
      question   TEXT,
      close_time INTEGER,
      has_draw   INTEGER DEFAULT 0,
      status     INTEGER DEFAULT 0,     -- 0 OPEN, 1 RESOLVED, 2 CANCELLED
      result     INTEGER                -- winning outcome once resolved
    )
  `);

  // Every BetPlaced event, deduped by (tx_hash, log_index).
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bet_events (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      market_id    INTEGER NOT NULL,
      bettor       TEXT    NOT NULL,
      outcome      INTEGER NOT NULL,    -- 0 yes, 1 no, 2 draw
      amount       TEXT    NOT NULL,    -- wei as string
      tx_hash      TEXT    NOT NULL,
      log_index    INTEGER NOT NULL,
      block_number INTEGER NOT NULL,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      UNIQUE(tx_hash, log_index)
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_bet_events_bettor ON bet_events(bettor)`);

  // Indexer cursor (last fully-scanned block, etc).
  await db.execute(`CREATE TABLE IF NOT EXISTS indexer_state (key TEXT PRIMARY KEY, value TEXT)`);

  initialized = true;
}
