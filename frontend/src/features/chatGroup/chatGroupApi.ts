import axios from "axios";
import type { ChatGroup } from "../../interface/UserResponse";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: ChatGroup;
}

export const fetchAllChatGroups = async () : Promise<ChatGroup[]> => {
    const response = await axios.get(`${API}/chatgroup`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchChatGroupById = async (id: number) : Promise<ChatGroup> => {
    const response = await axios.get(`${API}/chatgroup/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createChatGroup = async (chatGroup: ChatGroup) : Promise<ApiResponse> => {
    const response = await axios.post(`${API}/chatgroup`, chatGroup
    , {
        withCredentials: true
    });
    return response.data;
};

export const updateChatGroup = async (id: number, chatGroup: ChatGroup) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/chatgroup/${id}`, 
        chatGroup
    , {
        withCredentials: true
    });
    return response.data;
};

export const deleteChatGroup = async (id: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/chatgroup/${id}`, {
        withCredentials: true
    });
    return response.data;
};