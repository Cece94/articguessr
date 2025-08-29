import { Artwork } from "@/models";
import { ArtworkCard } from "./artwork-card";
import { ArtworkSkeleton } from "./artwork-skeleton";

/**
 * Props for the ArtworkGrid component
 */
interface ArtworkGridProps {
    /** Array of artworks to display */
    artworks: Artwork[];
    /** Callback function when an artwork card is clicked */
    onArtworkClick?: (artwork: Artwork) => void;
    /** Whether the initial load is in progress */
    isLoading?: boolean;
    /** Whether additional items are being loaded */
    loadingMore?: boolean;
    /** Number of skeleton placeholders to show during initial loading */
    skeletonCount?: number;
}

/**
 * Responsive grid component for displaying artworks
 * 
 * Features:
 * - Responsive layout: 1 column on mobile, up to 4 on desktop
 * - Initial loading state with skeleton placeholders
 * - Loading more state for infinite scroll
 * - Click handling for artwork interactions
 * 
 * The grid automatically adjusts its layout based on screen size:
 * - Mobile (default): 1 column
 * - Small screens: 2 columns  
 * - Medium screens: 3 columns
 * - Large screens: 4 columns
 */
export function ArtworkGrid({
    artworks,
    onArtworkClick,
    isLoading = false,
    loadingMore = false,
    skeletonCount = 12
}: ArtworkGridProps) {
    // Show skeleton grid during initial loading
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <ArtworkSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main artwork grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artworks.map((artwork) => (
                    <ArtworkCard
                        key={artwork.id}
                        artwork={artwork}
                        onClick={() => onArtworkClick?.(artwork)}
                    />
                ))}
            </div>

            {/* Additional skeletons while loading more items (infinite scroll) */}
            {loadingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ArtworkSkeleton key={`loading-${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
