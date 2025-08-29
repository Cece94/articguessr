import { Filters } from '@/models';

/**
 * Build URL search parameters from filters object
 */
export function buildQueryFromFilters(filters: Filters): URLSearchParams {
    const params = new URLSearchParams();

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
        page: 1,
        limit: 20,
    };
}

