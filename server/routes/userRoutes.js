import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware, userController.getAll);

router.post('/register', userController.create);
router.post('/login', userController.login)

router.get(`/id/:id`,authMiddleware, userController.getById);


export default router;