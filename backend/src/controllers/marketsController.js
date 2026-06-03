import { getAllMarkets, getMarketById } from '../services/footballData.js';

export async function listMarkets(req, res) {
  try {
    const { category, search } = req.query;
    let markets = await getAllMarkets();

    if (category && category !== 'all') {
      markets = markets.filter(m => m.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      markets = markets.filter(m => m.title.toLowerCase().includes(q));
    }

    res.json({ markets, total: markets.length });
  } catch (err) {
    console.error('listMarkets error:', err);
    res.status(500).json({ error: 'Failed to load markets' });
  }
}

export async function getMarket(req, res) {
  try {
    const market = await getMarketById(req.params.id);
    if (!market) return res.status(404).json({ error: 'Market not found' });
    res.json(market);
  } catch (err) {
    console.error('getMarket error:', err);
    res.status(500).json({ error: 'Failed to load market' });
  }
}
