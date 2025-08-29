"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ArtworkType, getAllArtworkTypes } from '@/models';

interface ArtworkTypeFilterProps {
    value?: ArtworkType;
    onValueChange: (value: ArtworkType | undefined) => void;
}

export function ArtworkTypeFilter({ value, onValueChange }: ArtworkTypeFilterProps) {
    const [open, setOpen] = useState(false);
    const types = getAllArtworkTypes();

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Artwork Type</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value || "Select type..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search types..." />
                        <CommandList>
                            <CommandEmpty>No type found.</CommandEmpty>
                            <CommandGroup>
                                {types.map((type) => (
                                    <CommandItem
                                        key={type}
                                        value={type}
                                        onSelect={() => {
                                            onValueChange(value === type ? undefined : type);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === type ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {type}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
