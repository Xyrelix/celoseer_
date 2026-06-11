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

    // Accept `outcome` (current) or `prediction` (older frontend builds).
    const { marketId, amount, txHash } = req.body;
    const outcome = req.body.outcome ?? req.body.prediction;
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    const bodyOdds  = typeof req.body.odds === 'string' ? parseFloat(req.body.odds) : req.body.odds;

    if (marketId == null || !outcome || amountNum == null) {
      return res.status(400).json({ error: 'marketId, outcome, and amount are required' });
    }
    if (typeof amountNum !== 'number' || Number.isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }
    if (!['yes', 'no', 'draw'].includes(outcome)) {
      return res.status(400).json({ error: 'outcome must be yes, no, or draw' });
    }

    // The frontend's market IDs don't always line up with the backend catalog,
    // so trust the title/odds the client displayed; fall back to a lookup.
    const market = await getMarketById(marketId).catch(() => null);
    const oddsMap = market
      ? { yes: market.yesOdds, no: market.noOdds, draw: market.drawOdds ?? null }
      : {};
    const odds = oddsMap[outcome] ?? bodyOdds;
    if (!odds || odds <= 0) {
      return res.status(400).json({ error: 'odds required (none on record or provided)' });
    }
    const marketTitle = market?.title ?? req.body.marketTitle ?? `Market ${marketId}`;

    const potentialWin = +(amountNum * odds).toFixed(4);
    const profit = +((amountNum * odds) - amountNum).toFixed(4);

    const result = await db.execute({
      sql: `INSERT INTO bets
              (wallet_address, market_id, market_title, outcome, amount, odds, potential_win, profit, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *`,
      args: [
        walletAddress.toLowerCase(),
        marketId,
        marketTitle,
        outcome,
        amountNum,
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
