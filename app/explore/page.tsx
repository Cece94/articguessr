import { Suspense } from "react";
import { ExploreContent } from "./components/explore-content";

export default function ExplorePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Explore Artworks
                    </h1>
                    <p className="text-muted-foreground">
                        Discover artworks from the Art Institute of Chicago collection
                    </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ExploreContent />
                </Suspense>
            </div>
        </div>
    );
}
