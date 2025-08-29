"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchArtworks } from '@/services/aic';
import { Artwork } from '@/models';

/**
 * Return type for the useArtworks hook
 */
interface UseArtworksReturn {
    /** Array of loaded artworks */
    artworks: Artwork[];
    /** Whether the initial load is in progress */
    isLoading: boolean;
    /** Whether additional items are being loaded (infinite scroll) */
    isLoadingMore: boolean;
    /** Error message if something went wrong, null if no error */
    error: string | null;
    /** Whether there are more pages available to load */
    hasMore: boolean;
    /** Function to load the next page of artworks */
    loadMore: () => void;
    /** Function to retry after an error */
    retry: () => void;
}

/**
 * Custom hook for managing artwork data with infinite scroll functionality
 * 
 * This hook handles:
 * - Initial data loading with loading states
 * - Infinite scroll pagination
 * - Error handling with retry functionality
 * - Deduplication of artworks by ID
 * - Filtering of artworks with valid images
 * 
 * @returns Object containing artworks data, loading states, and control functions
 */
/**
 * Simple persistence helper for artwork state
 */
const STORAGE_KEY = 'explore-artworks-state';

interface PersistedState {
    artworks: Artwork[];
    page: number;
    hasMore: boolean;
    timestamp: number;
}

const saveToStorage = (artworks: Artwork[], page: number, hasMore: boolean) => {
    try {
        const state: PersistedState = {
            artworks,
            page,
            hasMore,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save artworks state:', error);
    }
};

const loadFromStorage = (): PersistedState | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const state: PersistedState = JSON.parse(stored);
        // Only use cached data if it's less than 10 minutes old
        const maxAge = 10 * 60 * 1000; // 10 minutes
        if (Date.now() - state.timestamp > maxAge) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return state;
    } catch (error) {
        console.warn('Failed to load artworks state:', error);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Ignore cleanup errors
        }
        return null;
    }
};

export function useArtworks(): UseArtworksReturn {
    // State for the loaded artworks array - start with empty array (consistent SSR/client)
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    // Loading state for initial data load
    const [isLoading, setIsLoading] = useState(true);
    // Loading state for additional pages (infinite scroll)
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // Error state - contains error message or null
    const [error, setError] = useState<string | null>(null);
    // Current page number for pagination
    const [page, setPage] = useState(1);
    // Whether there are more pages available to load
    const [hasMore, setHasMore] = useState(true);
    // Track if we've already tried to restore from localStorage
    const [hasAttemptedRestore, setHasAttemptedRestore] = useState(false);
    // Prevent multiple concurrent loadMore calls
    const isLoadingMoreRef = useRef(false);

    /**
     * Core function to load artworks from the API
     * 
     * @param pageNum - The page number to load (1-based)
     * @param append - Whether to append to existing artworks (true) or replace them (false)
     */
    const loadArtworks = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            // Set appropriate loading state based on whether this is initial or additional load
            if (pageNum === 1) {
                setIsLoading(true);    // Show initial loading skeletons
                setError(null);        // Clear any previous errors
            } else {
                setIsLoadingMore(true); // Show loading more skeletons
            }

            console.log(`Loading artworks page ${pageNum}...`);

            // Fetch artworks from the API with pagination
            const response = await fetchArtworks({
                page: pageNum,
                limit: 20,        // Load 20 artworks per page
                sort: 'recent'    // Sort by most recent first
            });

            // Filter out artworks without valid images (required for display)
            const validArtworks = response.data.filter(artwork =>
                artwork.imageId && artwork.imageUrl
            );

            console.log(`Loaded ${validArtworks.length} valid artworks`);

            // Update pagination state
            setPage(pageNum);
            // Check if there are more pages available
            const newHasMore = response.pagination.current_page < response.pagination.total_pages;
            setHasMore(newHasMore);

            // Update artworks state based on whether we're appending or replacing
            if (append) {
                // Append mode: add new artworks to existing ones (infinite scroll)
                setArtworks(prev => {
                    // Create a set of existing IDs to prevent duplicates
                    const existingIds = new Set(prev.map(a => a.id));
                    // Filter out any artworks we already have
                    const newArtworks = validArtworks.filter(a => !existingIds.has(a.id));
                    // Return combined array
                    const updatedArtworks = [...prev, ...newArtworks];

                    // Save to localStorage with updated state
                    saveToStorage(updatedArtworks, pageNum, newHasMore);

                    return updatedArtworks;
                });
            } else {
                // Replace mode: replace all artworks (initial load or retry)
                setArtworks(validArtworks);
                // Save to localStorage
                saveToStorage(validArtworks, pageNum, newHasMore);
            }

        } catch (err) {
            console.error('Failed to load artworks:', err);
            setError('Failed to load artworks. Please try again.');
        } finally {
            // Always clear loading states when done
            setIsLoading(false);
            setIsLoadingMore(false);
            // Clear the concurrent loading protection
            isLoadingMoreRef.current = false;
        }
    }, []);

    /**
 * Function to load the next page of artworks (for infinite scroll)
 * Only loads if not already loading, there are more pages, and no error
 */
    const loadMore = useCallback(() => {
        // Extra protection against concurrent calls
        if (isLoadingMoreRef.current) {
            console.log('loadMore: already loading, skipping');
            return;
        }

        if (!isLoadingMore && hasMore && !error) {
            console.log('loadMore: triggering page', page + 1);
            isLoadingMoreRef.current = true;
            loadArtworks(page + 1, true); // Load next page and append to existing
        }
    }, [page, isLoadingMore, hasMore, error, loadArtworks]);

    /**
     * Function to retry loading after an error
     * Clears the error state and restarts from page 1
     */
    const retry = useCallback(() => {
        setError(null);
        loadArtworks(1, false); // Start fresh from page 1
    }, [loadArtworks]);

    // Restore state from localStorage on client-side only (prevents hydration mismatch)
    useEffect(() => {
        if (hasAttemptedRestore) return;

        const restoredState = loadFromStorage();
        if (restoredState) {
            console.log('Restoring state from localStorage:', restoredState.artworks.length, 'artworks');
            setArtworks(restoredState.artworks);
            setPage(restoredState.page);
            setHasMore(restoredState.hasMore);
            setIsLoading(false); // Don't show loading if we have restored data
        }

        setHasAttemptedRestore(true);
    }, [hasAttemptedRestore]);

    // Load initial data when the hook is first used (only if no restored state)
    useEffect(() => {
        if (!hasAttemptedRestore) return; // Wait for restore attempt first

        // Only load from API if we don't have any artworks (no restored state)
        if (artworks.length === 0) {
            loadArtworks(1, false); // Load first page, replace any existing data
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAttemptedRestore]); // Trigger after restore attempt

    return {
        artworks,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
        retry
    };
}
