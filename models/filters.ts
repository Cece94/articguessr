// Filter parameters
export interface Filters {
    period?: {
        start: number;
        end: number;
    };
    movements?: string[];
    artist?: string;
    sort?: 'recent' | 'oldest';
    page?: number;
    limit?: number;
}
