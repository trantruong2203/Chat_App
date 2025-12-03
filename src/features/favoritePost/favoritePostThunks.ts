import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { countFavoritePost, createFavoritePost, deleteFavoritePost, fetchAllFavoritePosts, fetchFavoritePostById, updateFavoritePost } from "./favoritePostApi";
import type { ApiResponse } from "./favoritePostApi";
import type { FavoritePost } from "../../interface/UserResponse";

export const getFavoritePosts = createAsyncThunk<FavoritePost[], void, { rejectValue: string }>(
    'favoritepost/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllFavoritePosts();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getFavoritePostById = createAsyncThunk<FavoritePost, number, { rejectValue: string }>(
    'favoritepost/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchFavoritePostById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const createdFavoritePost = createAsyncThunk<ApiResponse, FavoritePost, { rejectValue: string }>(
    'favoritepost/create',
    async (favoritePost, { rejectWithValue }) => {
      try {
        return await createFavoritePost(favoritePost);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const updatedFavoritePost = createAsyncThunk<ApiResponse, { id: number; favoritePost: FavoritePost }, { rejectValue: string }>(
    'favoritepost/update',
    async ({ id, favoritePost }, { rejectWithValue }) => {
      try {
        return await updateFavoritePost(id, favoritePost);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedFavoritePost = createAsyncThunk<ApiResponse, { postid: number, userid: number }, { rejectValue: string }>(
    'favoritepost/delete',
    async ({ postid, userid }, { rejectWithValue }) => {
      try {
        return await deleteFavoritePost(postid, userid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const countedFavoritePost = createAsyncThunk<number, number, { rejectValue: string }>(
    'favoritepost/count',
    async (postid, { rejectWithValue }) => {
      try {
        return await countFavoritePost(postid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );