import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { sendPostImage, deletePostImage, fetchAllPostImages, fetchPostImageById, updatePostImage, fetchLastPostImagesByPostId } from "./postImgApi";
import type { ApiResponse } from "./postImgApi";
import type {  PostImage } from "../../interface/UserResponse";

export const getPostImages = createAsyncThunk<PostImage[], number, { rejectValue: string }>(
    'postimage/fetchAll',
    async (postid, { rejectWithValue }) => {
      try {
        return await fetchAllPostImages(postid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getPostImageById = createAsyncThunk<PostImage, number, { rejectValue: string }>(
    'postimage/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchPostImageById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const sendPostImageThunk = createAsyncThunk<ApiResponse, { postid: number; imgurl: string }, { rejectValue: string }>(
    'postimage/create',
    async ({ postid, imgurl }, { rejectWithValue }) => {
      try {
        return await sendPostImage(postid, imgurl);
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

  export const updatedPostImage = createAsyncThunk<ApiResponse, { id: number; postImage: PostImage }, { rejectValue: string }>(
    'postimage/update',
    async ({ id, postImage }, { rejectWithValue }) => {
      try {
        return await updatePostImage(id, postImage.postid, postImage.imgurl);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedPostImage = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'postimage/delete',
    async (id, { rejectWithValue }) => {
      try {
        return await deletePostImage(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const fetchLastPostImagesByPostIdThunk = createAsyncThunk<PostImage[], number, { rejectValue: string }>(
    'postimage/fetchLastPostImagesByPostId',
    async (postid, { rejectWithValue }) => {
      try {
        return await fetchLastPostImagesByPostId(postid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );