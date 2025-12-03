import { Router } from "express";
import { getAllFavoritePostsController, getFavoritePostByIdController, createFavoritePostController, updateFavoritePostController, deleteFavoritePostController, countFavoritePostController } from "../controllers/FavoritePost.controller";

const router = Router();

router.get('/', getAllFavoritePostsController);
router.get('/:id', getFavoritePostByIdController);
router.post('/', createFavoritePostController);
router.put('/:id', updateFavoritePostController);
router.delete('/:postid/:userid', deleteFavoritePostController);
router.get('/count/:postid', countFavoritePostController);

export default router;