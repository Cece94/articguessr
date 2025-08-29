"use client";

import { useState } from 'react';
import { ArtworkTypeFilter } from './artwork-type-filter';
import { ArtworkType, Filters } from '@/models';

interface FiltersBarProps {
    onFiltersChange: (filters: Filters) => void;
}

export function FiltersBar({ onFiltersChange }: FiltersBarProps) {
    const [artworkType, setArtworkType] = useState<ArtworkType | undefined>();

    const handleArtworkTypeChange = (newArtworkType: ArtworkType | undefined) => {
        setArtworkType(newArtworkType);
        onFiltersChange({
            artworkType: newArtworkType,
            page: 1, // Reset to first page when filter changes
            limit: 20
        });
    };

    const handleClearFilters = () => {
        setArtworkType(undefined);
        onFiltersChange({
            page: 1,
            limit: 20
        });
    };

    const hasActiveFilters = !!artworkType;

    return (
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
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
