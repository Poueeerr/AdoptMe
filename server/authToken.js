import { Router } from 'express';
import authMiddleware from './middlewares/authMiddleware.js';

const router = Router();

router.get('/validate', authMiddleware, async (req, res) => {
  return res.json({ valid: true });
});

export default router;