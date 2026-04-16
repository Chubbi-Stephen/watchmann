import express from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mock AI content generator (placeholder before real API integration)
const generateMockContent = (headline, platform, identity, tone) => {
  const toneLabel = tone || 'informative';

  const templates = {
    X: `🚨 Breaking Tech: ${headline}\n\nHere's what this means for you as a tech enthusiast:\n\n1/ This is going to shake things up...\n2/ What you need to know right now\n3/ My take: [Your hot opinion here]\n\nDrop your thoughts 👇 #Tech #AI #Innovation`,
    LinkedIn: `📌 ${headline}\n\nAs a ${identity}, this caught my attention for one key reason...\n\nHere's the breakdown:\n• What happened\n• Why it matters\n• What to do about it\n\nIn a world where tech moves fast, staying ahead of trends like this is what separates those who thrive from those who fall behind.\n\n#Technology #ContentCreator #TechTrends`,
    Instagram: `Did you see this?! 👀\n\n"${headline}"\n\nAs someone in the tech space, I can't stop thinking about what this means for all of us 🤯\n\nSave this post — you're going to want to come back to it. 📌\n\n#TechNews #Innovation #ContentCreator #Trending`,
    Facebook: `This is BIG for anyone following the tech world 👇\n\n${headline}\n\nI've been breaking this down and here are my top 3 takeaways:\n\n✅ Takeaway 1: [Impact on users]\n✅ Takeaway 2: [Industry shift]\n✅ Takeaway 3: [What to watch next]\n\nShare this if you found it helpful! 🔄`,
    General: `📰 Today's Top Trend: ${headline}\n\nAs a ${identity}, here is why this matters to your audience and how you can create content around it today. Start with a hook, build the context, and end with a strong call to action.`,
  };

  return templates[platform] || templates.General;
};

// POST /api/posts/generate - generate posts from a trend
router.post('/generate', verifyToken, async (req, res) => {
  const { trendId } = req.body;

  if (!trendId) {
    return res.status(400).json({ error: 'trendId is required.' });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Complete your profile first.' });
    }

    const trend = await prisma.trend.findUnique({ where: { id: trendId } });
    if (!trend) {
      return res.status(404).json({ error: 'Trend not found.' });
    }

    const platforms = profile.targetPlatforms.split(',');
    const generatedPosts = [];

    for (const platform of platforms) {
      const content = generateMockContent(
        trend.headline,
        platform,
        profile.identity,
        profile.tone
      );

      const post = await prisma.post.create({
        data: {
          userId: req.userId,
          trendId: trend.id,
          platformTarget: platform,
          content,
          status: 'Draft',
        },
      });

      generatedPosts.push(post);
    }

    res.status(201).json({
      message: `${generatedPosts.length} post(s) generated successfully.`,
      trend: trend.headline,
      posts: generatedPosts,
    });
  } catch (error) {
    console.error('Generate posts error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/posts - get all posts for the current user (today)
router.get('/', verifyToken, async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const posts = await prisma.post.findMany({
      where: {
        userId: req.userId,
        createdAt: { gte: todayStart },
      },
      include: { trend: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/posts/:id/status - update post status
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Draft', 'Published'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const post = await prisma.post.updateMany({
      where: { id, userId: req.userId },
      data: { status },
    });

    if (post.count === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json({ message: 'Post status updated.' });
  } catch (error) {
    console.error('Update post status error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
