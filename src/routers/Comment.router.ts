import { RequestHandler, Router } from "express";
import { 
    getCommentsController, 
    createCommentController, 
    updateCommentController, 
    deleteCommentController, 
    getCommentByIdController,
    getCommentsByPostIdController,
    getCommentRepliesController,
    getCommentCountController
} from "../controllers/Comment.controller";
import {
    validateCreateComment,
    validateUpdateComment,
    validateDeleteComment,
    validateCommentId,
    validatePostId,
    validateCommentIdForReplies
} from "../middlewares/commentValidation";

const router = Router();

// Get all comments
router.get('/', getCommentsController);

// Get comment by ID
router.get('/:id',  getCommentByIdController as RequestHandler);

// Get comments by post ID
router.get('/post/:postId', getCommentsByPostIdController as RequestHandler);

// Get replies for a specific comment
router.get('/:commentId/replies', getCommentRepliesController as RequestHandler);

// Get comment count for a post
router.get('/post/:postId/count', getCommentCountController as RequestHandler);

// Create new comment
router.post('/', createCommentController);

// Update comment
router.put('/:id', updateCommentController);

// Delete comment
router.delete('/:id', deleteCommentController);

export default router;