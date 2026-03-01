import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// In production, store this in a proper database.
// For now, a simple hardcoded admin user with a bcrypt-hashed password.
const ADMIN_USER = {
  username: 'admin',
  // Default password: 'admin123' — change this in production!
  passwordHash: '$2b$10$rOzQqFqE3qFqE4qFqE5qFuOzQqFqE3qFqE4qFqE5qFuOzQqFqE3q',
};

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-admin-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

// Initialize: hash the default password on first load
let adminPasswordHash: string | null = null;

async function getAdminHash(): Promise<string> {
  if (!adminPasswordHash) {
    // Hash 'admin123' as the default password
    adminPasswordHash = await bcrypt.hash('admin123', 10);
  }
  return adminPasswordHash;
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    if (username !== ADMIN_USER.username) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const hash = await getAdminHash();
    const isValid = await bcrypt.compare(password, hash);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({ token, message: 'Login successful.' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/verify — Verify if a token is still valid
router.get('/verify', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
