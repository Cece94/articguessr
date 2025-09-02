/**
 * Filter model types
 *
 * Represents the in-memory state used to build queries and URLs for /explore.
 */
import { ArtworkType } from './artwork-type';
import { CultureOrStyle } from './culture-or-style';

// Year range filter (inclusive bounds)
export interface YearRange {
    start: number;
    end: number;
}

// High-level filter parameters shared by services and UI
export interface Filters {
    artworkType?: ArtworkType;
    cultureOrStyle?: CultureOrStyle;
    yearRange?: YearRange;
    page?: number;
    limit?: number;
}
