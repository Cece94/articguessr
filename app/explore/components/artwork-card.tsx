"use client";

import Image from "next/image";
import { Artwork } from "@/models";

interface ArtworkCardProps {
    artwork: Artwork;
    onClick?: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
    const handleClick = () => {
        onClick?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className="group cursor-pointer rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${artwork.title}`}
        >
            <div className="aspect-square relative overflow-hidden">
                <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-4">
                <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-5">
                    {artwork.title}
                </h3>
                {artwork.artist && (
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-1">
                        {artwork.artist}
                    </p>
                )}
            </div>
        </div>
    );
}
