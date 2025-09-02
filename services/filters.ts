/**
 * URL <-> Filters helpers
 *
 * Responsibilities:
 * - Build URLSearchParams from our `Filters` object
 * - Parse URLSearchParams into a `Filters` object
 * - Provide defaults and URL generation helpers
 */
import { Filters, ArtworkType, CultureOrStyle } from '@/models';

/** Convert an in-memory `Filters` object to URLSearchParams for /explore. */
export function buildQueryFromFilters(filters: Filters): URLSearchParams {
    const params = new URLSearchParams();

    // Artwork type filter
    if (filters.artworkType) {
        params.set('artworkType', filters.artworkType);
    }

    // Culture or style filter
    if (filters.cultureOrStyle) {
        params.set('cultureOrStyle', filters.cultureOrStyle);
    }

    // Year range filter
    if (filters.yearRange) {
        params.set('yearStart', filters.yearRange.start.toString());
        params.set('yearEnd', filters.yearRange.end.toString());
    }

    // Pagination
    if (filters.page && filters.page > 1) {
        params.set('page', filters.page.toString());
    }

    if (filters.limit && filters.limit !== 20) {
        params.set('limit', filters.limit.toString());
    }

    return params;
}

/** Parse URLSearchParams from /explore into our `Filters` object. */
export function parseFiltersFromSearchParams(searchParams: URLSearchParams): Filters {
    const filters: Filters = {};

    // Artwork type filter
    const artworkType = searchParams.get('artworkType');
    if (artworkType && Object.values(ArtworkType).includes(artworkType as ArtworkType)) {
        filters.artworkType = artworkType as ArtworkType;
    }

    // Culture or style filter
    const cultureOrStyle = searchParams.get('cultureOrStyle');
    if (cultureOrStyle && Object.values(CultureOrStyle).includes(cultureOrStyle as CultureOrStyle)) {
        filters.cultureOrStyle = cultureOrStyle as CultureOrStyle;
    }

    // Year range filter
    const yearStart = searchParams.get('yearStart');
    const yearEnd = searchParams.get('yearEnd');
    if (yearStart && yearEnd) {
        const start = parseInt(yearStart, 10);
        const end = parseInt(yearEnd, 10);
        if (!isNaN(start) && !isNaN(end)) {
            filters.yearRange = { start, end };
        }
    }

    // Pagination
    const page = searchParams.get('page');
    if (page) {
        const pageNum = parseInt(page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
            filters.page = pageNum;
        }
    }

    const limit = searchParams.get('limit');
    if (limit) {
        const limitNum = parseInt(limit, 10);
        if (!isNaN(limitNum) && limitNum > 0) {
            filters.limit = limitNum;
        }
    }

    return filters;
}

/** Produce a navigable URL (string) for a given `Filters` state. */
export function updateUrlWithFilters(filters: Filters, pathname: string = '/explore'): string {
    const params = buildQueryFromFilters(filters);
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
}

/** Default filters: page 1, limit 20; no active constraints. */
export function getDefaultFilters(): Filters {
    return {
        page: 1,
        limit: 20,
    };
}

