import { Request, Response } from "express";
import { 
    createComment, 
    deleteComment, 
    getAllComments, 
    getCommentById, 
    getCommentsByPostId,
    getCommentReplies,
    updateComment,
    getCommentCount
} from "../services/Comment.service";

export const getCommentsController = async (req: Request, res: Response) => {
    try {
        const data = await getAllComments();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const getCommentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID comment không hợp lệ"
            });
        }

        const data = await getCommentById(parseInt(id));
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment không tồn tại"
            });
        }

        res.json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const getCommentsByPostIdController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        
        if (!postId || isNaN(parseInt(postId))) {
            return res.status(400).json({
                success: false,
                message: "ID post không hợp lệ"
            });
        }

        const data = await getCommentsByPostId(parseInt(postId));
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const getCommentRepliesController = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        
        if (!commentId || isNaN(parseInt(commentId))) {
            return res.status(400).json({
                success: false,
                message: "ID comment không hợp lệ"
            });
        }

        const data = await getCommentReplies(parseInt(commentId));
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const createCommentController = async (req: Request, res: Response) => {
  try {
    const { userid, postid, content, createdat, iconid, imgurl, commentid } = req.body;
    // Validation cơ bản
    if (!userid || !postid) {
      return res.status(400).json({
        success: false,
        message: "userid và postid là bắt buộc"
      });
    }

    // Cho phép: phải có ít nhất content (sau khi trim) hoặc imgurl
    const hasText = typeof content === 'string' && content.trim().length > 0;
    const hasImage = typeof imgurl === 'string' && imgurl.trim().length > 0;
    if (!hasText && !hasImage) {
      return res.status(400).json({
        success: false,
        message: "Cần có nội dung hoặc ảnh cho comment"
      });
    }

    const commentData = {
      userid: parseInt(userid),
      postid: parseInt(postid),
      content: hasText ? content.trim() : '',
      createdat: createdat ,
      iconid: iconid || undefined,
      imgurl: hasImage ? imgurl : undefined,
      commentid: commentid || undefined
    };

    const data = await createComment(
      commentData.userid,
      commentData.postid,
      commentData.content,
      commentData.createdat,
      commentData.iconid,
      commentData.imgurl,
      commentData.commentid
    );
    res.status(201).json({
      success: true,
      message: 'Comment được tạo thành công',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const updateCommentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userid, content, iconid, imgurl } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID comment không hợp lệ"
            });
        }

        if (!userid) {
            return res.status(400).json({
                success: false,
                message: "userid là bắt buộc"
            });
        }

        const fieldsToUpdate: any = {};
        if (content !== undefined) {
            if (typeof content !== 'string' || content.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nội dung comment không được để trống"
                });
            }
            fieldsToUpdate.content = content.trim();
        }
        if (iconid !== undefined) fieldsToUpdate.iconid = parseInt(iconid);
        if (imgurl !== undefined) fieldsToUpdate.imgurl = imgurl;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không có thông tin nào để cập nhật"
            });
        }

        const data = await updateComment(parseInt(id), parseInt(userid), fieldsToUpdate);
        res.status(200).json({
            success: true,
            message: 'Comment được cập nhật thành công',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const deleteCommentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userid } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "ID comment không hợp lệ"
            });
        }

        if (!userid) {
            return res.status(400).json({
                success: false,
                message: "userid là bắt buộc"
            });
        }

        const data = await deleteComment(parseInt(id), parseInt(userid));
        res.status(200).json({
            success: true,
            message: 'Comment đã được xóa thành công',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};

export const getCommentCountController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        
        if (!postId || isNaN(parseInt(postId))) {
            return res.status(400).json({
                success: false,
                message: "ID post không hợp lệ"
            });
        }

        const count = await getCommentCount(parseInt(postId));
        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};