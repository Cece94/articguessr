export enum ArtworkType {
    Print = "Print",
    Photograph = "Photograph",
    DrawingAndWatercolor = "Drawing and Watercolor",
    Textile = "Textile",
    Painting = "Painting",
    ArchitecturalDrawing = "Architectural Drawing",
    Book = "Book",
    Ceramics = "Ceramics",
    Vessel = "Vessel",
    CostumeAndAccessories = "Costume and Accessories",
    Sculpture = "Sculpture",
    Glass = "Glass",
    Metalwork = "Metalwork",
    Coin = "Coin",
    GraphicDesign = "Graphic Design",
    DecorativeArts = "Decorative Arts",
    Design = "Design",
    Medals = "Medals",
    Furniture = "Furniture",
    Arms = "Arms",
    ReligiousRitualObject = "Religious/Ritual Object",
    Armor = "Armor",
    ArchitecturalFragment = "Architectural fragment",
    ArchivesGroupings = "Archives (groupings)",
    MixedMedia = "Mixed Media",
    MiniaturePainting = "Miniature Painting",
    Model = "Model",
    CoveringsAndHangings = "Coverings and Hangings",
    FilmVideoNewMedia = "Film, Video, New Media",
    NonArt = "non-art",
    Mask = "Mask",
    MiniatureRoom = "Miniature room",
    Installation = "Installation",
    FuneraryObject = "Funerary Object",
    Furnishings = "Furnishings",
    TimeBasedMedia = "Time Based Media",
    Basketry = "Basketry",
    AudioVideo = "Audio-Video",
    Equipment = "Equipment",
    DigitalArts = "Digital Arts",
    Materials = "Materials",
    Prototypes = "Prototypes"
}

export function getAllArtworkTypes(): ArtworkType[] {
    return Object.values(ArtworkType);
}

export function filterArtworkTypes(query: string): ArtworkType[] {
    if (!query) return getAllArtworkTypes();

    const lowerQuery = query.toLowerCase();
    return getAllArtworkTypes().filter(type =>
        type.toLowerCase().includes(lowerQuery)
    );
}
