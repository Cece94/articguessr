import { ArtworkType } from './artwork-type';

// Filter parameters
export interface Filters {
    artworkType?: ArtworkType;
    page?: number;
    limit?: number;
}
