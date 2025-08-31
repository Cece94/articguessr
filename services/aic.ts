import { Artwork, ArtworkRaw, Filters, Paginated, AicApiResponse } from '@/models';

const AIC_BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const AIC_SEARCH_URL = 'https://api.artic.edu/api/v1/artworks/search';

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

    return params;
}

/**
 * Fetch a random artwork (painting or drawing from 1900 onwards) from Art Institute of Chicago API
 */
export async function fetchRandomArtwork(): Promise<Artwork> {
    // Define painting and drawing types
    const paintingAndDrawingTypes = ['Painting', 'Drawing and Watercolor', 'Miniature Painting'];

    // Try multiple attempts with different strategies
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            // Get a random page number (reduce range for later attempts)
            const maxPage = attempt === 0 ? 50 : attempt === 1 ? 20 : 10;
            const randomPage = Math.floor(Math.random() * maxPage) + 1;

            // Randomly select one of the painting/drawing types
            const randomType = paintingAndDrawingTypes[Math.floor(Math.random() * paintingAndDrawingTypes.length)];

            const searchQuery = {
                query: {
                    bool: {
                        must: [
                            { term: { 'artwork_type_title.keyword': randomType } },
                            { range: { 'date_start': { gte: 1860 } } }
                        ]
                    }
                },
                fields: REQUIRED_FIELDS,
                page: randomPage,
                limit: 1
            };

            const response = await fetch(AIC_SEARCH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchQuery),
            });

            if (!response.ok) {
                throw new Error(`AIC Search API error: ${response.status} ${response.statusText}`);
            }

            const data: AicApiResponse = await response.json();

            if (data.data && data.data.length > 0) {
                return mapArtwork(data.data[0]);
            }

            // If no results, continue to next attempt
            console.log(`Attempt ${attempt + 1}: No artwork found for type "${randomType}" on page ${randomPage}`);

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);

            // If this is the last attempt, try a fallback strategy
            if (attempt === 2) {
                console.log('Trying fallback strategy...');
                return await fetchRandomArtworkFallback();
            }
        }
    }

    // This should never be reached, but just in case
    throw new Error('Failed to fetch random artwork after all attempts');
}

/**
 * Fallback strategy: fetch any artwork with image from regular API
 */
async function fetchRandomArtworkFallback(): Promise<Artwork> {
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const params = new URLSearchParams();
    params.set('has_image', '1');
    params.set('fields', REQUIRED_FIELDS.join(','));
    params.set('page', randomPage.toString());
    params.set('limit', '1');

    const url = `${AIC_BASE_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`AIC API error: ${response.status} ${response.statusText}`);
    }

    const data: AicApiResponse = await response.json();

    if (!data.data || data.data.length === 0) {
        throw new Error('No artwork found even with fallback');
    }

    return mapArtwork(data.data[0]);
}

/**
 * Fetch artworks from Art Institute of Chicago API
 */
export async function fetchArtworks(filters: Filters = {}): Promise<Paginated<Artwork>> {
    // Use search API if any filter is present
    if (filters.artworkType || filters.cultureOrStyle || filters.yearRange) {
        const mustClauses: any[] = [];

        if (filters.artworkType) {
            mustClauses.push({ term: { 'artwork_type_title.keyword': filters.artworkType } });
        }

        if (filters.cultureOrStyle) {
            mustClauses.push({ term: { 'style_title.keyword': filters.cultureOrStyle } });
        }

        if (filters.yearRange) {
            mustClauses.push({ range: { 'date_end': { gte: filters.yearRange.start } } });
            mustClauses.push({ range: { 'date_start': { lte: filters.yearRange.end } } });
        }

        const searchQuery = {
            query: {
                bool: {
                    must: mustClauses
                }
            },
            fields: REQUIRED_FIELDS,
            page: filters.page || 1,
            limit: filters.limit || 20
        };

        try {
            const response = await fetch(AIC_SEARCH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchQuery),
            });

            if (!response.ok) {
                throw new Error(`AIC Search API error: ${response.status} ${response.statusText}`);
            }

            const data: AicApiResponse = await response.json();
            const artworks = data.data.map(mapArtwork);

            return {
                data: artworks,
                pagination: data.pagination,
                info: data.info,
            };
        } catch (error) {
            console.error('Failed to fetch artworks with search:', error);
            throw new Error('Failed to fetch artworks from Art Institute of Chicago');
        }
    }

    // Use regular API when no artwork type filter
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
