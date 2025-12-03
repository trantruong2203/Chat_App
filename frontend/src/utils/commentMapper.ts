import type { Comment } from '../interface/Comment';

// Backend comment interface
interface BackendComment {
  id: number;
  userid: number;
  postid: number;
  content: string;
  iconid?: number;
  imgurl?: string;
  commentid?: number;
  createdat: string;
  updatedat?: string;
  username?: string;
  avatar?: string;
}

// Map backend comment data to frontend Comment interface
export const mapBackendCommentToFrontend = (backendComment: BackendComment): Comment => {
  return {
    id: backendComment.id,
    postId: backendComment.postid,
    postid: backendComment.postid,
    userId: backendComment.userid,
    parentId: backendComment.commentid,
    content: backendComment.content,
    createdAt: backendComment.createdat,
    updatedAt: backendComment.updatedat,
    isDeleted: false,
    favoriteCount: 0,
    isFavorite: false,
    replies: [],
    level: 0,
    imgUrl: backendComment.imgurl
  };
};

// Map array of backend comments to frontend format
export const mapBackendCommentsToFrontend = (backendComments: BackendComment[]): Comment[] => {
  return backendComments.map(mapBackendCommentToFrontend);
};

// Build nested comment structure from flat array
export const buildCommentTree = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!;
    
    if (comment.parentId) {
      // This is a reply
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.replies!.push(mappedComment);
      }
    } else {
      // This is a root comment
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
}; 