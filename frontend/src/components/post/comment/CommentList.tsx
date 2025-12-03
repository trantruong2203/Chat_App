import React from 'react';
import { List } from 'antd';
import type { Comment } from '../../../interface/Comment';
import CommentItem from './CommentItem';
import './CommentList.css';
import type { UserResponse } from '../../../interface/UserResponse';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd';

interface CommentListProps {
  comments: Comment[];
  items: UserResponse[];
  currentUserId?: number;
  maxLevel?: number;
  handleCommentReply: (commentId: number, content: string) => void;
  handleImageSelect?: (info: UploadChangeParam<UploadFile>) => void;
  handleRemoveImage?: (index: number) => void;
  previewImages?: string[];
  selectedImages?: File[];
  uploadFileList?: UploadFile[];
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  items,
  currentUserId,
  maxLevel = 3,
  handleCommentReply,
  handleImageSelect,
  handleRemoveImage,
  previewImages,
  selectedImages,
  uploadFileList,
}) => {
  // Flatten nested comments for rendering
  const flattenComments = (comments: Comment[], level: number = 0): Comment[] => {
    const result: Comment[] = [];
    
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      
      // Add current comment with level
      result.push({ ...comment, level });
      
      // Add replies recursively if they exist and we haven't reached max level
      if (comment.replies && comment.replies.length > 0 && level < maxLevel) {
        const childComments = flattenComments(comment.replies, level + 1);
        for (let j = 0; j < childComments.length; j++) {
          result.push(childComments[j]);
        }
      }
    }
    
    return result;
  };

  const flatComments = flattenComments(comments);

  return (
    <List
      className="comment-list"
      dataSource={flatComments}
      style={{ maxWidth: '100%', overflow: 'hidden' }}
      renderItem={(comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          level={comment.level || 0}
          items={items}
          currentUserId={currentUserId}
          maxLevel={maxLevel}
          handleCommentReply={handleCommentReply}
          handleImageSelect={handleImageSelect}
          handleRemoveImage={handleRemoveImage}
          previewImages={previewImages}
          selectedImages={selectedImages}
          uploadFileList={uploadFileList}
        />
      )}
    />
  );
};

export default CommentList;
