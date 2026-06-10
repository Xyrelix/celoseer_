import { getMarketById } from '../services/footballData.js';
import { db, initDb } from '../lib/db.js';
import { log } from '../lib/logger.js';

// Map a DB row to the API shape the frontend expects.
function rowToBet(r) {
  return {
    id:            Number(r.id),
    marketId:      Number(r.market_id),
    marketTitle:   r.market_title,
    walletAddress: r.wallet_address,
    outcome:       r.outcome,
    amount:        r.amount,
    odds:          r.odds,
    potentialWin:  r.potential_win,
    profit:        r.profit,
    status:        r.status,
    result:        r.result ?? null,
    txHash:        r.tx_hash ?? null,
    timestamp:     r.created_at,
  };
}

export async function placeBet(req, res) {
  try {
    await initDb();
    const walletAddress = req.headers['x-wallet-address'];
    if (!walletAddress) return res.status(401).json({ error: 'Wallet address required' });

    const { marketId, outcome, amount, txHash } = req.body;
    if (!marketId || !outcome || !amount) {
      return res.status(400).json({ error: 'marketId, outcome, and amount are required' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }
    if (!['yes', 'no', 'draw'].includes(outcome)) {
      return res.status(400).json({ error: 'outcome must be yes, no, or draw' });
    }

    const market = await getMarketById(marketId);
    if (!market) return res.status(404).json({ error: 'Market not found' });

    const oddsMap = { yes: market.yesOdds, no: market.noOdds, draw: market.drawOdds ?? null };
    const odds = oddsMap[outcome];
    if (!odds) return res.status(400).json({ error: `No ${outcome} odds for this market` });

    const potentialWin = +(amount * odds).toFixed(4);
    const profit = +((amount * odds) - amount).toFixed(4);

    const result = await db.execute({
      sql: `INSERT INTO bets
              (wallet_address, market_id, market_title, outcome, amount, odds, potential_win, profit, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *`,
      args: [
        walletAddress.toLowerCase(),
        marketId,
        market.title,
        outcome,
        amount,
        odds,
        potentialWin,
        profit,
        txHash ?? null,
      ],
    });

    res.status(201).json({ bet: rowToBet(result.rows[0]), message: 'Bet placed successfully' });
  } catch (err) {
    log.error('placeBet error:', err);
    res.status(500).json({ error: 'Failed to place bet' });
  }
}

export async function getUserBets(req, res) {
  try {
    await initDb();
    const walletAddress = req.headers['x-wallet-address'] ?? req.params.address;
    if (!walletAddress) return res.status(401).json({ error: 'Wallet address required' });

    const { status } = req.query;
    const sql = status
      ? `SELECT * FROM bets WHERE wallet_address = ? AND status = ? ORDER BY id DESC`
      : `SELECT * FROM bets WHERE wallet_address = ? ORDER BY id DESC`;
    const args = status ? [walletAddress.toLowerCase(), status] : [walletAddress.toLowerCase()];

    const { rows } = await db.execute({ sql, args });
    const bets = rows.map(rowToBet);

    const totalStaked = bets.reduce((sum, b) => sum + b.amount, 0);
    const activeBets = bets.filter(b => b.status === 'active');
    const wonBets = bets.filter(b => b.status === 'won');
    const totalWon = wonBets.reduce((sum, b) => sum + b.potentialWin, 0);

    res.json({
      bets,
      stats: {
        total: bets.length,
        active: activeBets.length,
        totalStaked: +totalStaked.toFixed(4),
        totalWon: +totalWon.toFixed(4),
        pnl: +(totalWon - totalStaked).toFixed(4),
      },
    });
  } catch (err) {
    log.error('getUserBets error:', err);
    res.status(500).json({ error: 'Failed to load bets' });
  }
}
