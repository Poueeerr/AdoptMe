import express from 'express';
import postsController from '../controllers/postsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/getPage/:page', postsController.getPostsPage);
router.post('/create', authMiddleware, postsController.createPost)
router.get('/postSize', postsController.getSize) 
router.get('/getUserInfo/:postId', postsController.getUserInfo);

export default router;