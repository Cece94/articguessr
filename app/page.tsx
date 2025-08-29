import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Welcome to ArticGuessr
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Explore and test your knowledge of artworks from the Art Institute of Chicago
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore Artworks
          </Link>
          <Link
            href="/guessr"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Play Art Guessr
          </Link>
        </div>
      </div>
    </div>
  );
}
