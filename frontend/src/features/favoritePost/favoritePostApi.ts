import axios from "axios";
import type { FavoritePost } from "../../interface/UserResponse";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: FavoritePost;
}

export const fetchAllFavoritePosts = async () : Promise<FavoritePost[]> => {
    const response = await axios.get(`${API}/favoritepost`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchFavoritePostById = async (id: number) : Promise<FavoritePost> => {
    const response = await axios.get(`${API}/favoritepost/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createFavoritePost = async (favoritePost: FavoritePost) : Promise<ApiResponse> => {
    const response = await axios.post(`${API}/favoritepost`, favoritePost
    , {
        withCredentials: true
    });
    return response.data;
};

export const updateFavoritePost = async (id: number, favoritePost: FavoritePost) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/favoritepost/${id}`, 
        favoritePost
    , {
        withCredentials: true
    });
    return response.data;
};

export const deleteFavoritePost = async (postid: number, userid: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/favoritepost/${postid}/${userid}`, {
        withCredentials: true
    });
    return response.data;
};

export const countFavoritePost = async (postid: number) : Promise<number> => {
    const response = await axios.get(`${API}/favoritepost/count/${postid}`, {
        withCredentials: true
    });
    return response.data;
};
