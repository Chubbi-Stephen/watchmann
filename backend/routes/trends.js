import express from 'express';
import Parser from 'rss-parser';
import prisma from '../lib/prisma.js';

const router = express.Router();
const parser = new Parser();

const RSS_FEEDS = [
  'https://techcrunch.com/feed/',
  'https://www.theverge.com/rss/index.xml',
  'https://hnrss.org/frontpage'
];

async function seedRealTrends() {
  console.log('Fetching real-time trends from RSS feeds...');
  try {
    const allItems = [];
    
    for (const url of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(url);
        const source = url.includes('techcrunch') ? 'TechCrunch' : 
                       url.includes('theverge') ? 'TheVerge' : 'HackerNews';
        
        feed.items.slice(0, 5).forEach(item => {
          allItems.push({
            headline: item.title,
            description: item.contentSnippet || item.content || '',
            platform: source,
            metadata: JSON.stringify({ link: item.link, date: item.pubDate })
          });
        });
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err.message);
      }
    }

    // Clean old trends and insert fresh ones
    // Note: In production we'd use a upsert based on link to avoid deletion
    await prisma.trend.deleteMany({});
    
    for (const trend of allItems) {
      await prisma.trend.create({ data: trend });
    }
    
    console.log(`Successfully seeded ${allItems.length} real trends.`);
  } catch (error) {
    console.error('Trend seeding failed:', error);
  }
}

// GET /api/trends
router.get('/', async (req, res) => {
  try {
    let trends = await prisma.trend.findMany({
      orderBy: { discoveredAt: 'desc' }
    });

    // If no trends or they are older than 1 hour, refresh them
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (trends.length === 0 || trends[0].discoveredAt < oneHourAgo) {
      await seedRealTrends();
      trends = await prisma.trend.findMany({
        orderBy: { discoveredAt: 'desc' }
      });
    }

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends.' });
  }
});

export default router;
