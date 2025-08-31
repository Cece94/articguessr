"use client";

import Image from "next/image";
import { Artwork } from "@/models";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ArtworkDetailModalProps {
    artwork: Artwork | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ArtworkDetailModal({ artwork, isOpen, onClose }: ArtworkDetailModalProps) {
    if (!artwork) return null;

    // Helper function to format period (decade)
    const getPeriod = (decade: number | null): string | null => {
        if (!decade) return null;
        return `${decade}s`;
    };

    // Helper function to render field only if value exists
    const renderField = (label: string, value: string | null) => {
        if (!value) return null;
        return (
            <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="text-sm text-foreground">{value}</dd>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr,400px] lg:gap-0 h-full">
                    {/* Large image */}
                    <div className="relative aspect-square lg:aspect-auto lg:min-h-[500px] bg-muted overflow-hidden flex-shrink-0">
                        <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority
                        />
                    </div>

                    {/* Artwork details */}
                    <div className="p-6 space-y-6">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-left text-xl leading-tight pr-8">
                                {artwork.title}
                            </DialogTitle>
                        </DialogHeader>

                        <dl className="grid grid-cols-2 gap-4">
                            {renderField("Artist", artwork.artist)}
                            {renderField("Date", artwork.dateDisplay)}
                            {renderField("Period", getPeriod(artwork.decade))}
                            {renderField("Movement", artwork.movement)}
                            {renderField("Department", artwork.department)}
                            {renderField("Medium", artwork.medium)}
                        </dl>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
