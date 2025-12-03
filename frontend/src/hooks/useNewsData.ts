import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
  source: {
    name: string;
  };
  creator?: string[];
  content?: string;
  keywords?: string[];
}

interface UseNewsDataReturn {
  newsArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
}

export const useNewsData = (): UseNewsDataReturn => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch news with error handling and caching
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have cached news data (less than 30 minutes old)
      const cachedNews = localStorage.getItem('newsData');
      const cachedTimestamp = localStorage.getItem('newsTimestamp');

      if (cachedNews && cachedTimestamp) {
        const now = Date.now();
        const cacheTime = parseInt(cachedTimestamp);
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

        if (now - cacheTime < thirtyMinutes) {
          setNewsArticles(JSON.parse(cachedNews));
          setLoading(false);
          return;
        }
      }

      // TODO: Move API key to environment variables for security
      // For now, using a proxy endpoint would be better
      const API_KEY = 'pub_63633974f3d34ad5b714aadead5a327b';
      const response = await axios.get(
        `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=news&country=vi`,
        {
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data && response.data.results) {
        const articles = response.data.results.slice(0, 10) || [];
        setNewsArticles(articles);

        // Cache the results
        localStorage.setItem('newsData', JSON.stringify(articles));
        localStorage.setItem('newsTimestamp', Date.now().toString());
      } else {
        throw new Error('Không có dữ liệu tin tức');
      }
    } catch (err) {
      console.error('Lỗi khi lấy tin tức:', err);

      // Try to use cached data as fallback
      const cachedNews = localStorage.getItem('newsData');
      if (cachedNews) {
        setNewsArticles(JSON.parse(cachedNews));
        setError('Đang hiển thị tin tức đã lưu (không thể tải tin mới)');
      } else {
        setNewsArticles([]);
        setError('Không thể tải tin tức. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh news function
  const refreshNews = useCallback(() => {
    // Clear cache and fetch fresh data
    localStorage.removeItem('newsData');
    localStorage.removeItem('newsTimestamp');
    fetchNews();
  }, [fetchNews]);

  // Load news on mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    newsArticles,
    loading,
    error,
    refreshNews
  };
};