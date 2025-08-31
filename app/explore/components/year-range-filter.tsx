"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { YearRange } from "@/models";

interface YearRangeFilterProps {
    value?: YearRange;
    onValueChange: (value: YearRange | undefined) => void;
}

const MIN_YEAR = -3000; // Antiquité
const MAX_YEAR = new Date().getFullYear(); // Année actuelle

export function YearRangeFilter({ value, onValueChange }: YearRangeFilterProps) {
    const [localValue, setLocalValue] = useState(value || { start: MIN_YEAR, end: MAX_YEAR });

    const handleSliderChange = (values: number[]) => {
        const newValue = { start: values[0], end: values[1] };
        setLocalValue(newValue);
    };

    const handleSliderCommit = (values: number[]) => {
        const newValue = { start: values[0], end: values[1] };
        // Si c'est la plage complète, on considère que c'est "pas de filtre"
        if (newValue.start === MIN_YEAR && newValue.end === MAX_YEAR) {
            onValueChange(undefined);
        } else {
            onValueChange(newValue);
        }
    };

    const handleClear = () => {
        const defaultValue = { start: MIN_YEAR, end: MAX_YEAR };
        setLocalValue(defaultValue);
        onValueChange(undefined);
    };

    const displayStart = localValue.start < 0 ? `${Math.abs(localValue.start)} BC` : localValue.start.toString();
    const displayEnd = localValue.end < 0 ? `${Math.abs(localValue.end)} BC` : localValue.end.toString();

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Year Range</label>
                {value && (
                    <button
                        onClick={handleClear}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="px-3">
                <Slider
                    value={[localValue.start, localValue.end]}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    step={10}
                    className="w-full"
                />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{displayStart}</span>
                <span>{displayEnd}</span>
            </div>

            {value && (
                <div className="text-xs text-center text-muted-foreground">
                    {displayStart} - {displayEnd}
                </div>
            )}
        </div>
    );
}
