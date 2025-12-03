import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import {
  countedFavoritePost,
  createdFavoritePost,
  deletedFavoritePost,
  getFavoritePosts
} from '../features/favoritePost/favoritePostThunks';
import type { FavoritePost } from '../interface/UserResponse';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface UseFavoritesReturn {
  favoriteCounts: { [postId: number]: number | undefined };
  isFavorite: (postId: number) => boolean;
  handleLike: (postId: number) => Promise<void>;
  isLoading: boolean;
  isPostLoading: (postId: number) => boolean;
}

export const useFavorites = (currentUserId: number | undefined, postIds: number[]): UseFavoritesReturn => {
  const dispatch = useAppDispatch();
  const favoritePosts = useAppSelector((state) => state.favoritePost.items);
  const [favoriteCounts, setFavoriteCounts] = useState<{ [postId: number]: number }>({});
  const [isLoading, setIsLoading] = useState<{ [postId: number]: boolean }>({});
  
  const isFavorite = useCallback((postId: number) => {
    if (!currentUserId) return false;
    return favoritePosts.some(item => item.postid === postId && item.userid === currentUserId);
  }, [favoritePosts, currentUserId]);

  const loadFavoriteCounts = useCallback(async (postIdsToLoad: number[]) => {
    if (postIdsToLoad.length === 0) return;

    try {
      const countPromises = postIdsToLoad.map(async (postId) => {
        try {
          const count = await dispatch(countedFavoritePost(postId)).unwrap();
          return { postId, count };
        } catch (error) {
          console.error(`Error loading favorite count for post ${postId}:`, error);
          return { postId, count: 0 };
        }
      });

      const results = await Promise.all(countPromises);

      const newCounts: { [postId: number]: number } = {};
      results.forEach(({ postId, count }) => {
        newCounts[postId] = count;
      });

      setFavoriteCounts(prev => ({ ...prev, ...newCounts }));
    } catch (err) {
      console.error('Error loading favorite counts:', err);
    }
  }, [dispatch]);

  // Load favorite counts for new post IDs
  useEffect(() => {
    const newPostIds = postIds.filter(id => !(id in favoriteCounts));
    if (newPostIds.length > 0) {
      loadFavoriteCounts(newPostIds);
    }
  }, [postIds, favoriteCounts, loadFavoriteCounts]);

  // Load user's favorite posts when user changes
  useEffect(() => {
    if (currentUserId) {
      dispatch(getFavoritePosts());
    }
  }, [dispatch, currentUserId]);

  const handleLike = useCallback(async (postId: number) => {
    if (!currentUserId) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    // Prevent multiple clicks while processing
    if (isLoading[postId]) {
      return;
    }

    setIsLoading(prev => ({ ...prev, [postId]: true }));

    const isCurrentlyFavorite = isFavorite(postId);
    const currentCount = favoriteCounts[postId] || 0;

    try {
      if (isCurrentlyFavorite) {
        // Unlike: delete favorite post
        await dispatch(deletedFavoritePost({ postid: postId, userid: currentUserId })).unwrap();
        
        // Update count locally after successful deletion
        setFavoriteCounts(prev => ({
          ...prev,
          [postId]: Math.max(0, currentCount - 1)
        }));
      } else {
        // Like: create favorite post
        const favoritePost: FavoritePost = {
          id: 0,
          userid: currentUserId,
          postid: postId,
          createdat: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          iconid: null
        };

        await dispatch(createdFavoritePost(favoritePost)).unwrap();
        
        // Update count locally after successful creation
        setFavoriteCounts(prev => ({
          ...prev,
          [postId]: currentCount + 1
        }));
      }

      // Refresh favorite posts list to ensure consistency
      await dispatch(getFavoritePosts());
      
      // Refresh count from server to ensure accuracy
      const updatedCount = await dispatch(countedFavoritePost(postId)).unwrap();
      setFavoriteCounts(prev => ({
        ...prev,
        [postId]: updatedCount
      }));

    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Có lỗi xảy ra khi thích bài viết');
      
      // Revert count on error
      setFavoriteCounts(prev => ({
        ...prev,
        [postId]: currentCount
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [postId]: false }));
    }
  }, [currentUserId, isFavorite, dispatch, favoriteCounts, isLoading]);

  return {
    favoriteCounts,
    isFavorite,
    handleLike,
    isLoading: Object.values(isLoading).some(loading => loading),
    isPostLoading: (postId: number) => isLoading[postId] || false,
  };
};