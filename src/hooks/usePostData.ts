import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { getPosts } from '../features/post/postThunks';
import { getPostImages } from '../features/postImg/postImgThunks';
import type { Post as PostType } from '../interface/UserResponse';

export interface PostUI extends PostType {
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  images?: string[];
  author?: {
    name: string;
    avatar: string;
  };
  time?: string;
}

interface UsePostDataReturn {
  allPosts: PostUI[];
  postImagesMap: { [postId: number]: string[] };
  loading: boolean;
  error: string | null;
  refreshPosts: () => void;
}

export const usePostData = (
  currentUserId: number | undefined,
  contactIds: number[]
): UsePostDataReturn => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.items);
  const postImages = useAppSelector((state) => state.postImage.items);

  const [allPosts, setAllPosts] = useState<PostUI[]>([]);
  const [postImagesMap, setPostImagesMap] = useState<{ [postId: number]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to track previous post IDs to avoid infinite loop
  const previousPostIdsRef = useRef<number[]>([]);

  // Memoized function to get filtered posts
  const getFilteredPosts = useCallback(() => {
    if (!currentUserId) return [];

    // Filter out current user from contact IDs
    const friendIds = contactIds.filter(id => id !== currentUserId && !isNaN(id));  
    const allUserIds = [...friendIds, currentUserId];
    // Filter posts from friends and current user
    const filteredPosts = posts.filter(item => {
      return allUserIds.map(id => id == item.userid) && item.status === 1;
    });

    // Sort by creation date (newest first)
    return filteredPosts.sort((a, b) =>
      new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
    );
  }, [currentUserId, posts, contactIds]);

  // Batch load post images with caching
  const loadPostImages = useCallback(async (postsToLoad: PostUI[], forceReload = false) => {
    if (postsToLoad.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Load images in parallel with limited concurrency
      const batchSize = 5; // Process 5 posts at a time
      const batches: PostUI[][] = [];

      for (let i = 0; i < postsToLoad.length; i += batchSize) {
        batches.push(postsToLoad.slice(i, i + batchSize));
      }

      const imagesMap: { [postId: number]: string[] } = {};

      for (const batch of batches) {
        const imagePromises = batch.map(async (post) => {
          // Skip if already loaded (unless force reload)
          if (!forceReload && postImagesMap[post.id]) {
            imagesMap[post.id] = postImagesMap[post.id];
            return;
          }

          try {
            const images = await dispatch(getPostImages(post.id)).unwrap();
            imagesMap[post.id] = images.map(img => img.imgurl);
          } catch (error) {
            console.error(`Error loading images for post ${post.id}:`, error);
            imagesMap[post.id] = [];
          }
        });

        await Promise.all(imagePromises);
      }

      setPostImagesMap(prev => ({ ...prev, ...imagesMap }));
    } catch (err) {
      setError('Không thể tải hình ảnh bài viết');
      console.error('Error loading post images:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, postImagesMap]);

  // Debounced image loading
  const debouncedLoadImages = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (postsToLoad: PostUI[], forceReload = false) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        loadPostImages(postsToLoad, forceReload);
      }, 200);
    };
  }, [loadPostImages]);

  // Load posts on mount
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // Update filtered posts when dependencies change
  useEffect(() => {
    const filteredPosts = getFilteredPosts();
    const previousPostIds = previousPostIdsRef.current;
    const newPosts = filteredPosts.filter(post => !previousPostIds.includes(post.id));
    
    setAllPosts(filteredPosts);
    
    // Update the ref with current post IDs
    previousPostIdsRef.current = filteredPosts.map(p => p.id);

    // Load images for all posts, but force reload for new posts
    if (filteredPosts.length > 0) {
      if (newPosts.length > 0) {
        // Force reload for new posts
        console.log(`Phát hiện ${newPosts.length} bài viết mới, force reload images`);
        debouncedLoadImages(filteredPosts, true);
      } else {
        // Normal loading for existing posts
        debouncedLoadImages(filteredPosts);
      }
    }
  }, [getFilteredPosts, debouncedLoadImages]);

  // Cập nhật postImagesMap khi có thay đổi trong postImages store
  useEffect(() => {
    if (postImages.length > 0) {
      const newImagesMap: { [postId: number]: string[] } = {};
      
      postImages.forEach(image => {
        if (image.postid) {
          if (!newImagesMap[image.postid]) {
            newImagesMap[image.postid] = [];
          }
          newImagesMap[image.postid].push(image.imgurl);
        }
      });
      
      // Cập nhật postImagesMap với ảnh mới
      setPostImagesMap(prev => ({ ...prev, ...newImagesMap }));
    }
  }, [postImages]);

  // Refresh function
  const refreshPosts = useCallback(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return {
    allPosts,
    postImagesMap,
    loading,
    error,
    refreshPosts
  };
};