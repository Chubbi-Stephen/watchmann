import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mock tech trends grouped by platform
const MOCK_TRENDS = {
  X: [
    { headline: 'OpenAI launches GPT-5 with real-time web browsing', platform: 'X' },
    { headline: 'Apple announces on-device AI chip for iPhone 17', platform: 'X' },
    { headline: 'Google DeepMind beats human experts in scientific reasoning', platform: 'X' },
  ],
  LinkedIn: [
    { headline: 'How AI agents are replacing junior dev roles in 2025', platform: 'LinkedIn' },
    { headline: 'Meta open-sources its newest multimodal AI model', platform: 'LinkedIn' },
    { headline: '10 tech startups that raised over $100M this week', platform: 'LinkedIn' },
  ],
  Instagram: [
    { headline: 'Behind the scenes: Building a SaaS in 30 days', platform: 'Instagram' },
    { headline: 'The viral "vibe coding" trend sweeping developers', platform: 'Instagram' },
  ],
  Facebook: [
    { headline: 'Tech myth-busting: Is AI really taking all the jobs?', platform: 'Facebook' },
    { headline: 'Best free AI tools every blogger should use in 2025', platform: 'Facebook' },
  ],
  General: [
    { headline: 'The rise of agentic AI and what it means for the internet', platform: 'General' },
    { headline: 'Nvidia hits $4 trillion market cap fuelled by AI demand', platform: 'General' },
  ],
};

// GET /api/trends - returns trending topics for user's platforms
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Complete your profile first.' });
    }

    const platforms = profile.targetPlatforms.split(',');
    const now = new Date();

    // Save fresh mock trends to the database (or fetch existing ones for today)
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const existingTrends = await prisma.trend.findMany({
      where: { discoveredAt: { gte: todayStart } },
    });

    let trends = existingTrends;

    if (existingTrends.length === 0) {
      // Seed mock trends for today
      const toCreate = [];
      for (const platform of [...platforms, 'General']) {
        const platformTrends = MOCK_TRENDS[platform] || [];
        platformTrends.forEach((t) => toCreate.push(t));
      }

      await prisma.trend.createMany({ data: toCreate });
      trends = await prisma.trend.findMany({ where: { discoveredAt: { gte: todayStart } } });
    }

    // Filter to user's platforms + general
    const filtered = trends.filter(
      (t) => platforms.includes(t.platform) || t.platform === 'General'
    );

    res.json({ trends: filtered, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
