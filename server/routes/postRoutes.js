import express from 'express';
import postsController from '../controllers/postsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload, processImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/getPage/:page', postsController.getPostsPage);

router.post(
  '/create',
  authMiddleware,
  upload.array('files'),
  processImages,
  postsController.createPost
);

router.put(
  '/edit/:id',
  authMiddleware,
  upload.array('files'),
  processImages,
  postsController.updatePostController
);

router.get('/postSize', postsController.getSize);
router.get('/getUserInfo/:postId', authMiddleware, postsController.getUserInfo);
router.get('/getByUser/:id', authMiddleware, postsController.getByUser);
router.get('/filter', postsController.getPostsFiltered);
router.delete('/deletePost/:id', authMiddleware, postsController.deletePost);

export default router;
