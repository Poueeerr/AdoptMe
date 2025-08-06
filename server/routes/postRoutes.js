import express from 'express';
import postsController from '../controllers/postsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/getPage/:page', postsController.getPostsPage);
router.post('/create', authMiddleware, upload.array('files'), postsController.createPost)
router.get('/postSize', postsController.getSize) 

router.get('/getUserInfo/:postId', authMiddleware, postsController.getUserInfo);
router.get('/getByUser/:id',authMiddleware, postsController.getByUser);

router.delete('/deletePost/:id',authMiddleware, postsController.deletePost);

router.get("/filter", postsController.getPostsFiltered);
router.put("/edit/:id", authMiddleware, upload.array('files'), postsController.updatePostController);


export default router;