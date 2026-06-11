import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { initDb } from './lib/db.js';
import { log, requestLogger } from './lib/logger.js';
import { startResolver, startIndexer } from './lib/scheduler.js';

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.use('/api', apiRoutes);

app.get('/', (req, res) => res.json({ message: 'CeloSeer backend running', version: '0.1.0' }));

app.listen(PORT, async () => {
  log.info(`CeloSeer backend on http://localhost:${PORT}`);
  try {
    await initDb();
    log.info(`DB ready (${process.env.TURSO_DATABASE_URL ? 'Turso' : 'local file'})`);
  } catch (err) {
    log.error('DB init failed:', err.message);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    log.warn('ANTHROPIC_API_KEY not set — AI predictions will use mock fallback data');
  }
  startIndexer();  // chain → Turso event indexer
  startResolver(); // autonomous market settlement (no-op unless enabled + configured)
});
