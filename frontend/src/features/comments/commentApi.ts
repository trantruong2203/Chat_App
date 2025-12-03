import axios from "axios";
import type { Comment, CommentCreateRequest } from "../../interface/Comment";
import { mapBackendCommentsToFrontend } from "../../utils/commentMapper";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: Comment;
}

export const fetchAllComments = async () : Promise<Comment[]> => {
    const response = await axios.get(`${API}/comment`, {
        withCredentials: true
    });
    return mapBackendCommentsToFrontend(response.data.data);
};

export const fetchCommentsByPostId = async (postid: number) : Promise<Comment[]> => {
    const response = await axios.get(`${API}/comment/post/${postid}`, {
        withCredentials: true
    });
    return mapBackendCommentsToFrontend(response.data.data);
};

export const createComment = async (comment: CommentCreateRequest) : Promise<ApiResponse> => {
    const response = await axios.post(`${API}/comment`, comment
    , {
        withCredentials: true
    });
    return response.data;
};

export const updateComment = async (id: number, comment: Comment) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/comment/${id}`, 
        comment
    , {
        withCredentials: true
    });
    return response.data;
};

export const deleteComment = async (commentId: number, userid: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/comment/${commentId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: { userid },
        withCredentials: true
    });
    return response.data;
};

export const countComment = async (postid: number) : Promise<number> => {
    const response = await axios.get(`${API}/comment/post/${postid}/count`, {
        withCredentials: true
    });
    return response.data.data.count;
};
