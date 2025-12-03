import { createSlice } from "@reduxjs/toolkit";
import type { GroupMember } from "../../interface/UserResponse";
import { createdGroupMember, deletedGroupMember, getGroupMembers, updatedGroupMember } from "./groupMemberThunks";

interface GroupMemberState {
  items: GroupMember[];
  groupMember: {
    groupid: number;
    userid: number;
    joinedat: string;
    status: number;
  };

  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
  error: string | null;
}

const innerValue = {
  groupid: 0,
  userid: 0,
  joinedat: '',
  status: 0,
};

const groupMemberSlice = createSlice({
  name: 'groupmember',
  initialState: {
    items: [] as GroupMember[],
    groupMember: innerValue,
    status: 'idle',
    error: null as string | null,
  } as GroupMemberState,
  reducers: {
    handleChange: (state, action) => {
      state.groupMember = action.payload;
    },
    setGroupMember: (state, action) => {
      state.groupMember = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getGroupMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getGroupMembers.fulfilled, (state, action) => {
        state.items = action.payload as GroupMember[];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getGroupMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || null;
      })
      // CREATE
      .addCase(createdGroupMember.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createdGroupMember.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(createdGroupMember.pending, (state) => {
        state.status = 'loading';
      })
      // UPDATE
      .addCase(updatedGroupMember.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (groupMember) => groupMember.id === action.payload.data.id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updatedGroupMember.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      // DELETE
      .addCase(deletedGroupMember.fulfilled, (state, action) => {
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
      .addCase(deletedGroupMember.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
  }
});

export const { handleChange, setGroupMember } = groupMemberSlice.actions;
export default groupMemberSlice.reducer;