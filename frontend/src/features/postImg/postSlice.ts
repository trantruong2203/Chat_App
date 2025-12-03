import { createSlice } from "@reduxjs/toolkit";
import type { PostImage } from "../../interface/UserResponse";
import { sendPostImageThunk, deletedPostImage, getPostImages, updatedPostImage } from "./postImgThunks";

interface PostState {
  items: PostImage[];
  lastPostImages: PostImage[];
  postImage: {
    id: number;
    postid: number;
    image: string;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const innerValue = {
  id: 0,
  postid: 0,
  image: '',
};

const postImageSlice = createSlice({
  name: 'postimage',
  initialState: {
    items: [] as PostImage[],
    lastPostImages: [] as PostImage[],
    postImage: innerValue,
    status: 'idle',
    error: null as string | null,
  } as PostState,
  reducers: {
    handleChange: (state, action) => {
      state.postImage = action.payload;
    },
    setPostImage: (state, action) => {
      state.postImage = action.payload;
    },
    setLastPostImages: (state, action) => {
      state.lastPostImages = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getPostImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPostImages.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        
        // Merge ảnh mới với ảnh hiện có thay vì ghi đè
        const newImages = action.payload as PostImage[];
        const existingImages = state.items.filter(item => 
          !newImages.some(newImg => newImg.postid === item.postid)
        );
        
        state.items = [...existingImages, ...newImages];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getPostImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })

      // CREATE
      .addCase(sendPostImageThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendPostImageThunk.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        
        if (action.payload && action.payload.data) {
          // Kiểm tra xem ảnh đã tồn tại chưa để tránh duplicate
          const existingIndex = state.items.findIndex(
            item => item.id === action.payload.data.id
          );
          
          if (existingIndex === -1) {
            // Thêm ảnh mới vào state
            state.items.push(action.payload.data);
          } else {
            // Cập nhật ảnh nếu đã tồn tại
            state.items[existingIndex] = action.payload.data;
          }
          
          state.status = 'succeeded';
          state.error = null;
        }
      })
      .addCase(sendPostImageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      
      // UPDATE
      .addCase(updatedPostImage.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (post) => post.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedPostImage.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedPostImage.fulfilled, (state, action) => {
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
      .addCase(deletedPostImage.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      
  }
});

export const { handleChange, setPostImage, setLastPostImages } = postImageSlice.actions;
export default postImageSlice.reducer;