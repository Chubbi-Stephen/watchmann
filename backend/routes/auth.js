import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
      hasProfile: !!profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/me - get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized.' });

  const { verifyToken } = await import('../middleware/auth.js');
  // inline verify for this route
  const token = authHeader.split(' ')[1];
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'watchmann_secret_key');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

export default router;
