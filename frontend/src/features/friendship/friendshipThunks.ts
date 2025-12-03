import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { createFriendShip, deleteFriendShip, fetchAllFriendShips, fetchFriendShipById, updateFriendShip } from "./friendshipAPI";
import type { ApiResponse } from "./friendshipAPI";
import type { FriendShip } from "../../interface/UserResponse";

export const getFriendShips = createAsyncThunk<FriendShip[], void, { rejectValue: string }>(
    'friendship/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        return await fetchAllFriendShips();
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const getFriendShipById = createAsyncThunk<FriendShip, number, { rejectValue: string }>(
    'friendship/fetchById',
    async (id, { rejectWithValue }) => {
      try {
        return await fetchFriendShipById(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const createdFriendShip = createAsyncThunk<ApiResponse, FriendShip, { rejectValue: string }>(
    'friendship/create',
    async (friendship, { rejectWithValue }) => {
      try {
        return await createFriendShip(friendship);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const updatedFriendShip = createAsyncThunk<ApiResponse, { id: number; friendShip: FriendShip }, { rejectValue: string }>(
    'friendship/update',
    async ({ id, friendShip }, { rejectWithValue }) => {
      try {
        return await updateFriendShip(id, friendShip);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );

  export const deletedFriendShip = createAsyncThunk<ApiResponse, number, { rejectValue: string }>(
    'friendship/delete',
    async (id, { rejectWithValue }) => {
      try {
        return await deleteFriendShip(id);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data) {
          return rejectWithValue(err.response.data.message || 'Lỗi từ server');
        }
        return rejectWithValue('Lỗi không xác định');
      }
    }
  );