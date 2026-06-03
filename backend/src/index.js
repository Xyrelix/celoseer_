import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => res.json({ message: 'CeloSeer backend running', version: '0.1.0' }));

app.listen(PORT, () => {
  console.log(`CeloSeer backend on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY not set — AI predictions will use mock fallback data');
  }
});
