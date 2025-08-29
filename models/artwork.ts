// API response types from Art Institute of Chicago
export interface ArtworkRaw {
    id: number;
    image_id: string | null;
    title: string;
    artist_title: string | null;
    date_display: string | null;
    date_start: number | null;
    date_end: number | null;
    style_title: string | null;
    department_title: string | null;
    medium_display: string | null;
    is_public_domain: boolean;
    thumbnail: {
        lqip: string;
        width: number;
        height: number;
        alt_text: string;
    } | null;
}

// Normalized artwork model for the app
export interface Artwork {
    id: number;
    imageId: string;
    title: string;
    artist: string | null;
    dateDisplay: string | null;
    dateStart: number | null;
    dateEnd: number | null;
    movement: string | null; // mapped from style_title
    department: string | null;
    medium: string | null;
    // Derived fields
    imageUrl: string;
    primaryYear: number | null; // prefer date_end, else date_start
    decade: number | null; // floor primaryYear to decade
}
