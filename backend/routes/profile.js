import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/profile/setup - Create or update an identity
router.post('/setup', verifyToken, async (req, res) => {
  const { identityName, identityRole, targetPlatforms, niche, tone, isActive } = req.body;

  if (!identityRole || !targetPlatforms || !niche) {
    return res.status(400).json({ error: 'identityRole, targetPlatforms, and niche are required.' });
  }

  const platformsString = Array.isArray(targetPlatforms)
    ? targetPlatforms.join(',')
    : targetPlatforms;

  try {
    // If setting something to active, deactivate others
    if (isActive) {
      await prisma.profile.updateMany({
        where: { userId: req.userId },
        data: { isActive: false }
      });
    }

    const profile = await prisma.profile.create({
      data: { 
        userId: req.userId, 
        identityName: identityName || 'Main Persona',
        identityRole, 
        targetPlatforms: platformsString, 
        niche, 
        tone,
        isActive: isActive !== undefined ? isActive : true
      },
    });

    res.status(200).json({
      message: 'Identity established.',
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

// GET /api/profile - get current active identity
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({ 
      where: { userId: req.userId, isActive: true } 
    }) || await prisma.profile.findFirst({ 
      where: { userId: req.userId } 
    });

    if (!profile) {
      return res.status(404).json({ error: 'No active identity found.' });
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

// GET /api/profile/all - list all identities
router.get('/all', verifyToken, async (req, res) => {
  try {
    const identities = await prisma.profile.findMany({ where: { userId: req.userId } });
    res.json({ identities: identities.map(p => ({ ...p, targetPlatforms: p.targetPlatforms.split(',') })) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
