import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="text-center py-12">
            <div className="max-w-md mx-auto">
                <div className="text-muted-foreground mb-4">
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    Something went wrong
                </h3>
                <p className="text-muted-foreground mb-6">
                    {error}
                </p>
                <Button onClick={onRetry} variant="outline">
                    Try again
                </Button>
            </div>
        </div>
    );
}
