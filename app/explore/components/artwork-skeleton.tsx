import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkSkeleton() {
    return (
        <div className="rounded-lg overflow-hidden bg-card border border-border">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}
