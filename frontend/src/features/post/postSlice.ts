import { createSlice } from "@reduxjs/toolkit";
import type { Post } from "../../interface/UserResponse";
import { sendPostThunk, deletedPost, getPosts, updatedPost } from "./postThunks";

interface PostState {
  items: Post[];
  lastPosts: Post[];
  post: {
    id: number;
    userid: number;
    content: string;
    sentat: string;
    status: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const innerValue = {
  id: 0,
  userid: 0,
  content: '',
  sentat: new Date().toISOString(),
  status: 0,
};

const postSlice = createSlice({
  name: 'post',
  initialState: {
    items: [] as Post[],
    lastPosts: [] as Post[],
    post: innerValue,
    status: 'idle',
    error: null as string | null,
  } as PostState,
  reducers: {
    handleChange: (state, action) => {
      state.post = action.payload;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.items = action.payload as Post[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })

      // CREATE
      .addCase(sendPostThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendPostThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload.data);
          state.status = 'succeeded';
        }
        state.error = null;
      })
      .addCase(sendPostThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      
      // UPDATE
      .addCase(updatedPost.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (post) => post.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedPost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedPost.fulfilled, (state, action) => {
        const idToDelete = action.meta.arg;
        if (idToDelete) {
          const newItems = state.items.filter(item => {
            const result = item.id !== idToDelete;
            return result;
          });
          state.items = newItems;
        }
        state.error = null;
      })
      .addCase(deletedPost.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      
  }
});

export const { handleChange, setPost } = postSlice.actions;
export default postSlice.reducer;