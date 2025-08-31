'use client';

import { useState, useEffect } from 'react';
import { fetchRandomArtwork } from '@/services/aic';
import { Artwork } from '@/models';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface GuessResult {
    artistCorrect: boolean;
    yearCorrect: boolean;
    submitted: boolean;
}

export default function GuessrPage() {
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User inputs
    const [artistGuess, setArtistGuess] = useState('');
    const [yearGuess, setYearGuess] = useState('');

    // Results
    const [result, setResult] = useState<GuessResult | null>(null);

    const loadNewArtwork = async () => {
        // Reset form without showing loading state
        setArtistGuess('');
        setYearGuess('');
        setResult(null);
        setError(null);

        try {
            const newArtwork = await fetchRandomArtwork();
            setArtwork(newArtwork);
        } catch (err) {
            setError('Failed to load artwork. Please try again.');
            console.error('Error loading artwork:', err);
        }
    };

    // Load initial artwork
    useEffect(() => {
        setLoading(true);
        loadNewArtwork().finally(() => setLoading(false));
    }, []);

    const handleSubmit = () => {
        if (!artwork) return;

        // Extract year from various date formats
        const extractYear = (dateDisplay: string | null, primaryYear: number | null): number => {
            if (primaryYear) return primaryYear;

            if (dateDisplay) {
                // Try to extract 4-digit year from date_display
                const yearMatch = dateDisplay.match(/\b(1[8-9]\d{2}|20\d{2})\b/);
                if (yearMatch) return parseInt(yearMatch[1]);
            }

            return 0; // fallback
        };

        const correctYear = extractYear(artwork.dateDisplay, artwork.primaryYear);
        const guessedYear = parseInt(yearGuess);

        // Check artist (case-insensitive, remove extra spaces)
        const normalizeArtist = (name: string) =>
            name.toLowerCase().trim().replace(/\s+/g, ' ');

        const correctArtist = normalizeArtist(artwork.artist || '');
        const guessedArtist = normalizeArtist(artistGuess);

        const artistCorrect = correctArtist.includes(guessedArtist) ||
            guessedArtist.includes(correctArtist) ||
            correctArtist === guessedArtist;

        // Year tolerance of ±5 years
        const yearCorrect = Math.abs(correctYear - guessedYear) <= 5;

        setResult({
            artistCorrect,
            yearCorrect,
            submitted: true
        });
    };

    const isSubmitDisabled = !artistGuess.trim() || !yearGuess.trim() || result?.submitted;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-6">Art Guessr</h1>
                    <p className="text-muted-foreground">Loading artwork...</p>
                </div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-6">Art Guessr</h1>
                    <p className="text-red-500 mb-4">{error || 'No artwork loaded'}</p>
                    <Button onClick={loadNewArtwork}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-6">
                    Art Guessr
                </h1>
                <p className="text-muted-foreground mb-8">
                    Guess the artist and year of this artwork. You have ±5 years tolerance for the date!
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Artwork Display */}
                    <div className="space-y-4">
                        <div className="w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            {artwork.imageUrl ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={artwork.imageUrl}
                                        alt="Artwork to guess"
                                        width={400}
                                        height={400}
                                        className="max-w-full max-h-full object-contain"
                                        sizes="400px"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-muted-foreground">No image available</p>
                                </div>
                            )}
                        </div>

                        {/* Artwork hints */}
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">{artwork.title}</h2>
                            <p className="text-muted-foreground">
                                Artist: {artwork.artist ? artwork.artist.charAt(0) + '...' : 'Unknown'}
                            </p>
                        </div>

                        {result?.submitted && (
                            <div className="space-y-2 text-sm">
                                <h3 className="font-semibold">Correct Answers:</h3>
                                <p><span className="font-medium">Title:</span> {artwork.title}</p>
                                <p><span className="font-medium">Artist:</span> {artwork.artist || 'Unknown'}</p>
                                <p><span className="font-medium">Date:</span> {artwork.dateDisplay || artwork.primaryYear || 'Unknown'}</p>
                                <p><span className="font-medium">Medium:</span> {artwork.medium || 'Unknown'}</p>
                            </div>
                        )}
                    </div>

                    {/* Guess Form */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="artist" className="block text-sm font-medium mb-2">
                                    Artist Name
                                </label>
                                <input
                                    id="artist"
                                    type="text"
                                    value={artistGuess}
                                    onChange={(e) => setArtistGuess(e.target.value)}
                                    placeholder="Enter artist name..."
                                    disabled={result?.submitted}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${result?.submitted
                                        ? result.artistCorrect
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-red-500 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {result?.submitted && (
                                    <p className={`text-sm mt-1 ${result.artistCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.artistCorrect ? '✓ Correct!' : '✗ Wrong artist'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="year" className="block text-sm font-medium mb-2">
                                    Year Created
                                </label>
                                <input
                                    id="year"
                                    type="number"
                                    value={yearGuess}
                                    onChange={(e) => setYearGuess(e.target.value)}
                                    placeholder="Enter year (e.g., 1885)..."
                                    min="1860"
                                    max="2024"
                                    disabled={result?.submitted}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${result?.submitted
                                        ? result.yearCorrect
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-red-500 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {result?.submitted && (
                                    <p className={`text-sm mt-1 ${result.yearCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.yearCorrect ? '✓ Correct! (±5 years)' : '✗ Wrong year'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {!result?.submitted ? (
                                <>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitDisabled}
                                        className="w-full"
                                    >
                                        Submit Guess
                                    </Button>
                                    <Button
                                        onClick={loadNewArtwork}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Skip this artwork
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={loadNewArtwork}
                                    className="w-full"
                                    variant="default"
                                >
                                    Next Artwork
                                </Button>
                            )}
                        </div>

                        {result?.submitted && (
                            <div className="text-center p-4 rounded-lg bg-muted">
                                <h3 className="font-semibold mb-2">Score:</h3>
                                <p className="text-lg">
                                    {(result.artistCorrect ? 1 : 0) + (result.yearCorrect ? 1 : 0)} / 2 correct
                                </p>
                                {result.artistCorrect && result.yearCorrect && (
                                    <p className="text-green-600 font-medium mt-1">Perfect! 🎉</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
