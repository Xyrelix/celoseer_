import { formatEther } from 'viem';
import { db, initDb } from '../lib/db.js';
import { log } from '../lib/logger.js';

const OUTCOME_LABEL = ['yes', 'no', 'draw'];

// Read a wallet's bet history straight from the chain index (bet_events,
// populated by the event indexer). Joined with the markets catalog for titles
// and resolution state.
export async function getUserBets(req, res) {
  try {
    await initDb();
    const walletAddress = req.headers['x-wallet-address'] ?? req.params.address;
    if (!walletAddress) return res.status(401).json({ error: 'Wallet address required' });

    const { rows } = await db.execute({
      sql: `SELECT b.market_id, b.outcome, b.amount, b.tx_hash, b.block_number, b.created_at,
                   m.question, m.status, m.result
              FROM bet_events b
              LEFT JOIN markets m ON m.id = b.market_id
             WHERE b.bettor = ?
             ORDER BY b.block_number DESC, b.log_index DESC`,
      args: [walletAddress.toLowerCase()],
    });

    const bets = rows.map(r => {
      const amount = parseFloat(formatEther(BigInt(r.amount)));
      const resolved = Number(r.status) === 1;
      const won = resolved && Number(r.outcome) === Number(r.result);
      return {
        marketId:    Number(r.market_id),
        marketTitle: r.question ?? `Market ${r.market_id}`,
        outcome:     OUTCOME_LABEL[Number(r.outcome)] ?? 'yes',
        amount,
        txHash:      r.tx_hash,
        status:      resolved ? 'closed' : 'active',
        result:      resolved ? (won ? 'won' : 'lost') : null,
        timestamp:   r.created_at,
      };
    });

    const totalStaked = bets.reduce((s, b) => s + b.amount, 0);
    const wonCount = bets.filter(b => b.result === 'won').length;

    res.json({
      bets,
      stats: {
        total: bets.length,
        active: bets.filter(b => b.status === 'active').length,
        totalStaked: +totalStaked.toFixed(4),
        won: wonCount,
      },
    });
  } catch (err) {
    log.error('getUserBets error:', err);
    res.status(500).json({ error: 'Failed to load bets' });
  }
}
