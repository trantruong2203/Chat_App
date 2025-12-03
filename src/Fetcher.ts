import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './stores/store';
import { getUsers } from './features/users/userThunks';
import { ContextAuth } from './contexts/AuthContext';
import { getFriendShips } from './features/friendship/friendshipThunks';
import { getMessages } from './features/messages/messageThunks';
import { getChatGroups } from './features/chatGroup/chatGroupThunks';
import { getGroupMembers } from './features/groupMember/groupMemberThunks';
import { getPosts } from './features/post/postThunks';
import { getFavoritePosts } from './features/favoritePost/favoritePostThunks';
import { getPostImages } from './features/postImg/postImgThunks';
import { getComments } from './features/comments/commentThunks';


function Fetcher() {
    const dispatch = useDispatch<AppDispatch>();
    const { accountLogin } = useContext(ContextAuth);
    useEffect(() => {
        dispatch(getUsers());
        dispatch(getFriendShips());        
        dispatch(getMessages());
        dispatch(getChatGroups());
        dispatch(getGroupMembers());
        dispatch(getPosts());
        dispatch(getFavoritePosts());
        dispatch(getPostImages(1));
        dispatch(getComments());
    }, [dispatch, accountLogin?.email]);
    return null;
}

export default Fetcher;