import { createSlice } from "@reduxjs/toolkit";
import type { Comment } from "../../interface/Comment";
import { countedComment, createdComment, deletedComment, getComments, getCommentsByPostId, updatedComment } from "./commentThunks";

interface CommentState {
  items: Comment[];
  comment: {
    userid: number;
    postid: number;
    createdat: string;
    iconid: number;
    content: string;
    imageurl: string;
    commentid: number;
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
  content: '',
  imageurl: '',
  commentid: 0,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    items: [] as Comment[],
    comment: innerValue,
    count: 0,
    status: 'idle',
    error: null as string | null,
  } as CommentState,
  reducers: {
    handleChange: (state, action) => {
      state.comment = action.payload;
    },
    setComment: (state, action) => {
      state.comment = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      // CREATE
      .addCase(createdComment.fulfilled, (state, action) => {
        // Ensure state.items is always an array
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items.push(action.payload.data);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createdComment.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(createdComment.pending, (state) => {
        state.status = 'loading';
      })
      // UPDATE
      .addCase(updatedComment.fulfilled, (state, action) => {
        // Ensure state.items is always an array
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const index = state.items.findIndex(
          (comment) => comment.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedComment.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedComment.fulfilled, (state, action) => {
        // Ensure state.items is always an array
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        const { postid, userid } = action.meta.arg;
        if (postid && userid) {
          state.items = state.items.filter(item => !(item.postId === postid && item.userId === userid));
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deletedComment.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // COUNT
      .addCase(countedComment.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(countedComment.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(countedComment.pending, (state) => {
        state.status = 'loading';
      })
      // GET BY POST ID
      .addCase(getCommentsByPostId.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getCommentsByPostId.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(getCommentsByPostId.pending, (state) => {
        state.status = 'loading';
      })
  }
});

export const { handleChange, setComment } = commentSlice.actions;
export default commentSlice.reducer;