import * as CommentModel from "../models/Comment.model";
import { Comment } from "../types/interface";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAllComments = async (): Promise<Comment[]> => {
    try {
        return await CommentModel.getAllComments();
    } catch (error) {
        throw new Error(`Error fetching comments: ${error}`);
    }
};

export const getCommentById = async (id: number): Promise<Comment[]> => {
    try {
        return await CommentModel.getCommentById(id);
    } catch (error) {
        throw new Error(`Error fetching comment: ${error}`);
    }
};

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
    try {
        return await CommentModel.getCommentsByPostId(postId);
    } catch (error) {
        throw new Error(`Error fetching comments for post: ${error}`);
    }
};

export const getCommentReplies = async (commentId: number): Promise<Comment[]> => {
    try {
        return await CommentModel.getCommentReplies(commentId);
    } catch (error) {
        throw new Error(`Error fetching comment replies: ${error}`);
    }
};

export const createComment = async (
    userid: number, 
    postid: number, 
    content: string, 
    createdat: string,
    iconid?: number,
    imgurl?: string,
    commentid?: number
): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await CommentModel.createComment(
            userid,
            postid,
            content,
            createdat,
            iconid,
            imgurl,
            commentid
        );
        resolve({ userid,
            postid,
            content,
            createdat,
            iconid,
            imgurl,
            commentid});
        } catch (error) {
            reject(error);
        }
    });
};

export const updateComment = async (
    id: number, 
    userId: number,
    fieldsToUpdate: Partial<{
        content: string;
        iconid: number;
        imgurl: string;
    }>
): Promise<any> => {
    try {
        // Check if user owns the comment
        const isOwner = await CommentModel.checkCommentOwnership(id, userId);
        if (!isOwner) {
            throw new Error('Bạn không có quyền chỉnh sửa comment này');
        }

        return await CommentModel.updateCommentDynamic(id, fieldsToUpdate);
    } catch (error) {
        throw new Error(`Error updating comment: ${error}`);
    }
};

export const deleteComment = async (id: number, userId: number): Promise<any> => {
    try {
        // Check if user owns the comment
        const isCommentOwner = await CommentModel.checkCommentOwnership(id, userId);
        
        if (!isCommentOwner) {
            // If not comment owner, check if user owns the post
            const comment = await CommentModel.getCommentById(id);
            if (comment.length === 0) {
                throw new Error('Comment không tồn tại');
            }
            
            const isPostOwner = await CommentModel.checkPostOwnership(comment[0].postid, userId);
            if (!isPostOwner) {
                throw new Error('Bạn không có quyền xóa comment này');
            }
        }

        return await CommentModel.deleteComment(id);
    } catch (error) {
        throw new Error(`Error deleting comment: ${error}`);
    }
};

export const getCommentCount = async (postId: number): Promise<number> => {
    try {
        return await CommentModel.getCommentCount(postId);
    } catch (error) {
        throw new Error(`Error getting comment count: ${error}`);
    }
};