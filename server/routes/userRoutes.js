import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.getAll);

router.post('/register', userController.create);
router.post('/login', userController.login)

router.get(`/id/:id`, userController.getById);
router.get('/email', userController.getByEmail);


export default router;