"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navigation = [
    { name: "Explore", href: "/explore" },
    { name: "Art Guessr", href: "/guessr" },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
                        >
                            ArticGuessr
                        </Link>
                        <nav className="flex space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        pathname === item.href
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
