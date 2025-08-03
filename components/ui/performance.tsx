import React, { useMemo, useCallback, memo } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';

// Memoized component wrapper
export function withMemo<T extends object>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Performance hook for expensive calculations
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// Optimized list component
export function OptimizedList<T>({
  data,
  renderItem,
  keyExtractor,
  ...props
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  [key: string]: any;
}) {
  const memoizedRenderItem = useCallback(renderItem, []);

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
      {...props}
    />
  );
}

// Lazy loading hook
export function useLazyLoad<T>(
  data: T[],
  pageSize: number = 10
) {
  const [visibleCount, setVisibleCount] = React.useState(pageSize);

  const visibleData = useMemo(() => data.slice(0, visibleCount), [data, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + pageSize, data.length));
  }, [data.length, pageSize]);

  const hasMore = visibleCount < data.length;

  return { visibleData, loadMore, hasMore, totalCount: data.length };
}

// Debounced hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled hook
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRun = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, delay - (Date.now() - lastRun.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<any>,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(Date.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (__DEV__) {
      console.log(`${componentName} rendered ${renderCount.current} times, ${timeSinceLastRender}ms since last render`);
    }
  });

  return { renderCount: renderCount.current };
}
