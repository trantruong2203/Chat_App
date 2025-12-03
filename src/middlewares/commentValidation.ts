import { Request, Response, NextFunction } from 'express';
import { 
    createCommentSchema, 
    updateCommentSchema, 
    deleteCommentSchema,
    commentIdSchema,
    postIdSchema
} from '../validations/commentSchema';

export const validateCreateComment = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = createCommentSchema.validate(req.body);
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    
    next();
};

export const validateUpdateComment = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = updateCommentSchema.validate(req.body);
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    
    next();
};

export const validateDeleteComment = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = deleteCommentSchema.validate(req.body);
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    
    next();
};

export const validateCommentId = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = commentIdSchema.validate({ id: parseInt(req.params.id) });
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    
    next();
};

export const validatePostId = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = postIdSchema.validate({ postId: parseInt(req.params.postId) });
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    
    next();
};

export const validateCommentIdForReplies = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = commentIdSchema.validate({ id: parseInt(req.params.commentId) });
    
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message.replace('ID comment', 'ID comment để lấy replies')
        });
        return;
    }
    
    next();
}; 