import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Your users logic here
    res.json({ message: 'Users route working' });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
