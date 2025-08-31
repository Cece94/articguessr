"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useArtworks } from '../hooks/use-artworks';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { ArtworkGrid } from './artwork-grid';
import { ErrorState } from './error-state';
import { InfiniteScrollTrigger } from './infinite-scroll-trigger';
import { FiltersBar } from './filters-bar';
import { Artwork, Filters } from '@/models';
import { parseFiltersFromSearchParams, getDefaultFilters } from '@/services/filters';

/**
 * Main content component for the Explore page
 * 
 * This component orchestrates:
 * - Artwork data fetching via useArtworks hook
 * - Infinite scroll functionality via useInfiniteScroll hook
 * - Display of artwork grid with loading states
 * - Error handling and retry functionality
 * 
 * The component handles all the complex state management through custom hooks,
 * keeping the component itself focused on rendering the UI.
 */
export function ExploreContent() {
    const searchParams = useSearchParams();
    const [currentFilters, setCurrentFilters] = useState<Filters>(() => {
        const urlFilters = parseFiltersFromSearchParams(searchParams);
        return Object.keys(urlFilters).length > 0 ? { ...getDefaultFilters(), ...urlFilters } : getDefaultFilters();
    });

    // Sync filters when URL changes
    useEffect(() => {
        const urlFilters = parseFiltersFromSearchParams(searchParams);
        const newFilters = Object.keys(urlFilters).length > 0 ? { ...getDefaultFilters(), ...urlFilters } : getDefaultFilters();
        setCurrentFilters(newFilters);
    }, [searchParams]);

    // Hook for managing artwork data and pagination
    const {
        artworks,      // Array of loaded artworks
        isLoading,     // Initial loading state
        isLoadingMore, // Loading more items state (infinite scroll)
        error,         // Error message if something went wrong
        hasMore,       // Whether there are more pages to load
        loadMore,      // Function to load next page
        retry          // Function to retry after error
    } = useArtworks({ filters: currentFilters });

    // Hook for infinite scroll functionality
    const { triggerRef } = useInfiniteScroll({
        hasMore,                    // Whether there are more items to load
        isLoading: isLoadingMore,   // Prevent loading while already loading
        onLoadMore: loadMore        // Function to call when trigger is visible
    });

    /**
     * Handles clicking on an artwork card
     * Currently just logs the artwork, but will open a detail modal in future features
     */
    const handleArtworkClick = (artwork: Artwork) => {
        // TODO: Open detail modal in future feature
        console.log('Artwork clicked:', artwork.title);
    };

    // Show error state if initial load failed and no artworks are loaded
    if (error && artworks.length === 0) {
        return <ErrorState error={error} onRetry={retry} />;
    }

    return (
        <div className="space-y-6">
            {/* Filters bar */}
            <FiltersBar />

            {/* Main artwork grid with loading states */}
            <ArtworkGrid
                artworks={artworks}
                onArtworkClick={handleArtworkClick}
                isLoading={isLoading}
                loadingMore={isLoadingMore}
            />

            {/* Invisible trigger element for infinite scroll */}
            <InfiniteScrollTrigger
                ref={triggerRef}
                hasMore={hasMore}
            />

            {/* End of collection message */}
            {!hasMore && artworks.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        You&apos;ve reached the end of the collection
                    </p>
                </div>
            )}

            {/* Error while loading more (partial failure) */}
            {error && artworks.length > 0 && (
                <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                        {error}
                    </p>
                    <button
                        onClick={retry}
                        className="text-primary hover:text-primary/80 underline underline-offset-4"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}
