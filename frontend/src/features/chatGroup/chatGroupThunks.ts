import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { createChatGroup, deleteChatGroup, fetchAllChatGroups, fetchChatGroupById, updateChatGroup } from "./chatGroupApi";
import type { ApiResponse } from "./chatGroupApi";
import type { ChatGroup } from "../../interface/UserResponse";

export const getChatGroups = createAsyncThunk<ChatGroup[], void, { rejectValue: string }>(
    'chatgroup/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllChatGroups();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getChatGroupById = createAsyncThunk<ChatGroup, number, { rejectValue: string }>(
    'chatgroup/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchChatGroupById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const createdChatGroup = createAsyncThunk<ApiResponse, ChatGroup, { rejectValue: string }>(
    'chatgroup/create',
    async (chatGroup, { rejectWithValue }) => {
      try {
        return await createChatGroup(chatGroup);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const updatedChatGroup = createAsyncThunk<ApiResponse, { id: number; chatGroup: ChatGroup }, { rejectValue: string }>(
    'chatgroup/update',
    async ({ id, chatGroup }, { rejectWithValue }) => {
      try {
        return await updateChatGroup(id, chatGroup);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedChatGroup = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'chatgroup/delete',
    async (id, { rejectWithValue }) => {
      try {
        return await deleteChatGroup(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );