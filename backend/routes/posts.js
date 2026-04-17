import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';
import { generateContentStrategy } from '../lib/openai.js';

const router = express.Router();

// Mock fallback logic preserved for robustness
const generateMockContent = (headline, platform, identity, tone) => {
  const templates = {
    X: `🚨 Breaking Tech: ${headline}\n\nHere's what this means for you as a tech enthusiast:\n\n1/ This is going to shake things up...\n2/ What you need to know right now\n3/ My take: [Your hot opinion here]\n\nDrop your thoughts 👇 #Tech #AI #Innovation`,
    LinkedIn: `📌 ${headline}\n\nAs a ${identity}, this caught my attention for one key reason...\n\nHere's the breakdown:\n• What happened\n• Why it matters\n• What to do about it\n\nIn a world where tech moves fast, staying ahead of trends like this is what separates those who thrive from those who fall behind.\n\n#Technology #ContentCreator #TechTrends`,
    Instagram: `Did you see this?! 👀\n\n"${headline}"\n\nAs someone in the tech space, I can't stop thinking about what this means for all of us 🤯\n\nSave this post — you're going to want to come back to it. 📌\n\n#TechNews #Innovation #ContentCreator #Trending`,
    Facebook: `This is BIG for anyone following the tech world 👇\n\n${headline}\n\nI've been breaking this down and here are my top 3 takeaways:\n\n✅ Takeaway 1: [Impact on users]\n✅ Takeaway 2: [Industry shift]\n✅ Takeaway 3: [What to watch next]\n\nShare this if you found it helpful! 🔄`,
    General: `📰 Today's Top Trend: ${headline}\n\nAs a ${identity}, here is why this matters to your audience and how you can create content around it today. Start with a hook, build the context, and end with a strong call to action.`,
  };

  return templates[platform] || templates.General;
};

// POST /api/posts/generate
router.post('/generate', verifyToken, async (req, res) => {
  const { trendId, identityId } = req.body;
  if (!trendId) return res.status(400).json({ error: 'trendId is required.' });

  try {
    // 1. Get Active (or specific) Identity
    const identity = identityId 
      ? await prisma.profile.findUnique({ where: { id: identityId, userId: req.userId } })
      : await prisma.profile.findFirst({ where: { userId: req.userId, isActive: true } });

    if (!identity) return res.status(404).json({ error: 'Identity not found. Establish identity first.' });

    // 2. Resolve Trend Link
    const trend = await prisma.trend.findUnique({ where: { id: trendId } });
    if (!trend) return res.status(404).json({ error: 'Trend node unreachable.' });

    const platforms = identity.targetPlatforms.split(',');
    const generatedPosts = [];

    // 3. Neural Strategy Generation
    for (const platform of platforms) {
      let content = await generateContentStrategy({ 
        trend, 
        identity, 
        tone: identity.tone || 'Professional', 
        platform 
      });

      // Fallback if AI fails or key is missing
      if (!content) {
        content = generateMockContent(trend.headline, platform, identity.identityRole, identity.tone);
      }

      const post = await prisma.post.create({
        data: { 
          userId: req.userId, 
          trendId: trend.id, 
          platformTarget: platform, 
          content, 
          status: 'Draft' 
        },
      });
      generatedPosts.push(post);
    }
    res.status(201).json({ message: 'Neural Sync Complete', posts: generatedPosts });
  } catch (error) {
    console.error("Meta Generation Failed:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/posts - today's posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const posts = await prisma.post.findMany({
      where: { userId: req.userId, createdAt: { gte: todayStart } },
      include: { trend: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/posts/all - historical Archive
router.get('/all', verifyToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: req.userId },
      include: { trend: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/posts/:id
router.patch('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status, scheduledFor, content } = req.body;
  try {
    const updated = await prisma.post.update({ 
      where: { id, userId: req.userId }, 
      data: { status, scheduledFor, content } 
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
