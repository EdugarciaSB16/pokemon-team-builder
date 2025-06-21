import { useEffect } from 'react';

export function useInfiniteScroll({ onLoadMore, isLoading, threshold = 200 }) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const isAtBottom = scrollTop + windowHeight >= docHeight - threshold;

      if (isAtBottom && !isLoading && typeof onLoadMore === 'function') {
        onLoadMore();
      }
    };

    // Trigger once on mount (for short pages)
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, isLoading, threshold]);
}
