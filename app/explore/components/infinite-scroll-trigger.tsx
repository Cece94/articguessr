"use client";

import { forwardRef } from 'react';

/**
 * Props for the InfiniteScrollTrigger component
 */
interface InfiniteScrollTriggerProps {
    /** Whether there are more items to load */
    hasMore: boolean;
}

/**
 * Invisible trigger element for infinite scroll functionality
 * 
 * This component renders an invisible element that serves as the trigger point
 * for infinite scroll. When this element becomes visible in the viewport,
 * it signals that more content should be loaded.
 * 
 * Key features:
 * - Invisible to users (visibility: hidden)
 * - Always present when hasMore is true
 * - Provides a stable target for IntersectionObserver
 * - Accessible (aria-hidden for screen readers)
 * 
 * @param hasMore - Whether there are more items to load
 * @param ref - Forwarded ref to be used by IntersectionObserver
 */
export const InfiniteScrollTrigger = forwardRef<HTMLDivElement, InfiniteScrollTriggerProps>(
    ({ hasMore }, ref) => {
        // Don't render if there are no more items to load
        if (!hasMore) return null;

        return (
            <div
                ref={ref}
                className="h-4 w-full"
                style={{ visibility: 'hidden' }} // Invisible but takes up space
                aria-hidden="true"                // Hidden from screen readers
            />
        );
    }
);

// Set display name for React DevTools
InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger';
