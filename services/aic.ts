import { Artwork, ArtworkRaw, Filters, Paginated, AicApiResponse } from '@/models';

const AIC_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

// Required fields for the API
const REQUIRED_FIELDS = [
    'id',
    'image_id',
    'title',
    'artist_title',
    'date_display',
    'date_start',
    'date_end',
    'style_title',
    'department_title',
    'medium_display',
    'is_public_domain',
    'thumbnail'
];

/**
 * Compute decade from a year by flooring to the nearest decade
 */
export function computeDecade(year: number): number {
    return Math.floor(year / 10) * 10;
}

/**
 * Generate IIIF image URL from image_id
 */
export function generateImageUrl(imageId: string): string {
    return `https://www.artic.edu/iiif/2/${imageId}/full/600,/0/default.jpg`;
}

/**
 * Get primary year from artwork (prefer date_end, fallback to date_start)
 */
export function getPrimaryYear(artwork: ArtworkRaw): number | null {
    return artwork.date_end ?? artwork.date_start;
}

/**
 * Map raw artwork from API to normalized Artwork model
 */
export function mapArtwork(raw: ArtworkRaw): Artwork {
    const primaryYear = getPrimaryYear(raw);

    return {
        id: raw.id,
        imageId: raw.image_id || '',
        title: raw.title,
        artist: raw.artist_title,
        dateDisplay: raw.date_display,
        dateStart: raw.date_start,
        dateEnd: raw.date_end,
        movement: raw.style_title, // mapped from style_title
        department: raw.department_title,
        medium: raw.medium_display,
        // Derived fields
        imageUrl: raw.image_id ? generateImageUrl(raw.image_id) : '',
        primaryYear,
        decade: primaryYear ? computeDecade(primaryYear) : null,
    };
}

/**
 * Build query parameters for AIC API
 */
function buildApiQuery(filters: Filters = {}): URLSearchParams {
    const params = new URLSearchParams();

    // Always require images
    params.set('has_image', '1');

    // Limit fields to required ones
    params.set('fields', REQUIRED_FIELDS.join(','));

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    // Sorting - default to most recent
    const sort = filters.sort || 'recent';
    if (sort === 'recent') {
        // Sort by date_end descending, then date_start descending
        params.set('sort', '-date_end,-date_start');
    } else if (sort === 'oldest') {
        // Sort by date_start ascending, then date_end ascending
        params.set('sort', 'date_start,date_end');
    }

    // Period filter
    if (filters.period) {
        const { start, end } = filters.period;
        // Filter by date range (using both date_start and date_end)
        params.set('q', `date_start:[${start} TO ${end}] OR date_end:[${start} TO ${end}]`);
    }

    // Movement filter (style_title)
    if (filters.movements && filters.movements.length > 0) {
        const movementQuery = filters.movements
            .map(movement => `"${movement}"`)
            .join(' OR ');
        const existingQuery = params.get('q');
        const combinedQuery = existingQuery
            ? `(${existingQuery}) AND (style_title:(${movementQuery}))`
            : `style_title:(${movementQuery})`;
        params.set('q', combinedQuery);
    }

    // Artist filter
    if (filters.artist) {
        const artistQuery = `artist_title:"${filters.artist}"`;
        const existingQuery = params.get('q');
        const combinedQuery = existingQuery
            ? `(${existingQuery}) AND (${artistQuery})`
            : artistQuery;
        params.set('q', combinedQuery);
    }

    return params;
}

/**
 * Fetch artworks from Art Institute of Chicago API
 */
export async function fetchArtworks(filters: Filters = {}): Promise<Paginated<Artwork>> {
    const queryParams = buildApiQuery(filters);
    const url = `${AIC_BASE_URL}?${queryParams.toString()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`AIC API error: ${response.status} ${response.statusText}`);
        }

        const data: AicApiResponse = await response.json();

        // Map raw artworks to normalized format
        const artworks = data.data.map(mapArtwork);

        return {
            data: artworks,
            pagination: data.pagination,
            info: data.info,
        };
    } catch (error) {
        console.error('Failed to fetch artworks:', error);
        throw new Error('Failed to fetch artworks from Art Institute of Chicago');
    }
}
