import { Router } from "express";
import { getAllPostImagesController, getPostImageByIdController, createPostImageController, updatePostImageController, deletePostImageController } from "../controllers/PostImage.controller";

const router = Router();

router.get('/post/:postid', getAllPostImagesController);
router.get('/:id', getPostImageByIdController);
router.post('/', createPostImageController);
router.put('/:id', updatePostImageController);
router.delete('/:id', deletePostImageController);

export default router;