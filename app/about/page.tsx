export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-6">
                    About ArticGuessr
                </h1>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            Credits
                        </h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-muted-foreground">
                                ArticGuessr is built using artwork data from the{" "}
                                <a
                                    href="https://api.artic.edu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                                >
                                    Art Institute of Chicago API
                                </a>
                                , which provides access to thousands of artworks in their collection.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            Image Attribution
                        </h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-muted-foreground">
                                All artwork images are served via the Art Institute of Chicago's IIIF service.
                                Individual image credits and copyright information are displayed with each artwork
                                when available.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            Technology
                        </h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-muted-foreground">
                                Built with Next.js and Tailwind CSS. This application is designed to be a
                                educational tool for art appreciation and learning.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
