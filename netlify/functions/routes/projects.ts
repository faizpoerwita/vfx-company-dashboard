import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Your projects logic here
    res.json({ message: 'Projects route working' });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
