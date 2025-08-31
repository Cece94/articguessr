"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchRandomArtwork } from "@/services/aic";
import { Artwork } from "@/models/artwork";

export default function Home() {
  const [featuredArtwork, setFeaturedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRandomArtwork = async () => {
      try {
        const artwork = await fetchRandomArtwork();
        setFeaturedArtwork(artwork);
      } catch (error) {
        console.error("Failed to load featured artwork:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRandomArtwork();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-secondary/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">
            ARTICGUESSR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and test your knowledge of masterpieces from the Art Institute of Chicago
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Info Cards */}
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Explore Collection</h3>
              <p className="text-sm text-muted-foreground">
                Browse thousands of artworks with advanced filtering options to discover your favorites.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn & Discover</h3>
              <p className="text-sm text-muted-foreground">
                Each artwork tells a story. Learn about artists, movements, and historical contexts.
              </p>
            </div>
          </div>

          {/* Center Featured Artwork */}
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-80 h-80 bg-muted rounded-3xl animate-pulse flex items-center justify-center">
                <div className="text-muted-foreground">Loading artwork...</div>
              </div>
            ) : featuredArtwork ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-background rounded-3xl p-4">
                  <Image
                    src={featuredArtwork.imageUrl}
                    alt={featuredArtwork.title}
                    width={320}
                    height={320}
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold text-lg">{featuredArtwork.title}</h3>
                    <p className="text-muted-foreground">{featuredArtwork.artist}</p>
                    <p className="text-sm text-muted-foreground">{featuredArtwork.dateDisplay}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-80 h-80 bg-muted rounded-3xl flex items-center justify-center">
                <div className="text-muted-foreground">Failed to load artwork</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Link
                href="/explore"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Gallery
              </Link>
              <Link
                href="/guessr"
                className="bg-background border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Game
              </Link>
            </div>
          </div>

          {/* Right Info Cards */}
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m1 6V4a3 3 0 013-3m-3 9a3 3 0 000 6h1m0-6h1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Test Your Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Challenge yourself with our guessing game and see how well you know art history.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-chart-1/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Art Institute Collection</h3>
              <p className="text-sm text-muted-foreground">
                Access to over 300,000 artworks from one of the world&apos;s premier art museums.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="text-center mt-16">
          <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
            &ldquo;Art enables us to find ourselves and lose ourselves at the same time.&rdquo;
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">— Thomas Merton</cite>
        </div>
      </div>
    </div>
  );
}
