import { describe, it, expect } from 'vitest';
import {
    buildQueryFromFilters,
    parseFiltersFromSearchParams,
    updateUrlWithFilters,
    getDefaultFilters
} from '../filters';
import type { Filters } from '@/models';
import { ArtworkType, CultureOrStyle } from '@/models';

describe('filters service', () => {
    describe('buildQueryFromFilters', () => {
        it('should build empty params for empty filters', () => {
            const params = buildQueryFromFilters({});
            expect(params.toString()).toBe('');
        });

        it('should build params for artwork type filter', () => {
            const filters: Filters = {
                artworkType: ArtworkType.Painting
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('artworkType')).toBe(ArtworkType.Painting);
        });

        it('should build params for culture or style filter', () => {
            const filters: Filters = {
                cultureOrStyle: CultureOrStyle.Impressionism
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('cultureOrStyle')).toBe(CultureOrStyle.Impressionism);
        });

        it('should build params for year range filter', () => {
            const filters: Filters = {
                yearRange: { start: 1800, end: 1900 }
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('yearStart')).toBe('1800');
            expect(params.get('yearEnd')).toBe('1900');
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
                artworkType: ArtworkType.Sculpture,
                cultureOrStyle: CultureOrStyle.Bauhaus,
                yearRange: { start: 1650, end: 1750 },
                page: 2,
                limit: 10
            };
            const params = buildQueryFromFilters(filters);

            expect(params.get('artworkType')).toBe(ArtworkType.Sculpture);
            expect(params.get('cultureOrStyle')).toBe(CultureOrStyle.Bauhaus);
            expect(params.get('yearStart')).toBe('1650');
            expect(params.get('yearEnd')).toBe('1750');
            expect(params.get('page')).toBe('2');
            expect(params.get('limit')).toBe('10');
        });
    });

    describe('parseFiltersFromSearchParams', () => {
        it('should parse empty params to empty filters', () => {
            const params = new URLSearchParams();
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.artworkType).toBeUndefined();
            expect(filters.cultureOrStyle).toBeUndefined();
            expect(filters.yearRange).toBeUndefined();
            expect(filters.page).toBeUndefined();
            expect(filters.limit).toBeUndefined();
        });

        it('should parse artwork type filter', () => {
            const params = new URLSearchParams(`artworkType=${ArtworkType.Painting}`);
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.artworkType).toBe(ArtworkType.Painting);
        });

        it('should skip invalid artwork type values', () => {
            const params = new URLSearchParams('artworkType=invalid');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.artworkType).toBeUndefined();
        });

        it('should parse culture or style filter', () => {
            const params = new URLSearchParams(`cultureOrStyle=${CultureOrStyle.Impressionism}`);
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.cultureOrStyle).toBe(CultureOrStyle.Impressionism);
        });

        it('should skip invalid culture or style values', () => {
            const params = new URLSearchParams('cultureOrStyle=invalid');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.cultureOrStyle).toBeUndefined();
        });

        it('should parse year range filter', () => {
            const params = new URLSearchParams('yearStart=1800&yearEnd=1900');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.yearRange).toEqual({ start: 1800, end: 1900 });
        });

        it('should skip invalid year range values', () => {
            const params = new URLSearchParams('yearStart=invalid&yearEnd=1900');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.yearRange).toBeUndefined();
        });

        it('should skip incomplete year range', () => {
            const params = new URLSearchParams('yearStart=1800');
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.yearRange).toBeUndefined();
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

        it('should parse all filters combined', () => {
            const params = new URLSearchParams([
                ['artworkType', ArtworkType.Sculpture],
                ['cultureOrStyle', CultureOrStyle.Bauhaus],
                ['yearStart', '1650'],
                ['yearEnd', '1750'],
                ['page', '2'],
                ['limit', '10']
            ]);
            const filters = parseFiltersFromSearchParams(params);

            expect(filters.artworkType).toBe(ArtworkType.Sculpture);
            expect(filters.cultureOrStyle).toBe(CultureOrStyle.Bauhaus);
            expect(filters.yearRange).toEqual({ start: 1650, end: 1750 });
            expect(filters.page).toBe(2);
            expect(filters.limit).toBe(10);
        });
    });

    describe('updateUrlWithFilters', () => {
        it('should return pathname only for empty filters', () => {
            const url = updateUrlWithFilters({}, '/explore');
            expect(url).toBe('/explore');
        });

        it('should build URL with query parameters', () => {
            const filters: Filters = {
                artworkType: ArtworkType.Painting,
                yearRange: { start: 1850, end: 1900 }
            };
            const url = updateUrlWithFilters(filters, '/explore');

            expect(url).toContain('/explore?');
            expect(url).toContain(`artworkType=${ArtworkType.Painting}`);
            expect(url).toContain('yearStart=1850');
            expect(url).toContain('yearEnd=1900');
        });

        it('should use default pathname', () => {
            const filters: Filters = {
                cultureOrStyle: CultureOrStyle.Impressionism
            };
            const url = updateUrlWithFilters(filters);

            expect(url).toContain('/explore?');
            expect(url).toContain(`cultureOrStyle=${CultureOrStyle.Impressionism}`);
        });
    });

    describe('getDefaultFilters', () => {
        it('should return default filter values', () => {
            const defaults = getDefaultFilters();

            expect(defaults).toEqual({
                page: 1,
                limit: 20
            });
        });
    });
});