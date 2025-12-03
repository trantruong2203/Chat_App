import axios from "axios";
import type { Post } from "../../interface/UserResponse";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: Post & {
    id?: number;
  };
}

export const fetchAllPosts = async () : Promise<Post[]> => {
    const response = await axios.get(`${API}/post`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchPostById = async (id: number) : Promise<Post> => {
    const response = await axios.get(`${API}/post/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const sendPost = async (post: Post) : Promise<ApiResponse> => {
    const response = await axios.post(`${API}/post`, post, {
        withCredentials: true
    });
    return response.data;
};

export const updatePost = async (id: number, post: Post) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/post/${id}`, 
        post
    , {
        withCredentials: true
    });
    return response.data;
};

export const deletePost = async (id: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/post/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchLastPostsByUserId = async (userId: number) : Promise<Post[]> => {
    try {
        const response = await axios.get(`${API}/post/last-posts?userId=${userId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching last posts:', error);
        throw error;
    }
};