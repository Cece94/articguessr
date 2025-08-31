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
import { CultureOrStyle, getAllCultureOrStyles } from '@/models';

interface CultureOrStyleFilterProps {
    value?: CultureOrStyle;
    onValueChange: (value: CultureOrStyle | undefined) => void;
}

export function CultureOrStyleFilter({ value, onValueChange }: CultureOrStyleFilterProps) {
    const [open, setOpen] = useState(false);
    const styles = getAllCultureOrStyles();

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Culture or Style</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value || "Select style..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search styles..." />
                        <CommandList>
                            <CommandEmpty>No style found.</CommandEmpty>
                            <CommandGroup>
                                {styles.map((style) => (
                                    <CommandItem
                                        key={style}
                                        value={style}
                                        onSelect={() => {
                                            onValueChange(value === style ? undefined : style);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === style ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {style}
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
