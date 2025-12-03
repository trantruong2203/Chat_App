import { Router } from "express";
import { getAllPostsController, getPostByIdController, createPostController, updatePostController, deletePostController } from "../controllers/Post.controller";

const router = Router();

router.get('/', getAllPostsController);
router.get('/:id', getPostByIdController);
router.post('/', createPostController);
router.put('/:id', updatePostController);
router.delete('/:id', deletePostController);

export default router;