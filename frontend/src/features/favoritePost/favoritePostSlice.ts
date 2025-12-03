import { createSlice } from "@reduxjs/toolkit";
import type { FavoritePost } from "../../interface/UserResponse";
import { countedFavoritePost, createdFavoritePost, deletedFavoritePost, getFavoritePosts, updatedFavoritePost } from "./favoritePostThunks";

interface FavoritePostState {
  items: FavoritePost[];
  favoritePost: {
    userid: number;
    postid: number;
    createdat: string;
    iconid: number;
  };
  count: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
  error: string | null;
}

const innerValue = {
  userid: 0,
  postid: 0,
  createdat: '',
  iconid: 0,
};

const favoritePostSlice = createSlice({
  name: 'favoritepost',
  initialState: {
    items: [] as FavoritePost[],
    favoritePost: innerValue,
    count: 0,
    status: 'idle',
    error: null as string | null,
  } as FavoritePostState,
  reducers: {
    handleChange: (state, action) => {
      state.favoritePost = action.payload;
    },
    setFavoritePost: (state, action) => {
      state.favoritePost = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getFavoritePosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFavoritePosts.fulfilled, (state, action) => {
        state.items = action.payload as FavoritePost[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getFavoritePosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      // CREATE
      .addCase(createdFavoritePost.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        state.status = 'succeeded';
        state.error = null;
      })
      
      
      .addCase(createdFavoritePost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(createdFavoritePost.pending, (state) => {
        state.status = 'loading';
      })
      // UPDATE
      .addCase(updatedFavoritePost.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (favoritePost) => favoritePost.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedFavoritePost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedFavoritePost.fulfilled, (state, action) => {
        const { postid, userid } = action.meta.arg;
        if (postid && userid) {
          state.items = state.items.filter(item => !(item.postid === postid && item.userid === userid));
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deletedFavoritePost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // COUNT
      .addCase(countedFavoritePost.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(countedFavoritePost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
  }
});

export const { handleChange, setFavoritePost } = favoritePostSlice.actions;
export default favoritePostSlice.reducer;