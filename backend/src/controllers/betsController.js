import { getMarketById } from '../services/footballData.js';

// In-memory bet store keyed by wallet address (replace with DB later)
const betsByWallet = new Map();
let betIdCounter = 1;

function getBetsForWallet(address) {
  return betsByWallet.get(address.toLowerCase()) ?? [];
}

export async function placeBet(req, res) {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    if (!walletAddress) return res.status(401).json({ error: 'Wallet address required' });

    const { marketId, outcome, amount } = req.body;
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

    const bet = {
      id: betIdCounter++,
      marketId,
      marketTitle: market.title,
      walletAddress: walletAddress.toLowerCase(),
      outcome,
      amount,
      odds,
      potentialWin: +(amount * odds).toFixed(4),
      profit: +((amount * odds) - amount).toFixed(4),
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    const existing = getBetsForWallet(walletAddress);
    betsByWallet.set(walletAddress.toLowerCase(), [...existing, bet]);

    res.status(201).json({ bet, message: 'Bet placed successfully' });
  } catch (err) {
    console.error('placeBet error:', err);
    res.status(500).json({ error: 'Failed to place bet' });
  }
}

export function getUserBets(req, res) {
  try {
    const walletAddress = req.headers['x-wallet-address'] ?? req.params.address;
    if (!walletAddress) return res.status(401).json({ error: 'Wallet address required' });

    const { status } = req.query;
    let bets = getBetsForWallet(walletAddress);

    if (status) bets = bets.filter(b => b.status === status);

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
    console.error('getUserBets error:', err);
    res.status(500).json({ error: 'Failed to load bets' });
  }
}
