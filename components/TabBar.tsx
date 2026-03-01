"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Scan", href: "/camera", icon: Camera },
    { name: "Profile", href: "/profile", icon: User },
];

export function TabBar() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <nav className="flex items-center justify-around p-2 bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl shadow-black/20">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="tab-background"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className="w-6 h-6 mb-1 z-10" />
                            <span className="text-[10px] font-medium z-10">{tab.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
