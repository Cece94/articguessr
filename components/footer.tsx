export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="text-sm text-muted-foreground">
                            <p>
                                Artwork data provided by the{" "}
                                <a
                                    href="https://api.artic.edu/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:text-foreground transition-colors"
                                >
                                    Art Institute of Chicago API
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <p>
                                Image credits and attributions displayed with individual artworks
                            </p>
                            <span>•</span>
                            <a
                                href="/about"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                About
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
