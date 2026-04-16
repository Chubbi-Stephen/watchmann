import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Watchmann Backend is running' });
});

// Mock Onboarding Endpoint
app.post('/api/profile/setup', (req, res) => {
  const { identity, targetPlatforms, niche } = req.body;
  
  if (!identity || !targetPlatforms || !niche) {
    return res.status(400).json({ error: 'Missing required profile fields' });
  }

  // TODO: Save to DB
  console.log('Received profile setup:', req.body);
  
  res.status(200).json({ 
    message: 'Profile setup successful',
    profile: { identity, targetPlatforms, niche }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
