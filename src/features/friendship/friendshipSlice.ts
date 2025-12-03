import { createSlice } from "@reduxjs/toolkit";
import type { FriendShip } from "../../interface/UserResponse";
import { createdFriendShip, deletedFriendShip, getFriendShips, updatedFriendShip } from "./friendshipThunks";

interface FriendShipState {
  items: FriendShip[];
  friendShip: {
    userid: number;
    sentat: number;
    status: boolean;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const innerValue = {
  userid: 0,
  sentat: 0,
  status: false,
};

const friendshipSlice = createSlice({
  name: 'friendship',
  initialState: {
    items: [] as FriendShip[],
    friendShip: innerValue,
    status: 'idle',
    error: null as string | null,
  } as FriendShipState,
  reducers: {
    handleChange: (state, action) => {
      state.friendShip = action.payload;
    },
    setFriendShip: (state, action) => {
      state.friendShip = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getFriendShips.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFriendShips.fulfilled, (state, action) => {
        state.items = action.payload as FriendShip[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getFriendShips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      .addCase(createdFriendShip.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createdFriendShip.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // UPDATE
      .addCase(updatedFriendShip.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (friendship) => friendship.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedFriendShip.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedFriendShip.fulfilled, (state, action) => {
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
      .addCase(deletedFriendShip.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
  }
});

export const { handleChange, setFriendShip } = friendshipSlice.actions;
export default friendshipSlice.reducer;