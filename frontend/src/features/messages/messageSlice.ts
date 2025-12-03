import { createSlice } from "@reduxjs/toolkit";
import type { Message } from "../../interface/UserResponse";
import { sendMessageThunk, deletedMessage, getMessages, updatedMessage, fetchLastMessagesByUserIdThunk } from "./messageThunks";

interface MessageState {
  items: Message[];
  lastMessages: Message[];
  message: {
    id: number;
    senderid: number;
    receiverid: number;
    groupid: number;
    content: string;
    sentat: string;
    status: number;
    messageid: number;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const innerValue = {
  id: 0,
  senderid: 0,
  receiverid: 0,
  groupid: 0,
  content: '',
  sentat: new Date().toISOString(),
  status: 0,
  messageid: 0,
};

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    items: [] as Message[],
    lastMessages: [] as Message[],
    message: innerValue,
    status: 'idle',
    error: null as string | null,
  } as MessageState,
  reducers: {
    handleChange: (state, action) => {
      state.message = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.items = action.payload as Message[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      .addCase(fetchLastMessagesByUserIdThunk.fulfilled, (state, action) => {
        state.lastMessages = action.payload as Message[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchLastMessagesByUserIdThunk.rejected, (state, action) => {  
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      // CREATE
      .addCase(sendMessageThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload.data);
          state.status = 'succeeded';
        }
        state.error = null;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      
      // UPDATE
      .addCase(updatedMessage.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (message) => message.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedMessage.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedMessage.fulfilled, (state, action) => {
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
      .addCase(deletedMessage.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      
  }
});

export const { handleChange, setMessage } = messageSlice.actions;
export default messageSlice.reducer;