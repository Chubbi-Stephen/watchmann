import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/profile/setup - complete onboarding
router.post('/setup', verifyToken, async (req, res) => {
  const { identity, targetPlatforms, niche, tone } = req.body;

  if (!identity || !targetPlatforms || !niche) {
    return res.status(400).json({ error: 'identity, targetPlatforms, and niche are required.' });
  }

  const platformsString = Array.isArray(targetPlatforms)
    ? targetPlatforms.join(',')
    : targetPlatforms;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: { identity, targetPlatforms: platformsString, niche, tone },
      create: { userId: req.userId, identity, targetPlatforms: platformsString, niche, tone },
    });

    res.status(200).json({
      message: 'Profile saved successfully.',
      profile: {
        ...profile,
        targetPlatforms: profile.targetPlatforms.split(','),
      },
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/profile - get current user's profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please complete onboarding.' });
    }

    res.json({
      ...profile,
      targetPlatforms: profile.targetPlatforms.split(','),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
