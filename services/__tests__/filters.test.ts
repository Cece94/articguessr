import { describe, it, expect } from 'vitest';
import {
    buildQueryFromFilters,
    parseFiltersFromSearchParams,
    updateUrlWithFilters,
    getDefaultFilters,
    hasActiveFilters
} from '../filters';
import type { Filters } from '@/models';

describe('filters service', () => {
    describe('buildQueryFromFilters', () => {
        it('should build empty params for empty filters', () => {
            const params = buildQueryFromFilters({});
            expect(params.toString()).toBe('');
        });

        it('should build params for period filter', () => {
            const filters: Filters = {
                period: { start: 1800, end: 1900 }
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('period_start')).toBe('1800');
            expect(params.get('period_end')).toBe('1900');
        });

        it('should build params for movements filter', () => {
            const filters: Filters = {
                movements: ['Impressionism', 'Post-Impressionism']
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('movements')).toBe('Impressionism,Post-Impressionism');
        });

        it('should build params for artist filter', () => {
            const filters: Filters = {
                artist: 'Vincent van Gogh'
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('artist')).toBe('Vincent van Gogh');
        });

        it('should handle artist filter with whitespace', () => {
            const filters: Filters = {
                artist: '  Claude Monet  '
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('artist')).toBe('Claude Monet');
        });

        it('should skip empty artist filter', () => {
            const filters: Filters = {
                artist: '   '
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('artist')).toBe(null);
        });

        it('should build params for sort filter (non-default)', () => {
            const filters: Filters = {
                sort: 'oldest'
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('sort')).toBe('oldest');
        });

        it('should skip default sort filter', () => {
            const filters: Filters = {
                sort: 'recent'
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('sort')).toBe(null);
        });

        it('should build params for pagination', () => {
            const filters: Filters = {
                page: 3,
                limit: 50
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('page')).toBe('3');
            expect(params.get('limit')).toBe('50');
        });

        it('should skip default pagination values', () => {
            const filters: Filters = {
                page: 1,
                limit: 20
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('page')).toBe(null);
            expect(params.get('limit')).toBe(null);
        });

        it('should build params for all filters combined', () => {
            const filters: Filters = {
                period: { start: 1850, end: 1900 },
                movements: ['Impressionism'],
                artist: 'Claude Monet',
                sort: 'oldest',
                page: 2,
                limit: 10
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('period_start')).toBe('1850');
            expect(params.get('period_end')).toBe('1900');
            expect(params.get('movements')).toBe('Impressionism');
            expect(params.get('artist')).toBe('Claude Monet');
            expect(params.get('sort')).toBe('oldest');
            expect(params.get('page')).toBe('2');
            expect(params.get('limit')).toBe('10');
        });
    });

    describe('parseFiltersFromSearchParams', () => {
        it('should parse empty params to empty filters', () => {
            const params = new URLSearchParams();
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.sort).toBe('recent'); // default
            expect(filters.period).toBeUndefined();
            expect(filters.movements).toBeUndefined();
            expect(filters.artist).toBeUndefined();
        });

        it('should parse period filter', () => {
            const params = new URLSearchParams('period_start=1800&period_end=1900');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.period).toEqual({ start: 1800, end: 1900 });
        });

        it('should skip invalid period values', () => {
            const params = new URLSearchParams('period_start=invalid&period_end=1900');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.period).toBeUndefined();
        });

        it('should parse movements filter', () => {
            const params = new URLSearchParams('movements=Impressionism,Post-Impressionism,Cubism');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.movements).toEqual(['Impressionism', 'Post-Impressionism', 'Cubism']);
        });

        it('should handle movements with empty values', () => {
            const params = new URLSearchParams('movements=Impressionism,,Post-Impressionism,');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.movements).toEqual(['Impressionism', 'Post-Impressionism']);
        });

        it('should parse artist filter', () => {
            const params = new URLSearchParams('artist=Vincent%20van%20Gogh');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.artist).toBe('Vincent van Gogh');
        });

        it('should parse sort filter', () => {
            const params = new URLSearchParams('sort=oldest');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.sort).toBe('oldest');
        });

        it('should default to recent sort for invalid values', () => {
            const params = new URLSearchParams('sort=invalid');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.sort).toBe('recent');
        });

        it('should parse pagination', () => {
            const params = new URLSearchParams('page=3&limit=50');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.page).toBe(3);
            expect(filters.limit).toBe(50);
        });

        it('should skip invalid pagination values', () => {
            const params = new URLSearchParams('page=invalid&limit=-5');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.page).toBeUndefined();
            expect(filters.limit).toBeUndefined();
        });
    });

    describe('updateUrlWithFilters', () => {
        it('should return pathname only for empty filters', () => {
            const url = updateUrlWithFilters({}, '/explore');
            expect(url).toBe('/explore');
        });

        it('should build URL with query parameters', () => {
            const filters: Filters = {
                period: { start: 1850, end: 1900 },
                sort: 'oldest'
            };
            const url = updateUrlWithFilters(filters, '/explore');

            expect(url).toContain('/explore?');
            expect(url).toContain('period_start=1850');
            expect(url).toContain('period_end=1900');
            expect(url).toContain('sort=oldest');
        });

        it('should use default pathname', () => {
            const filters: Filters = { sort: 'oldest' };
            const url = updateUrlWithFilters(filters);

            expect(url).toContain('/explore?');
            expect(url).toContain('sort=oldest');
        });
    });

    describe('getDefaultFilters', () => {
        it('should return default filter values', () => {
            const defaults = getDefaultFilters();

            expect(defaults).toEqual({
                sort: 'recent',
                page: 1,
                limit: 20
            });
        });
    });

    describe('hasActiveFilters', () => {
        it('should return false for empty filters', () => {
            expect(hasActiveFilters({})).toBe(false);
        });

        it('should return false for default values only', () => {
            const filters: Filters = {
                sort: 'recent',
                page: 1,
                limit: 20
            };
            expect(hasActiveFilters(filters)).toBe(false);
        });

        it('should return true for period filter', () => {
            const filters: Filters = {
                period: { start: 1800, end: 1900 }
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for movements filter', () => {
            const filters: Filters = {
                movements: ['Impressionism']
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for artist filter', () => {
            const filters: Filters = {
                artist: 'Claude Monet'
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return false for empty artist string', () => {
            const filters: Filters = {
                artist: '   '
            };
            expect(hasActiveFilters(filters)).toBe(false);
        });

        it('should return true for non-default sort', () => {
            const filters: Filters = {
                sort: 'oldest'
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });

        it('should return true for any active filter', () => {
            const filters: Filters = {
                period: { start: 1800, end: 1900 },
                movements: ['Impressionism'],
                artist: 'Claude Monet',
                sort: 'oldest'
            };
            expect(hasActiveFilters(filters)).toBe(true);
        });
    });
});
