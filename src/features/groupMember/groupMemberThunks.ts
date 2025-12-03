import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { ApiResponse } from "./groupMemberAPI";
import type { GroupMember } from "../../interface/UserResponse";
import { createGroupMember, deleteGroupMember, fetchAllGroupMembers, fetchGroupMemberById, updateGroupMember } from "./groupMemberAPI";

export const getGroupMembers = createAsyncThunk<GroupMember[], void, { rejectValue: string }>(
    'groupmember/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllGroupMembers();
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data) {
                return rejectWithValue(err.response.data.message || 'Lỗi từ server');
            }
            return rejectWithValue('Lỗi không xác định');
        }
    }
);

export const getGroupMemberById = createAsyncThunk<GroupMember, number, { rejectValue: string }>(
    'groupmember/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchGroupMemberById(id);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data) {
                return rejectWithValue(err.response.data.message || 'Lỗi từ server');
            }
            return rejectWithValue('Lỗi không xác định');
        }
    }
);

export const createdGroupMember = createAsyncThunk<ApiResponse, GroupMember, { rejectValue: string }>(
    'groupmember/create',
    async (groupMember, { rejectWithValue }) => {
        try {
            return await createGroupMember(groupMember);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data) {
                return rejectWithValue(err.response.data.message || 'Lỗi từ server');
            }
            return rejectWithValue('Lỗi không xác định');
        }
    }
);

export const updatedGroupMember = createAsyncThunk<ApiResponse, { id: number; groupMember: GroupMember }, { rejectValue: string }>(
    'groupmember/update',
    async ({ id, groupMember }, { rejectWithValue }) => {
        try {
            return await updateGroupMember(id, groupMember);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data) {
                return rejectWithValue(err.response.data.message || 'Lỗi từ server');
            }
            return rejectWithValue('Lỗi không xác định');
        }
    }
);

export const deletedGroupMember = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'groupmember/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteGroupMember(id);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.data) {
                return rejectWithValue(err.response.data.message || 'Lỗi từ server');
            }
            return rejectWithValue('Lỗi không xác định');
        }
    }
);