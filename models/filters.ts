import { ArtworkType } from './artwork-type';
import { CultureOrStyle } from './culture-or-style';

// Year range filter
export interface YearRange {
    start: number;
    end: number;
}

// Filter parameters
export interface Filters {
    artworkType?: ArtworkType;
    cultureOrStyle?: CultureOrStyle;
    yearRange?: YearRange;
    page?: number;
    limit?: number;
}
