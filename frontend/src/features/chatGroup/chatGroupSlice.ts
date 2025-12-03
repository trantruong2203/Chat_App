import { createSlice } from "@reduxjs/toolkit";
import type { ChatGroup } from "../../interface/UserResponse";
import { createdChatGroup, deletedChatGroup, getChatGroups, updatedChatGroup } from "./chatGroupThunks";

interface ChatGroupState {
  items: ChatGroup[];
  chatGroup: {
    name: string;
    avatar: string;
    creatorid: number;
    createdat: string;
    status: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
  error: string | null;
}

const innerValue = {
  name: '',
  avatar: '',
  creatorid: 0,
  createdat: '',
  status: 0,
};

const chatGroupSlice = createSlice({
  name: 'chatgroup',
  initialState: {
    items: [] as ChatGroup[],
    chatGroup: innerValue,
    status: 'idle',
    error: null as string | null,
  } as ChatGroupState,
  reducers: {
    handleChange: (state, action) => {
      state.chatGroup = action.payload;
    },
    setChatGroup: (state, action) => {
      state.chatGroup = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getChatGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getChatGroups.fulfilled, (state, action) => {
        state.items = action.payload as ChatGroup[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getChatGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      // CREATE
      .addCase(createdChatGroup.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        state.status = 'succeeded';
        state.error = null;
      })
      
      
      .addCase(createdChatGroup.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(createdChatGroup.pending, (state) => {
        state.status = 'loading';
      })
      // UPDATE
      .addCase(updatedChatGroup.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (chatGroup) => chatGroup.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedChatGroup.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedChatGroup.fulfilled, (state, action) => {
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
      .addCase(deletedChatGroup.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
  }
});

export const { handleChange, setChatGroup } = chatGroupSlice.actions;
export default chatGroupSlice.reducer;