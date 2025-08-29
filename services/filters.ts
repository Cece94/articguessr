import { Filters } from '@/models';

/**
 * Build URL search parameters from filters object
 */
export function buildQueryFromFilters(filters: Filters): URLSearchParams {
    const params = new URLSearchParams();

    // Period filter
    if (filters.period) {
        params.set('period_start', filters.period.start.toString());
        params.set('period_end', filters.period.end.toString());
    }

    // Movements filter
    if (filters.movements && filters.movements.length > 0) {
        // Join multiple movements with comma
        params.set('movements', filters.movements.join(','));
    }

    // Artist filter
    if (filters.artist && filters.artist.trim()) {
        params.set('artist', filters.artist.trim());
    }

    // Sort filter
    if (filters.sort && filters.sort !== 'recent') {
        params.set('sort', filters.sort);
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

/**
 * Parse URL search parameters into filters object
 */
export function parseFiltersFromSearchParams(searchParams: URLSearchParams): Filters {
    const filters: Filters = {};

    // Period filter
    const periodStart = searchParams.get('period_start');
    const periodEnd = searchParams.get('period_end');
    if (periodStart && periodEnd) {
        const start = parseInt(periodStart, 10);
        const end = parseInt(periodEnd, 10);
        if (!isNaN(start) && !isNaN(end)) {
            filters.period = { start, end };
        }
    }

    // Movements filter
    const movementsParam = searchParams.get('movements');
    if (movementsParam) {
        const movements = movementsParam
            .split(',')
            .map(m => m.trim())
            .filter(m => m.length > 0);
        if (movements.length > 0) {
            filters.movements = movements;
        }
    }

    // Artist filter
    const artist = searchParams.get('artist');
    if (artist && artist.trim()) {
        filters.artist = artist.trim();
    }

    // Sort filter
    const sort = searchParams.get('sort');
    if (sort === 'oldest') {
        filters.sort = 'oldest';
    } else {
        filters.sort = 'recent'; // default
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

/**
 * Update URL with current filters (for browser history)
 */
export function updateUrlWithFilters(filters: Filters, pathname: string = '/explore'): string {
    const params = buildQueryFromFilters(filters);
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Reset filters to default state
 */
export function getDefaultFilters(): Filters {
    return {
        sort: 'recent',
        page: 1,
        limit: 20,
    };
}

/**
 * Check if filters have any active values (not default)
 */
export function hasActiveFilters(filters: Filters): boolean {
    return !!(
        filters.period ||
        (filters.movements && filters.movements.length > 0) ||
        (filters.artist && filters.artist.trim()) ||
        (filters.sort && filters.sort !== 'recent')
    );
}
