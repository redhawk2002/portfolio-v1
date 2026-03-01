import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-admin-secret-key-change-in-production';

// Auth middleware for protected routes
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// GET all sections (admin — includes hidden items)
router.get('/admin/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      include: {
        items: {
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });
    res.json(sections);
  } catch (error) {
    console.error('Failed to fetch all sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all active sections
router.get('/', async (req: Request, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      where: { isVisible: true },
      include: {
        items: {
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });
    res.json(sections);
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a specific section by type
router.get('/:type', async (req: Request, res: Response) => {
  try {
    const section = await prisma.section.findFirst({
      where: { 
        type: req.params.type as string,
        isVisible: true
      },
      include: {
        items: {
          where: { isVisible: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    res.json(section);
  } catch (error) {
    console.error(`Failed to fetch section ${req.params.type}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update a section item (protected)
router.put('/items/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { content, isVisible } = req.body;

    const updateData: Record<string, unknown> = {};
    if (content !== undefined) updateData.content = content;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const updated = await prisma.sectionItem.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    console.error(`Failed to update item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create a new section item (protected)
router.post('/items', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sectionId, content, isVisible = true } = req.body;

    // Get the current highest displayOrder for this section
    const lastItem = await prisma.sectionItem.findFirst({
      where: { sectionId },
      orderBy: { displayOrder: 'desc' },
    });
    
    const displayOrder = lastItem ? lastItem.displayOrder + 10 : 10;

    const newItem = await prisma.sectionItem.create({
      data: {
        sectionId,
        content: content || {},
        displayOrder,
        isVisible,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Failed to create item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a section item (protected)
router.delete('/items/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.sectionItem.delete({
      where: { id },
    });

    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error(`Failed to delete item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

