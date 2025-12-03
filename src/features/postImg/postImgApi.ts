import axios from "axios";
import type { PostImage } from "../../interface/UserResponse";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: PostImage & {
    id?: number;
  };
}

export const fetchAllPostImages = async (postid: number) : Promise<PostImage[]> => {
    const response = await axios.get(`${API}/postimage/${postid}`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchPostImageById = async (id: number) : Promise<PostImage> => {
    const response = await axios.get(`${API}/postimage/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const sendPostImage = async (postid: number, image: string) : Promise<ApiResponse> => {
        const response = await axios.post(`${API}/postimage`, {postid, imgurl: image}, {
        withCredentials: true
    });
    return response.data;
};

export const updatePostImage = async (id: number, postid: number, image: string) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/postimage/${id}`, 
        {postid, imgurl: image}
    , {
        withCredentials: true
    });
    return response.data;
};

export const deletePostImage = async (id: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/postimage/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchLastPostImagesByPostId = async (postid: number) : Promise<PostImage[]> => {
    try {
        const response = await axios.get(`${API}/postimage/last-postimages?postid=${postid}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching last post images:', error);
        throw error;
    }
};