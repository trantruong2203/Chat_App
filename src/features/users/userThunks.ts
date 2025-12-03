import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllUsers, getUserOnline, login, register, updatePassword, updateUser } from "./userApi";
import type { LoginRequest, LoginResponse, UserResponse } from "../../interface/UserResponse";
import { AxiosError } from "axios";


// Lấy tất cả user
export const getUsers = createAsyncThunk<UserResponse[], void, { rejectValue: string }>(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllUsers();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);

// Lấy user theo email
export const getUserByAccount = createAsyncThunk<UserResponse, string, { rejectValue: string }>(
  'user/getUserByAccount',
  async (email, { rejectWithValue }) => {
    try {
      return await getUserByAccount(email);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);

// Đăng nhập
export const loginUser = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  'user/login',
  async (account, { rejectWithValue }) => {
    try {
      return await login(account);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);

// Đăng ký
export const createUser = createAsyncThunk<UserResponse, UserResponse, { rejectValue: string }>(
  'user/create',
  async (account, { rejectWithValue }) => {
    try {
      const response = await register(account);
      return response;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);

// Cập nhật user
export const updateUserThunk = createAsyncThunk<UserResponse, {email: string, account: UserResponse}, { rejectValue: string }>(
  'user/update',
  async ({email, account}, { rejectWithValue }) => {
    try {
      return await updateUser(account.username, account.birthday, account.phone, account.gender, email, account.status, account.avatar);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);
export const updatePasswordThunk = createAsyncThunk<UserResponse, {email: string, password: string}, { rejectValue: string }>(
  'user/updatePassword',
  async ({email, password}, { rejectWithValue }) => {
    try {
      return await updatePassword(email, password);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);

export const fetchUserOnlineThunk = createAsyncThunk<UserResponse[], void, { rejectValue: string }>(
  'user/fetchUserOnline',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserOnline();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        return rejectWithValue(err.response.data.message || 'Lỗi từ server');
      }
      return rejectWithValue('Lỗi không xác định');
    }
  }
);