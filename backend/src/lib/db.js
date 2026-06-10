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
  initialized = true;
}
