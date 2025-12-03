import axios from "axios";
import type { GroupMember } from "../../interface/UserResponse";

const API = import.meta.env.VITE_API_URL;

// Định nghĩa interface cho response từ API
export interface ApiResponse {
  message: string;
  data: GroupMember;
}

export const fetchAllGroupMembers = async () : Promise<GroupMember[]> => {
    const response = await axios.get(`${API}/groupmember`, {
        withCredentials: true
    });
    return response.data;
};

export const fetchGroupMemberById = async (id: number) : Promise<GroupMember> => {
    const response = await axios.get(`${API}/groupmember/${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createGroupMember = async (groupMember: GroupMember) : Promise<ApiResponse> => {
    const response = await axios.post(`${API}/groupmember`, groupMember
    , {
        withCredentials: true
    });
    return response.data;
};

export const updateGroupMember = async (id: number, groupMember: GroupMember) : Promise<ApiResponse> => {
    const response = await axios.put(`${API}/groupmember/${id}`, 
        groupMember
    , {
        withCredentials: true
    });
    return response.data;
};

export const deleteGroupMember = async (id: number) : Promise<ApiResponse> => {
    const response = await axios.delete(`${API}/groupmember/${id}`, {
        withCredentials: true
    });
    return response.data;
};