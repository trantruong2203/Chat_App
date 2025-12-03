import { createSlice } from '@reduxjs/toolkit';
import { createUser, fetchUserOnlineThunk, getUsers, loginUser, updatePasswordThunk, updateUserThunk } from './userThunks';
import type { LoginResponse, UserResponse } from '../../interface/UserResponse';


interface UserState {
  items: UserResponse[];
  user: {
    username: string;
    password: string;
    email: string;
    phone: string;
    gender?: string;
    birthday?: string; // Chuyển từ Date? sang string?
    avatar?: string;
    status?: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchKeyword: string;
  userOnline: UserResponse[];
}

const innerValue = {
  username: '',
  password: '',
  email: '',
  phone: '',
  gender: '',
  birthday: undefined,
  avatar: '',
  status: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    items: [] as UserResponse[],
    user: innerValue, 
    status: 'idle',
    error: null as string | null,
    searchKeyword: '',
    userOnline: [] as UserResponse[],
  } as UserState,
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    handleChange: (state, action) => {
      state.user = action.payload;   
    }, 
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.items = action.payload as UserResponse[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })

      // CREATE
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload as UserResponse);
        }
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })

      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        const userData = action.payload as LoginResponse;
        state.user = {
          ...state.user,
          username: userData.username || '',
          email: userData.email || '',
          password: userData.password || '',
          phone: userData.phone || '',
          gender: userData.gender || '',
          birthday: userData.birthday ? (typeof userData.birthday === 'string' ? userData.birthday : new Date(userData.birthday).toISOString()) : undefined,
          avatar: userData.avatar || '',
          status: userData.status || 0,
        };

        state.error = null; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })

      // UPDATE
      .addCase(updateUserThunk.fulfilled, (state, action) => {            
        const index = state.items.findIndex(
          (user) => user.email === action.payload.email
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
        console.log(state.items);
        console.log(action.payload);
      })
    
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })

      // UPDATE PASSWORD
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })

      // FETCH USER ONLINE
      .addCase(fetchUserOnlineThunk.fulfilled, (state, action) => {
        state.items = action.payload as UserResponse[];
      })
      .addCase(fetchUserOnlineThunk.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
  },
});

export const { setSearchKeyword , handleChange, setUser } = userSlice.actions;
export default userSlice.reducer;