"use client";

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Configuration props for the infinite scroll hook
 */
interface UseInfiniteScrollProps {
    /** Whether there are more items to load */
    hasMore: boolean;
    /** Whether a loading operation is currently in progress */
    isLoading: boolean;
    /** Callback function to trigger when more items should be loaded */
    onLoadMore: () => void;
    /** Intersection threshold (0.0 to 1.0) - how much of the trigger element must be visible */
    threshold?: number;
    /** Root margin for the intersection observer - triggers before element is fully visible */
    rootMargin?: string;
}

/**
 * Custom hook for implementing infinite scroll functionality using IntersectionObserver
 * 
 * This hook provides a clean way to implement infinite scroll by:
 * 1. Creating an IntersectionObserver that watches a trigger element
 * 2. Calling onLoadMore when the trigger becomes visible
 * 3. Handling cleanup and re-initialization when dependencies change
 * 
 * @param props - Configuration object for the infinite scroll behavior
 * @returns Object containing the triggerRef to attach to the trigger element
 */
export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 0.1,
    rootMargin = '100px'
}: UseInfiniteScrollProps) {
    // Ref to store the IntersectionObserver instance
    const observerRef = useRef<IntersectionObserver | null>(null);
    // Ref to be attached to the trigger element in the DOM
    const triggerRef = useRef<HTMLDivElement | null>(null);
    // Track if this is the initial mount to prevent immediate triggers
    const [isInitialMount, setIsInitialMount] = useState(true);

    /**
     * Handles intersection events from the IntersectionObserver
     * Only triggers onLoadMore if:
     * - The trigger element is intersecting (visible)
     * - There are more items to load (hasMore)
     * - No loading operation is in progress (isLoading)
     */
    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;

        console.log('IntersectionObserver triggered:', {
            isIntersecting: entry.isIntersecting,
            hasMore,
            isLoading,
            isInitialMount
        });

        // Prevent immediate trigger on initial mount (especially after refresh with restored state)
        if (entry.isIntersecting && hasMore && !isLoading && !isInitialMount) {
            console.log('Infinite scroll triggered, loading more...');
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore, isInitialMount]);

    /**
     * Effect to set up and manage the IntersectionObserver
     * 
     * This effect:
     * 1. Cleans up any existing observer
     * 2. Creates a new observer with the current settings
     * 3. Attaches the observer to the trigger element
     * 4. Returns a cleanup function to disconnect the observer
     * 
     * The effect re-runs when the intersection handler or observer settings change
     */
    useEffect(() => {
        // Clean up previous observer to prevent memory leaks
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer with current configuration
        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold,    // How much of the element must be visible (0.1 = 10%)
            rootMargin    // Margin around the root (100px = trigger 100px before visible)
        });

        // Start observing the trigger element if it exists
        if (triggerRef.current && observerRef.current) {
            observerRef.current.observe(triggerRef.current);
            console.log('InfiniteScroll observer attached');
        }

        // Clear initial mount flag after a longer delay to prevent immediate triggers on page refresh
        // This prevents the browser's scroll restoration from immediately triggering infinite scroll
        // Extra time needed when localStorage restores a lot of content
        const timer = setTimeout(() => {
            console.log('InfiniteScroll: enabling after delay');
            setIsInitialMount(false);
        }, 2000);

        // Cleanup function to disconnect observer and clear timer when effect reruns or component unmounts
        return () => {
            clearTimeout(timer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleIntersection, threshold, rootMargin]);

    // Return the ref that should be attached to the trigger element
    return { triggerRef };
}
