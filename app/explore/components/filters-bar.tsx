"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ArtworkTypeFilter } from './artwork-type-filter';
import { ArtworkType } from '@/models';
import { buildQueryFromFilters, parseFiltersFromSearchParams, getDefaultFilters } from '@/services/filters';

export function FiltersBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current filters from URL
    const currentFilters = parseFiltersFromSearchParams(searchParams);
    const artworkType = currentFilters.artworkType;

    const handleArtworkTypeChange = (newArtworkType: ArtworkType | undefined) => {
        const newFilters = {
            ...getDefaultFilters(),
            artworkType: newArtworkType,
        };

        const params = buildQueryFromFilters(newFilters);
        const newUrl = params.toString() ? `/explore?${params.toString()}` : '/explore';
        router.push(newUrl);
    };

    const handleClearFilters = () => {
        router.push('/explore');
    };

    const hasActiveFilters = !!artworkType;

    return (
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ArtworkTypeFilter
                    value={artworkType}
                    onValueChange={handleArtworkTypeChange}
                />
            </div>
        </div>
    );
}
