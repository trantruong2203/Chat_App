import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { sendPost, deletePost, fetchAllPosts, fetchPostById, updatePost, fetchLastPostsByUserId } from "./postApi";
import type { ApiResponse } from "./postApi";
import type {  Post } from "../../interface/UserResponse";

export const getPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
    'post/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllPosts();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getPostById = createAsyncThunk<Post, number, { rejectValue: string }>(
    'post/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchPostById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const sendPostThunk = createAsyncThunk<ApiResponse, Post, { rejectValue: string }>(
    'post/create',
    async (post, { rejectWithValue }) => {
      try {
        return await sendPost(post);
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

  export const updatedPost = createAsyncThunk<ApiResponse, { id: number; post: Post }, { rejectValue: string }>(
    'post/update',
    async ({ id, post }, { rejectWithValue }) => {
      try {
        return await updatePost(id, post);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedPost = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'post/delete',
    async (id, { rejectWithValue }) => {
      try {
        return await deletePost(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const fetchLastPostsByUserIdThunk = createAsyncThunk<Post[], number, { rejectValue: string }>(
    'post/fetchLastPostsByUserId',
    async (userId, { rejectWithValue }) => {
      try {
        return await fetchLastPostsByUserId(userId);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );