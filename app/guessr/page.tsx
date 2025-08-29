export default function GuessrPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-6">
                    Art Guessr
                </h1>
                <p className="text-muted-foreground mb-8">
                    Test your knowledge of art history by guessing the period and style of artworks.
                </p>
                <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                        Art Guessr game coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}
