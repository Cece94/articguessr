/** Enumeration of curated culture/style values for filtering. */
export enum CultureOrStyle {
    JapaneseCultureOrStyle = "Japanese (culture or style)",
    Century21st = "21st Century",
    Century19th = "19th century",
    Century20th = "20th Century",
    ChineseCultureOrStyle = "Chinese (culture or style)",
    Modernism = "Modernism",
    RomanAncientStyleOrPeriod = "roman (ancient, style or period)",
    PopArt = "Pop Art",
    NineteenthCentury = "nineteenth century",
    Greek = "greek",
    Century18th = "18th Century",
    Nazca = "nazca",
    AvantGarde = "avant-garde",
    Moche = "moche",
    Cubism = "Cubism",
    Contemporary = "contemporary",
    ArtsAndCraftsMovement = "Arts and Crafts Movement",
    Pictorialism = "Pictorialism",
    Egyptian = "egyptian",
    Bauhaus = "bauhaus",
    Qing = "qing",
    SouthAsian = "South Asian",
    Century17th = "17th Century",
    Himalayan = "Himalayan",
    Impressionism = "Impressionism",
    Medieval = "medieval",
    FolkArt = "Folk Art",
    PhotoLeague = "Photo League",
    NewKingdom = "new kingdom",
    RomanPeriodEgyptian = "roman period (egyptian)",
    Syrian = "syrian",
    Surrealism = "Surrealism",
    ArtDeco = "Art Deco",
    NewBauhausInstituteOfDesign = "New Bauhaus (Institute of Design)",
    ThirdIntermediatePeriod = "third intermediate period",
    ImperialRoman = "imperial (roman)",
    Realism = "Realism",
    Japanism = "Japanism",
    EdoJapanesePeriod = "edo (japanese period)",
    Chimu = "chimú",
    Indonesian = "indonesian",
    KoreanCultureOrStyle = "Korean (culture or style)",
    Ming = "ming",
    Century15th = "15th century"
}

/** Return all supported culture/style strings. */
export function getAllCultureOrStyles(): CultureOrStyle[] {
    return Object.values(CultureOrStyle);
}

/** Case-insensitive substring filter over culture/style values. */
export function filterCultureOrStyles(query: string): CultureOrStyle[] {
    if (!query) return getAllCultureOrStyles();

    const lowerQuery = query.toLowerCase();
    return getAllCultureOrStyles().filter(style =>
        style.toLowerCase().includes(lowerQuery)
    );
}
