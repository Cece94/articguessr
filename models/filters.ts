import { ArtworkType } from './artwork-type';
import { CultureOrStyle } from './culture-or-style';

// Filter parameters
export interface Filters {
    artworkType?: ArtworkType;
    cultureOrStyle?: CultureOrStyle;
    page?: number;
    limit?: number;
}
