import { parseAbiItem } from 'viem';
import { publicClient, CONTRACT_ADDRESS } from './market.js';
import { db, initDb } from './db.js';
import { log } from './logger.js';

// Events we index into the read model.
const EV_CREATED  = parseAbiItem('event MarketCreated(uint256 indexed id, string question, uint256 closeTime, bool hasDraw)');
const EV_BET      = parseAbiItem('event BetPlaced(uint256 indexed id, address indexed bettor, uint8 outcome, uint256 amount)');
const EV_RESOLVED = parseAbiItem('event MarketResolved(uint256 indexed id, uint8 result)');

// Block the PredictionMarket was deployed at (don't scan from genesis).
const START_BLOCK = BigInt(process.env.INDEXER_START_BLOCK || 27804539);
const CHUNK = 9000n; // most RPCs cap getLogs ranges; stay under it

async function getCursor() {
  const { rows } = await db.execute({ sql: 'SELECT value FROM indexer_state WHERE key = ?', args: ['lastBlock'] });
  return rows.length ? BigInt(rows[0].value) : START_BLOCK - 1n;
}

async function setCursor(block) {
  await db.execute({
    sql: `INSERT INTO indexer_state (key, value) VALUES ('lastBlock', ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [block.toString()],
  });
}

/** Scan new blocks for contract events and fold them into the read model. */
export async function indexEvents() {
  await initDb();
  const latest = await publicClient.getBlockNumber();
  let from = (await getCursor()) + 1n;
  if (from > latest) return { created: 0, bets: 0, resolved: 0, latest: Number(latest) };

  let created = 0, bets = 0, resolved = 0;

  while (from <= latest) {
    const to = from + CHUNK > latest ? latest : from + CHUNK;

    const [createdLogs, betLogs, resolvedLogs] = await Promise.all([
      publicClient.getLogs({ address: CONTRACT_ADDRESS, event: EV_CREATED,  fromBlock: from, toBlock: to }),
      publicClient.getLogs({ address: CONTRACT_ADDRESS, event: EV_BET,      fromBlock: from, toBlock: to }),
      publicClient.getLogs({ address: CONTRACT_ADDRESS, event: EV_RESOLVED, fromBlock: from, toBlock: to }),
    ]);

    for (const lg of createdLogs) {
      await db.execute({
        sql: `INSERT INTO markets (id, question, close_time, has_draw, status) VALUES (?, ?, ?, ?, 0)
              ON CONFLICT(id) DO UPDATE SET question = excluded.question,
                close_time = excluded.close_time, has_draw = excluded.has_draw`,
        args: [Number(lg.args.id), lg.args.question, Number(lg.args.closeTime), lg.args.hasDraw ? 1 : 0],
      });
      created++;
    }

    for (const lg of betLogs) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO bet_events
                (market_id, bettor, outcome, amount, tx_hash, log_index, block_number)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          Number(lg.args.id), lg.args.bettor.toLowerCase(), Number(lg.args.outcome),
          lg.args.amount.toString(), lg.transactionHash, lg.logIndex, Number(lg.blockNumber),
        ],
      });
      bets++;
    }

    for (const lg of resolvedLogs) {
      await db.execute({
        sql: `UPDATE markets SET status = 1, result = ? WHERE id = ?`,
        args: [Number(lg.args.result), Number(lg.args.id)],
      });
      resolved++;
    }

    await setCursor(to);
    from = to + 1n;
  }

  if (created || bets || resolved) {
    log.info(`indexer: +${created} markets, +${bets} bets, ${resolved} resolved (head ${latest})`);
  }
  return { created, bets, resolved, latest: Number(latest) };
}
