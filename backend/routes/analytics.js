import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/analytics - System performance metrics
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Platform Distribution
    const posts = await prisma.post.findMany({ where: { userId } });
    const platformCounts = posts.reduce((acc, post) => {
      acc[post.platformTarget] = (acc[post.platformTarget] || 0) + 1;
      return acc;
    }, {});

    const platformData = Object.entries(platformCounts).map(([name, value]) => ({ name, value }));

    // 2. Activity Timeline (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPosts = await prisma.post.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'asc' }
    });

    const activityMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activityMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
    }

    recentPosts.forEach(post => {
      const day = new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (activityMap[day] !== undefined) activityMap[day]++;
    });

    const activityData = Object.entries(activityMap).map(([name, count]) => ({ name, count })).reverse();

    // 3. Efficiency Metrics
    const publishedCount = posts.filter(p => p.status === 'Published').length;
    const streak = 12; // Placeholder for logic
    
    res.json({
      platformData,
      activityData,
      metrics: {
        totalPosts: posts.length,
        publishedCount,
        viralityAvg: 78,
        activeStreak: streak
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
