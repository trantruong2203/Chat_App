import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';
import friendshipReducer from '../features/friendship/friendshipSlice';
import messageReducer from '../features/messages/messageSlice';
import chatGroupReducer from '../features/chatGroup/chatGroupSlice';
import groupMemberReducer from '../features/groupMember/groupMemberSlice';
import postReducer from '../features/post/postSlice';
import favoritePostReducer from '../features/favoritePost/favoritePostSlice';
import postImageReducer from '../features/postImg/postSlice';
import commentReducer from '../features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    friendship: friendshipReducer,
    message: messageReducer,
    chatGroup: chatGroupReducer,
    groupMember: groupMemberReducer,
    post: postReducer,
    favoritePost: favoritePostReducer,
    postImage: postImageReducer,
    comment: commentReducer,
  },
});

// Khai báo các kiểu type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
