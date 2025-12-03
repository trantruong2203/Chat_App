import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from './index';

interface UseContactsReturn {
  contacts: number[];
  loading: boolean;
  error: string | null;
}

export const useContacts = (currentUserId: number | undefined): UseContactsReturn => {
  const friendShip = useAppSelector((state) => state.friendship.items);

  const [contacts, setContacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized function to get filtered friendships
  const getFilteredFriendships = useCallback(() => {
    if (!currentUserId) return [];

    try {
      setLoading(true);
      setError(null);

      const filteredFriendships = friendShip.filter(item =>
        (item.sentat == currentUserId || item.userid == currentUserId) &&
        item.status === 0 
      );

      const friendListId = filteredFriendships.map(item => 
        item.userid == currentUserId ? item.sentat : item.userid
      );

      return friendListId;
    } catch (err) {
      setError('Không thể tải danh sách bạn bè');
      console.error('Error filtering friendships:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUserId, friendShip]);

  // Update contacts when dependencies change
  useEffect(() => {
    const friendListId = getFilteredFriendships();
    setContacts(friendListId);
  }, [getFilteredFriendships]);
  return {
    contacts,
    loading,
    error
  };
};