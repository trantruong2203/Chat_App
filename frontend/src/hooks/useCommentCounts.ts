import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from './index';
import { countedComment } from '../features/comments/commentThunks';

interface UseCommentCountsReturn {
  commentCounts: { [postId: number]: number };
  refreshPostCount: (postId: number) => Promise<void>;
}

export function useCommentCounts(postIds: number[]): UseCommentCountsReturn {
  const dispatch = useAppDispatch();
  const [commentCounts, setCommentCounts] = useState<{ [postId: number]: number }>({});

  const refreshPostCount = useCallback(async (postId: number) => {
    try {
      const count = await dispatch(countedComment(postId)).unwrap();
      setCommentCounts(prev => ({ ...prev, [postId]: count }));
    } catch {
      // ignore
    }
  }, [dispatch]);

  const loadCounts = useCallback(async (idsToLoad: number[]) => {
    if (idsToLoad.length === 0) return;

    try {
      const tasks = idsToLoad.map(async (postId) => {
        try {
          const count = await dispatch(countedComment(postId)).unwrap();
          return { postId, count };
        } catch {
          return { postId, count: 0 };
        }
      });
      const results = await Promise.all(tasks);
      const merged: { [postId: number]: number } = {};
      results.forEach(({ postId, count }) => { merged[postId] = count; });
      setCommentCounts(prev => ({ ...prev, ...merged }));
    } catch {
      // ignore
    }
  }, [dispatch]);

  useEffect(() => {
    const newIds = postIds.filter(id => !(id in commentCounts));
    if (newIds.length > 0) {
      loadCounts(newIds);
    }
  }, [postIds, loadCounts, commentCounts]);

  return { commentCounts, refreshPostCount };
} 