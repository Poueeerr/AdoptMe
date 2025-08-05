import express from 'express';
import postsController from '../controllers/postsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/getPage/:page', postsController.getPostsPage);
router.post('/create', authMiddleware, upload.array('files'), postsController.createPost)
router.get('/postSize', postsController.getSize) 
router.get('/getUserInfo/:postId', postsController.getUserInfo);
router.get("/filter", postsController.getPostsFiltered);

export default router;