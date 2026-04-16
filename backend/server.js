import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import trendsRoutes from './routes/trends.js';
import postsRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Watchmann Backend is running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/posts', postsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

app.listen(PORT, () => {
  console.log(`✅ Watchmann server running on http://localhost:${PORT}`);
});
