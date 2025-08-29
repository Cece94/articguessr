import { describe, it, expect } from 'vitest';
import {
    computeDecade,
    generateImageUrl,
    getPrimaryYear,
    mapArtwork
} from '../aic';
import type { ArtworkRaw } from '@/models';

describe('aic service', () => {
    describe('computeDecade', () => {
        it('should compute decade correctly for various years', () => {
            expect(computeDecade(1850)).toBe(1850);
            expect(computeDecade(1855)).toBe(1850);
            expect(computeDecade(1859)).toBe(1850);
            expect(computeDecade(1860)).toBe(1860);
            expect(computeDecade(1901)).toBe(1900);
            expect(computeDecade(2023)).toBe(2020);
        });

        it('should handle edge cases', () => {
            expect(computeDecade(0)).toBe(0);
            expect(computeDecade(1)).toBe(0);
            expect(computeDecade(10)).toBe(10);
        });

        it('should handle negative years', () => {
            expect(computeDecade(-50)).toBe(-50);
            expect(computeDecade(-55)).toBe(-60);
        });
    });

    describe('generateImageUrl', () => {
        it('should generate correct IIIF URL', () => {
            const imageId = 'test-image-123';
            const expected = 'https://www.artic.edu/iiif/2/test-image-123/full/600,/0/default.jpg';
            expect(generateImageUrl(imageId)).toBe(expected);
        });

        it('should handle special characters in image ID', () => {
            const imageId = 'image-with-dashes_and_underscores.123';
            const expected = 'https://www.artic.edu/iiif/2/image-with-dashes_and_underscores.123/full/600,/0/default.jpg';
            expect(generateImageUrl(imageId)).toBe(expected);
        });
    });

    describe('getPrimaryYear', () => {
        it('should prefer date_end over date_start', () => {
            const artwork: ArtworkRaw = {
                id: 1,
                image_id: 'test',
                title: 'Test',
                artist_title: null,
                date_display: null,
                date_start: 1850,
                date_end: 1860,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: true,
                thumbnail: null
            };

            expect(getPrimaryYear(artwork)).toBe(1860);
        });

        it('should fallback to date_start when date_end is null', () => {
            const artwork: ArtworkRaw = {
                id: 1,
                image_id: 'test',
                title: 'Test',
                artist_title: null,
                date_display: null,
                date_start: 1850,
                date_end: null,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: true,
                thumbnail: null
            };

            expect(getPrimaryYear(artwork)).toBe(1850);
        });

        it('should return null when both dates are null', () => {
            const artwork: ArtworkRaw = {
                id: 1,
                image_id: 'test',
                title: 'Test',
                artist_title: null,
                date_display: null,
                date_start: null,
                date_end: null,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: true,
                thumbnail: null
            };

            expect(getPrimaryYear(artwork)).toBe(null);
        });
    });

    describe('mapArtwork', () => {
        it('should map artwork raw to normalized format correctly', () => {
            const rawArtwork: ArtworkRaw = {
                id: 123,
                image_id: 'test-image-456',
                title: 'The Starry Night',
                artist_title: 'Vincent van Gogh',
                date_display: '1889',
                date_start: 1889,
                date_end: 1889,
                style_title: 'Post-Impressionism',
                department_title: 'European Painting and Sculpture',
                medium_display: 'Oil on canvas',
                is_public_domain: true,
                thumbnail: {
                    lqip: 'data:image/jpeg;base64,test',
                    width: 843,
                    height: 1000,
                    alt_text: 'The Starry Night'
                }
            };

            const mapped = mapArtwork(rawArtwork);

            expect(mapped).toEqual({
                id: 123,
                imageId: 'test-image-456',
                title: 'The Starry Night',
                artist: 'Vincent van Gogh',
                dateDisplay: '1889',
                dateStart: 1889,
                dateEnd: 1889,
                movement: 'Post-Impressionism',
                department: 'European Painting and Sculpture',
                medium: 'Oil on canvas',
                imageUrl: 'https://www.artic.edu/iiif/2/test-image-456/full/600,/0/default.jpg',
                primaryYear: 1889,
                decade: 1880
            });
        });

        it('should handle null image_id', () => {
            const rawArtwork: ArtworkRaw = {
                id: 123,
                image_id: null,
                title: 'Test Artwork',
                artist_title: null,
                date_display: null,
                date_start: null,
                date_end: null,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: false,
                thumbnail: null
            };

            const mapped = mapArtwork(rawArtwork);

            expect(mapped.imageId).toBe('');
            expect(mapped.imageUrl).toBe('');
        });

        it('should handle null dates and compute decade correctly', () => {
            const rawArtwork: ArtworkRaw = {
                id: 123,
                image_id: 'test-image',
                title: 'Test Artwork',
                artist_title: null,
                date_display: null,
                date_start: 1875,
                date_end: null,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: false,
                thumbnail: null
            };

            const mapped = mapArtwork(rawArtwork);

            expect(mapped.primaryYear).toBe(1875);
            expect(mapped.decade).toBe(1870);
        });

        it('should handle completely null dates', () => {
            const rawArtwork: ArtworkRaw = {
                id: 123,
                image_id: 'test-image',
                title: 'Test Artwork',
                artist_title: null,
                date_display: null,
                date_start: null,
                date_end: null,
                style_title: null,
                department_title: null,
                medium_display: null,
                is_public_domain: false,
                thumbnail: null
            };

            const mapped = mapArtwork(rawArtwork);

            expect(mapped.primaryYear).toBe(null);
            expect(mapped.decade).toBe(null);
        });
    });
});
