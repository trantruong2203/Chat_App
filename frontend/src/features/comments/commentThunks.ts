import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { countComment, createComment, deleteComment, fetchAllComments, fetchCommentsByPostId, updateComment } from "./commentApi";
import type { ApiResponse } from "./commentApi";
import type { Comment, CommentCreateRequest } from "../../interface/Comment";

export const getComments = createAsyncThunk<Comment[], void, { rejectValue: string }>(
    'comment/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllComments();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getCommentsByPostId = createAsyncThunk<Comment[], number, { rejectValue: string }>(
    'comment/fetchByPostId',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchCommentsByPostId(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );



  export const createdComment = createAsyncThunk<ApiResponse, CommentCreateRequest, { rejectValue: string }>(
    'comment/create',
    async (comment, { rejectWithValue }) => {
      try {
        return await createComment(comment);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const updatedComment = createAsyncThunk<ApiResponse, { id: number; comment: Comment }, { rejectValue: string }>(
    'comment/update',
    async ({ id, comment }, { rejectWithValue }) => {
      try {
        return await updateComment(id, comment);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedComment = createAsyncThunk<ApiResponse, { postid: number, userid: number }, { rejectValue: string }>(
    'comment/delete',
    async ({ postid, userid }, { rejectWithValue }) => {
      try {
        return await deleteComment(postid, userid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const countedComment = createAsyncThunk<number, number, { rejectValue: string }>(
    'comment/count',
    async (postid, { rejectWithValue }) => {
      try {
        return await countComment(postid);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );