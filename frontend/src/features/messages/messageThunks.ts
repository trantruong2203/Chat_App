import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { sendMessage, deleteMessage, fetchAllMessages, fetchMessageById, updateMessage, fetchLastMessagesByUserId } from "./messageApi";
import type { ApiResponse } from "./messageApi";
import type {  Message } from "../../interface/UserResponse";

export const getMessages = createAsyncThunk<Message[], void, { rejectValue: string }>(
    'message/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllMessages();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getMessageById = createAsyncThunk<Message, number, { rejectValue: string }>(
    'message/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchMessageById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const sendMessageThunk = createAsyncThunk<ApiResponse, Message, { rejectValue: string }>(
    'message/create',
    async (message, { rejectWithValue }) => {
      try {
        return await sendMessage(message);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          console.error('Chi tiết lỗi:', err.response?.data || err.message);
          return rejectWithValue(err.response?.data?.message || err.message || 'Lỗi từ server');
        }
        console.error('Lỗi không xác định:', err);
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const updatedMessage = createAsyncThunk<ApiResponse, { id: number; message: Message }, { rejectValue: string }>(
    'message/update',
    async ({ id, message }, { rejectWithValue }) => {
      try {
        return await updateMessage(id, message);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedMessage = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'message/delete',
    async (id, { rejectWithValue }) => {
      try {
        return await deleteMessage(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const fetchLastMessagesByUserIdThunk = createAsyncThunk<Message[], number, { rejectValue: string }>(
    'message/fetchLastMessagesByUserId',
    async (userId, { rejectWithValue }) => {
      try {
        return await fetchLastMessagesByUserId(userId);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );