import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Your tasks logic here
    res.json({ message: 'Tasks route working' });
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
