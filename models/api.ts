// Paginated response wrapper
export interface Paginated<T> {
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        total_pages: number;
        current_page: number;
        next_url: string | null;
        prev_url: string | null;
    };
    info: {
        license_text: string;
        license_links: string[];
        version: string;
    };
}

// AIC API response structure
export interface AicApiResponse {
    data: import('./artwork').ArtworkRaw[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        total_pages: number;
        current_page: number;
        next_url: string | null;
        prev_url: string | null;
    };
    info: {
        license_text: string;
        license_links: string[];
        version: string;
    };
}
